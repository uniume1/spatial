<template>
  <div id="game"></div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Phaser from 'phaser'
import Boot from './scene/Boot'
import Game from './spatial/scene/Game.ts'
if (document) {
  ;(document as any).querySelector('#app').innerHTML = ''
}
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 960,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: [Boot, Game],
  scale: {
    mode: Phaser.Scale.CENTER_BOTH
    // autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    // expandParent: true // 让画布充满整个父容器（通常是 body 元素）
  },
  fullscreen: true
}
const game = new Phaser.Game(config)
</script>

<style>
@font-face {
  font-family: JinBuTi;
  src: url(../public/DingTalk\ JinBuTi.ttf);
}
body {
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
  font-family: JinBuTi;
}
</style>
