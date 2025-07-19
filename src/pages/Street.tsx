import { useGame } from "../config/useConfig";

export function Street() {
  const { gameContainerRef } = useGame();

  return (
    <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
  );
}
