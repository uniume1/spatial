import { Scene } from 'phaser'
import bg from '../../assets/bg.png'
import line from '../../assets/bg-pasue.png'

export default class Boot extends Scene {
    [x: string]: any
    constructor() {
        super('boot-scene')
    }
    preload() {
        this.load.image('bg', bg)
        this.load.spritesheet('line', line, {
            frameWidth: 50,
            frameHeight: 30,
        });
    }
    create() {
        const bg = this.add.image(400, 300, 'bg')
        bg.setDisplaySize(1920 * 2, 960 * 2);
        // this.add.image(62, 50, 'line', 0)
        this.tileSprite = this.add.tileSprite(400, 300, 800, 600, 'line');
        this.tileSprite.setTexture('line', 2)

    }
    update() {
    }
}