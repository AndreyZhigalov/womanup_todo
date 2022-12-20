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

import styles from './TaskCard.module.scss';

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
  const headerRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const filesRef = React.useRef<HTMLInputElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const deadlineTimecode = new Date(dateText as string).getTime();
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
        setShowFileInputMenu(false)
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
    dispatch(deleteTaskOnServer({taskID, files}));
  };

  const onClickFileInput = () => {
    setShowFileInputMenu(state => !state);
    filesRef.current?.click();
  };

  const downloadFiles = () => {
    setShowFileInputMenu(state => !state);
    dispatch(downloadFilesFromServer(taskID));
  };

  const uploadFiles = () => {
    if (filesRef.current?.files) {
      setShowFileInputMenu(state => !state);
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
      {!isEditable ? (
        <h5 className={styles.card_header}>{headerText}</h5>
      ) : (
        <input
          aria-label="input"
          ref={headerRef}
          className={styles.card_header}
          readOnly={!isEditable}
          onChange={() => setHeaderText(headerRef?.current?.value as string)}
          value={headerText}
        />
      )}
      <i
        className={styles.attached_files + ' fa-solid fa-paperclip'}
        onClick={() => setShowFileInputMenu((state) => !state)}>
        {!!files.length && <span className={styles.file_count}>{files.length}</span>}
        <input
          type={'file'}
          className={styles.input__hidden}
          onChange={uploadFiles}
          multiple
          ref={filesRef}></input>
        {showFileInputMenu && (
          <div className={styles.file_input_options}>
            <p onClick={downloadFiles}>Скачать</p>
            <p onClick={onClickFileInput}>Добавить</p>
          </div>
        )}
      </i>
      {!isEditable ? (
        <p className={styles.card_text}>{taskText}</p>
      ) : (
        <textarea
          aria-label="input"
          ref={textRef}
          readOnly={!isEditable}
          className={styles.card_text}
          onKeyDown={(e) => e.ctrlKey && e.code === 'Enter' && onClickUpdateTask(false)}
          onChange={() => setTaskText(textRef.current?.value as string)}
          value={taskText}
        />
      )}
      <div className={styles.card_readers}></div>
      <span
        onClick={() => dateRef?.current?.showPicker()}
        className={`${styles.card_deadline} ${
          deadlineTimecode < new Date().getTime() && dateText ? styles.failed : ''
        }`}>
        {`${dateText ?? 'Бессрочно'} `}
        {isEditable && (
          <i className="fa-regular fa-calendar">
            <input
              ref={dateRef}
              type="date"
              className={styles.input__hidden}
              onChange={() => setDateText(dateRef?.current?.value as string)}
            />
          </i>
        )}
      </span>
      {isEditable ? (
        <i
          onClick={() => onClickUpdateTask(false)}
          className={styles.agree_text_change + ' fa-solid fa-check-to-slot'}></i>
      ) : (
        <i
          onClick={onClickRemoveTask}
          className={styles.remove_task + ' fa-regular fa-trash-can'}></i>
      )}
    </div>
  );
};

export default TaskCard;
