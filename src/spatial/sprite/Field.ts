import Phaser from 'phaser'
import { CONST } from '../const/Const'

export default class Field extends Phaser.GameObjects.Graphics {
    private container: Phaser.GameObjects.Container
    private bar: any
    private cards: any = [];
    private selectCardsArr: any = [];
    private selectCardResult: any = [];
    private ranNumber: number = 0;
    private fieldWidth: number = 0
    private fieldHeight: number = 0
    private successNumber: number = 0
    declare mask: any
    private life: number = CONST.LIFE
    private hasWrong: boolean = false
    private number: number = CONST.DEFAULT_NUMBER
    private hasMask: boolean = false
    private finish: boolean = false
    declare scene: any
    private guideEnd: boolean = false
    private lastClickTime: number = 0
    private clickDelay: number = 500
    private canClick: boolean = true

    constructor(scene: Phaser.Scene, opt?: any) {
        super(scene)
        this.container = this.scene.add.container(0, 0)
        this.bar = opt.bar
        this.guideEnd = this.scene.guideAniEnd
    }

    // 重置
    private reset() {
        this.cards = []
        this.selectCardsArr = []
        this.selectCardResult = []
        this.ranNumber = 0
        this.fieldWidth = 0
        this.fieldHeight = 0
        this.hasWrong = false
    }

    // 创建格子时的遮罩层
    private createFieldMask(rectWidth: number, rectHeight: number) {
        // 生成遮罩
        this.mask = this.scene.add.rectangle(rectWidth / 2 + 20, rectHeight / 2 + 20, rectWidth, rectHeight, 0x000000)
        this.mask.setAlpha(0)
        this.mask.setInteractive()
        this.hasMask = true
    }

    public draw(w: number, h: number) {
        this.reset()
        this.container.removeAll(true)
        const centerX = this.scene.sys.game.canvas.width / 2
        const centerY = this.scene.sys.game.canvas.height / 2
        const padding: number = 40
        const rectWidth = w * this.scene.cardX;
        const rectHeight = h * this.scene.cardY
        this.fieldWidth = w
        this.fieldHeight = h


        this.createFieldMask(rectWidth, rectHeight)

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
                    if (!this.canClick && !this.guideEnd) return
                    // 阻止连击
                    const currentTime = new Date().getTime();
                    if (currentTime - this.lastClickTime > this.clickDelay) {
                        // 引导页控制器
                        if (!this.guideEnd) {
                            this.guideManager(x, y)
                            if (this.selectCardsArr[this.selectCardResult.length].x !== x || this.selectCardsArr[this.selectCardResult.length].y !== y) {
                                return false
                            }
                            this.canClick = false

                        }

                        const filter = this.selectCardResult.filter((item: any) => item.x === x && item.y === y)
                        if (filter.length > 0) return
                        if (clickRecordArr.length < this.selectCardsArr.length) {
                            clickRecordArr.push({ x, y })
                            const len = clickRecordArr.length - 1
                            const CRA = clickRecordArr[len]
                            const SCA = this.selectCardsArr[len]
                            // 翻转动画
                            this.scene.tweens.add({
                                targets: card,
                                scaleX: 0,
                                duration: 100,
                                onComplete: () => {
                                    this.scene.tweens.add({
                                        targets: card,
                                        scaleX: 1,
                                        duration: 50,
                                        onComplete: () => {
                                            if (CRA.x === SCA.x && CRA.y === SCA.y) {
                                                this.scene.sound.add('successSound').play()
                                                this.click(x, y, clickRecordArr.length)
                                                // 清除已经正确选择的事件
                                                card.off('pointerdown')
                                            } else {
                                                this.scene.sound.add('wrongSound').play()

                                                this.wrongClick(x, y, clickRecordArr.length, SCA)
                                                // 抖动动画
                                                // this.scene.tweens.add({
                                                //     targets: card,
                                                //     x: {
                                                //         yoyo: true,
                                                //         value: card.x + 5,
                                                //         repeat: 2,
                                                //         duration: 50,

                                                //     },
                                                //     y: {
                                                //         yoyo: true,
                                                //         value: card.y + 3,
                                                //         repeat: 2,
                                                //         duration: 50,
                                                //     },
                                                //     ease: 'Sine.easeInOut',
                                                //     onComplete: () => {
                                                //     }
                                                // })

                                            }
                                        }
                                    })
                                }
                            })
                        }
                        // 更新上一次点击时间
                        this.lastClickTime = currentTime;
                    }
                }, this);
                this.container.add(card)
            }
        }
        this.container.setPosition(centerX - (rectWidth + padding) / 2, centerY - (rectHeight + padding) / 2 + 60)

        let timer: any

        if (this.scene.guideAniEnd) {
            !this.finish && this.ranCards()
        } else {
            // 引导进度监听
            timer = this.scene.time.addEvent({
                callback: () => {
                    if (this.scene.guideAniEnd) {

                        // this.ranCards()
                        this.guideShowNumbers()
                        timer.destroy()

                    }
                },
                delay: 100,
                loop: true
            })
        }

    }

    // 引导页逻辑
    private guideManager(x: number, y: number) {

        let guideIdx: number = this.selectCardResult.length
        if ((this.selectCardsArr[guideIdx].x !== x || this.selectCardsArr[guideIdx].y !== y)) {
            return true
        }
        guideIdx += 1
        this.guideObj && this.guideObj.setAlpha(0)
        if (guideIdx < 3) {
            this.scene.time.delayedCall(1000, () => {
                this.guideObj && this.guideObj.setAlpha(1)
                this.setGuideAni(this.selectCardsArr[guideIdx].x + 80, this.selectCardsArr[guideIdx].y + 80)
            })
        }
    }
    private guideShowNumbers() {

        this.mask.setAlpha(.1)
        this.container.add(this.mask)

        this.selectCardsArr = [
            {
                "x": 170,
                "y": 170
            },
            {
                "x": 470,
                "y": 470
            },
            {
                "x": 770,
                "y": 170
            }
        ]
        for (let i = 0; i < this.selectCardsArr.length; i++) {
            this.scene.time.delayedCall(i * 2000, () => {
                this.showApples(this.selectCardsArr[this.ranNumber].x, this.selectCardsArr[this.ranNumber].y)
                this.ranNumber += 1
            })
        }
    }
    // 选取随机格子数据
    private ranCards() {
        this.mask.setAlpha(.1)
        this.container.add(this.mask)
        let delayTime = 0
        while (this.selectCardsArr.length < this.number) {
            const ran = Math.floor(Math.random() * this.cards.length)
            const select = this.cards.splice(ran, 1)
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
            fontFamily: 'JinBuTi',
            fontSize: '120px',
            color: '#fff',
            // fontStyle: 'italic'
        };
        const apple = this.getApple()

        const text = this.scene.add.text(0, 0, `${this.ranNumber + 1}`, textStyle);
        text.setOrigin(.5, .28)
        text.setScale((this.fieldWidth + this.fieldHeight) / (CONST.FIELD_SIZE * 2))

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
                        if (CONST.DEBUG_ALPHA === 0) {
                            container.removeAll(true)
                        }
                        if (this.hasMask && this.ranNumber === this.selectCardsArr.length) {
                            if (this.hasMask) {
                                this.destroyMask()
                                if (!this.guideObj && !this.guideEnd) {
                                    this.scene.time.delayedCall(2500, () => {
                                        this.guideObj = this.guideAni(this.selectCardsArr[0].x + 80, this.selectCardsArr[0].y + 80)
                                        this.container.add(this.guideObj)
                                    })
                                }
                            }
                        }
                    },
                })
            }
        })
    }

    // 销毁mask遮罩
    private destroyMask() {
        this.hasMask = false
        this.scene.time.delayedCall(3000, () => {
            this.mask.destroy()
        })
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
                    this.guideEnd && this.bar.setScore()
                }, // 更新数字的回调函数
                callbackScope: this, // 回调函数的作用域
                repeat: 99, // 重复次数，这里设为 100 次
            });
        }

        const bg = this.scene.add.rectangle(0, 0, this.fieldWidth, this.fieldHeight, bgColor)
        const border = this.scene.add.graphics()
        border.lineStyle(4, borderColor)
        border.strokeRect(0 - this.fieldWidth / 2, 0 - this.fieldHeight / 2, this.fieldWidth - 2, this.fieldHeight - 2)
        const apple = this.getApple()

        // 添加文字
        const textStyle = {
            fontFamily: 'JinBuTi',
            fontSize: '120px',
            color: '#fff',
            // fontStyle: 'italic'
        };
        const text = this.scene.add.text(0, 0, `${n}`, textStyle);
        text.setOrigin(.5, .28)
        text.setScale((this.fieldWidth + this.fieldHeight) / (CONST.FIELD_SIZE * 2))

        appleGroup.add([apple, text])
        clickGroup.add([bg, border, appleGroup])
        clickGroup.name = 'clickGroup'
        this.container.add(clickGroup)

        // 引导页逻辑
        if (!this.guideEnd) {
            this.container.bringToTop(this.guideObj)
        }
        if (this.selectCardResult.length >= this.selectCardsArr.length) {
            const isEnd = CONST.PROGERSS_MODE === 'before' ? this.bar.index >= CONST.TOTAL : this.bar.index >= CONST.TOTAL - 1
            if (isEnd && this.guideEnd) {
                CONST.PROGERSS_MODE === 'after' && this.bar.setProgress()

                this.scene.time.delayedCall(1000, () => {
                    this.finish = true
                    this.container.each((child: any) => {
                        if (child.name === 'clickGroup') {
                            child.destroy()
                        }
                    })
                    this.bar.showPasueModal()
                    this.scene.sound.add('finishSound').play()
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
        const bg = this.scene.add.rectangle(0, 0, this.fieldWidth, this.fieldHeight, 0xEF3349)
        const border = this.scene.add.graphics()
        border.lineStyle(4, 0xFFB9C2)
        border.strokeRect(2 - this.fieldWidth / 2, 2 - this.fieldHeight / 2, this.fieldWidth - 4, this.fieldHeight - 4)
        const error = this.scene.add.image(0, 0, 'error')
        error.setScale(this.fieldHeight / 340)
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
        const scale = this.fieldHeight / apple.height * .9
        apple.setDisplaySize(apple.width * scale, apple.height * scale)
        return apple;
    }

    // 选择错误life-1
    private loseLife() {
        this.life -= 1
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
        if (!this.guideEnd) {
            // 引导逻辑
            this.scene.time.delayedCall(1000, () => {
                this.scene.sound.add('contDownSound').play()

                const centerX = this.scene.sys.game.canvas.width / 2
                const centerY = this.scene.sys.game.canvas.height / 2
                const mask = this.scene.add.rectangle(centerX, centerY, centerX * 2, centerY * 2, 0x000000)
                mask.setAlpha(.3)

                let n = 3
                const timeTxt = this.scene.add.text(centerX, centerY, `${n}`, { color: '#fff', fontFamily: 'JinBuTi', fontSize: 300 })
                timeTxt.setPosition(centerX - timeTxt.width / 2, centerY - timeTxt.height / 2)
                this.scene.tweens.add({
                    targets: this,
                    complete: () => {
                        timeTxt.setText(`${n -= 1}`)
                    },
                    repeat: 1,
                    delay: 900,
                    onComplete: () => {
                        this.scene.sound.add('maskFade').play()
                        mask.destroy()
                        timeTxt.destroy()
                        this.scene.level()
                        this.guideEnd = true
                    }
                })
            })

        } else {
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
    // 手指引导动画-移动
    private guideObj: any
    private setGuideAni(x: number, y: number) {
        this.scene.tweens.add({
            targets: this.guideObj,
            scale: 0,
            duration: 1,
        })
        this.scene.tweens.add({
            targets: this.guideObj,
            x: x,
            y: y,
            scale: 1,
            duration: 300,
            onComplete: () => {
                this.canClick = true
            }
        })
    }
    // 手指引导动画-点击动画
    private guideAni(x: number, y: number) {
        const hand1 = this.scene.add.sprite(x, y, 'hand1')
        this.scene.anims.create({
            key: 'ani',
            frames: [{
                key: 'hand1', duration: 80
            }, {
                key: 'hand2', duration: 80
            }],
            repeat: 2,
            delay: 300
        })
        hand1.play('ani')
        hand1.on('animationcomplete', () => {
            hand1.play('ani')
        })
        return hand1
    }
}