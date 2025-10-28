import { useParams } from "react-router-dom";
import { useGame } from "../config/useGame";
import styles from "./Home.module.css";
import heroImage from "../assets/hero.png";
import { Controls } from "../companents/controls/Controls";
import { Status } from "../companents/status/Status";

export function Home() {
  const { locationId } = useParams();
  // логика инициализации и управления игрой Phaser в React-компоненте.
  const { gameContainerRef } = useGame(locationId || "Home");

  return (
    <div className={styles.container}>
      <img className={styles.img} src={heroImage} alt="hero img" />
      <Status />
      <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
      <Controls />
    </div>
  );
}
