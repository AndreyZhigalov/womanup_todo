import React from 'react'

import styles from  "./Stats.module.scss"

const Stats: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  return <div className={`${styles.stats} ${styles.container}`} data-menu={showMenu}>Stats</div>;
};

export default Stats