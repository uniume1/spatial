import { Scene } from 'phaser'
import bg from '../../assets/bg.png'
import { CONST } from '../const/Const'
import apple from '../../assets/icon-apple.png'
import error from '../../assets/icon-error.png'
import crown from '../../assets/icon-crown.png'
import line from '../../assets/icon-line.png'
import star from '../../assets/icon-star.png'
import pasueBtn from '../../assets/icon-pasue-btn.png'
import pasueBg from '../../assets/bg-pasue.png'
import finishBg from '../../assets/bg-finish.png'
import closeBtn from '../../assets/icon-close-btn.png'
import successBtn from '../../assets/icon-success-btn.png'
import hand1 from '../../assets/icon-hand-1.png'
import hand2 from '../../assets/icon-hand-2.png'

import Bar from '../sprite/Bar'
import Table from '../sprite/Table'
import Field from '../sprite/Field'

export default class Game extends Scene {
    constructor() {
        super('game-scene')
    }

    private bar: Bar | any
    private table: Table | any
    private field: Field | any

    preload() {
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


    }
    private toggleFullscreen() {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }

    create() {
        const bg = this.add.image(400, 300, 'bg')
        bg.setDisplaySize(1920 * 2, 960 * 2);

        this.bar = new Bar(this)
        this.bar.draw()

        this.table = new Table(this)

        this.field = new Field(this, { bar: this.bar })
        this.level()
        return
        const hand1 = this.add.sprite(406, 290, 'hand1')
        // const hand2 = this.add.sprite(400, 300, 'hand2')
        this.anims.create({
            key: 'ani',
            frames: [{
                key: 'hand1', duration: 80
            }, {
                key: 'hand2', duration: 80
            }],
            repeat: 2,
        })

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                hand1.play('ani')
            },
            callbackScope: this,
            loop: true
        })
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
        if (this.cardX * this.fieldW > maxW) {
            this.fieldW = (maxW / (this.cardX * CONST.FIELD_SIZE) * CONST.FIELD_SIZE)
        }
        // 超高设置
        if (this.cardY * this.fieldH > maxH) {
            this.fieldH = (maxH / (this.cardY * CONST.FIELD_SIZE) * CONST.FIELD_SIZE)
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