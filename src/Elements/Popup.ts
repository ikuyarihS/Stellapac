import * as PIXI from 'pixi.js';

class Popup extends PIXI.Container {
  private background: PIXI.Graphics;
  private image: PIXI.Sprite;
  private title: PIXI.Text;
  private description: PIXI.Text;
  private detail: PIXI.Text;

  constructor(imageUrl: string, titleText: string, descriptionText: string, detailText: string) {
    super();

    const removeImagePadding = imageUrl !== '' ? 0 : 500;

    // Create the background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0xffffff);
    this.background.drawRect(0, 0, 760, 850 - removeImagePadding);
    this.background.endFill();
    this.addChild(this.background);

    if (imageUrl !== '') {
      // Create the image
      this.image = PIXI.Sprite.from(imageUrl);
      this.image.width = 700;
      this.image.height = 500;
      this.image.position.set(30, 30);
      this.addChild(this.image);
    }

    // Create the title
    this.title = new PIXI.Text(titleText, {
      fontSize: 55,
      fontWeight: 'bold',
      fill: 0x000000,
    });
    this.title.position.set(125, 530 - removeImagePadding);
    this.addChild(this.title);

    if (imageUrl !== '') {
      const textTiny = new PIXI.Text('(Modal scan)', {
        fontSize: 30,
        fontWeight: 'bold',
        fill: 0x000000,
      });
      textTiny.position.set(titleText.length * 45, 545 - removeImagePadding);
      this.addChild(textTiny);
    }

    // Create the description
    this.description = new PIXI.Text(descriptionText, {
      fontSize: 25,
      fill: 0x000000,
      wordWrap: true,
      wordWrapWidth: 700,
    });
    this.description.position.set(25, 590 - removeImagePadding);
    this.addChild(this.description);

    this.detail = new PIXI.Text(detailText, {
      fontSize: 25,
      fill: 0x000000,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 760,
    });
    this.detail.position.set(25, 740 - removeImagePadding);
    this.addChild(this.detail);
  }
}

export default Popup;
