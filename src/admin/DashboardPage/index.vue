<template>
  <div class="dashboard-page">
    <Card
      :path="getChildPath('card')"
    >
      <Form
        v-if="state.filter"
        :path="getChildPath('filter')"
        class="dashboard-page-filter"
      />
      <div
        v-for="(group, index) in state.groups"
        :key="index"
        :class="`dashboard-panel-${index}`"
      >
        <el-divider v-if="group.title">
          {{ group.title }}
        </el-divider>
        <draggable
          :class="[group.options && group.options.disabled ? 'no-drag-board' : 'drag-board']"
          :list="group.items"
          :options="group.options"
          :groups="group.name"
          :style="{}"
          @end="end"
        >
          <AdminComponent
            v-for="(item, itemIndex) in group.items"
            :key="itemIndex"
            :path="getChildPath(`groups[${index}].items[${itemIndex}]`)"
            class="item"
          />
        </draggable>
      </div>
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
    <Pagination
      v-if="state.pagination"
      :path="getChildPath('pagination')"
      class="dashboard-page-pagination"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import { DashboardPage } from './DashboardPageState'
import Card from '@/admin/common/Card/index.vue'
import Dialog from '@/admin/common/Dialog/index.vue'
import Pagination from '@/admin/common/data/Pagination/index.vue'
import Form from '@/admin/common/Form/index.vue'
import draggable from 'vuedraggable'

@Component({
  name: 'DashboardPage',
  components: {
    Card,
    Dialog,
    draggable,
    Pagination,
    Form
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DashboardPage {
    return this.$state as DashboardPage
  }

  end() {
    const action = this.state.endAction
    if (action) {
      this.runAction(action)
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-board {
  .item {
    &:hover {
      cursor: move;
    }
  }
}
.dashboard-page-pagination {
  background-color: #fff;
  border: 1px solid #e6ebf5;
}
</style>
