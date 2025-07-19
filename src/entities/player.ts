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
  private playerHealthBar: Phaser.GameObjects.Graphics | null = null;
  private enemyHealthBar: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: SpriteType) {
    super(scene, x, y, texture.base, SPRITES.PLAYER.base);
    // анимация движения в другие стороны
    const anims = this.scene.anims;
    // кратное 3 т.к. 3 кадра у нашего героя, 3 медлено -> 9
    const animsFrameRate = 9;
    // ключ для понимания какую анимацию делать
    this.textureKey = texture.base;
    this.moveSpeed = 25;
    // уменьшение фиизческой оболочки под макет героя
    this.setSize(12, 16);
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
  ): void {
    anims.create({
      key,
      frames: anims.generateFrameNumbers(textureKey, { start, end }),
      frameRate,
      repeat,
    });
  }

  // полоска хп - героя
  private drawPlayerHealthBar(): void {
    // фикс утечки
    if (!this.playerHealthBar) {
      this.playerHealthBar = this.scene.add.graphics();
      this.playerHealthBar.setScrollFactor(0);
    }
    // очистка
    this.playerHealthBar.clear();
    this.drawHealtBar(this.playerHealthBar, 10, 10, this.health / 100);
  }

  // полоска хп - противника
  private drawEnemyHealthBar(target: Entity): void {
    if (!this.enemyHealthBar) {
      this.enemyHealthBar = this.scene.add.graphics();
      this.enemyHealthBar.setScrollFactor(0);
    }
    this.enemyHealthBar.clear();
    this.drawHealtBar(this.enemyHealthBar, 10, 30, target.health / 100);
  }

  // graphiscs - объект ресования Phaser
  private drawHealtBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    percentage: number
  ): void {
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(x, y, 100, 10);

    graphics.fillStyle(0x00ff00, 1);
    // полоска уменьщаеться от колличества хп
    graphics.fillRect(x, y, 100 * percentage, 10);
  }

  // все враги на сцене
  setEnemys(enemies: Entity[]): void {
    this.enemies = enemies;
  }

  // найти ближайщего моба к персонажу
  private findTarget(enemies: Entity[] | undefined): Entity | null {
    // Проверяем, есть ли враги
    if (!enemies || enemies.length === 0) {
      return null;
    }

    let closestEnemy: Entity | null = null;
    let minDistance = Number.MAX_VALUE;

    // Ищем ближайшего врага
    for (const enemy of enemies) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  // атака на пробел
  private setupKeyListeners(): void {
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

  attack(target: Entity): void {
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

  update(delta: number): void {
    // Блокируем движение во время атаки
    if (this.isAttacking) return;

    // Получаем ссылку на объект управления с клавиатуры
    const keys = this.scene.input.keyboard?.createCursorKeys();
    // перерисовка хп
    this.drawPlayerHealthBar();

    const direction = new Phaser.Math.Vector2(0, 0);

    if (keys?.up.isDown) direction.y -= 1;
    if (keys?.down.isDown) direction.y += 1;
    if (keys?.left.isDown) direction.x -= 1;
    if (keys?.right.isDown) direction.x += 1;

    // Нормализуем вектор (чтобы диагональная скорость не была больше)
    // Проверяем, есть ли движение (длина вектора > 0)
    if (direction.length() > 0) {
      // Проверяем, есть ли движение (длина вектора > 0) чтобы диагональное движение не было быстрее движения по осям
      direction.normalize();
    }

    // расчёт движеня х - y
    const speed = delta * this.moveSpeed;
    this.setVelocity(direction.x * speed, direction.y * speed);

    // Выбор анимации движения
    if (direction.y < 0) {
      this.play("up", true);
    } else if (direction.y > 0) {
      this.play("down", true);
    } else if (direction.x < 0) {
      this.play("left", true);
    } else if (direction.x > 0) {
      this.play("right", true);
    } else {
      this.stop();
    }
  }
}
