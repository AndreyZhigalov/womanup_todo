import React from 'react';

type HeaderPropsType = {
  isEditable: boolean;
  text: string;
  styles: {
    readonly [key: string]: string;
  };
  handler: (value: string) => void;
};

const TaskHeader: React.FC<HeaderPropsType> = ({ isEditable, text, styles, handler }) => {
  return (
    <>
      {!isEditable ? (
        <h5 className={styles.card_header}>{text}</h5>
      ) : (
        <input
          aria-label="input"
          className={styles.card_header}
          readOnly={!isEditable}
          onChange={(e) => handler(e.target.value)}
          value={text}
        />
      )}
    </>
  );
};

export default TaskHeader;
