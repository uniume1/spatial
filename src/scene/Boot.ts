import { Scene } from 'phaser'
import kingIdle from '/assets/Sprites/01-King Human/Idle (78x58).png'
import kingRun from '/assets/Sprites/01-King Human/run (78x58).png'
import Terrain from '/assets/Sprites/14-TileSets/Terrain (32x32).png'
import dude from './image/dude.png'

export default class Boot extends Scene {
    [x: string]: any
    constructor() {
        super('boot-scene')
    }
    preload() {
        this.load.spritesheet({
            key: 'king-idle',
            url: kingIdle,
            frameConfig: {
                frameWidth: 78,
                frameHeight: 58
            }
        })
        this.load.spritesheet({
            key: 'king-run',
            url: kingRun,
            frameConfig: {
                frameWidth: 78,
                frameHeight: 58
            }
        })

    }
    create() {
        // const king = this.add.sprite(400, 300, 'king')
        // this.king = this.physics.add.sprite(300, 300, 'king-idle')
        this.kingRun = this.physics.add.sprite(300, 300, 'king-run')
        // this.king.animations.add('left', [0, 1, 2, 3], 10, true)
        this.anims.create({
            key: 'king-idle',
            frames: this.anims.generateFrameNumbers('king-idle', { start: 0, end: 22 }),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'king-left',
            frames: this.anims.generateFrameNumbers('king-run', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'king-run', frame: 4 }],
            frameRate: 20,
            repeat: -1,
        })
        // this.king.anims.play('king-idle')
        // this.king.body.setSize(38, 38)
        this.kingRun.body.setSize(38, 38)




        // // const king = this.add.sprite(400, 300, 'kingIdle')

        // // const king = this.add.sprite(400, 300, 'kingIdle')
        // // this.physics.add.existing(king)
        // // king.body.setSize(78, 58)
        // this.physics.add.sprite(400, 300, 'king-idle')

        // this.anims.create({
        //     key: 'kingIdle',
        //     frames: this.anims.generateFrameNumbers('king-idle', {
        //         start: 0,
        //         end: 12,
        //     }),
        //     repeat: -1,
        //     frameRate: 10
        // })
        // // console.log(king)
        this.cameras.main.setZoom(2)
        this.cursor = this.input.keyboard.createCursorKeys()

    }
    update() {
        const { left, right, up, down } = this.cursor
        if (left.isDown) {
            console.log('left',)
            this.kingRun.setFlipX(true)
            this.kingRun.setVelocityX(-100)
            this.kingRun.anims.play('king-left', true)
        } else if (right.isDown) {
            console.log('right')
            this.kingRun.setFlipX(false)

            this.kingRun.setVelocityX(100)
            this.kingRun.anims.play('king-left', true)

        } else if (up.isDown) {
            console.log('up')

        } else if (down.isDown) {
            this.scene.start('game-scene');
        } else {
            this.kingRun.setVelocityX(0)
            this.kingRun.anims.play('turn')
        }
    }
}