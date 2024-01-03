import Phaser from 'phaser'
import type { IBlockConstructor } from '../interface/block.interface';
import { CONST } from '../const/Const'

export default class Bar extends Phaser.GameObjects.Graphics {
    constructor(scene: Phaser.Scene) {
        super(scene)
    }
    private star: Phaser.GameObjects.Image | any
    private progressRect: Phaser.GameObjects.Graphics | any
    private total: number = CONST.TOTAL;
    private step: number = 1150 / this.total;
    private starProgress: number = this.step + 260
    private RectProgress: number = this.step + 30
    private index: number = CONST.INDEX;
    private scoreText: any
    private score: number = CONST.SCORE
    private stepLevel: any

    public draw() {
        const barBg = this.scene.add.graphics()
        // 进度条背景
        barBg.fillStyle(0x4BA589)
        barBg.fillRoundedRect(137, 38, 1350, 84, 28)

        barBg.fillStyle(0xffffff)
        barBg.fillRoundedRect(137, 38, 1350, 74, 28)

        barBg.lineStyle(6, 0xABD5C8)
        barBg.strokeRoundedRect(137, 38, 1350, 74, 28)

        barBg.fillStyle(0xDFEFE3)
        barBg.fillRoundedRect(226, 56, 1200, 44, 20)

        // 进度条
        this.progressRect = this.scene.add.graphics();
        this.progressRect.fillStyle(0xFCE126)
        this.progressRect.fillRoundedRect(236, 60, this.RectProgress, 35, 15) // 40/900

        // 得分区
        barBg.fillStyle(0x4BA589)
        barBg.fillRoundedRect(1500, 38, 330, 84, 28)

        barBg.fillStyle(0xffffff)
        barBg.fillRoundedRect(1500, 38, 330, 74, 28)

        barBg.lineStyle(6, 0xABD5C8)
        barBg.strokeRoundedRect(1500, 38, 330, 74, 28)

        // 皇冠
        const crown = this.scene.add.image(1526, 40, 'crown')
        crown.setPosition(crown.width / 2 + crown.x, crown.height / 2 + crown.y)
        // 连接线
        const line = this.scene.add.image(1465, 52, 'line')
        line.setPosition(line.width / 2 + line.x, line.height / 2 + line.y)
        // 星
        this.star = this.scene.add.image(this.starProgress, 42, 'star') // 90/980
        this.star.setY(this.star.height / 2 + this.star.y)
        // 暂停按钮
        const pasueBtn = this.scene.add.image(100, 16, 'pasueBtn')
        pasueBtn.setPosition(121 / 2 + pasueBtn.x, 125 / 2 + pasueBtn.y)

        // 得分区数字
        this.scoreText = this.scene.add.text(1642, 44, `${this.score}`, {
            fontFamily: 'monospace', // 你的字体
            fontSize: '56px',
            color: '#4BA589',
            fontStyle: 'italic', // 设置为斜体
        });
        // 关卡数字
        this.stepLevel = this.scene.add.text(257, 66, `${this.index}/${this.total}`, {
            fontFamily: 'monospace', // 你的字体
            fontSize: '22px',
            color: '#AD5411',
        });

        // 容器
        const container = this.scene.add.container(0, 0)
        container.add([barBg, this.progressRect, crown, line, this.star, pasueBtn, this.scoreText, this.stepLevel])
        // container.setScale(.5)

        // 暂停按钮点击事件
        pasueBtn.setInteractive()
        pasueBtn.on('pointerdown', () => {
            this.showPasueModal('pasue')
        })
    }
    public showPasueModal(s?: string) {
        const centerX = this.scene.sys.game.canvas.width / 2
        const centerY = this.scene.sys.game.canvas.height / 2
        let bgImg = s === 'pasue' ? 'pasueBg' : 'finishBg'
        const pasueImg = this.scene.add.image(centerX, centerY, bgImg)
        const closeBtn = this.scene.add.image(centerX + 220, centerY - 240, 'closeBtn')
        const successBtn = this.scene.add.image(centerX, centerY + 280, 'successBtn')

        const btnBg1 = this.scene.add.graphics()
        btnBg1.fillStyle(0xdfefe3)
        btnBg1.fillRoundedRect(centerX, centerY - 100, 320, 76, 10)
        btnBg1.setX(0 - 320 / 2)

        const btnBg2 = this.scene.add.graphics()

        btnBg2.lineStyle(2, 0xFFA800)
        btnBg2.strokeRoundedRect(centerX, centerY, 320, 76, 10)
        btnBg2.fillStyle(0xFFD324)
        btnBg2.fillRoundedRect(centerX, centerY, 320, 76, 10)
        btnBg2.setX(0 - 320 / 2)


        const btnTxt1 = this.scene.add.text(centerX, centerY - 82, '  继续作答  ', {
            color: '#2e9475',
            fontStyle: 'italic',
            fontSize: 48,
        })
        btnTxt1.setX(centerX - btnTxt1.width / 2)
        btnTxt1.setInteractive()

        const btnTxt2 = this.scene.add.text(centerX, centerY + 18, '  回到首页  ', {
            color: '#fff',
            fontStyle: 'italic',
            fontSize: 48,
        })
        btnTxt2.setX(centerX - btnTxt2.width / 2)
        btnTxt2.setInteractive()
        btnTxt2.on('pointerdown', () => {
            console.log('btnB2')
        })



        // 积分
        const text = this.scene.add.text(centerX, centerY, `${this.score}`, {
            color: '#4BA589',
            fontSize: '60px',
            fontFamily: 'monospace', // 你的字体
        })
        text.setPosition(centerX - text.width / 2, centerY - 100)

        // 积分单位
        const unit = this.scene.add.text(centerX, centerY, '分', {
            color: '#4BA589',
            fontSize: '30px',
            fontFamily: 'monospace', // 你的字体
        })
        unit.setPosition(centerX + text.width / 1.6, centerY - 76)
        text.setAlpha(0)
        unit.setAlpha(0)
        // 完成游戏
        if (!s) {
            closeBtn.setAlpha(0)
            text.setAlpha(1)
            unit.setAlpha(1)
            btnBg1.setY(100)
            btnBg2.setY(100)
            btnTxt1.setY(centerY + 18)
            btnTxt1.setText('  下一科目  ')
            btnTxt2.setY(centerY + 118)
        } else {
            btnTxt1.on('pointerdown', () => {
                // 解除暂停
                this.scene.game.resume()
                container.removeAll(true)
            })
        }

        // 遮罩
        const modalBg = this.scene.add.rectangle(0, 0, 1920 * 2, 960 * 2, 0x000000)
        modalBg.setAlpha(.3)
        modalBg.setInteractive()
        modalBg.on('pointerdown', () => {
            console.log('modal')
        })

        // 弹窗容器
        const container = this.scene.add.container(0, 0)
        container.add([modalBg, pasueImg, successBtn, closeBtn, text, unit, btnBg1, btnBg2, btnTxt1, btnTxt2])

        // 关闭逻辑
        closeBtn.setInteractive()
        closeBtn.once('pointerdown', () => {
            // 解除暂停
            this.scene.game.resume()
            container.removeAll(true)
        })

        // 暂停游戏
        this.scene.time.addEvent({
            callback: () => this.scene.game.pause(),
            callbackScope: this
        })

    }
    public setScore() {
        this.score += 1
        this.scoreText.setText(`${this.score}`)
    }
    public setProgress() {
        const n = this.step / 100
        this.scene.time.addEvent({
            delay: 10, // 每帧更新的间隔时间，单位是毫秒
            callback: () => {
                this.star.setX(this.starProgress += n)
                this.progressRect.clear()
                this.progressRect.fillStyle(0xFCE126)
                this.progressRect.fillRoundedRect(236, 60, this.RectProgress += n, 35, 15)
            },
            callbackScope: this,
            repeat: 99
        })
        this.setStepLevel()
    }
    public setStepLevel() {
        this.stepLevel.setText(`${this.index += 1}/${this.total}`)
    }
}