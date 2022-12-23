import React from 'react';

type DeadlinePropsType = {
  isEditable: boolean;
  date: string;
  styles: {
    readonly [key: string]: string;
  };
  handler: (value: string) => void;
};

const TaskDeadline: React.FC<DeadlinePropsType> = ({ styles, date, isEditable, handler }) => {
  const dateRef = React.useRef<HTMLInputElement>(null);
  const deadlineTimecode = new Date(date as string).getTime();

  return (
    <>
      <span
        onClick={() => dateRef?.current?.showPicker()}
        className={`${styles.card_deadline} ${
          deadlineTimecode < new Date().getTime() && date ? styles.failed : ''
        }`}>
        {`${date} `}
        {isEditable && (
          <i className="fa-regular fa-calendar">
            <input
              ref={dateRef}
              type="date"
              className={styles.input__hidden}
              onChange={(e) => handler(e.target.value)}
            />
          </i>
        )}
      </span>
    </>
  );
};

export default TaskDeadline;
