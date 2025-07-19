import testJSON from "../../assets/test.json";
import { Enemy } from "../../entities/enemy";
import { Player } from "../../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../../utils/constants";

export class YardHomes extends Phaser.Scene {
  private player?: Player;
  private enemies: Enemy[] = [];
  private killsCounter = 0;
  private killsText!: Phaser.GameObjects.Text;
  private onNavigate?: (path: string) => void;
  private doorHintText?: Phaser.GameObjects.Text;
  private doorTile: Phaser.Tilemaps.Tile | null = null;
  private map?: Phaser.Tilemaps.Tilemap;
  private doorInteractionAllowed: boolean = true;

  constructor() {
    super("YardHomes");
  }

  preload() {
    // Оптимизированная загрузка ресурсов
    const { load } = this;
    load.image(TITLES.NAME_MAP, "src/assets/sprites.png");
    load.tilemapTiledJSON("map", "src/assets/test.json");

    // Загрузка спрайтов через цикл
    const spritesToLoad = [
      { key: SPRITES.PLAYER.base, path: "src/assets/characters/alliance.png" },
      { key: SPRITES.BOAR.base, path: "src/assets/characters/boar.png" },
      {
        key: SPRITES.PLAYER.fight,
        path: "src/assets/characters/alliance-fight-small.png",
      },
    ];

    spritesToLoad.forEach(({ key, path }) => {
      load.spritesheet(key, path, {
        frameWidth: SIZES[key.includes("BOAR") ? "BOAR" : "PLAYER"].WIDTH,
        frameHeight: SIZES[key.includes("BOAR") ? "BOAR" : "PLAYER"].HEIGHT,
      });
    });
  }

  private setupDoorInteraction() {
    if (!this.doorTile || !this.map) return;

    const { tileWidth, tileHeight } = this.map;
    const { pixelX, pixelY } = this.doorTile;

    // Создаем зону взаимодействия
    const doorZone = this.add
      .zone(
        pixelX + tileWidth / 2,
        pixelY + tileHeight / 2,
        tileWidth * 2,
        tileHeight * 3
      )
      .setOrigin(0.5);

    doorZone.setInteractive({ useHandCursor: true });

    // Создаем текстовую подсказку
    this.doorHintText = this.createDoorHintText(
      pixelX + tileWidth / 2,
      pixelY - 20
    );

    doorZone.on("pointerdown", () => {
      if (this.doorInteractionAllowed) {
        this.game.events.emit("navigate", "/");
      } else {
        this.showDistanceWarning();
      }
    });
  }

  private createDoorHintText(x: number, y: number): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, "Кликните по двери чтобы войти", {
        font: "16px Arial",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setVisible(false)
      .setScrollFactor(0);
  }

  private setupPlayerAndEnemies() {
    if (!this.map) return;

    this.player = new Player(this, 280, 180, SPRITES.PLAYER);
    this.enemies = [
      new Enemy(this, 500, 240, SPRITES.BOAR.base),
      new Enemy(this, 500, 375, SPRITES.BOAR.base),
    ];
    this.player.setEnemys(this.enemies);

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

  private setupKillsCounter() {
    this.killsText = this.add
      .text(770, 10, `${this.killsCounter}`, {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
      })
      .setScrollFactor(0);
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage(
      testJSON.tilesets[0].name,
      TITLES.NAME_MAP,
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

    this.doorTile = this.map.findTile((tile) => tile.index === 1808);
    this.setupDoorInteraction();
    this.setupPlayerAndEnemies();
    this.setupKillsCounter();

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
    this.enemies.forEach((enemy) => enemy.update());
    this.killsText.setText(`${this.killsCounter}`);

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

  private showDistanceWarning() {
    const warning = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        "Подойдите ближе к двери!",
        {
          font: "20px Arial",
          color: "#ff0000",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setDepth(2000);

    this.time.delayedCall(2000, () => warning.destroy());
  }
}
