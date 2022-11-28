import React from 'react';
import { useAppDispatch } from '../../hooks/storeHook';

import {
  removeCard,
  setTaskGroup,
  TaskDataType,
  updateTask,
  updateCard,
  deleteTask,
} from '../../Redux/tasksSlice';

import styles from './TaskCard.module.scss';

export type TaskCardType = {
  taskData: TaskDataType;
  droppedGroup: string | undefined;
};

const TaskCard: React.FC<TaskCardType> = ({
  taskData: { taskID, text, header, editable, deadline, readers, isCurrent, isFuture, isCompleted },
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
  };
  const [headerText, setHeaderText] = React.useState<string>(header);
  const [taskText, setTaskText] = React.useState<string>(text);
  const [dateText, setDateText] = React.useState<string | null>(deadline);
  const [showFileInputMenu, setShowFileInputMenu] = React.useState<boolean>(false);
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
    dispatch(deleteTask(taskID));
  };

  const uploadFiles = () => {
    filesRef.current?.click();
    setShowFileInputMenu(!showFileInputMenu);
  };

  const downloadFiles = () => {
    setShowFileInputMenu(!showFileInputMenu);
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
      className={styles.task_card}
      onDoubleClick={() => onClickUpdateTask(true)}
      onDragEnd={setTaskToNewGroup}
      draggable>
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
        onClick={() => setShowFileInputMenu(!showFileInputMenu)}>
        <input type={'file'} className={styles.input__hidden} multiple ref={filesRef}></input>
        {showFileInputMenu && (
          <div className={styles.file_input_options}>
            <p onClick={downloadFiles}>Скачать</p>
            <p onClick={uploadFiles}>Загрузить</p>
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
          onChange={() => setTaskText(textRef.current?.value as string)}
          value={taskText}
        />
      )}
      <div className={styles.card_readers}></div>
      <span
        className={`${styles.card_deadline} ${
          deadlineTimecode < new Date().getTime() && dateText ? styles.failed : ''
        }`}>
        {`${dateText ?? 'Бессрочно'} `}
        {isEditable && (
          <i className="fa-regular fa-calendar" onClick={() => dateRef?.current?.showPicker()}>
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
