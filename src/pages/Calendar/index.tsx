import React from 'react';

import styles from './Calendar.module.scss';

const Calendar: React.FC<{showMenu: boolean}> = ({showMenu}) => {
  return (
    <div className={`${styles.calendar} ${styles.container}`} data-menu={showMenu}>
      Calendar
    </div>
  );
};

export default Calendar;
