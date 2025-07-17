import { Entity } from "./entity";

export class Enemy extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // запуск анимации

    this.cycleTween();
    // т.к. картинка в другую сторону
    this.setFlipX(true);
  }

  // Цикличная анимация для свеньи
  cycleTween() {
    this.scene.tweens.add({
      targets: this,
      //   продолжительность анимации
      duration: 2000,
      //   ease: "Linear", - тип анимации
      // зацикливание
      repeat: -1,
      // с начала до конца и с конца до начала
      yoyo: true,
      // кордината перемещения
      x: this.x + 100,
      // келбек на каждое повторение
      onRepeat: () => {
        // разворот кабана
        this.setFlipX(true);
      },
      // в обратную сторону
      onYoyo: () => {
        this.setFlipX(false);
      },
    });
  }
}
