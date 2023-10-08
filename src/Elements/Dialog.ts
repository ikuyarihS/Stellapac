import * as PIXI from 'pixi.js';
import store from '../store';

class Dialog extends PIXI.Container {
  private background: PIXI.Graphics;
  private texts: PIXI.Text[];
  private actionButton: PIXI.Graphics;
  private actionCallback: () => void;
  private currentIndex = 0;

  constructor(texts: string[], actionCallback: () => void = () => this.destroy()) {
    super();

    // Create the background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0xdce0d2);
    this.background.drawRect(0, 0, store.app.view.width, 200);
    this.background.endFill();
    // this.background.position.set(0, 100);-===[]
    this.addChild(this.background);

    this.texts = texts.map((text) => {
      const pixiText = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 30,
        wordWrap: true,
        wordWrapWidth: this.background.width - 10,
        letterSpacing: -2,
      });
      pixiText.position.set(10, 10);
      return pixiText;
    });

    console.log(this.texts);

    // Create the action button
    this.actionButton = new PIXI.Graphics();
    this.actionButton.beginFill();
    this.actionButton.drawRect(0, 0, 150, 50);
    this.actionButton.endFill();
    this.actionButton.position.set(store.app.view.width - 170, 140);
    this.addChild(this.actionButton);

    this.actionButton.eventMode = 'static';
    this.actionButton.on('pointerdown', () => {
      texts.length === 1 ? this.destroy() : this.next();
    });
    this.addChild(this.actionButton);

    // Create the button text
    const buttonText = new PIXI.Text(texts.length === 1 ? 'Ok' : 'Next', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(this.actionButton.width / 2, this.actionButton.height / 2);
    this.actionButton.addChild(buttonText);

    // Save the action callback
    this.actionCallback = actionCallback;

    this.addChild(this.texts[0]);
  }

  private next() {
    if (this.currentIndex >= this.texts.length - 1) {
      return;
    }
    const textRenderIndex = this.getChildIndex(this.texts[this.currentIndex]);
    this.removeChild(this.texts[this.currentIndex]);
    this.currentIndex++;
    this.addChildAt(this.texts[this.currentIndex], textRenderIndex);
    if (this.currentIndex === this.texts.length - 1) {
      this.actionButton.children[0].text = 'Ok';
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
