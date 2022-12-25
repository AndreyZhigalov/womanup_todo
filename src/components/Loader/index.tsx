import styles from "./Loader.module.scss"

const Loader = () => {
  return (
    <div className={styles.loading_auth__overlay}>
      <span className={styles.loader}></span>
    </div>
  );
}

export default Loader