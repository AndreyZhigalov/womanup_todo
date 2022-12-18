import React from 'react';
import TaskCard from '../../components/TaskCard';
import { useAppSelector, useAppDispatch } from '../../hooks/storeHook';

import { addNewCard, addNewTask, AddTaskStatus, FetchTaskListStatus } from '../../Redux/tasksSlice';

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

  const addTask = (type: string) => {
    if (status === AddTaskStatus.WAITING || status === FetchTaskListStatus.SUCCESS)
      dispatch(addNewCard(type));
  };

  if (status === FetchTaskListStatus.LOADING) {
    return (
      <section className={styles.overview}>
        <div className={styles.loading_wrapper}>
          <div className={styles.dots_bars}></div>
          <span className={styles.loading_message}>Загрузка списка задач</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.overview}>
      <div
        className={styles.current_tasks_block}
        onDragOverCapture={(e) => {
          e.preventDefault();
          setDroppedGroup('current');
        }}>
        <h4 className={styles.tasks_block_header}>Текущие задачи</h4>
        <button className={styles.add_task_button} onClick={() => addTask('current')}>
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
        onDragOverCapture={(e) => {
          e.preventDefault();
          setDroppedGroup('future');
        }}>
        <h4 className={styles.tasks_block_header}>Задачи в очереди</h4>
        <button className={styles.add_task_button} onClick={() => addTask('future')}>
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
        onDragOverCapture={(e) => {
          e.preventDefault();
          setDroppedGroup('completed');
        }}>
        <h4 className={styles.tasks_block_header}>Выполненные задачи</h4>
        <button className={styles.add_task_button} onClick={() => addTask('completed')}>
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
