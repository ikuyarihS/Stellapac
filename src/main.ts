import * as PIXI from 'pixi.js';
import CharacterSelectionScene from './Scene/CharacterSelection';

import store from './store';

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
store.app = app;

const characterSelection = new CharacterSelectionScene(app);
await characterSelection.initialize();
store.characterScene = characterSelection;
app.stage.addChild(characterSelection.getContainer());

document.body.appendChild(app.view);
// Add the 'keydown' event listener to our document
// document.addEventListener('keydown', onKeyDown);
