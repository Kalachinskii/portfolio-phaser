import { Entity } from "./entity";

export class Enemy extends Entity {
  private player: Entity;
  private isFollowing: boolean;
  private agroDistance: number;
  private followRange: number;
  private attackRange: number;
  private isAlive: boolean;
  private moveSpeed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // запуск анимации
    this.initialPosition = { x, y };
    this.isFollowing = false;
    this.agroDistance = 100;
    this.attackRange = 40;
    this.followRange = 250;
    this.moveSpeed = 100;
    this.isAlive = true;
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

  setPlayer(player: Entity) {
    this.player = player;
  }

  stopCycleTween() {
    // удаляем анимации на объекте
    this.scene.tweens.killTweensOf(this);
  }

  // кто, за-кем, с какой скоростью
  followToPlayer(player) {
    this.scene.physics.moveToObject(this, player, this.moveSpeed);
  }

  returnToOriginalPosition(distanceToPosition) {
    // остановить персонажа
    this.setVelocity(0, 0);
    // передвижение
    this.scene.tweens.add({
      targets: this,
      x: this.initialPosition.x,
      y: this.initialPosition.y,
      duration: (distanceToPosition * 1000) / this.moveSpeed,
      onComplete: () => {
        this.cycleTween();
      },
    });
  }

  // расчитываем дистанцию до персонажа
  update(): void {
    const player = this.player;
    const distancePlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );
    // текущее растояние
    const distanceToPosition = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.initialPosition.x,
      this.initialPosition.y
    );

    if (!this.isFollowing && distancePlayer < this.agroDistance) {
      this.isFollowing = true;
      this.stopCycleTween();
    }

    // следовать
    if (this.isFollowing && this.isAlive) {
      this.followToPlayer(player);
      // Начало боя
      if (distancePlayer < this.attackRange) {
        this.setVelocity(0, 0);
      }
      // вернуть на исходную позицию
      if (distanceToPosition > this.followRange) {
        this.isFollowing = false;
        this.returnToOriginalPosition(distanceToPosition);
      }
    }
  }
}
