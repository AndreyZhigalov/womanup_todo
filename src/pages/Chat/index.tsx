import React from 'react';

import styles from './Chat.module.scss';

const Chat: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  return <div className={`${styles.chat} ${styles.container}`} data-menu={showMenu}>Chat</div>;
};

export default Chat;
