import * as PIXI from 'pixi.js';
import utils from '../utils';

const WATER = ['Water/tile000.png', 'Water/tile001.png', 'Water/tile002.png', 'Water/tile003.png'];
const GRASS = [
  'Grass/tile000.png',
  'Grass/tile001.png',
  'Grass/tile002.png',
  'Grass/tile003.png',
  'Grass/tile004.png',
  'Grass/tile005.png',
  'Grass/tile010.png',
  'Grass/tile011.png',
  'Grass/tile012.png',
  'Grass/tile013.png',
  'Grass/tile014.png',
  'Grass/tile015.png',
];
const EARTH = [
  'Earth/tile000.png',
  'Earth/tile001.png',
  'Earth/tile002.png',
  'Earth/tile008.png',
  'Earth/tile009.png',
  'Earth/tile010.png',
];

const randomSprite = (array: string[]): PIXI.Sprite => {
  const path = utils.randomize(array);
  const sprite = PIXI.Sprite.from(`assets/Tilesets/${path}`);
  return sprite;
};

interface MapProps {
  waters: number;
  grasses: number;
  earths: number;
}

class Map {
  private waters: number;
  private grasses: number;
  private earths: number;
  public container: PIXI.Container = new PIXI.Container();
  public chunkSize = 64;
  public grid: any[][] = [];
  public properties = { rows: 0, columns: 0, waters: 0, earths: 0, grasses: 0 };

  constructor({ waters, grasses, earths }: MapProps) {
    this.waters = waters;
    this.grasses = grasses;
    this.earths = earths;
  }

  private generateTileNames(app: PIXI.Application) {
    const rows = Math.ceil(app.view.height / this.chunkSize);
    const columns = Math.ceil(app.view.width / this.chunkSize);
    const total = rows * columns;
    const waters = Math.ceil(total * this.waters);
    const grasses = Math.ceil(total * this.grasses);
    const earths = total - waters - grasses;
    this.properties = { rows, columns, waters, grasses, earths };
    console.log({ properties: this.properties, total });
  }

  private createGrid() {
    let x = 0;
    let y = 0;
    Array.from({ length: this.properties.rows * this.properties.columns }, () => {
      if (!(x in this.grid)) this.grid[x] = [];
      this.grid[x][y] = '';
      x += 1;
      if (x >= this.properties.columns) {
        x = 0;
        y += 1;
      }
    });
  }

  private generateSurroundingTiles = (x: number, y: number) =>
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([x, y]) => x >= 0 && x < this.properties.columns && y >= 0 && y < this.properties.rows);

  private generateBySpreading(name: string, amount: number, initialX: number, initialY: number) {
    const filled = [[initialX, initialY]];
    let failedCount = 0;
    while (amount > 0) {
      const availableTiles = filled.reduce(
        (acc, [x, y]) => [
          ...acc,
          ...this.generateSurroundingTiles(x, y).filter(
            ([x, y]) => this.grid[x][y] === '' && !acc.some(([x2, y2]) => x == x2 && y == y2),
          ),
        ],
        [] as number[][],
      );

      if (availableTiles.length > 0) {
        filled.push(utils.randomize(availableTiles));
        amount -= 1;
        failedCount = 0;
      } else {
        failedCount += 1;
        if (failedCount > 10) {
          console.log('failed');
          break;
        }
      }
    }
    filled.forEach(([x, y]) => {
      this.grid[x][y] = name;
    });
  }

  private generateWater() {
    const initialX = Math.floor(Math.random() * (this.properties.columns - 1) + 1);
    const initialY = Math.floor(Math.random() * (this.properties.rows - 1) + 1);
    this.generateBySpreading('water', this.properties.waters, initialX, initialY);
  }

  private generateGrass() {
    let initialX = Math.floor(Math.random() * (this.properties.columns - 1) + 1);
    let initialY = Math.floor(Math.random() * (this.properties.rows - 1) + 1);
    while (this.grid[initialX][initialY] !== '') {
      initialX = Math.floor(Math.random() * (this.properties.columns - 1) + 1);
      initialY = Math.floor(Math.random() * (this.properties.rows - 1) + 1);
    }

    this.generateBySpreading('grass', this.properties.grasses, initialX, initialY);
  }

  private fillGrid() {
    for (let x = 0; x < this.properties.columns; x++) {
      for (let y = 0; y < this.properties.rows; y++) {
        let names;
        if (this.grid[x][y] === 'water') {
          names = WATER;
        } else if (this.grid[x][y] === 'grass') {
          names = GRASS;
        } else {
          names = EARTH;
        }
        const sprite = randomSprite(names);
        sprite.position.set(x * this.chunkSize, y * this.chunkSize);
        sprite.width = this.chunkSize;
        sprite.height = this.chunkSize;
        this.container.addChild(sprite);
      }
    }
  }

  public generateMap(app: PIXI.Application) {
    this.generateTileNames(app);
    this.createGrid();
    this.generateWater();
    this.generateGrass();
    this.fillGrid();
  }
}

export default Map;
