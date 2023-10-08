import { Container, Sprite } from 'pixi.js';
import Popup from './Popup';

/**
 * Animated planetary class
 */
class Planetary {
  /** Path to the planetary */
  public path: string;

  /** Path to the planetary screenshot */
  public screenshotPath: string;

  /** The title of the planetary */
  public title: string;

  /** The description of the planetary */
  public description: string;

  /** The Sprite of the planetary */
  sprite: Sprite;

  /** The position of the planetary */
  position: { x: number; y: number } = { x: 0, y: 0 };

  properties = { waters: 0, grasses: 0, earths: 0 };

  /** The container of the planetary */
  container = new Container();
  private popup: Popup;

  constructor(
    path: string,
    screenshotPath: string,
    title: string,
    description: string,
    { waters, grasses, earths }: { waters: number; grasses: number; earths: number },
  ) {
    this.path = path;
    this.screenshotPath = screenshotPath;
    this.title = title;
    this.description = description;
    this.properties = { waters, earths, grasses };

    const sprite = Sprite.from(path);
    sprite.anchor.set(0.5);
    sprite.scale.set(2);
    sprite.width = 700;
    sprite.height = 500;
    this.sprite = sprite;
    this.container.addChild(this.sprite);

    this.popup = new Popup(screenshotPath, title, description);
  }

  public showPopup() {
    console.log('show popup');
    this.popup = new Popup(
      this.screenshotPath,
      this.title,
      this.description,
      Object.entries(this.properties)
        .map(([key, value]) => `${key[0].toUpperCase()}${key.substring(1)}: ${value * 100}%`)
        .join('\n'),
    );
    this.popup.position = { x: -380, y: 250 };
    this.container.addChild(this.popup);
  }

  public hidePopup() {
    console.log('hide popup');
    this.popup.destroy();
  }

  /**
   * Set the scale of the planetary
   * @param {number} scale
   */
  public setScale(scale: number) {
    this.container.scale.set(scale);
  }
}

export default Planetary;
