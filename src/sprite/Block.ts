import Phaser from 'phaser'
import type { IBlockConstructor } from '../interface/block.interface';
import { CONST } from '../const/Const'

export default class Block extends Phaser.GameObjects.Graphics {
    constructor(params: IBlockConstructor) {
        super(params.scene, params.options)
        this.fillStyle(0x61e85b)
        this.fillRect(
            CONST.FIELD_SIZE,
            CONST.FIELD_SIZE,
            CONST.FIELD_SIZE,
            CONST.FIELD_SIZE
        )
        this.scene.add.existing(this);

    }
    public newSetBlock(x: number, y: number) {
        this.x = x
        this.y = y
    }
}