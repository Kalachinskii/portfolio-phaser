import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity {
  // скорость
  private moveSpeed: number;
  textureKey: string;
  enemies?: Entity[];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, SPRITES.PLAYER);
    // анимация движения в другие стороны
    const anims = this.scene.anims;
    // кратное 3 т.к. 3 кадра у нашего героя, 3 медлено -> 9
    const animsFrameRate = 9;
    // ключ для понимания какую анимацию делать
    this.textureKey = texture;
    this.moveSpeed = 50;
    // уменьшение фиизческой оболочки под макет героя
    this.setSize(28, 32);
    this.setOffset(10, 16);
    // уменьшить персонажа
    this.setScale(0.8);

    this.setupKeyListeners();
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

  // все враги на сцене
  setEnemys(enemies: Entity[]) {
    this.enemies = enemies;
  }

  // найти ближайщего моба к персонажу
  private findTarget(enemies: Entity[]) {
    // поиск крочайшего пути
    let target = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
      const distanceToEnemy = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y
      );

      if (distanceToEnemy < minDistance) {
        minDistance = distanceToEnemy;
        target = enemy;
      }
    }
    return target;
  }

  // атака на пробел
  private setupKeyListeners() {
    this.scene.input.keyboard?.on("keydown-SPACE", () => {
      const target = this.findTarget(this.enemies);
      console.log(target);

      // таргет получить можно как в enemy через setTarget подобно setPlayer - но врагом может быть множество
      this.attack(target);
    });
  }

  attack(target: Entity) {
    // растояние до Entity
    const distanceToEnemy = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y
    );

    if (distanceToEnemy < 50) {
      target.takeDamage(25);
    }
  }

  update(delta: number) {
    const keys = this.scene.input.keyboard?.createCursorKeys();

    // надо обновить в цикле сцены в durotar.ts
    // скорость перемещение игрока
    if (keys?.up.isDown) {
      // запуск анимации , true - не воспроизводи другие
      this.play("up", true);
      // передвижение спрайта (не физика! проходит стены)
      // this.setPosition(this.x, this.y - delta * 0.25);
      this.setVelocity(0, -delta * this.moveSpeed);
    } else if (keys?.down.isDown) {
      this.play("down", true);
      // this.setPosition(this.x, this.y + delta * 0.25);
      this.setVelocity(0, delta * this.moveSpeed);
    } else if (keys?.left.isDown) {
      this.play("left", true);
      // this.setPosition(this.x - delta * 0.25, this.y);
      this.setVelocity(-delta * this.moveSpeed, 0);
    } else if (keys?.right.isDown) {
      this.play("right", true);
      // this.setPosition(this.x + delta * 0.25, this.y);
      this.setVelocity(delta * this.moveSpeed, 0);
    } else {
      // остановка персонажа при отпускании кнопки
      this.setVelocity(0, 0);
      this.stop();
    }
  }
}
