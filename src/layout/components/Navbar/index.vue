<template>
  <div
    class="navbar"
    :class="classPrefix"
  >
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-tooltip
          :content="$t('navbar.search')"
          effect="dark"
          placement="bottom"
        >
          <header-search class="right-menu-item" />
        </el-tooltip>
        <el-tooltip
          :content="$t('navbar.notice')"
          effect="dark"
          placement="bottom"
        >
          <notice-center class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            v-if="avatar"
            :src="avatar"
            class="user-avatar"
          >
          <span>{{ username }}</span>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="usercenter-dropdown-menu"
        >
          <el-dropdown-item @click.native="logout">
            <span style="display: block">
              {{ $t("navbar.logOut") }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import NoticeCenter from '@/components/NoticeCenter/index.vue'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    HeaderSearch,
    LangSelect,
    Screenfull,
    SizeSelect,
    NoticeCenter
  }
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get classPrefix() {
    return this.$route.name === 'desktop' ? 'navbar-bgc' : ''
  }

  get device() {
    return AppModule.device.toString()
  }

  get avatar() {
    return UserModule.avatar || require('@/assets/avatar.png')
  }

  get username() {
    return UserModule.realname || UserModule.username
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private async logout() {
    await runFlowByFile('flows/common/logout', {
      com: this
    })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  &.navbar-bgc {
    background-color: #E7F3FF;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding-left: 10px;
      padding-right: 10px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          margin-right: 5px;
        }
      }
    }
  }
}
.usercenter-dropdown-menu {
  li {
    text-align: center;
  }
}
</style>
