import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity {
  textureKey: string;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, SPRITES.PLAYER);
    // анимация движения в другие стороны
    const anims = this.scene.anims;
    // кратное 3 т.к. 3 кадра у нашего героя, 3 медлено -> 9
    const animsFrameRate = 9;
    // ключ для понимания какую анимацию делать
    this.textureKey = texture;

    // как называеться наша анимация - формально
    anims.create({
      key: "down",
      frames: anims.generateFrameNumbers(this.textureKey, {
        start: 0,
        end: 2,
      }),
      // частота кадров
      frameRate: animsFrameRate,
      // зацикленность
      repeat: -1,
    });
    anims.create({
      key: "left",
      frames: anims.generateFrameNumbers(this.textureKey, {
        start: 12,
        end: 14,
      }),
      // частота кадров
      frameRate: animsFrameRate,
      // зацикленность
      repeat: -1,
    });
    anims.create({
      key: "right",
      frames: anims.generateFrameNumbers(this.textureKey, {
        start: 24,
        end: 26,
      }),
      // частота кадров
      frameRate: animsFrameRate,
      // зацикленность
      repeat: -1,
    });
    anims.create({
      key: "up",
      frames: anims.generateFrameNumbers(this.textureKey, {
        start: 36,
        end: 38,
      }),
      // частота кадров
      frameRate: animsFrameRate,
      // зацикленность
      repeat: -1,
    });
  }
  update(delta: number) {
    const keys = this.scene.input.keyboard?.createCursorKeys();

    // надо обновить в цикле сцены в durotar.ts
    // скорость перемещение игрока
    if (keys?.up.isDown) {
      // запуск анимации , true - не воспроизводи другие
      this.play("up", true);
      // передвижение
      this.setPosition(this.x, this.y - delta * 0.25);
    } else if (keys?.down.isDown) {
      this.play("down", true);
      this.setPosition(this.x, this.y + delta * 0.25);
    } else if (keys?.left.isDown) {
      this.play("left", true);
      this.setPosition(this.x - delta * 0.25, this.y);
    } else if (keys?.right.isDown) {
      this.play("right", true);
      this.setPosition(this.x + delta * 0.25, this.y);
    }
  }
}
