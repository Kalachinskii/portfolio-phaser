import { useParams } from "react-router-dom";
import { useGame } from "../config/useGame";
import styles from "./Home.module.css";
import heroImage from "../assets/hero.png";

export function Home() {
  const { locationId } = useParams();
  // логика инициализации и управления игрой Phaser в React-компоненте.
  const { gameContainerRef } = useGame(locationId || "Home");

  return (
    <div className={styles.container}>
      <img className={styles.img} src={heroImage} alt="hero img" />
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
          <h4>Характеристика:</h4>
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
      <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
    </div>
  );
}
