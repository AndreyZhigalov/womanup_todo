import React from 'react';

import styles from './Projects.module.scss';

const Projects: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  return <div className={`${styles.projects} ${styles.container}`} data-menu={showMenu}>Projects</div>;
};

export default Projects;
