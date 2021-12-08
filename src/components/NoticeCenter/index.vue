<template>
  <el-popover
    class="notice-center"
    placement="bottom"
    trigger="click"
    width="540"
    @show="show"
  >
    <el-tabs
      v-if="tabs.length > 0"
      v-model="active"
      stretch
      @tab-click="handleTabClick"
    >
      <template v-for="(tab, i) in tabs">
        <el-tab-pane
          :key="i"
          :label="tab.label"
          :name="tab.name"
        >
          <div v-if="tab.items.length > 0">
            <div
              v-for="(item, index) in tab.items"
              :key="index"
              class="item"
            >
              <div class="content">
                {{ item.title }}
              </div>
              <div class="created">
                {{ getTime(item.time) }}
              </div>
            </div>
            <el-pagination
              background
              :page-size="pageSize"
              :current-page="currentPage"
              :page-sizes="[3, 5, 10]"
              layout="sizes, prev, pager, next, total"
              :pager-count="5"
              :total="total"
              @current-change="onCurrentPageChange"
              @size-change="onPageSizeChange"
            />
          </div>
          <div
            v-else
            class="placeholder"
          >
            暂无数据
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <el-badge
      slot="reference"
      is-dot
    >
      <i class="el-icon-message-solid" />
    </el-badge>
  </el-popover>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { NOTICE_API } from '@/constants/api'
import OpenAPI from '@/config/openapi'
import { runFlowByFile } from '@/arkfbp'
import { dateParser } from '@/utils/common'

@Component({
  name: 'NoticeCenter'
})
export default class extends Vue {
  private currentPage = 1;
  private pageSize = 5;
  private active = '0';
  private tabs: any[] = [];
  private total = 0;

  getTime(time: string) {
    return dateParser(time)
  }

  initTabs() {
    for (let i = 0, len = NOTICE_API.length; i < len; i++) {
      const { path, method, description } = NOTICE_API[i]
      if (OpenAPI.instance.getOperation(path, method)) {
        this.tabs.push({
          name: `${i}`,
          label: description,
          items: []
        })
      }
    }
  }

  mounted() {
    this.initTabs()
  }

  async onCurrentPageChange(page: number) {
    this.currentPage = page
    await this.show()
  }

  async onPageSizeChange(size: number) {
    this.pageSize = size
    await this.show()
  }

  async handleTabClick() {
    await this.show()
  }

  async show() {
    const index = Number(this.active)
    const action = NOTICE_API[index]
    const { path: url, method } = action
    await runFlowByFile('arkfbp/flows/notice', {
      url,
      method,
      client: {
        state: this.tabs[index],
        total: this.total
      },
      request: {
        page: this.currentPage,
        pageSize: this.pageSize
      }
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__item {
  font-size: 15px;
  font-weight: bold;
}

::v-deep .el-badge__content.is-fixed {
  top: 15px;
}

.el-icon-message-solid {
  cursor: pointer;
}

.notice-center {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  padding: 0px 10px 0 10px;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.placeholder {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.notice-icon {
  cursor: pointer;
  font-size: 18px;
  vertical-align: middle;
}
.item {
  border-bottom: 1px solid #e5e7eb;
  padding: 5px;
}
.content {
  font-weight: bold;
  font-size: 15px;
  line-height: 30px;
  margin-bottom: 5px;
}
.created {
  color: rgba(0, 0, 0, 0.45);
}
</style>
