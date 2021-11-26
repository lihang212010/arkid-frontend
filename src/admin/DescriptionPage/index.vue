<template>
  <div class="tree-page">
    <Card
      :class="[{'tree-list-page': !!state.list}]"
      :path="getChildPath('card')"
    >
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Card from '@/admin/common/Card/index.vue'
import Dialog from '@/admin/common/Dialog/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'DescriptionPage',
  components: {
    Card,
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  get state() {
    return this.$state
  }
}
</script>
