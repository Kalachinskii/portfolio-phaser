import type { Durotar } from "../scenes/durotar";
import { Entity } from "./entity";

export class Enemy extends Entity {
  private player?: Entity;
  private isFollowing: boolean;
  private agroDistance: number;
  private followRange: number;
  private attackRange: number;
  private isAlive: boolean;
  private moveSpeed: number;
  private initialPosition: { x: number; y: number };
  private lastAttackTime: number = 0;
  private attackCooldown: number = 2000;

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
  cycleTween(): void {
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

  setPlayer(player: Entity): void {
    this.player = player;
  }

  stopCycleTween(): void {
    // удаляем анимации на объекте
    this.scene.tweens.killTweensOf(this);
  }

  // кто, за-кем, с какой скоростью
  followToPlayer(player: Entity): void {
    this.scene.physics.moveToObject(this, player, this.moveSpeed);
  }

  returnToOriginalPosition(distanceToPosition: number): void {
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

  // атака
  attack(target: Entity): void {
    // текущее игровое время в миллисекундах
    const currentTime = this.scene.game.loop.time;
    // Проверяем, прошло ли достаточно времени с последней атаки
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      target.takeDamage(10);
      // Обновляем время последней атаки
      this.lastAttackTime = currentTime;
    }
  }

  // переопределение получение урона у монстра
  takeDamage(damage: number): void {
    super.takeDamage(damage);
    // доступно т.к. есть у  родительского класса
    if (this.health <= 0) {
      this.deactivate();
    }
  }

  // диактивация - монстр убит
  deactivate(): void {
    const scene = this.scene as Durotar;
    // остановим анимацию
    this.stopCycleTween();
    // сохранить позицию
    this.setPosition(this.initialPosition.x, this.initialPosition.y);
    // скрыть видемость героя
    this.setVisible(false);
    // флаг логики следования
    this.isAlive = false;
    // удаление противника с карты
    this.destroy();
    // передача переменной через объект сцены (такое себе)
    scene.killsCounter += 1;
  }

  // расчитываем дистанцию до персонажа
  update(): void {
    const player = this.player;
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player!.x,
      player!.y
    );
    // текущее растояние
    const distanceToPosition = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.initialPosition.x,
      this.initialPosition.y
    );

    if (!this.isFollowing && distanceToPlayer < this.agroDistance) {
      this.isFollowing = true;
      this.stopCycleTween();
    }

    // следовать
    if (this.isFollowing && this.isAlive) {
      this.followToPlayer(player as Entity);
      // Начало боя
      if (distanceToPlayer < this.attackRange) {
        this.setVelocity(0, 0);
        this.attack(player as Entity);
        // console.log("Атакую! Здоровье цели:", (player as Entity).health);
      }
      // вернуть на исходную позицию
      if (distanceToPosition > this.followRange) {
        this.isFollowing = false;
        this.returnToOriginalPosition(distanceToPosition);
      }
    }
  }
}
