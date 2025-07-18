import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

type SpriteType = {
  [key: string]: string;
  base: string;
  fight: string;
};

export class Player extends Entity {
  // скорость
  private moveSpeed: number;
  textureKey: string;
  enemies?: Entity[];
  target: any;
  private isAttacking: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: SpriteType) {
    super(scene, x, y, texture.base, SPRITES.PLAYER.base);
    // анимация движения в другие стороны
    const anims = this.scene.anims;
    // кратное 3 т.к. 3 кадра у нашего героя, 3 медлено -> 9
    const animsFrameRate = 9;
    // ключ для понимания какую анимацию делать
    this.textureKey = texture.base;
    this.moveSpeed = 50;
    // уменьшение фиизческой оболочки под макет героя
    this.setSize(28, 32);
    this.setOffset(10, 16);
    // уменьшить персонажа
    this.setScale(0.8);

    this.setupKeyListeners();
    // как называеться наша анимация - формально
    this.createAnimation("down", texture.base, 0, 2, anims, animsFrameRate);
    this.createAnimation("left", texture.base, 12, 14, anims, animsFrameRate);
    this.createAnimation("right", texture.base, 24, 26, anims, animsFrameRate);
    this.createAnimation("up", texture.base, 36, 38, anims, animsFrameRate);

    this.drawPlayerHealthBar();
    // анимация боя
    this.createAnimation(
      "fight",
      texture.fight,
      3,
      6,
      anims,
      animsFrameRate,
      0
    );

    this.on("animationcomplete", () => {
      this.isAttacking = false;
    });
  }

  private createAnimation(
    // как называеться наша анимация
    key: string,
    textureKey: string,
    // порядок кадров
    start: number,
    end: number,
    anims: Phaser.Animations.AnimationManager,
    // частота кадров
    frameRate: number,
    // зацикленность
    repeat: number = -1
  ) {
    anims.create({
      key,
      frames: anims.generateFrameNumbers(textureKey, { start, end }),
      frameRate,
      repeat,
    });
  }

  // полоска хп - героя
  private drawPlayerHealthBar() {
    this.playerHealthBar = this.scene.add.graphics();
    //
    this.playerHealthBar.setScrollFactor(0);
    this.drawHealtBar(this.playerHealthBar, 10, 10, this.health / 100);
  }

  // полоска хп - противника
  private drawEnemyHealthBar(target) {
    this.enemyHealthBar = this.scene.add.graphics();
    this.enemyHealthBar.setScrollFactor(0);

    this.drawHealtBar(this.enemyHealthBar, 10, 30, target.health / 100);
  }

  // graphiscs - объект ресования Phaser
  private drawHealtBar(graphics, x, y, percentage) {
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(x, y, 100, 10);

    graphics.fillStyle(0x00ff00, 1);
    // полоска уменьщаеться от колличества хп
    graphics.fillRect(x, y, 100 * percentage, 10);
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
      // Не позволяем новую атаку во время текущей
      if (this.isAttacking) return;

      const target = this.findTarget(this.enemies);
      if (!target) return;

      this.isAttacking = true;
      this.play("fight");
      this.setVelocity(0, 0);

      // Атакуем в середине анимации
      this.scene.time.delayedCall(300, () => {
        this.attack(target);
        // отрисока бара хп - моба
        this.drawEnemyHealthBar(target);
      });
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
    // Блокируем движение во время атаки
    if (this.isAttacking) return;
    const keys = this.scene.input.keyboard?.createCursorKeys();
    // перерисовка хп
    this.drawPlayerHealthBar();

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
