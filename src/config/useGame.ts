import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { createScenes } from "../scenes";

export const useGame = (location: string) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) return;
    const scenes = createScenes(location);

    const config: Phaser.Types.Core.GameConfig = {
      width: 800,
      height: 600,
      title: "test phaser RPG",
      scene: scenes,
      parent: gameContainerRef.current,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: true,
    };

    gameRef.current = new Phaser.Game(config);

    // Подписываемся на событие навигации
    gameRef.current.events.on("navigate", (route: string) => {
      navigate(route);
    });

    return () => {
      // Очистка при размонтировании
      gameRef.current?.events.off("navigate");
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [location, navigate]);

  //  для привязки к DOM-элементу
  return { gameContainerRef };
};
