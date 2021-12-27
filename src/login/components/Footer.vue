<template>
  <div class="login-footer">
    {{ content }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'LoginFooter'
})
export default class LoginFooter extends Vue {
  private content = 'Copyright © 2021 All Rights Reserved. 龙归科技 版权所有'
}
</script>

<style lang="scss" scoped>
.login-footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  text-align: center;
  background-color: #F0F2F5;
  font-size: 12px;
  font-family: 'PingFang SC';
  color: #909399;
  line-height: 50px;
}
</style>
