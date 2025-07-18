// Phaser.GameObjects - для декораций объектов и котиков
export class Entity extends Phaser.Physics.Arcade.Sprite {
  health: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    type?: string
  ) {
    super(scene, x, y, texture);

    this.scene = scene;
    // отрисовка персонажа
    this.scene.add.existing(this);
    // + физический объект на сцену
    this.scene.physics.add.existing(this);
    this.health = 100;
  }

  // получение урона
  takeDamage(damage: number) {
    if (this.health > 0) {
      this.health -= damage;
    }
  }
}
