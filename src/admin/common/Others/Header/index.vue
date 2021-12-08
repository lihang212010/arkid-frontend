<template>
  <div class="main-header">
    <div class="main-header-left">
      <img
        :src="img"
        alt=""
      >
      <div class="main-header-left-text">
        <div class="title">
          {{ title }}
        </div>
        <div class="subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>
    <div class="main-header-right">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="item"
      >
        <div class="label">
          {{ item.label }}
        </div>
        <div class="value">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MainHeaderState } from '.'

@Component({
  name: 'MainHeader',
  components: {}
})
export default class extends Vue {
  private img: string = require('@/assets/avatar.png')
  private title = '欢迎使用一账通， 开启新的一天吧！'
  private subtitle = '今日晴。阳历 2020年11月21日。'

  private data = [
    {
      label: '待办',
      value: 10
    },
    {
      label: '团队',
      value: 5
    }
  ]
}
</script>

<style lang="scss" scoped>
.main-header {
  background-color: #E7F3FF;
  padding: 0 20px 0 20px;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-left {
    display: flex;

    img {
      width: 50px;
    }

    &-text {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;

      .title {
        font-size: 17px;
        font-weight: 500;
      }

      .subtitle {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }

  &-right {
    display: flex;

    .item {
      margin-right: 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .value {
        font-size: 20px;
        font-weight: 500;
      }
    }
  }
}
</style>
