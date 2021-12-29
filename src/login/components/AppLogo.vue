<template>
  <div class="app-logo">
    <img
      :src="icon || logo"
      alt=""
    >
    <h2>{{ name }}</h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'

@Component({
  name: 'AppLogo'
})
export default class AppLogo extends Vue {
  @Prop({ required: false }) icon?: string;
  @Prop({ required: false, default: 'ArkID' }) name?: string;

  private logo = require('@/assets/arkid.png');
}
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;

  img {
    width: 60px;
    margin-right: 20px;
  }
}
</style>
