import React from 'react';
import styles from './DropArea.module.scss';

type DropAreaProps = {
  tabGroup: number;
  onDragOver: (group: string) => void;
};

const DropArea: React.FC<DropAreaProps> = ({ tabGroup, onDragOver }) => {
  return (
    <>
      {tabGroup !== 1 && (
        <div
          onDragOver={() => onDragOver(`${tabGroup === 2 ? 'current' : 'inQueue'}`)}
          className={styles.dropArea_prev}>
          {tabGroup === 2 ? 'Текущие' : 'В очереди'}
        </div>
      )}
      {tabGroup !== 3 && (
        <div
          onDragOver={() => onDragOver(`${tabGroup === 2 ? 'completed' : 'inQueue'}`)}
          className={styles.dropArea_next}>
          {tabGroup === 2 ? 'Выполненные' : 'В очереди'}
        </div>
      )}
    </>
  );
};

export default DropArea;
