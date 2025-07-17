// Phaser.GameObjects - для декораций объектов и котиков
export class Entity extends Phaser.Physics.Arcade.Sprite {
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
  }
}
