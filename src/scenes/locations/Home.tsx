import homeJSON from "../../assets/maps/home.json";
import { Player } from "../../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../../utils/constants";

export class Home extends Phaser.Scene {
  private player?: Player;
  killsCounter: number = 0;
  private killsText!: Phaser.GameObjects.Text;
  private onNavigate?: (path: string) => void;
  public setNavigationHandler(callback: (path: string) => void) {
    this.onNavigate = callback;
  }

  constructor() {
    super("Home");
  }

  // предзагрузка
  preload() {
    this.load.on("loaderror", (file: any) => {
      console.error("Failed to load:", file.key);
    });

    this.load.image(TITLES.NAME_MAP_HOME, "src/assets/sprites.png");
    this.load.tilemapTiledJSON("map", "src/assets/maps/home.json");
    this.load.spritesheet(
      SPRITES.PLAYER.base,
      "src/assets/characters/alliance.png",
      {
        frameWidth: SIZES.PLAYER.WIDTH,
        frameHeight: SIZES.PLAYER.HEIGHT,
      }
    );

    // загрузка анимации боя
    this.load.spritesheet(
      SPRITES.PLAYER.fight,
      "src/assets/characters/alliance-fight-small.png",
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
      homeJSON.tilesets[0].name,
      TITLES.NAME_MAP_HOME,
      SIZES.TILE,
      SIZES.TILE
    );

    if (!tileset) {
      console.error("Failed to load tileset");
      return;
    }

    // слои 1 и 2
    const earthGrass = map.createLayer(LAYERS.ONE_LAYER, tileset, 0, 0);
    const bushesFlowers = map.createLayer(LAYERS.TWO_LAYER, tileset, 0, 0);
    // 3(непроходимый)
    const impassable = map.createLayer(LAYERS.THREE_LAYER, tileset, 0, 0);

    this.player = new Player(this, 690, 580, SPRITES.PLAYER);

    // камера следует за игроком
    this.cameras.main.startFollow(this.player);
    // камера не уйдет за края карты
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // физика для мира что-бы не выйти за рамки экрана
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // запрет на выход за рамки мира
    this.player.setCollideWorldBounds(true);

    // непроходимые текстуры
    if (impassable) {
      this.physics.add.collider(this.player, impassable);
      impassable?.setCollisionByExclusion([-1]);
    }

    this.killsText = this.add.text(770, 10, `${this.killsCounter}`, {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#ffffff",
    });
    this.killsText.setScrollFactor(0);
  }

  update(_: number, delta: number) {
    this.cameras.main.roundPixels = true;
    this.player?.update(delta);
    this.killsText.setText(`${this.killsCounter}`);
  }
}
