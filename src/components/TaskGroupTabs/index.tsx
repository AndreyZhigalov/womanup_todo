import React from 'react'

import styles from "./TaskGroupTabs.module.scss"

type GroupTabs = {
  tabGroup: number;
  setTabGroup: React.Dispatch<React.SetStateAction<number>>;
  onDragOverTab: (group: string, e: React.DragEvent<HTMLLIElement>) => void;
};

const TaskGroupTabs: React.FC<GroupTabs> = ({ tabGroup, onDragOverTab, setTabGroup }) => {
  return (
    <ul className={styles.tabs} data-tab-group={tabGroup}>
      <li className={styles.arrows}>
        <button onClick={() => tabGroup > 1 && setTabGroup((value) => --value)}>{'<'}</button>
      </li>
      <li
        onDragOverCapture={(e) => onDragOverTab('current', e)}
        className={styles.tab}
        onClick={() => setTabGroup(1)}>
        Текущие
      </li>
      <li
        onDragOverCapture={(e) => onDragOverTab('inQueue', e)}
        className={styles.tab}
        onClick={() => setTabGroup(2)}>
        В очереди
      </li>
      <li
        onDragOverCapture={(e) => onDragOverTab('completed', e)}
        className={styles.tab}
        onClick={() => setTabGroup(3)}>
        Выполненные
      </li>
      <li className={styles.arrows}>
        <button onClick={() => tabGroup < 3 && setTabGroup((value) => ++value)}>{'>'}</button>
      </li>
    </ul>
  );
};

export default TaskGroupTabs