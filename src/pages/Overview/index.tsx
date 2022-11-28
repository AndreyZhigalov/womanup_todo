import React from 'react';
import TaskCard from '../../components/TaskCard';
import { useAppSelector, useAppDispatch } from '../../hooks/storeHook';

import { addNewCard, addNewTask, AddTaskStatus } from '../../Redux/tasksSlice';

import styles from './Overview.module.scss';

const Overview = () => {
  const dispatch = useAppDispatch();
  const { taskList, status } = useAppSelector((state) => state.tasksSlice);
  const { input } = useAppSelector((state) => state.searchSlice);
  const [droppedGroup, setDroppedGroup] = React.useState<string>();

  React.useEffect(() => {
    if (status === AddTaskStatus.ADDED) {
      dispatch(addNewTask(taskList[taskList.length - 1]));
    }
  }, [status]);

  return (
    <section className={styles.overview}>
      <div
        className={styles.current_tasks_block}
        onDragOverCapture={() => setDroppedGroup('current')}>
        <h4 className={styles.tasks_block_header}>Текущие задачи</h4>
        <button
          className={styles.add_task_button}
          onClick={() =>
            status === AddTaskStatus.WAITING ? dispatch(addNewCard('current')) : false
          }>
          +
        </button>
        {taskList
          .filter((item) => item.header.toLowerCase().includes(input?.toLowerCase()))
          .map((task) =>
            task.isCurrent ? (
              <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
            ) : null,
          )
          .reverse()}
      </div>
      <div
        className={styles.future_tasks_block}
        onDragOverCapture={() => setDroppedGroup('future')}>
        <h4 className={styles.tasks_block_header}>Задачи в очереди</h4>
        <button
          className={styles.add_task_button}
          onClick={() =>
            status === AddTaskStatus.WAITING ? dispatch(addNewCard('future')) : false
          }>
          +
        </button>
        {taskList
          .filter((item) => item.header.toLowerCase().includes(input?.toLowerCase()))
          .map((task) =>
            task.isFuture ? (
              <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
            ) : null,
          )
          .reverse()}
      </div>
      <div
        className={styles.completed_tasks_block}
        onDragOverCapture={() => setDroppedGroup('completed')}>
        <h4 className={styles.tasks_block_header}>Выполненные задачи</h4>
        <button
          className={styles.add_task_button}
          onClick={() =>
            status === AddTaskStatus.WAITING ? dispatch(addNewCard('completed')) : false
          }>
          +
        </button>
        {taskList
          .filter((item) => item.header.toLowerCase().includes(input?.toLowerCase()))
          .map((task) =>
            task.isCompleted ? (
              <TaskCard key={task.taskID} taskData={task} droppedGroup={droppedGroup} />
            ) : null,
          )
          .reverse()}
      </div>
    </section>
  );
};

export default Overview;
