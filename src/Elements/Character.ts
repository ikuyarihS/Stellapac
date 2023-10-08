import { AnimatedSprite, BaseTexture, Container, Spritesheet } from 'pixi.js';

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

interface Animations {
  up: AnimatedSprite;
  down: AnimatedSprite;
  left: AnimatedSprite;
  right: AnimatedSprite;
}

/**
 * Animated character class
 * @class Character
 */
class Character {
  /** Path to the character spritesheet */
  path: string;

  /** The animation speed of the character */
  private readonly animationSpeed = 0.1;

  /** The animations of the character */
  animations: Animations = {} as Animations;

  /** The position of the character */
  position: { x: number; y: number } = { x: 0, y: 0 };

  /** The container of the character */
  container = new Container();

  constructor(path: string) {
    this.path = path;
  }

  /**
   * Load the character spritesheet
   * @returns {Promise<void>}
   */
  async load() {
    const metadata = await import(this.path , { assert: { type: "json" } }).then(module => module.default);
    const spritesheet = new Spritesheet(BaseTexture.from(metadata.meta.image), metadata);
    await spritesheet.parse();
    for (const direction of DIRECTIONS) {
      const anim = new AnimatedSprite(spritesheet.animations[direction]);
      anim.animationSpeed = this.animationSpeed;
      anim.anchor.set(0.5);
      anim.play();
      this.animations[direction] = anim;
    }
    this.container.addChild(this.animations.down);
  }

  /**
   * Set the scale of the character
   * @param {number} scale
   */
  public setScale(scale: number) {
    this.animations.up.scale.set(scale);
    this.animations.down.scale.set(scale);
    this.animations.left.scale.set(scale);
    this.animations.right.scale.set(scale);
  }

  /**
   * Move the character up
   * @param {number} pixels
   */
  moveUp(pixels: number) {
    if (window.outerHeight - pixels < 0) {
      return;
    }
    this.position.y -= pixels;
    this.container.removeChildren();
    this.container.addChild(this.animations.up);
    this.animations.up.position = this.position;
  }

  /**
   * Move the character down
   * @param {number} pixels
   */
  moveDown(pixels: number) {
    this.position.y += pixels;
    this.container.removeChildren();
    this.container.addChild(this.animations.down);
    this.animations.down.position = this.position;
  }

  /**
   * Move the character left
   * @param {number} pixels
   */
  moveLeft(pixels: number) {
    this.position.x -= pixels;
    this.container.removeChildren();
    this.container.addChild(this.animations.left);
    this.animations.left.position = this.position;
  }

  /**
   * Move the character right
   * @param {number} pixels
   */
  moveRight(pixels: number) {
    this.position.x += pixels;
    this.container.removeChildren();
    this.container.addChild(this.animations.right);
    this.animations.right.position = this.position;
  }
}

export default Character;
