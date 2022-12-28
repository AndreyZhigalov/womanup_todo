import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import {
  addNewCard,
  AddTaskStatus,
  FetchTaskListStatus,
  taskListSelector,
} from '../../Redux/tasksSlice';

import TaskCard from '../TaskCard';

import styles from './TaskGroup.module.scss';

type TaskGroupType = {
  currentGroup: string;
  setDroppedGroup: (group: string) => void;
  droppedGroup: string;
  tabGroup: number;
};

const TaskGroup: React.FC<TaskGroupType> = ({ currentGroup, setDroppedGroup, droppedGroup , tabGroup}) => {
  const dispatch = useAppDispatch();
  const { input } = useAppSelector((state) => state.searchSlice);
  const { taskList, status } = useAppSelector(taskListSelector);

  const addTask = (type: string) => {
    if (status === AddTaskStatus.WAITING || status === FetchTaskListStatus.SUCCESS)
      dispatch(addNewCard(type));
  };

  const groupHeader =
    currentGroup === 'current'
      ? 'Текущие'
      : currentGroup === 'inQueue'
      ? 'В очереди'
      : 'Выполненные';

  const groupClass =
    currentGroup === 'current'
      ? styles.current_tasks_block
      : currentGroup === 'inQueue'
      ? styles.inQueue_tasks_block
      : styles.completed_tasks_block;

  return (
    <ul
      data-tab-group={`${tabGroup}`}
      className={groupClass}
      onDragOverCapture={(e) => {
        e.preventDefault();
        setDroppedGroup(currentGroup);
      }}>
      <h4 className={styles.tasks_block_header}>{groupHeader}</h4>
      <button className={styles.add_task_button} onClick={() => addTask(currentGroup)}>
        +
      </button>
      {taskList
        .filter((item) => item.header.toLowerCase().includes(input?.toLowerCase()))
        .map((task) => {
          if (currentGroup === 'current') {
            return (
              task.isCurrent && (
                <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
              )
            );
          }
          if (currentGroup === 'inQueue') {
            return (
              task.isInQueue && (
                <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
              )
            );
          }
          return (
            task.isCompleted && (
              <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
            )
          );
        })
        .reverse()}
    </ul>
  );
};

export default TaskGroup;
