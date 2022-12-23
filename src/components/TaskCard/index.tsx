import React from 'react';
import { useAppDispatch } from '../../hooks/storeHook';

import {
  deleteTaskOnServer,
  downloadFilesFromServer,
  removeCard,
  setTaskGroup,
  TaskDataType,
  updateCard,
  updateTask,
  uploadFilesOnServer,
} from '../../Redux/tasksSlice';
import TaskButton from './TaskButton';

import styles from './TaskCard.module.scss';
import TaskDeadline from './TaskDeadline';
import TaskDescription from './TaskDescription';
import TaskFiles from './TaskFiles';
import TaskHeader from './TaskHeader';

export type TaskCardType = {
  taskData: TaskDataType;
  droppedGroup: string | undefined;
};

const TaskCard: React.FC<TaskCardType> = ({
  taskData: {
    taskID,
    text,
    header,
    editable,
    deadline,
    readers,
    isCurrent,
    isFuture,
    isCompleted,
    files,
  },
  droppedGroup,
}) => {
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = React.useState<boolean>(editable);
  const taskObj: TaskDataType = {
    taskID,
    text,
    header,
    editable,
    deadline,
    readers,
    isCurrent,
    isFuture,
    isCompleted,
    files,
  };
  const [headerText, setHeaderText] = React.useState<string>(header);
  const [taskText, setTaskText] = React.useState<string>(text);
  const [dateText, setDateText] = React.useState<string | null>(deadline);
  const [showFileInputMenu, setShowFileInputMenu] = React.useState<boolean>(false);
  const TaskCardRef = React.useRef<HTMLDivElement>(null);
  const filesRef = React.useRef<HTMLInputElement>(null);

  const updatedTask = {
    ...taskObj,
    header: headerText,
    text: taskText,
    editable: false,
    deadline: dateText,
    isCurrent,
    isFuture,
    isCompleted,
  };

  React.useEffect(() => {
    const fileInputClickHandler = (e: MouseEvent) => {
      if (TaskCardRef.current && !e.composedPath().includes(TaskCardRef.current)) {
        setShowFileInputMenu(false);
      }
    };

    document.addEventListener('click', (e) => fileInputClickHandler(e));

    return document.removeEventListener('click', (e) => fileInputClickHandler(e));
  }, []);

  const onClickUpdateTask = (state: boolean) => {
    if (state) {
      setIsEditable(state);
    } else {
      setIsEditable(false);
      dispatch(updateCard(updatedTask));
      dispatch(updateTask(updatedTask));
    }
  };

  const onClickRemoveTask = () => {
    dispatch(removeCard(taskID));
    dispatch(deleteTaskOnServer({ taskID, files }));
  };

  const downloadFiles = () => {
    if (files.length) {
      dispatch(downloadFilesFromServer(taskID));
    }
  };

  const uploadFiles = () => {
    if (filesRef.current?.files) {
      dispatch(uploadFilesOnServer({ files: filesRef.current.files, taskID }));
    }
  };

  const setTaskToNewGroup = () => {
    dispatch(setTaskGroup([taskID, droppedGroup as string]));
    dispatch(
      updateTask({
        ...updatedTask,
        isCurrent: droppedGroup === 'current' ? true : false,
        isFuture: droppedGroup === 'future' ? true : false,
        isCompleted: droppedGroup === 'completed' ? true : false,
      }),
    );
  };

  return (
    <div
      ref={TaskCardRef}
      className={styles.task_card}
      onDoubleClick={() => onClickUpdateTask(true)}
      onDragStart={(e) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={setTaskToNewGroup}
      onKeyDown={(e) => e.code === 'Escape' && setIsEditable(false)}
      draggable={!isEditable}>
      <TaskHeader
        isEditable={isEditable}
        text={headerText}
        styles={styles}
        handler={setHeaderText}
      />
      <TaskFiles
        styles={styles}
        fileNames={files}
        refElem={filesRef}
        uploadHandler={uploadFiles}
        downloadHandler={downloadFiles}
        menuToggler={() => setShowFileInputMenu((state) => !state)}
        showMenu={showFileInputMenu}
      />
      <TaskDescription
        isEditable={isEditable}
        text={taskText}
        styles={styles}
        handler={setTaskText}
        updateHandler={onClickUpdateTask}
      />
      <div className={styles.card_readers}></div>
      <TaskDeadline
        styles={styles}
        date={dateText ?? 'Бессрочно'}
        isEditable={isEditable}
        handler={setDateText}
      />
      <TaskButton
        isEditable={isEditable}
        updateHandler={onClickUpdateTask}
        removeHandler={onClickRemoveTask}
        styles={styles}
      />
    </div>
  );
};

export default TaskCard;
