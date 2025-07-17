import { useEffect, useRef } from "react";
import Phaser, { Scene } from "phaser";
import { scenes } from "../scenes";

export function Home() {
  // ссылка экземпляра игры Phaser (Phaser.Game).
  const gameRef = useRef<Phaser.Game | null>(null);
  // ссылка на <div>, в котором будет отрисовываться игра
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // DOM-элемент не найден или игра создана - выход
    if (!gameContainerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      //  автоматический выбор рендера (WebGL или Canvas).
      // type: Phaser.AUTO,
      // размер игрового поля.
      width: 800,
      height: 600,
      title: "test phaser RPG",
      scene: scenes,
      url: import.meta.env.URL || "",
      version: import.meta.env.VERSION || "0.0.1",
      parent: gameContainerRef.current,
      backgroundColor: "#000",
      // задаём физику
      physics: {
        default: "arcade",
        arcade: {
          // режим дебага - обветка персонажа вид границ
          debug: true,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: true,
    };

    // Создаем игру
    gameRef.current = new Phaser.Game(config);

    return () => {
      // Уничтожаем игру при размонтировании
      gameRef.current?.destroy(true);
      // очищает все ресурсы
      gameRef.current = null;
    };
  }, []);

  return (
    <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
  );
}
