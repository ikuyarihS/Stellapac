import * as PIXI from 'pixi.js';
import CharacterSelectionScene from './Scene/CharacterSelection';
import PlanetarySelectionScene from './Scene/PlanetarySelection';
import PlayfieldScene from './Scene/Playfield';

interface Store {
  app: PIXI.Application;
  characterScene: CharacterSelectionScene;
  planetaryScene: PlanetarySelectionScene;
  playfieldScene: PlayfieldScene;
}

const store: Store = {} as Store;

export default store;
