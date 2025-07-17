import testJSON from "../assets/test.json";
import { Enemy } from "../entities/enemy";
import { Player } from "../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../utils/constants";

export class Durotar extends Phaser.Scene {
  private player?: Player;
  private boar: Enemy;

  constructor() {
    super("DurotarScene");
  }

  // предзагрузка
  preload() {
    this.load.image(TITLES.NAME_MAP, "src/assets/b.png");
    this.load.tilemapTiledJSON("map", "src/assets/test.json");
    this.load.spritesheet(
      SPRITES.PLAYER,
      "src/assets/characters/alliance.png",
      {
        frameWidth: SIZES.PLAYER.WIDTH,
        frameHeight: SIZES.PLAYER.HEIGHT,
      }
    );
    // загрузка картинки свеньи
    this.load.spritesheet(SPRITES.BOAR.base, "src/assets/characters/boar.png", {
      frameWidth: SIZES.BOAR.WIDTH,
      frameHeight: SIZES.BOAR.HEIGHT,
    });
  }

  // создание определенных моментов
  create() {
    const map = this.make.tilemap({ key: "map" });
    // addTilesetImage(name из json файла talses->name)
    const tileset = map.addTilesetImage(
      testJSON.tilesets[0].name,
      TITLES.NAME_MAP,
      SIZES.TILE,
      SIZES.TILE
    );

    if (!tileset) {
      console.error("Failed to load tileset");
      return;
    }

    // слои 1 и 2
    const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
    const wallsLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);
    // класс сцены, кардинаты, текстурный ключ из прелоад
    this.player = new Player(this, 400, 250, SPRITES.PLAYER);
    // добавить врага кабан
    // "boar" - ключ для загрузки текстуры - SPRITES.BOAR
    this.boar = new Enemy(this, 500, 250, SPRITES.BOAR.base);

    // камера следует за игроком
    this.cameras.main.startFollow(this.player);
    // камера не уйдет за края карты
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // физика для мира что-бы не выйти за рамки экрана
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // запрет на выход за рамки мира
    this.player.setCollideWorldBounds(true);
    // запрет на объекты wallsLayer - слой со стенами
    this.physics.add.collider(this.player, wallsLayer);

    wallsLayer?.setCollisionByExclusion([-1]);
    // аналог но в диапазоне id, id виден при выборе элемента в Tiled
    // wallsLayer?.setCollisionBetween(5,24);
  }

  // реализация анимаций, действий на клавиши
  update(_: number, delta: number) {
    // console.log(delta); частота обновления кадров
    this.player?.update(delta);
  }
}
