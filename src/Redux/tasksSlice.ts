import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  QuerySnapshot,
  updateDoc,
} from 'firebase/firestore/lite';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DB } from '../firebase';
import { storageRef } from './../firebase/index';
import { RootState } from './store';

export type TaskDataType = {
  taskID: string;
  text: string;
  header: string;
  files: string[];
  readers: [];
  editable: boolean;
  deadline: string | null;
  isCurrent: boolean;
  isFuture: boolean;
  isCompleted: boolean;
};

export enum AddTaskStatus {
  ADDED = 'The new card was added',
  ERROR = 'The card adding was rejected',
  WAITING = 'I am waiting for new card',
}

export enum FetchTaskListStatus {
  LOADING = 'Waiting response',
  SUCCESS = 'Tasklist has been received',
  ERROR = 'Tasklist fetching was rejected',
}

interface taskState {
  taskList: TaskDataType[];
  status: string;
}

const initialState: taskState = {
  taskList: [],
  status: AddTaskStatus.WAITING,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addNewCard(state, action: PayloadAction<string>) {
      const newTask: TaskDataType = {
        taskID: '',
        text: 'Описание',
        header: 'Заголовок',
        readers: [],
        files: [],
        editable: true,
        deadline: null,
        isCurrent: false,
        isFuture: false,
        isCompleted: false,
      };
      state.taskList = [
        ...state.taskList,
        {
          ...newTask,
          isCurrent: action.payload === 'current' ? true : false,
          isFuture: action.payload === 'future' ? true : false,
          isCompleted: action.payload === 'completed' ? true : false,
        },
      ];
      state.status = AddTaskStatus.ADDED;
    },
    updateCard(state, action: PayloadAction<TaskDataType>) {
      state.taskList = state.taskList.map((item) =>
        item.taskID === action.payload.taskID ? action.payload : item,
      );
    },
    setTaskGroup(state, action: PayloadAction<string[]>) {
      state.taskList = state.taskList.map((item) =>
        item.taskID === action.payload[0]
          ? {
              ...item,
              isCurrent: action.payload[1] === 'current' ? true : false,
              isFuture: action.payload[1] === 'future' ? true : false,
              isCompleted: action.payload[1] === 'completed' ? true : false,
            }
          : item,
      );
    },
    removeCard(state, action: PayloadAction<string>) {
      state.taskList = state.taskList.filter(({ taskID }) => taskID !== action.payload);
    },
    clearAllTasks(state) {
      state.taskList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewTask.fulfilled, (state) => {
      state.status = AddTaskStatus.WAITING;
    });
    builder.addCase(addNewTask.rejected, () => {
      alert('Ошибка при создании новой задачи');
    });
    builder.addCase(getTaskList.pending, (state) => {
      state.status = FetchTaskListStatus.LOADING;
    });
    builder.addCase(
      getTaskList.fulfilled,
      (state, action: PayloadAction<QuerySnapshot<DocumentData>>) => {
        state.status = FetchTaskListStatus.SUCCESS;
        const tasks = [];
        for (let value of action.payload.docs) {
          tasks.push(value.data() as TaskDataType);
        }
        state.taskList = tasks;
      },
    );
    builder.addCase(getTaskList.rejected, (state) => {
      state.status = FetchTaskListStatus.ERROR;
      alert('Ошибка при загрузке списка задач');
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      let index = state.taskList.findIndex((item) => item.taskID === '');
      if (index >= 0) state.taskList = [...state.taskList.slice(0, index), action.payload];
    });
    builder.addCase(updateTask.rejected, () => {
      alert('Ошибка при обишка при обновлении задачи');
    });
    builder.addCase(deleteTaskOnServer.rejected, () => {
      alert('Ошибка при удалении задачи');
    });
  },
});

export const getTaskList = createAsyncThunk<QuerySnapshot<DocumentData>>(
  'getTaskListStatus',
  async () => {
    const id = localStorage.getItem('userId');
    const querySnapshot = await getDocs(collection(DB, `userData/${id}/taskList`));
    return querySnapshot;
  },
);

export const addNewTask = createAsyncThunk<void, TaskDataType>(
  'addNewTaskStatus',
  async (task, Thunk) => {
    const id = localStorage.getItem('userId');
    const docRef = await addDoc(collection(DB, `userData/${id}/taskList`), task);
    await Thunk.dispatch(updateTask({ ...task, taskID: docRef.id }));
  },
);

export const updateTask = createAsyncThunk<TaskDataType, TaskDataType>(
  'updateTaskStatus',
  async (updatedTask) => {
    const id = localStorage.getItem('userId');
    try {
      await updateDoc(doc(DB, `userData/${id}/taskList/${updatedTask.taskID}`), updatedTask);
    } catch (error) {
      console.error(error);
    }
    return updatedTask;
  },
);

export const deleteTaskOnServer = createAsyncThunk<void, { taskID: string; files: string[] }>(
  'deleteTaskOnStatus',
  async ({ taskID, files }) => {
    const id = localStorage.getItem('userId');
    try {
      await deleteDoc(doc(DB, `userData/${id}/taskList/${taskID}`));
      if (id) {
        const userLink = ref(storageRef, id);
        const taskLink = ref(userLink, taskID);
        for (let value of files) {
          const fileLink = ref(taskLink, value);
          deleteObject(fileLink);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
);

export type UploadFilesType = { files: FileList; taskID: string };

export const uploadFilesOnServer = createAsyncThunk<void, UploadFilesType>(
  'uploadFilesStatus',
  async ({ files, taskID }, Thunk) => {
    const {
      tasksSlice: { taskList },
    } = Thunk.getState() as RootState;

    let updatedTask = taskList.find((task) => task.taskID === taskID);
    let userID = localStorage.getItem('userId');
    let filesNames = [];

    if (userID) {
      const userLink = ref(storageRef, userID);
      const taskLink = ref(userLink, taskID);

      for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name;
        let fileLink = ref(taskLink, fileName);

        uploadBytes(fileLink, files[i]);
        filesNames.push(fileName);
      }
    }
    if (updatedTask) {
      Thunk.dispatch(updateTask({ ...updatedTask, files: [...updatedTask.files, ...filesNames] }));
      Thunk.dispatch(updateCard({ ...updatedTask, files: [...updatedTask.files, ...filesNames] }));
    }
  },
);

export const downloadFilesFromServer = createAsyncThunk<void, string>(
  'downloadFilesStatus',
  async (taskID, Thunk) => {
    const {
      tasksSlice: { taskList },
    } = Thunk.getState() as RootState;
    let task = taskList.find((task) => task.taskID === taskID);
    let userID = localStorage.getItem('userId');

    if (userID) {
      const userLink = ref(storageRef, userID);
      const taskLink = ref(userLink, taskID);

      if (task) {
        for (let value of task?.files) {
          let fileLink = ref(taskLink, value);
          getDownloadURL(fileLink).then((url) => {
            let a = document.createElement('a');
            Object.assign(a, { download: '', href: url, target: '_blank' });
            a.click();
          });
        }
      }
    }
  },
);

export const taskListSelector = (state: RootState) => state.tasksSlice;

export const { addNewCard, clearAllTasks, removeCard, setTaskGroup, updateCard } =
  tasksSlice.actions;
export default tasksSlice.reducer;
