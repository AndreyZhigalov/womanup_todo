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
import DropArea from '../../components/DropArea';

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

  return (
    <section className={`${styles.overview} ${styles.container}`} data-menu={showMenu}>
      <TaskGroupTabs
        tabGroup={tabGroup}
        setTabGroup={setTabGroup}
        onDragOverTab={setDroppedGroup}
      />
      <DropArea tabGroup={tabGroup} onDragOver={setDroppedGroup} />
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
