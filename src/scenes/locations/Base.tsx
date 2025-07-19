export abstract class Base extends Phaser.Scene {
  protected killsText?: Phaser.GameObjects.Text;
  protected killsCounter: number = 0;
  protected doorHintText?: Phaser.GameObjects.Text;
  protected doorInteractionAllowed: boolean = false;

  protected showDistanceWarning() {
    const warning = this.createDoorHintText(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      "#ff0000",
      "Далековато"
    );
    this.time.delayedCall(2000, () => warning.destroy());
  }

  // количество убитых хрюшек
  protected setupKillsCounter(x: number = 770, y: number = 10) {
    this.killsText = this.add
      .text(x, y, `${this.killsCounter}`, {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
      })
      .setScrollFactor(0);
  }

  // роутинг между сценами
  protected setupDoorInteraction(
    doorTile: Phaser.Tilemaps.Tile,
    map: Phaser.Tilemaps.Tilemap,
    navigatePath: string = "/",
    text: string = `Кликни чтобы ${navigatePath == "/" ? "войти" : "выйти"}`
  ) {
    if (!doorTile || !map) return;

    const { tileWidth, tileHeight } = map;
    const { pixelX, pixelY } = doorTile;

    const doorZone = this.add
      .zone(
        pixelX + tileWidth / 2,
        pixelY + tileHeight / 2,
        tileWidth * 2,
        tileHeight * 3
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.doorHintText = this.createDoorHintText(
      pixelX + tileWidth / 2,
      pixelY - 20,
      "#ffffff",
      text
    );

    doorZone.on("pointerdown", () => {
      if (this.doorInteractionAllowed) {
        this.game.events.emit("navigate", navigatePath);
      } else {
        this.showDistanceWarning();
      }
    });
  }

  // вывод сообщений
  protected createDoorHintText(
    x: number,
    y: number,
    color: string,
    text: string
  ): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, text, {
        font: "16px Arial",
        color: color,
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(1000);
  }
}
