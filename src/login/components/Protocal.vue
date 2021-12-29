<template>
  <el-dialog
    class="protocal"
    :show-close="false"
    center
    :modal="false"
    :visible="true"
  >
    {{ content }}
    <div
      slot="footer"
      class="protocal-footer"
    >
      <el-button @click="cancel">
        不同意
      </el-button>
      <el-button
        type="primary"
        @click="ok"
      >
        同意
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Protocal'
})
export default class Protocal extends Vue {
  @Prop({ required: false, default: '' }) title?: string
  @Prop({ required: false, default: '' }) content?: string

  ok() {
    this.$emit('ok')
  }

  cancel() {
    this.$emit('cancel')
  }
}
</script>
