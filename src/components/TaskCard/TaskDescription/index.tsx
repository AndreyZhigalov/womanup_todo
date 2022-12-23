import React from 'react';

type DescriptionPropsType = {
  isEditable: boolean;
  text: string;
  styles: {
    readonly [key: string]: string;
  };
  handler: (value: string) => void;
  updateHandler: (value: boolean) => void;
};

const TaskDescription: React.FC<DescriptionPropsType> = ({
  isEditable,
  text,
  styles,
  handler,
  updateHandler,
}) => {
  return (
    <>
      {!isEditable ? (
        <p className={styles.card_text}>{text}</p>
      ) : (
        <textarea
          aria-label="input"
          readOnly={!isEditable}
          className={styles.card_text}
          onKeyDown={(e) => e.ctrlKey && e.code === 'Enter' && updateHandler(false)}
          onChange={(e) => handler(e.target.value)}
          value={text}
        />
      )}
    </>
  );
};

export default TaskDescription;
