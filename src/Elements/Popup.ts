import * as PIXI from 'pixi.js';

class Popup extends PIXI.Container {
  private background: PIXI.Graphics;
  private image: PIXI.Sprite;
  private title: PIXI.Text;
  private description: PIXI.Text;

  constructor(imageUrl: string, titleText: string, descriptionText: string) {
    super();

    // Create the background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0xffffff);
    this.background.drawRect(0, 0, 400, 400);
    this.background.endFill();
    this.addChild(this.background);

    // Create the image
    this.image = PIXI.Sprite.from(imageUrl);
    this.image.width = 350;
    this.image.height = 250;
    this.image.position.set(25, 25);
    this.addChild(this.image);

    // Create the title
    this.title = new PIXI.Text(titleText, {
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0x000000,
    });
    this.title.position.set(25, 280);
    this.addChild(this.title);

    // Create the description
    this.description = new PIXI.Text(descriptionText, {
      fontSize: 16,
      fill: 0x000000,
      wordWrap: true,
      wordWrapWidth: 300,
    });
    this.description.position.set(25, 310);
    this.addChild(this.description);
  }
}

export default Popup;
