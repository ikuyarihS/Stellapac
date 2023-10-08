import { Dialog, Planetary } from '../Elements';
import store from '../store';
import BaseSelectionScene from './BaseSelection';
import PlayfieldScene from './Playfield';

// Define the character selection scene class
class PlanetarySelectionScene extends BaseSelectionScene {
  public defaultScale = 0.4;
  textures = [
    {
      path: '../../assets/Planetary/PSS1.png',
      screenshot: '../../assets/Planetary/Planet_1.png',
      title: 'Veridian-7',
      description:
        'a world that bears witness to the ancient rhythms of life. Its history is woven with tales of communities living in harmony with nature. The cultural heritage here is a celebration of sustainable practices, where every crop and creature holds a sacred place in the ecosystem',
      properties: { waters: 0.3, grasses: 0.1, earths: 0.4 },
    },
    {
      path: '../../assets/Planetary/PSS2.png',
      screenshot: '../../assets/Planetary/Planet_2.png',
      title: 'Aridora-9',
      description:
        'a planet of resilience and resourcefulness. Its people, known for their ingenuity, have transformed the arid landscapes into thriving agricultural hubs. The cultural tapestry here is one of determination, where water, though scarce, is revered as a life-giving force',
      properties: { waters: 0.1, grasses: 0.5, earths: 0.4 },
    },
    {
      path: '../../assets/Planetary/PSS3.png',
      screenshot: '../../assets/Planetary/Planet_3.png',
      title: 'Icehaven-12',
      description:
        "once a world shrouded in frost, has witnessed a remarkable metamorphosis. The planet's cultural legacy now embraces adaptability and innovation. Here, the thawing landscapes are a testament to the collective effort to breathe life into a once-frozen realm",
      properties: { waters: 0.2, grasses: 0.5, earths: 0.3 },
    },
  ];
  title = 'Select Your Planet';
  selections: Planetary[] = [];

  /** Initialize the scene */
  public async initialize(): Promise<PIXI.Container> {
    const container = await super.initialize();
    const dialog = new Dialog([
      'Before you lies a celestial canvas, each planet a world steeped in history and culture. With the aid of advanced satellite imaging and landcover classification models, you have the power to unlock their secrets.',
      'Veridian-7, a world that bears witness to the ancient rhythms of life. Its history is woven with tales of communities living in harmony with nature. The cultural heritage here is a celebration of sustainable practices, where every crop and creature holds a sacred place in the ecosystem.',
      'Aridora-9, a planet of resilience and resourcefulness. Its people, known for their ingenuity, have transformed the arid landscapes into thriving agricultural hubs. The cultural tapestry here is one of determination, where water, though scarce, is revered as a life-giving force.',
      "Icehaven-12, once a world shrouded in frost, has witnessed a remarkable metamorphosis. The planet's cultural legacy now embraces adaptability and innovation. Here, the thawing landscapes are a testament to the collective effort to breathe life into a once-frozen realm.",
      'Mouse over each planet to understand the land classification.  for each planet offers a unique tapestry of history and culture. Which world will you embrace, carrying forward its legacy, and turning its potential into a thriving beacon of sustainable agriculture?',
    ]);
    dialog.addToContainer(container);
    return container;
  }

  /** Load the selections */
  async loadSelections(): Promise<void> {
    this.selections = this.textures.map(({ path, screenshot, title, description, properties }, index) => {
      const selection = new Planetary(path, screenshot, title, description, properties);
      selection.container.on('click', () => {
        this.select(index);
      });
      selection.container.eventMode = 'static';
      return selection;
    });
  }

  select(index: number): void {
    console.log('select', index);
    this.selections[this.selectedIndex].hidePopup();
    super.select(index);
    this.selections[this.selectedIndex].showPopup();
  }

  async onComplete(): Promise<void> {
    super.onComplete();
    store.planetaryScene.getContainer().destroy();
    const playfieldScene = new PlayfieldScene({
      app: this.app,
      player: store.characterScene.getSelected(),
      planetary: store.planetaryScene.getSelected(),
    });
    await playfieldScene.initialize();
    this.app.stage.addChild(playfieldScene.getContainer());
    store.playfieldScene = playfieldScene;
    document.addEventListener('keydown', (e) => playfieldScene.onKeyDown(e));
    this.app.ticker.add((delta) => {
      playfieldScene.render(delta);
    });
  }
}

export default PlanetarySelectionScene;
