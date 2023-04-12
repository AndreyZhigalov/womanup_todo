import React from 'react';

import avatar from '../../assets/avatar_placeholder.png';

import styles from './Chat.module.scss';

const Chat: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  return (
    <div className={`${styles.chat} ${styles.container}`} data-menu={showMenu}>
      <section className={styles.rooms_container}>
        <ul className={styles.rooms_list}>
          <li className={styles.room}>
            <p className={styles.room_name}>{'Черешки'}</p>
            <p className={styles.last_message}>{'Привет всем)))'}</p>
          </li>
        </ul>
      </section>
      <section className={styles.messages_container}>
        <ul className={styles.messages_list}>
          <li className={styles.message}>
            <img className={styles.message_avatar} src={avatar} alt="" />
            <span className={styles.message_name}>Semen</span>
            <span className={styles.message_text}>{'Привет всем)))'}</span>
          </li>
          <li className={styles.message}>
            <img className={styles.message_avatar} src={avatar} alt="" />
            <span className={styles.message_name}>Semen</span>
            <span className={styles.message_text}>{'Привет всем)))'}</span>
          </li>
        </ul>
        <form action="" className={styles.send_form}>
          <textarea className={styles.message_input} name="message" required />
          <button className={styles.send_button} type="submit">
            Отправить
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
