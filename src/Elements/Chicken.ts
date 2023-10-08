import { AnimatedSprite } from 'pixi.js';
import utils from '../utils';

class Chicken {
  animation: AnimatedSprite;
  private readonly randomMovementRange = 30;
  private readonly movementInterval = 7;
  private readonly animationSpeed = 0.05;
  timeSinceMoved = 0;

  public async spawn() {
    const spritesheet = await utils.loadSpritesheet('../../assets/Characters/Chicken/chicken.json');
    const anim = new AnimatedSprite(spritesheet.animations.chicken);
    anim.animationSpeed = this.animationSpeed;
    anim.scale.set(3);
    anim.play();
    this.animation = anim;
    return this;
  }

  public move(delta: number) {
    this.timeSinceMoved += delta;
    if (this.timeSinceMoved < this.movementInterval) {
      return;
    }
    this.animation.position.x += (0.5 - Math.random()) * this.randomMovementRange;
    this.animation.position.y += (0.5 - Math.random()) * this.randomMovementRange;
    this.timeSinceMoved = 0;
    // this.body.rotation -= 0.01 * 10;
  }
}

export default Chicken;
