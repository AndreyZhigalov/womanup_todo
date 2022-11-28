import { DB } from '../firebase';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  collection,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore/lite';

export type TaskDataType = {
  taskID: string;
  text: string;
  header: string;
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
     state.taskList = state.taskList.map((item) => (item.taskID === action.payload.taskID ? action.payload : item));
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
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.status = AddTaskStatus.WAITING;
    });
    builder.addCase(addNewTask.rejected, (state, action) => {
      alert('Ошибка при создании новой задачи');
    });
    builder.addCase(getTaskList.pending, (state, action) => {});
    builder.addCase(
      getTaskList.fulfilled,
      (state, action: PayloadAction<QuerySnapshot<DocumentData>>) => {
        state.taskList = []
        for (let value of action.payload.docs) {
          state.taskList.push(value.data() as TaskDataType);
        }
      },
    );
    builder.addCase(getTaskList.rejected, (state, action) => {
      alert('Ошибка при загрузке списка задач');
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      let index = state.taskList.findIndex((item) => item.taskID === '');
      if (index >= 0) state.taskList = [...state.taskList.slice(0, index), action.payload];
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      alert('Ошибка при обишка при обновлении задачи');
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      alert('Ошибка при удалении задачи');
    });
  },
});

export const getTaskList = createAsyncThunk<QuerySnapshot<DocumentData>>(
  'getTaskListStatus',
  async () => {
    const id = localStorage.getItem('userId');
    const querySnapshot = getDocs(collection(DB, `userData/${id}/taskList`));
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

export const deleteTask = createAsyncThunk<void, string>('deleteTaskStatus', async (taskID) => {
  const id = localStorage.getItem('userId');
  try {
    await deleteDoc(doc(DB, `userData/${id}/taskList/${taskID}`));
  } catch (error) {
    console.log(error);
  }
});

export const { addNewCard, clearAllTasks, removeCard, setTaskGroup, updateCard } =
  tasksSlice.actions;
export default tasksSlice.reducer;
