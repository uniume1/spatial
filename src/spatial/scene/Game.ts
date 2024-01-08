import { Scene } from 'phaser'
// 引入图片资源
import bg from '../assets/bg.png'
import apple from '../assets/icon-apple.png'
import error from '../assets/icon-error.png'
import crown from '../assets/icon-crown.png'
import line from '../assets/icon-line.png'
import star from '../assets/icon-star.png'
import pasueBtn from '../assets/icon-pasue-btn.png'
import pasueBg from '../assets/bg-pasue.png'
import finishBg from '../assets/bg-finish.png'
import closeBtn from '../assets/icon-close-btn.png'
import successBtn from '../assets/icon-success-btn.png'
import hand1 from '../assets/icon-hand-1.png'
import hand2 from '../assets/icon-hand-2.png'

// 引入声音资源
import guideSound from '../assets/sound/记忆-提示语.mp3'
import contDownSound from '../assets/sound/倒计时.mp3'
import backSound from '../assets/sound/返回.wav'
import bgSound from '../assets/sound/可做背景音乐-备选.wav'
import wrongSound from '../assets/sound/黄色.wav'
import successSound from '../assets/sound/绿色对.wav'
import maskFade from '../assets/sound/蒙版散去.wav'
import finishSound from '../assets/sound/完成.wav'

import { CONST } from '../const/Const'

import Bar from '../sprite/Bar'
import Table from '../sprite/Table'
import Field from '../sprite/Field'
import Guide from '../sprite/Guide'

export default class Game extends Scene {
    constructor() {
        super('game-scene')
    }

    private bar: Bar | any
    private table: Table | any
    private field: Field | any
    private guide: Guide | any
    private guideAniEnd: any = !CONST.HAS_GUIDE

    preload() {
        // 加载图片资源
        this.load.image('bg', bg)
        this.load.image('apple', apple)
        this.load.image('error', error)
        this.load.image('crown', crown)
        this.load.image('line', line)
        this.load.image('star', star)
        this.load.image('pasueBtn', pasueBtn)
        this.load.image('pasueBg', pasueBg)
        this.load.image('closeBtn', closeBtn)
        this.load.image('successBtn', successBtn)
        this.load.image('pasueBg', pasueBg)
        this.load.image('finishBg', finishBg)
        this.load.image('hand1', hand1)
        this.load.image('hand2', hand2)
        // 加载声音资源
        this.load.audio('guideSound', guideSound)
        this.load.audio('contDownSound', contDownSound)
        this.load.audio('maskFade', maskFade)
        this.load.audio('successSound', successSound)
        this.load.audio('wrongSound', wrongSound)
        this.load.audio('backSound', backSound)
        this.load.audio('bgSound', bgSound)
        this.load.audio('finishSound', finishSound)

    }
    private toggleFullscreen() {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }
    // drawObject() {
    //     // 绘制对象
    //     this.shakingObject.clear();
    //     this.shakingObject.fillStyle(0x00ff00);
    //     this.shakingObject.fillRect(-20, -20, 40, 40);
    // }

    // startFastShake() {
    //     // 快速抖动动画
    //     const shakeIntensity = 5; // 抖动幅度
    //     const shakeDuration = 100; // 抖动持续时间

    //     this.tweens.add({
    //         targets: this.shakingObject,
    //         x: {
    //             value: this.shakingObject.x + shakeIntensity,
    //             duration: 50,
    //             yoyo: true,
    //             repeat: 5,
    //         },
    //         y: {
    //             value: this.shakingObject.y + shakeIntensity,
    //             duration: 50,
    //             yoyo: true,
    //             repeat: 5,
    //         },
    //         ease: 'Sine.easeInOut',
    //     });
    // }
    createBubble(x: any, y: any, r: number) {
        // const bubble: any = this.add.image(x, y, 'crown');
        // bubble.setScale(0.5);

        const bubble: any = this.add.graphics();
        bubble.fillStyle(0xff0000)
        bubble.fillCircle(x, y, r)


        // 添加水平速度，使汽泡分散
        this.physics.world.enable(bubble);
        bubble.body.velocity.y = -Phaser.Math.Between(100, 250);
        bubble.body.velocity.x = Phaser.Math.Between(-50, 50); // 控制分散的水平速度

        this.tweens.add({
            targets: bubble,
            alpha: 0,
            // duration: 1000,
            onComplete: () => {
                bubble.destroy();
            },
            delay: 500
        })
    }
    bubble() {
        const rectangle = this.add.rectangle(400, 300, 100, 100, 0xff0000);
        rectangle.setInteractive();

        rectangle.on('pointerdown', () => {
            rectangle.setVisible(false);
            this.time.delayedCall(1000, () => {
                rectangle.setVisible(true);
            })

            for (let i = 0; i < 10; i++) {
                // 每个汽泡的水平位置稍微分散
                const bubbleX = rectangle.x + Phaser.Math.Between(-20, 20);
                const bubbleY = rectangle.y + Phaser.Math.Between(-10, 50);
                const r = Phaser.Math.Between(5, 20);

                this.createBubble(bubbleX, bubbleY, r);
            }
        });
    }
    private guideSound: any
    create() {
        const bg = this.add.image(400, 300, 'bg')
        bg.setDisplaySize(1920 * 2, 960 * 2);


        // 创建背景音乐实例
        const bgSound = this.sound.add('bgSound', { loop: true });
        // 播放背景音乐
        bgSound.play();
        bgSound.setVolume(.5)


        this.bar = new Bar(this)
        this.bar.draw()
        // 重力方块
        // const b: any = this.add.rectangle(400, 400, 50, 50, 0xff0000)
        // this.physics.world.enable(b)
        // b.body.velocity.y = -Phaser.Math.Between(120, 280)
        // b.body.velocity.x = 50



        // this.bubble()

        this.table = new Table(this)

        this.field = new Field(this, { bar: this.bar })
        this.level()

        if (CONST.HAS_GUIDE) {
            this.guide = new Guide(this)
            this.guide.start()
        }

    }
    update(time: number, delta: number): void {

    }
    private cardX = CONST.CARD_X;
    private cardY = CONST.CARD_Y;
    private fieldW = CONST.FIELD_SIZE
    private fieldH = CONST.FIELD_SIZE

    private calcFieldSize() {
        this.reset()
        const maxW = this.cameras.main.width * .56
        const maxH = this.cameras.main.height * .74
        // 超宽设置
        // if (this.cardX * this.fieldW > maxW) {
        //     this.fieldW = (maxW / (this.cardX * CONST.FIELD_SIZE) * CONST.FIELD_SIZE)
        // }
        // 超高设置
        if (this.cardY * this.fieldH > maxH) {
            this.fieldH = (maxH / (this.cardY * CONST.FIELD_SIZE) * CONST.FIELD_SIZE)
            this.fieldW = this.fieldH
        }
        return [this.fieldW, this.fieldH]
    }

    private level() {
        const [fieldWidth, fieldHeight] = this.calcFieldSize()
        this.field.draw(fieldWidth, fieldHeight)
        this.table.draw(fieldWidth, fieldHeight)
    }
    private reset() {
        this.fieldW = CONST.FIELD_SIZE
        this.fieldH = CONST.FIELD_SIZE
    }
}