<template>
  <div class="conatiner">
    <template v-if="play">
      <div>{{ step }}/{{ stepTotal }}</div>
      <div>得分{{ score }}</div>
      <div class="row" v-for="(x, idx) in d[1]" :key="idx">
        <div class="col" v-for="(y, i) in d[0]" :key="i">
          <div
            :class="{ circle: true, ani: obj[y + x], suc: sucObj[y + x], error: error[y + x] }"
            @click="click(y + x)"
          >
            <!-- {{ y + x }} -->
            {{ numbersRef.indexOf(y + x) !== -1 ? numbersRef.indexOf(y + x) + 1 : '' }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div>完成游戏</div>
      <div>总得分{{ score }}</div>
      <div @click="restart">重新开始</div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
let x = 3
let y = 2
let step = ref(1)
const stepTotal = ref(5)
let data: any = []
const d: any = ref([])
let numbers: any = []
const obj: any = ref({})
const sucObj: any = ref({})
let num = 3
const numbersRef = ref([])
const score = ref(0)
const play = ref(true)
const error: any = ref({})

const updateXY = () => {
  if (step.value % 2 === 0) {
    x += 1
  } else {
    y += 1
  }
  createXY()
}
const reset = () => {
  numbers = []
  obj.value = {}
  sucObj.value = {}
  data = []
  d.value = []
  numbersRef.value = []
}
const createXY = () => {
  const xArr = []
  const yArr = []
  for (let i = 0; i < x; i++) {
    xArr.push(String.fromCharCode(97 + i))
  }
  for (let i = 1; i <= y; i++) {
    yArr.push(i)
  }
  data[0] = xArr
  data[1] = yArr
  d.value = data
  createNumbers(data)
}

const ani = (nArr: any) => {
  if (nArr.length > 0) {
    setTimeout(() => {
      const n = nArr.splice(0, 1)
      obj.value[n] = true
      ani(nArr)
    }, 1000)
  }
}
const createNumbers = (data: any) => {
  const arr: any = []
  data[0].map((x: any) => {
    data[1].map((y: any) => {
      arr.push(`${x}${y}`)
      obj.value[`${x}${y}`] = false
    })
  })
  while (numbers.length < num) {
    const ran = Math.floor(Math.random() * arr.length)
    const [fil] = arr.splice(ran, 1)
    numbers.push(fil)
  }
  numbersRef.value = numbers
  ani([...numbers])
}

createXY()
const restart = () => {
  reset()
  createXY()

  score.value = 0
  step.value = 1
  play.value = true
}

const click = (str: string) => {
  if (numbers.includes(str)) {
    if (Object.keys(sucObj.value).length === numbers.indexOf(str)) {
      sucObj.value[str] = true
      score.value += 100
      if (Object.keys(sucObj.value).length === numbers.length) res()
    } else {
      error.value[str] = true
      setTimeout(() => {
        err()
      }, 100)
    }
  } else {
    error.value[str] = true
    setTimeout(() => {
      err()
    }, 100)
  }
}
const err = () => {
  error.value = []
  const str = numbers[Object.keys(sucObj.value).length]
  sucObj.value[str] = true
  if (Object.keys(sucObj.value).length === numbers.length) res()
}
const res = () => {
  if (stepTotal.value === step.value) {
    setTimeout(() => {
      play.value = false
    }, 800)
    return
  }
  setTimeout(() => {
    reset()
    num += 1
    step.value += 1
    updateXY()
  }, 1500)
}
</script>

<style scoped>
.row {
  display: flex;
}
.col {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  background: #f8f8f8;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.circle {
  border-radius: 50%;
  width: 68px;
  height: 68px;
  background: #c99c9c;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  transform: rotateY(180deg);
  font-size: 0;
}
.ani {
  animation: animate 1.5s;
}
@keyframes animate {
  30% {
    transform: rotateY(0deg);
    background: rgb(83, 147, 203);
    font-size: 40px;
  }

  80% {
    transform: rotateY(0deg);
    background: rgb(83, 147, 203);
    font-size: 40px;
  }
  100% {
    transform: rotateY(180deg);
  }
}
.suc {
  animation: animate1 0.2s forwards;
}
@keyframes animate1 {
  100% {
    transform: rotateY(0deg);
    background: rgb(83, 147, 203);
    font-size: 40px;
  }
}
.error {
  background: #b43f3f;
}
</style>
