import styles from "./controls.module.css";

export const Controls = () => {
  return (
    <div className={styles.controls}>
      <h4>Управление:</h4>
      <div className={styles.controlGroup}>
        <div className={styles.controlRow}>
          <kbd>W</kbd> <kbd className={styles.arrow}>↑</kbd>
          <span>Вперед</span>
        </div>
        <div className={styles.controlRow}>
          <kbd>A</kbd> <kbd className={styles.arrow}>←</kbd>
          <span>Влево</span>
        </div>
        <div className={styles.controlRow}>
          <kbd>S</kbd> <kbd className={styles.arrow}>↓</kbd>
          <span>Назад</span>
        </div>
        <div className={styles.controlRow}>
          <kbd>D</kbd> <kbd className={styles.arrow}>→</kbd>
          <span>Вправо</span>
        </div>
        <div className={styles.controlRow}>
          <kbd>Пробел</kbd>
          <span>Атака</span>
        </div>
      </div>
    </div>
  );
};
