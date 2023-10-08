import { AnimatedSprite, Container } from 'pixi.js';
import utils from '../utils';
import Popup from './Popup';

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

interface Animations {
  up: AnimatedSprite;
  down: AnimatedSprite;
  left: AnimatedSprite;
  right: AnimatedSprite;
}

interface CharacterProps {
  path: string;
  title: string;
  description: string;
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
  public animations: Animations = {} as Animations;

  /** The position of the character */
  public position: { x: number; y: number } = { x: 0, y: 0 };

  /** The container of the character */
  public container = new Container();

  private details: { title: string; description: string };
  private popup: Popup;

  constructor({ path, title, description }: CharacterProps) {
    this.path = path;
    this.details = { title, description };
    this.popup = new Popup('', this.details.title, this.details.description, '');
  }

  /**
   * Load the character spritesheet
   * @returns {Promise<void>}
   */
  async load() {
    const spritesheet = await utils.loadSpritesheet(this.path);
    for (const direction of DIRECTIONS) {
      const anim = new AnimatedSprite(spritesheet.animations[direction]);
      anim.animationSpeed = this.animationSpeed;
      anim.anchor.set(0.5);
      anim.play();
      this.animations[direction] = anim;
    }
    this.container.addChild(this.animations.down);
  }

  public showPopup() {
    console.log('show popup');
    this.popup = new Popup('', this.details.title, this.details.description, '');
    this.popup.position = { x: -190, y: 100 };
    this.popup.scale.set(0.5);
    this.container.addChild(this.popup);
  }

  public hidePopup() {
    console.log('hide popup');
    this.popup.destroy();
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
