import testJSON from "../../assets/test.json";
import { Enemy } from "../../entities/enemy";
import { Player } from "../../entities/player";
import { LAYERS, SIZES, SPRITES, TITLES } from "../../utils/constants";

export class YardHomes extends Phaser.Scene {
  private player?: Player;
  private boar?: Enemy;
  private boarSecond?: Enemy;
  // исправляем типизацию - временно, позже исправить
  killsCounter: number = 0;
  private killsText!: Phaser.GameObjects.Text;
  private onNavigate?: (path: string) => void;
  public setNavigationHandler(callback: (path: string) => void) {
    this.onNavigate = callback;
  }

  constructor() {
    super("YardHomes");
  }

  // предзагрузка
  preload() {
    this.load.image(TITLES.NAME_MAP, "src/assets/sprites.png");
    this.load.tilemapTiledJSON("map", "src/assets/test.json");
    this.load.spritesheet(
      SPRITES.PLAYER.base,
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
    const earthGrass = map.createLayer(LAYERS.ONE_LAYER, tileset, 0, 0);
    const bushesFlowers = map.createLayer(LAYERS.TWO_LAYER, tileset, 0, 0);
    // 3(непроходимый)
    const impassable = map.createLayer(LAYERS.THREE_LAYER, tileset, 0, 0);
    // дверь-улица
    const doorLayer = map.createLayer(LAYERS.DOOR, tileset, 0, 0);
    // Находим координаты двери (если знаем конкретный тайл)
    const doorTile = map.findTile((tile) => tile.index === 1808);

    // навигация при клике на низ двери
    if (doorTile) {
      const tileWidth = map.tileWidth;
      const tileHeight = map.tileHeight;

      const doorZone = this.add
        .zone(
          doorTile.pixelX + tileWidth / 2,
          doorTile.pixelY + tileHeight / 2,
          tileWidth,
          tileHeight
        )
        .setOrigin(0.5);

      doorZone.setInteractive();

      doorZone.on("pointerdown", () => {
        // Отправляем событие навигации
        this.game.events.emit("navigate", "/street");
      });
    }

    // класс сцены, кардинаты, текстурный ключ из прелоад
    this.player = new Player(this, 280, 180, SPRITES.PLAYER);
    // добавить врага кабан
    // "boar" - ключ для загрузки текстуры - SPRITES.BOAR
    this.boar = new Enemy(this, 500, 240, SPRITES.BOAR.base);
    // 2 кобанчик
    this.boarSecond = new Enemy(this, 500, 375, SPRITES.BOAR.base);

    this.player.setEnemys([this.boar, this.boarSecond]);

    // камера следует за игроком
    this.cameras.main.startFollow(this.player);
    // камера не уйдет за края карты
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // физика для мира что-бы не выйти за рамки экрана
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // запрет на выход за рамки мира
    this.player.setCollideWorldBounds(true);
    // запрет на объекты wallsLayer - слой со стенами
    if (impassable) {
      this.physics.add.collider(this.player, impassable);
    }

    this.boar.setPlayer(this.player);
    this.boarSecond.setPlayer(this.player);

    impassable?.setCollisionByExclusion([-1]);
    // аналог но в диапазоне id, id виден при выборе элемента в Tiled
    // wallsLayer?.setCollisionBetween(5,24);
    this.killsText = this.add.text(770, 10, `${this.killsCounter}`, {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#ffffff",
    });
    this.killsText.setScrollFactor(0);
  }

  // реализация анимаций, действий на клавиши
  update(_: number, delta: number) {
    // fix бага с полоской - обновить до целочисленного числа при смещении камеры
    this.cameras.main.roundPixels = true;
    // console.log(delta); частота обновления кадров
    this.player?.update(delta);
    this.boar?.update();
    this.boarSecond?.update();
    this.killsText.setText(`${this.killsCounter}`);
  }
}
