import * as PIXI from 'pixi.js';

const spritesheets: Record<string, PIXI.Spritesheet> = {};

const utils = {
  loadSpritesheet: async (path: string) => {
    if (!spritesheets[path]) {
      // const metadata = await import(path);
      const metadata = await import(path, { assert: { type: 'json' } }).then((module) => module.default);
      const spritesheet = new PIXI.Spritesheet(PIXI.BaseTexture.from(metadata.meta.image), metadata);
      await spritesheet.parse();
      spritesheets[path] = spritesheet;
    }
    return spritesheets[path];
  },

  randomInt(max: number, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomize: (array: any[]) => {
    return array[utils.randomInt(array.length - 1)];
  },

  shuffle: (array: any[]) => {
    const newArray = [];
    while (array.length) {
      const index = utils.randomInt(array.length);
      newArray.push(array.splice(index, 1)[0]);
    }
    return newArray;
  },
};

export default utils;
