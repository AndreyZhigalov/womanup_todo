import React from 'react';

type FilePropsType = {
  styles: {
    readonly [key: string]: string;
  };
  fileNames: string[];
  refElem: React.RefObject<HTMLInputElement>;
  uploadHandler: () => void;
  downloadHandler: () => void;
  menuToggler: () => void;
  showMenu: boolean;
};

const TaskFiles: React.FC<FilePropsType> = ({
  styles,
  fileNames,
  refElem,
  uploadHandler,
  downloadHandler,
  menuToggler,
  showMenu,
}) => {
  const onClickFileInput = () => {
    menuToggler();
    refElem.current?.click();
  };

  return (
    <>
      <i className={styles.attached_files + ' fa-solid fa-paperclip'} onClick={menuToggler}>
        {!!fileNames.length && <span className={styles.file_count}>{fileNames.length}</span>}
        <input
          type={'file'}
          className={styles.input__hidden}
          onChange={uploadHandler}
          multiple
          ref={refElem}></input>
        {showMenu && (
          <div className={styles.file_input_options}>
            <p onClick={downloadHandler}>Скачать</p>
            <p onClick={onClickFileInput}>Добавить</p>
          </div>
        )}
      </i>
    </>
  );
};

export default TaskFiles;
