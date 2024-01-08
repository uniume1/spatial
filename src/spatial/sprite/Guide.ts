import Phaser from 'phaser'

export default class Guide extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }
    public start() {

        // 遮罩
        const modalBg = this.scene.add.rectangle(0, 0, 1920 * 2, 960 * 2, 0x000000)
        modalBg.setAlpha(.3)
        modalBg.setInteractive()
        modalBg.on('pointerdown', () => {
            console.log('modal')
        })

        const centerX = this.scene.sys.game.canvas.width / 2
        const centerY = this.scene.sys.game.canvas.height / 2
        const txt1 = this.scene.add.text(centerX, centerY + 30, '请记住图形出现的顺序', {
            fontSize: 100,
            fontFamily: 'JinBuTi'
        })
        txt1.setX(centerX - txt1.width / 2)
        txt1.setAlpha(0)

        const txt2 = this.scene.add.text(centerX, centerY + 150, '依次找出所有图形', {
            fontSize: 100,
            fontFamily: 'JinBuTi'
        })
        txt2.setX(centerX - txt2.width / 2)
        txt2.setAlpha(0)
        const container = this.scene.add.container(0, 0)
        const appleCont = this.scene.add.container(0, 0)
        appleCont.add([this.scene.add.image(0, 0, 'apple').setName('a1')])
        appleCont.add(this.scene.add.image(132 * 2, 0, 'apple').setName('a2'))
        appleCont.add(this.scene.add.image(132 * 4, 0, 'apple').setName('a3'))
        appleCont.setPosition(centerX - 132 * 5 / 2 + 132 / 2, centerY - 100)
        appleCont.setAlpha(0)
        container.add([modalBg, txt1, txt2])
        this.scene.add.timeline([
            {
                at: 300,
                tween: {
                    targets: txt1,
                    duration: 500,
                    alpha: 1
                }
            }, {
                at: 1400,
                tween: {
                    targets: txt2,
                    duration: 500,
                    alpha: 1
                },
            }, {
                at: 3500,
                tween: {
                    targets: appleCont,
                    duration: 300,
                    alpha: 1,
                    onComplete: () => {
                        this.appleVanish(appleCont, container)
                    }
                },
            }
        ]).play()

        this.scene.time.delayedCall(100, () => {
            this.scene.sound.add('guideSound').play()
        })
    }
    private appleVanish(appleCont: Phaser.GameObjects.Container, container: Phaser.GameObjects.Container) {
        this.scene.time.delayedCall(900, () => {
            this.scene.sound.add('contDownSound').play()
        })
        this.scene.tweens.add({
            repeat: appleCont.length - 1,
            delay: 800,
            targets: appleCont,
            complete: () => {
                appleCont.getAt(appleCont.length - 1).destroy()
            },
            onComplete: () => {
                const maskFade = this.scene.sound.add('maskFade')
                maskFade.play()
                container.removeAll(true);
                (this.scene as any).guideAniEnd = true
            }
        })
    }
}