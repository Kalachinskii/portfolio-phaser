import testJSON from "../assets/test.json";
import { Player } from "../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../utils/constants";

export class Durotar extends Phaser.Scene {
  private player?: Player;

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
  }

  // реализация анимаций, действий на клавиши
  update(time: number, delta: number): void {}
}
