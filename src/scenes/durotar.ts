import testJSON from "../assets/test.json";
import { LAYERS, SIZES, TITLES } from "../utils/constants";

export class Durotar extends Phaser.Scene {
  constructor() {
    super("DurotarScene");
  }

  preload() {
    this.load.image(TITLES.NAME_MAP, "src/assets/b.png");
    this.load.tilemapTiledJSON("map", "src/assets/test.json");
  }

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
  }
}
