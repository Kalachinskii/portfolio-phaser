import { useEffect, useRef } from "react";
import Phaser from "phaser";

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
      type: Phaser.AUTO,
      // размер игрового поля.
      width: 800,
      height: 600,
      // DOM-элемент для вставки игры
      parent: gameContainerRef.current,
      physics: {
        // Используем Arcade Physics
        default: "arcade",
        arcade: {
          // Гравитация по оси Y (объекты падают вниз)
          gravity: { x: 0, y: 200 },
        },
      },
      scene: {
        // загрузка ресурсов
        preload: function (this: Phaser.Scene) {
          // Локальные ресурсы (положите их в public/assets/)
          this.load.image("sky", "/skies/asd.jpg");
          this.load.image("logo", "/sprites/ada.png");
          this.load.image("one", "/particles/1.png");
        },
        //  создание игровых объектов
        create: function (this: Phaser.Scene) {
          // Добавление фона
          this.add.image(400, 300, "sky");

          // Новый API для частиц (Phaser 3.60+)
          const emitter = this.add.particles(100, 60, "one", {
            // Скорость частиц
            speed: 100,
            // Уменьшение со временем
            scale: { start: 1, end: 0 },
            // Эффект свечения
            blendMode: Phaser.BlendModes.ADD,
          });

          // Добавление физического объекта (логотип)
          const logo = this.physics.add.image(400, 100, "logo");
          // Скорость по X и Y
          logo.setVelocity(100, 100);
          // Упругость (1 = 100%)
          logo.setBounce(1, 1);
          // Столкновение с границами мира
          logo.setCollideWorldBounds(true);
          // Привязка частиц к логотипу
          emitter.startFollow(logo);
        },
      },
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
