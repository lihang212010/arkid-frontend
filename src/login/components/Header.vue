<template>
  <div class="login-header">
    <img
      :src="icon || defaultIcon"
      alt=""
    >
    <h2>{{ name }}</h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'LoginHeader'
})
export default class LoginHeader extends Vue {
  @Prop({ required: false, default: 'Tenant Name' }) name?: string
  @Prop({ required: false, default: '' }) icon?: string

  private defaultIcon = require('../../assets/arkid.png');
}
</script>

<style lang="scss" scoped>
.login-header {
  width: 100%;
  height: 60px;
  padding: 0 20px 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}
</style>
