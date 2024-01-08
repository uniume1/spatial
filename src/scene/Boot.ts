import { Scene } from 'phaser'
import bg from '../spatial/assets/bg.png'

export default class Boot extends Scene {
    [x: string]: any
    constructor() {
        super('boot-scene')
    }
    preload() {
        this.load.image('bg', bg)

    }
    create() {
        const bg = this.add.image(400, 300, 'bg')
        bg.setDisplaySize(1920 * 2, 960 * 2);
        const rect = this.add.rectangle(400, 300, 100, 100, 0xf00f00)
        rect.setInteractive()
        rect.on('pointerdown', () => {
            this.scene.start('game-scene')
        })
    }
    update() {
    }
}