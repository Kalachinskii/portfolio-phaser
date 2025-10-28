import type { Enemy } from "../../entities/enemy";
import { Player } from "../../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../../utils/constants";
import { Base } from "./Base";

export class Home extends Base {
  private player?: Player;
  private map?: Phaser.Tilemaps.Tilemap;
  private doorTile: Phaser.Tilemaps.Tile | null = null;
  private enemies: Enemy[] = [];

  constructor() {
    super("Home");
  }

  preload() {
    this.load.image(TITLES.NAME_MAP_HOME, "assets/sprites.png");
    this.load.tilemapTiledJSON("home-map", "assets/maps/home.json");

    // ПУТИ для спрайтов
    const spritesToLoad = [
      { key: SPRITES.PLAYER.base, path: "assets/characters/alliance.png" },
      {
        key: SPRITES.PLAYER.fight,
        path: "assets/characters/alliance-fight-small.png",
      },
    ];

    spritesToLoad.forEach(({ key, path }) => {
      this.load.spritesheet(key, path, {
        frameWidth: SIZES.PLAYER.WIDTH,
        frameHeight: SIZES.PLAYER.HEIGHT,
      });
    });
  }

  private setupPlayerAndEnemies() {
    if (!this.map) return;

    this.player = new Player(this, 690, 580, SPRITES.PLAYER);

    // Настройка камеры и физики
    this.cameras.main
      .startFollow(this.player)
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.player.setCollideWorldBounds(true);
  }

  create() {
    this.map = this.make.tilemap({ key: "home-map" });

    // tileset имя из загруженной карты
    const tilesetName = this.map.tilesets[0]?.name || "Interiors";
    const tileset = this.map.addTilesetImage(
      tilesetName,
      TITLES.NAME_MAP_HOME,
      SIZES.TILE,
      SIZES.TILE
    );

    if (!tileset) {
      console.error("Failed to load tileset");
      return;
    }

    // Создаем слои карты
    [
      LAYERS.ONE_LAYER,
      LAYERS.TWO_LAYER,
      LAYERS.THREE_LAYER,
      LAYERS.DOOR,
    ].forEach((layer) => {
      this.map?.createLayer(layer, tileset, 0, 0);
    });

    // ПОИСК ТАЙЛА - используем индекс из Tiled
    this.doorTile = this.map.findTile((tile) => tile.index === 3365);

    // расположение точки клика, сцена, куда перенаправить
    this.doorTile &&
      this.setupDoorInteraction(this.doorTile, this.map, "/street");
    this.setupPlayerAndEnemies();

    // Настройка коллизий
    const impassable = this.map.getLayer(LAYERS.THREE_LAYER)?.tilemapLayer;
    if (impassable && this.player) {
      this.physics.add.collider(this.player, impassable);
      impassable.setCollisionByExclusion([-1]);
    }

    // да игрок существует !
    this.enemies.forEach((enemy) => enemy.setPlayer(this.player!));
  }

  update(_: number, delta: number) {
    this.cameras.main.roundPixels = true;
    this.player?.update(delta);

    // Управление отображением подсказки
    if (this.doorTile && this.player && this.map && this.doorHintText) {
      const doorCenterX = this.doorTile.pixelX + this.map.tileWidth / 2;
      const doorCenterY = this.doorTile.pixelY + this.map.tileHeight / 2;

      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        doorCenterX,
        doorCenterY
      );

      this.doorInteractionAllowed = distance < 50;

      this.doorHintText.setVisible(distance < 50);
    }
  }
}
