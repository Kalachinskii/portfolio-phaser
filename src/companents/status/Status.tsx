import styles from "./status.module.css";

export const Status = () => {
  return (
    <div className={styles.status}>
      <div className={styles.statusSection}>
        <h4>Статус:</h4>
        <ul className={styles.heroBar}>
          <li>❤️: 100/100</li>
          <li>✨: 200/200</li>
          <li>⚡: 80/80</li>
        </ul>
      </div>

      <div className={styles.statusSection}>
        <h4>Характеристики:</h4>
        <ul className={styles.heroStats}>
          <li>💪 Сила: 15</li>
          <li>🔮 Магическая сила: 30</li>
          <li>🎯 Ловкость: 12</li>
          <li>📚 Интеллект: 8</li>
          <li>🛡️ Защита: 10</li>
          <li>👁️ Точность: 95%</li>
          <li>🌀 Уворот: 15%</li>
          <li>🍀 Удача: 7</li>
        </ul>
      </div>
    </div>
  );
};
