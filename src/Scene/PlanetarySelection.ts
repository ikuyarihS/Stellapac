import { Planetary } from '../Elements';
import store from '../store';
import BaseSelectionScene from './BaseSelection';
import PlayfieldScene from './Playfield';

// Define the character selection scene class
class PlanetarySelectionScene extends BaseSelectionScene {
  public defaultScale = 0.4;
  textures = [
    {
      path: '../../assets/Planetary/Planet_1.png',
      screenshot: '../../assets/Planetary/PSS1.png',
      title: 'Planet 1 - Satellite image',
      description: '',
      properties: { waters: 0.3, grasses: 0.1, earths: 0.4 },
    },
    {
      path: '../../assets/Planetary/Planet_2.png',
      screenshot: '../../assets/Planetary/PSS2.png',
      title: 'Planet 2 - Satellite image',
      description: '',
      properties: { waters: 0.1, grasses: 0.5, earths: 0.4 },
    },
    {
      path: '../../assets/Planetary/Planet_3.png',
      screenshot: '../../assets/Planetary/PSS3.png',
      title: 'Planet 3 - Satellite image',
      description: '',
      properties: { waters: 0.2, grasses: 0.5, earths: 0.3 },
    },
  ];
  title = 'Select Your Planetary';
  selections: Planetary[] = [];

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
