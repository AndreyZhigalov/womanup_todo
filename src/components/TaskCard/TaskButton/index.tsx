import React from 'react';

type ButtonPropsType = {
  isEditable: boolean;
  styles: {
    readonly [key: string]: string;
  };
  updateHandler: (value: boolean) => void;
  removeHandler: () => void;
};

const TaskButton: React.FC<ButtonPropsType> = ({
  isEditable,
  updateHandler,
  removeHandler,
  styles,
}) => {
  return (
    <>
      {isEditable ? (
        <i
          onClick={() => updateHandler(false)}
          className={styles.agree_text_change + ' fa-solid fa-check-to-slot'}></i>
      ) : (
        <i onClick={removeHandler} className={styles.remove_task + ' fa-regular fa-trash-can'}></i>
      )}
    </>
  );
};

export default TaskButton;
