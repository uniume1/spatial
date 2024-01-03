import Phaser from 'phaser'
import { CONST } from '../const/Const'

export default class Field extends Phaser.GameObjects.Graphics {
    private container: Phaser.GameObjects.Container
    private bar: any
    private cards: any = [];
    private selectCardsArr: any = [];
    private selectCardResult: any = [];
    private ranNumber: number = 0;
    private fw: number = 0
    private fh: number = 0
    private successNumber: number = 0
    mask: any = undefined
    private life: number = CONST.LIFE
    private hasWrong: boolean = false
    private number: number = CONST.DEFAULT_NUMBER
    private hasMask: boolean = false
    private finish: boolean = false

    constructor(scene: Phaser.Scene, opt?: any) {
        super(scene)
        this.container = this.scene.add.container(0, 0)
        this.bar = opt.bar
    }

    // 重置
    private reset() {
        this.cards = []
        this.selectCardsArr = []
        this.selectCardResult = []
        this.ranNumber = 0
        this.fw = 0
        this.fh = 0
        this.hasWrong = false
    }

    public draw(w: number, h: number) {
        this.reset()
        this.container.removeAll(true)
        const centerX = this.scene.sys.game.canvas.width / 2
        const centerY = this.scene.sys.game.canvas.height / 2
        const padding: number = 40
        const rectWidth = w * this.scene.cardX;
        const rectHeight = h * this.scene.cardY
        this.mask = this.scene.add.rectangle(rectWidth / 2 + 20, rectHeight / 2 + 20, rectWidth, rectHeight, 0x000000)
        this.mask.setAlpha(.1)
        this.mask.setInteractive()
        this.hasMask = true
        this.fw = w
        this.fh = h

        const cardColors = [0xDFEFE3, 0xF7F9F6]; // 交替颜色

        const clickRecordArr: any = []
        let n = 0
        for (let i = 0; i < this.scene.cardX; i++) {
            for (let j = 0; j < this.scene.cardY; j++) {
                const x = i * w + w / 2 + 20
                const y = j * h + h / 2 + 20
                const card = this.scene.add.rectangle(x, y, w, h, cardColors[(i + j) % 2])
                card.setAlpha(0)
                n++
                this.scene.tweens.add({
                    targets: card,
                    alpha: 1,
                    delay: 0,
                    duration: n * 10,
                })

                this.cards.push({ x, y })
                card.setInteractive()
                card.on('pointerdown', () => {
                    const filter = this.selectCardResult.filter((item: any) => item.x === x && item.y === y)
                    if (filter.length > 0) return
                    if (clickRecordArr.length < this.selectCardsArr.length) {
                        clickRecordArr.push({ x, y })
                        const len = clickRecordArr.length - 1
                        const CRA = clickRecordArr[len]
                        const SCA = this.selectCardsArr[len]
                        if (CRA.x === SCA.x && CRA.y === SCA.y) {
                            this.click(x, y, clickRecordArr.length)
                            // 清除已经正确选择的事件
                            card.off('pointerdown')
                        } else {
                            this.wrongClick(x, y, clickRecordArr.length, SCA)
                        }
                    }
                }, this);
                this.container.add(card)
            }
        }
        this.container.add(this.mask)
        this.container.setPosition(centerX - (rectWidth + padding) / 2, centerY - (rectHeight + padding) / 2 + 60)

        !this.finish && this.ranCards()
    }
    // 选取随机格子数据
    private ranCards() {
        const newCards: any = [].concat(...this.cards)
        let delayTime = 0
        while (this.selectCardsArr.length < this.number) {
            const ran = Math.floor(Math.random() * newCards.length)
            const select = newCards.splice(ran, 1)
            this.selectCardsArr.push(...select)
            this.scene.time.delayedCall(delayTime * 2000, () => {
                this.showApples(this.selectCardsArr[this.ranNumber].x, this.selectCardsArr[this.ranNumber].y)
                this.ranNumber += 1

            })
            delayTime += 1
        }
    }
    // 显示随机数字
    private showApples(x: number, y: number) {
        const container = this.scene.add.container(x, y)
        // 添加文字
        const textStyle = {
            fontFamily: 'none', // 你的字体
            fontSize: '120px',
            color: '#fff',
            // fontStyle: 'italic'
        };
        const apple = this.getApple()

        const text = this.scene.add.text(0, 0, `${this.ranNumber + 1}`, textStyle);
        text.setOrigin(.5, .28)
        text.setScale((this.fw + this.fh) / (CONST.FIELD_SIZE * 2))

        container.add([apple, text])
        this.container.add(container)

        container.setAlpha(0)
        this.scene.tweens.add({
            targets: container,
            ease: 'Linear',
            duration: 500,
            alpha: 1,
            delay: 1000,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: container,
                    ease: 'Linear',
                    duration: 500,
                    alpha: CONST.DEBUG_ALPHA,
                    delay: 1000,
                    onComplete: () => {
                        // 销毁容器
                        // container.removeAll(true)
                        this.hasMask && this.destroyMask()
                    },
                })
            }
        })
    }

    // 销毁mask遮罩
    private destroyMask() {
        if (this.ranNumber === this.selectCardsArr.length) {
            this.hasMask = false
            this.scene.time.delayedCall(2000, () => {
                this.mask.destroy()
            })
        }
    }

    // 选择正确点击
    private click(x: number, y: number, n: number, isWrong?: boolean) {
        this.selectCardResult.push({ x, y })
        const clickGroup = this.scene.add.container(x, y)
        const appleGroup = this.scene.add.container()
        let bgColor = 0x44C495
        let borderColor = 0xBFFFEE
        if (isWrong) {
            bgColor = 0xFFA63C
            borderColor = 0xFFE2C0
        } else {
            this.successNumber += 1
            this.scene.time.addEvent({
                delay: 3, // 每帧更新的间隔时间，单位是毫秒
                callback: () => {
                    // if (this.bar.score <= (this.successNumber * 100)) {
                    this.bar.setScore()
                    // }
                }, // 更新数字的回调函数
                callbackScope: this, // 回调函数的作用域
                repeat: 99, // 重复次数，这里设为 100 次
            });
        }

        const bg = this.scene.add.rectangle(0, 0, this.fw, this.fh, bgColor)
        const border = this.scene.add.graphics()
        border.lineStyle(4, borderColor)
        border.strokeRect(0 - this.fw / 2, 0 - this.fh / 2, this.fw - 2, this.fh - 2)
        const apple = this.getApple()

        // 添加文字
        const textStyle = {
            fontFamily: 'none', // 你的字体
            fontSize: '120px',
            color: '#fff',
            // fontStyle: 'italic'
        };
        const text = this.scene.add.text(0, 0, `${n}`, textStyle);
        text.setOrigin(.5, .28)
        text.setScale((this.fw + this.fh) / (CONST.FIELD_SIZE * 2))

        appleGroup.add([apple, text])
        clickGroup.add([bg, border, appleGroup])
        clickGroup.name = 'clickGroup'
        this.container.add(clickGroup)
        if (this.selectCardResult.length === this.selectCardsArr.length) {
            if (this.bar.index === CONST.TOTAL) {
                this.scene.time.delayedCall(1000, () => {
                    this.finish = true
                    this.container.each((child: any) => {
                        if (child.name === 'clickGroup') {
                            child.destroy()
                        }
                    })
                    this.bar.showPasueModal()
                })
            } else if (this.hasWrong) {
                this.wrongResult()
            } else {
                this.successResult()
            }
        }
    }
    // 选择错误点击
    private wrongClick(x: number, y: number, n: number, item: any) {
        const clickGroup = this.scene.add.container(x, y)
        const bg = this.scene.add.rectangle(0, 0, this.fw, this.fh, 0xEF3349)
        const border = this.scene.add.graphics()
        border.lineStyle(4, 0xFFB9C2)
        border.strokeRect(2 - this.fw / 2, 2 - this.fh / 2, this.fw - 4, this.fh - 4)
        const error = this.scene.add.image(0, 0, 'error')
        error.setScale(this.fh / 340)
        clickGroup.add([bg, border, error])
        this.container.add(clickGroup)
        this.scene.tweens.add({
            targets: clickGroup,
            ease: 'Linear',
            duration: 200,
            delay: 400,
            alpha: 0,
            yoyo: false,
            onComplete: () => {
                // this.children.remove(clickGroup)
                clickGroup.destroy()
            }
        })
        this.hasWrong = true
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.click(item.x, item.y, n, true)
            }
        })
    }

    private getApple() {
        const apple = this.scene.add.image(0, 0, 'apple')
        const scale = this.fh / apple.height * .9
        apple.setDisplaySize(apple.width * scale, apple.height * scale)
        return apple;
    }

    // 选择错误life-1
    private loseLife() {
        this.life -= 1
        console.log(this.life)
    }

    // 重置life
    private resetLife() {
        this.life = CONST.LIFE
    }

    // 错误结局
    private wrongResult() {
        if (this.life === 0) {
            this.scene.time.delayedCall(1000, () => {
                if (this.number > CONST.MIN_NUMBER) {
                    this.number -= 1
                    if (this.scene.cardY < this.scene.cardX) {
                        this.scene.cardX -= 1
                    } else {
                        this.scene.cardY -= 1
                    }
                }

                this.scene.level()
            })
            this.resetLife()
        } else {
            this.scene.time.delayedCall(1000, () => {
                this.loseLife()
                this.scene.level()
            })
        }
        this.bar.setProgress()

    }

    // 正确结局
    private successResult() {
        this.scene.time.delayedCall(2000, () => {
            this.number += 1
            if (this.scene.cardY < this.scene.cardX) {
                this.scene.cardY += 1
            } else {
                this.scene.cardX += 1
            }
            this.scene.level()
        })
        this.resetLife()
        this.bar.setProgress()
    }
}