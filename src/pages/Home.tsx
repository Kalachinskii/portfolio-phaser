import { useParams } from "react-router-dom";
import { useGame } from "../config/useConfig";

export function Home() {
  const { locationId } = useParams();
  // логика инициализации и управления игрой Phaser в React-компоненте.
  const { gameContainerRef } = useGame(locationId || "Home");

  return (
    <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
  );
}
