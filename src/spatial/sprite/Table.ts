import Phaser from 'phaser'

export default class Table extends Phaser.GameObjects.Graphics {
    private container: Phaser.GameObjects.Container
    add: any

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.container = this.scene.add.container(0, 0)
    }

    public draw(w: number, h: number) {
        this.container.removeAll(true)
        const centerX = this.scene.sys.game.canvas.width / 2
        const centerY = this.scene.sys.game.canvas.height / 2
        const padding: number = 80
        const margin: number = 40
        const rectWidth = w * (this.scene as any).cardX;
        const rectHeight = h * (this.scene as any).cardY
        // 创建圆角矩形
        const roundedRect = this.scene.add.graphics();
        const borderRadius = 30;

        roundedRect.fillStyle(0xffffff)
        roundedRect.fillRoundedRect(0, 0, rectWidth + padding, rectHeight + padding, borderRadius)


        roundedRect.lineStyle(20, 0xFFFDF1)
        roundedRect.strokeRoundedRect(0, 0, rectWidth + padding, rectHeight + padding, borderRadius)

        roundedRect.lineStyle(6, 0xABD5C8)
        roundedRect.strokeRoundedRect(margin / 2, margin / 2, rectWidth - margin + padding, rectHeight - margin + padding, borderRadius)

        this.container.add(roundedRect)
        this.container.setPosition(centerX - (rectWidth + padding) / 2, centerY - (rectHeight + padding) / 2 + 60)
        // centerY - (rectHeight + padding) / 2
        // centerY - (rectHeight + padding) / 2
        // 130
        // console.log((this.scene.sys.game.canvas.height - 168) / 2)
    }
}