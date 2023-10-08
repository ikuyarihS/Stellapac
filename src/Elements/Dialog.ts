import * as PIXI from 'pixi.js';
import store from '../store';

class Dialog extends PIXI.Container {
  private background: PIXI.Graphics;
  private texts: PIXI.Text[];
  private actionButton: PIXI.Sprite;
  private actionCallback: () => void;
  private currentIndex = 0;

  constructor(texts: string[], actionCallback: () => void = () => this.destroy()) {
    super();

    // Create the background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000);
    this.background.drawRect(0, 0, 400, 200);
    this.background.endFill();
    this.addChild(this.background);

    this.texts = texts.map((text) => {
      const pixiText = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: 380,
      });
      pixiText.position.set(10, 10);
      return pixiText;
    });

    this.addChildAt(this.texts[0], 0);

    // Create the action button
    this.actionButton = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.actionButton.width = 50;
    this.actionButton.height = 50;
    this.actionButton.tint = 0x00ff00;
    this.actionButton.position.set(300, 150);
    this.actionButton.eventMode = 'static';
    this.actionButton.on('pointerdown', () => {
      this.next();
    });
    this.addChild(this.actionButton);

    // Create the button text
    const buttonText = new PIXI.Text(texts.length === 0 ? 'Take action' : 'Next', {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0xffffff,
    });
    buttonText.position.set(0, 0);
    this.actionButton.addChild(buttonText);

    // Save the action callback
    this.actionCallback = actionCallback;
  }

  private next() {
    if (this.currentIndex > this.texts.length - 1) {
      return;
    }
    this.removeChild(this.texts[this.currentIndex]);
    this.currentIndex++;
    this.addChildAt(this.texts[this.currentIndex], 0);
    if (this.currentIndex === this.texts.length - 1) {
      this.actionButton.children[0].text = 'Take action';
      this.actionButton.on('pointerdown', () => {
        this.actionCallback();
      });
    }
  }

  public addToContainer(container: PIXI.Container) {
    this.width = store.app.view.width;
    this.position.x = 0;
    this.position.y = store.app.view.height - this.height;
    container.addChild(this);
  }
}

export default Dialog;
