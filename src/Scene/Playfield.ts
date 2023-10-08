import * as PIXI from 'pixi.js';
import { ActionMenu, Character, Chicken, Clock, Crop, Map, Dialog } from '../Elements';
import utils from '../utils';

class PlayfieldScene {
  private app: PIXI.Application;
  private container: PIXI.Container = new PIXI.Container();
  private chickens: Chicken[] = [];
  private crops: Crop[] = [];
  private player: Character;
  private dialog: Dialog;
  private map: Map;
  private planetary: any; // TODO: define planetary type

  private clock = new Clock();
  private sinceLastEvent = 0;

  constructor({ app, player, planetary }: { app: PIXI.Application; player: Character; planetary: any }) {
    this.app = app;
    this.player = player;
    this.planetary = planetary;
    this.map = new Map(this.planetary.properties);

    this.dialog = new Dialog(['hi']);

    this.container.addChild(this.dialog);

    this.app.stage.on('click', () => {
      console.log('click');
    });
    this.app.stage.eventMode = 'static';
  }

  public async initialize() {
    this.map.generateMap(this.app);
    this.container.addChild(this.map.container);
    await this.spawnCrops('Corn', 0.1);
    this.spawnPlayer();
    await this.spawnChickens();
    this.container.addChild(this.clock.container);
    const dialog = new Dialog([
      "As you step onto the soil of your chosen planet, a new chapter in regenerative agriculture unfolds before you. The landscape holds the echoes of a rich history, and now it's your turn to leave a legacy of sustainable abundance.",
      "Your first challenge: Crop Rotation. This ancient practice is the cornerstone of sustainable farming, ensuring the health and fertility of the soil. By strategically rotating crops, you'll optimize nutrient balance and minimize the risk of pests and diseases.",
      'Select your initial crops wisely, considering their nutrient needs and compatibility. Observing the rhythms of nature will be key to your success. Let the dance of the seasons guide your choices.',
      'As you embark on this journey, remember that every decision you make has a ripple effect on the ecosystem. Embrace the power of regenerative agriculture, and watch as your outpost flourishes with life and vitality.',
    ]);
    dialog.addToContainer(this.container);
  }

  /** Create the background */
  private createBackground(): void {
    const background = new PIXI.Graphics();
    background.beginFill(0xffffff);
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.endFill();
    this.container.addChild(background);
  }

  private async spawnChickens(count = 7) {
    for (let i = 0; i < count; i++) {
      const chicken = await new Chicken().spawn();
      this.chickens.push(chicken);
      this.centerContainer(chicken.animation);
      const playerIndex = this.container.getChildIndex(this.player.container);
      this.container.addChildAt(chicken.animation, playerIndex);
    }
  }

  private centerContainer(container: PIXI.Container) {
    container.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
  }

  private moveChickens(delta: number) {
    this.chickens.forEach((chicken) => chicken.move(delta));
  }

  private spawnPlayer() {
    this.player.setScale(2);
    this.centerContainer(this.player.container);
    this.container.addChild(this.player.container);
    this.player.container.on('click', () => {
      const actionMenu = new ActionMenu([
        {
          text: 'Grow corn',
          callback: () => {
            console.log('grow corn');
            this.spawnCrops('Corn', 0.1);
          },
        },
        {
          text: 'Grow peas',
          callback: () => {
            console.log('grow peas');
            this.spawnCrops('Peas', 0.05);
          },
        },
        {
          text: 'Grow wheat',
          callback: () => {
            console.log('grow wheat');
            this.spawnCrops('Wheat', 0.05);
          },
        },

        {
          text: 'Spawn chicken',
          callback: () => {
            console.log('spawn chicken');
            this.spawnChickens(7);
          },
        },
      ]);
      actionMenu.position.set(this.player.position.x, this.player.position.y);
      this.player.container.addChild(actionMenu);
    });
  }

  private async spawnCrops(name: string, animationSpeed: number) {
    this.crops.forEach((crop) => crop.container.destroy());
    for (let x = 2; x < this.map.grid.length - 2; x++) {
      for (let y = 2; y < this.map.grid[x].length - 2; y++) {
        if (this.map.grid[x][y] !== 'water') {
          const crop = new Crop(name, animationSpeed);
          await crop.grow();
          crop.animation.height = this.map.chunkSize;
          crop.animation.width = this.map.chunkSize;
          crop.container.position.x = x * this.map.chunkSize;
          crop.container.position.y = y * this.map.chunkSize;
          this.crops.push(crop);
          this.container.addChild(crop.container);
        }
      }
    }
  }

  public render(delta: number) {
    this.sinceLastEvent += delta;
    this.moveChickens(delta);
    this.clock.render(delta);

    if (this.sinceLastEvent > 10) {
      const witherCount = utils.randomInt(4, 1);
      for (let i = 0; i < witherCount; i++) {
        const crop = utils.randomize(this.crops.filter((crop) => crop.status !== 'withering'));
        if (crop) crop.wither();
      }
      this.sinceLastEvent = 0;
    }
    // this.checkEvent();
  }

  private checkEvent() {
    if (this.sinceLastEvent > 5 * 60) {
      console.log('event');
      this.pause();
      const actionMenu = new ActionMenu([
        { text: 'Attack', callback: () => console.log('attack') },
        { text: 'Defend', callback: () => console.log('defend') },
        { text: 'Run', callback: () => console.log('run') },
        {
          text: 'Spawn chicken',
          callback: () => {
            console.log('spawn chicken');
            this.spawnChickens(7);
            this.resume();
            actionMenu.destroy();
          },
        },
      ]);
      this.centerContainer(actionMenu);
      this.container.addChild(actionMenu);
      this.sinceLastEvent = 0;
    }
  }

  private pause() {
    this.app.ticker.stop();
  }

  private resume() {
    this.app.ticker.start();
  }

  public getContainer() {
    return this.container;
  }

  public show() {
    this.container.visible = true;
  }

  public hide() {
    this.container.visible = false;
  }

  public isVisible() {
    return this.container.visible;
  }

  public onKeyDown(e: KeyboardEvent) {
    const movSize = 50;
    const movX = this.app.view.width / movSize;
    const movY = this.app.view.height / movSize;
    switch (e.keyCode) {
      case 87:
      case 38:
        this.player.moveUp(movY);
        break;
      case 83:
      case 40:
        this.player.moveDown(movY);
        break;
      case 65:
      case 37:
        this.player.moveLeft(movX);
        break;
      case 68:
      case 39:
        this.player.moveRight(movX);
        break;
    }
  }
}

export default PlayfieldScene;
