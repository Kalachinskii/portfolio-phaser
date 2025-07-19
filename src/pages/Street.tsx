import { useParams } from "react-router-dom";
import { useGame } from "../config/useConfig";

export function Street() {
  const { locationId } = useParams();
  // логика инициализации и управления игрой Phaser в React-компоненте.
  const { gameContainerRef } = useGame(locationId || "Street");

  return (
    <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
  );
}
