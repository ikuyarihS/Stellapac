import { AnimatedSprite, Container } from 'pixi.js';
import utils from '../utils';

/**
 * Animated crop class
 */
class Crop {
  /** Path to the crop spritesheet */
  public name: string;

  /** The animation speed of the crop */
  private animationSpeed;

  /** The position of the crop */
  public position: { x: number; y: number } = { x: 0, y: 0 };

  /** The animation of the crop */
  public animation: AnimatedSprite;
  public status: 'growing' | 'withering' = 'growing';

  /** The container of the crop */
  public container = new Container();

  private readonly chunkSize = 64;

  constructor(name: string, animationSpeed = 0.01) {
    this.name = name;
    this.animationSpeed = animationSpeed;
  }

  /**
   * Load the crop spritesheet
   * @returns {Promise<void>}
   */
  async grow() {
    this.container.removeChildren();
    const spritesheet = await utils.loadSpritesheet(`../../assets/Crops/${this.name}/${this.name.toLowerCase()}.json`);
    const anim = new AnimatedSprite(spritesheet.animations.grow);
    anim.animationSpeed = utils.randomInt(1, this.animationSpeed * 100) / 100;
    anim.play();
    anim.height = this.chunkSize;
    anim.width = this.chunkSize;
    anim.loop = false;
    this.animation = anim;
    this.container.addChild(this.animation);
  }

  async wither() {
    if (this.status === 'withering' || this.animation.currentFrame !== this.animation.totalFrames - 1) {
      return;
    }
    this.container.removeChildren();
    this.status = 'withering';
    const spritesheet = await utils.loadSpritesheet(`../../assets/Crops/${this.name}/${this.name.toLowerCase()}.json`);
    const anim = new AnimatedSprite(spritesheet.animations.wither);
    anim.animationSpeed = utils.randomInt(1, this.animationSpeed * 100) / 100;
    anim.gotoAndPlay(this.animation.totalFrames - this.animation.currentFrame);
    anim.height = this.chunkSize;
    anim.width = this.chunkSize;
    anim.loop = false;
    this.animation = anim;
    this.container.addChild(this.animation);
  }

  /**
   * Set the scale of the crop
   * @param {number} scale
   */
  public setScale(scale: number) {
    this.animation.scale.set(scale);
  }
}

export default Crop;
