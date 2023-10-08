import * as PIXI from 'pixi.js';
import store from '../store';
import BaseSelectionScene from './BaseSelection';
import PlanetarySelectionScene from './PlanetarySelection';
import { Dialog } from '../Elements';

// Define the character selection scene class
class CharacterSelectionScene extends BaseSelectionScene {
  textures = [
    '../../assets/Characters/Andrew JackSUN/andrew_jacksun.json',
    '../../assets/Characters/George Washingstar/george_washingstar.json',
    '../../assets/Characters/ZZorge III/zzorge_iii.json',
  ];
  title = 'Select Your Character';

  /** Initialize the scene */
  public async initialize(): Promise<PIXI.Container> {
    const container = await super.initialize();
    const dialog = new Dialog(['hi', 'yes']);
    // dialog.addToContainer(container);
    return container;
  }

  async onComplete(): Promise<void> {
    super.onComplete();
    store.characterScene.getContainer().destroy();
    const planetaryScene = new PlanetarySelectionScene(this.app);
    await planetaryScene.initialize();
    this.app.stage.addChild(planetaryScene.getContainer());
    store.planetaryScene = planetaryScene;
  }
}

export default CharacterSelectionScene;
