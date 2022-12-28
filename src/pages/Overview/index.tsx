import React from 'react';
import TaskGroup from '../../components/TaskGroup';
import TaskGroupTabs from '../../components/TaskGroupTabs';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import {
  addNewTask,
  AddTaskStatus,
  FetchTaskListStatus,
  taskListSelector,
} from '../../Redux/tasksSlice';

import styles from './Overview.module.scss';

const Overview: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const dispatch = useAppDispatch();
  const { taskList, status } = useAppSelector(taskListSelector);
  const [droppedGroup, setDroppedGroup] = React.useState<string>('');
  const [tabGroup, setTabGroup] = React.useState<number>(1);

  React.useEffect(() => {
    if (status === AddTaskStatus.ADDED) {
      dispatch(addNewTask(taskList[taskList.length - 1]));
    }
  }, [status]);

  if (status === FetchTaskListStatus.LOADING) {
    return (
      <section className={`${styles.overview} ${styles.container}`}>
        <div className={styles.loading_wrapper}>
          <div className={styles.dots_bars}></div>
          <span className={styles.loading_message}>Загрузка списка задач</span>
        </div>
      </section>
    );
  }

  const onDragOverTab = (group: string, e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    setDroppedGroup(group);
  };

  const onDragOverDropArea = (group: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    setDroppedGroup(group);
  };

  return (
    <section className={`${styles.overview} ${styles.container}`} data-menu={showMenu}>
      <TaskGroupTabs tabGroup={tabGroup} setTabGroup={setTabGroup} onDragOverTab={onDragOverTab} />
      {/* {tabGroup !== 1 && (
        <div       
          onDragOverCapture={(e) =>
            onDragOverDropArea(`${tabGroup === 2 ? 'current' : 'inQueue'}`, e)
          }
          className={styles.dropArea_prev}>
          {tabGroup === 2 ? 'Текущие' : 'В очереди'}
        </div>
      )}
      {tabGroup !== 3 && (
        <div
          onDragOverCapture={(e) =>
            onDragOverDropArea(`${tabGroup === 2 ? 'completed' : 'inQueue'}`, e)
          }
          className={styles.dropArea_next}>
          {tabGroup === 2 ? 'Выполненные' : 'В очереди'}
        </div>
      )} */}
      <TaskGroup
        tabGroup={tabGroup}
        currentGroup={'current'}
        setDroppedGroup={setDroppedGroup}
        droppedGroup={droppedGroup}
      />
      <TaskGroup
        tabGroup={tabGroup}
        currentGroup={'inQueue'}
        setDroppedGroup={setDroppedGroup}
        droppedGroup={droppedGroup}
      />
      <TaskGroup
        tabGroup={tabGroup}
        currentGroup={'completed'}
        setDroppedGroup={setDroppedGroup}
        droppedGroup={droppedGroup}
      />
    </section>
  );
};

export default Overview;
