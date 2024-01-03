<template>
  <div id="game"></div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Phaser from 'phaser'
import Boot from './scene/Boot'
import Game from './scene/Game'
if (document) {
  ;(document as any).querySelector('#app').innerHTML = ''
}
console.log(
  (window.innerWidth / 1920) * window.innerWidth,
  (window.innerHeight / 960) * window.innerHeight
)
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 960,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Game, Boot],
  scale: {
    mode: Phaser.Scale.EXACT_FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true // 让画布充满整个父容器（通常是 body 元素）
  }
}
const game = new Phaser.Game(config)
</script>

<style>
body {
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
}
#spatial {
  /* width: 100vw;
  height: 100vh; */
}
</style>
./scene/Game
