import * as PIXI from 'pixi.js';
import store from '../store';
import BaseSelectionScene from './BaseSelection';
import PlanetarySelectionScene from './PlanetarySelection';
import { Dialog } from '../Elements';

// Define the character selection scene class
class CharacterSelectionScene extends BaseSelectionScene {
  textures = [
    {
      path: '../../assets/Characters/ZZorge III/zzorge_iii.json',
      title: 'Andrew JackSUN',
      description:
        "And then there's Andrew JackSUN, a dedicated pioneer with a vision for regenerating the land and creating a self-sustaining oasis. His expertise in soil science is unmatched, and he's ready to lead the charge towards a greener tomorrow.",
    },
    {
      path: '../../assets/Characters/Andrew JackSUN/andrew_jacksun.json',
      title: 'ZZorge III',
      description:
        'Meet ZZorge III, a wise and compassionate soul, deeply connected to the harmony of nature. Her expertise in biodiversity and animal husbandry will pave the way for a flourishing, balanced ecosystem',
    },
    {
      path: '../../assets/Characters/George Washingstar/george_washingstar.json',
      title: 'George Washingstar',
      description:
        "Next, we have George Wahsingstar, a pragmatic problem-solver who knows how to turn limited resources into abundant harvests. With a background in engineering and a knack for innovation, he's poised to engineer nature's potential.",
    },
  ];
  title = 'Select Your Character';

  /** Initialize the scene */
  public async initialize(): Promise<PIXI.Container> {
    const container = await super.initialize();
    const dialog = new Dialog([
      'Meet ZZorge III, a wise and compassionate soul, deeply connected to the harmony of nature. Her expertise in biodiversity and animal husbandry will pave the way for a flourishing, balanced ecosystem.',
      "Next, we have George Wahsingstar, a pragmatic problem-solver who knows how to turn limited resources into abundant harvests. With a background in engineering and a knack for innovation, he's poised to engineer nature's potential.",
      "And then there's Andrew JackSUN, a dedicated pioneer with a vision for regenerating the land and creating a self-sustaining oasis. His expertise in soil science is unmatched, and he's ready to lead the charge towards a greener tomorrow.",
      'Choose your pioneer wisely, for their strengths will guide your journey towards prosperity. Who will lead the charge in transforming this barren land into a thriving beacon of regenerative agriculture?',
    ]);
    dialog.addToContainer(container);
    return container;
  }

  select(index: number): void {
    console.log('select', index);
    this.selections[this.selectedIndex].hidePopup();
    super.select(index);
    this.selections[this.selectedIndex].showPopup();
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
