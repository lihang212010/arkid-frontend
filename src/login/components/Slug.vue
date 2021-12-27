<template>
  <div class="login-slug">
    <el-card class="login-slug-container">
      <el-tabs
        v-model="active"
        stretch
      >
        <el-tab-pane
          name="slug"
          label="提交Slug"
        >
          <el-form
            ref="slugForm"
            :model="form"
            :rules="rules"
          >
            <el-form-item prop="slug">
              <el-input
                v-model="form.slug"
                placeholder="请输入Slug"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="btn"
                type="primary"
                @click="submitForm('slugForm')"
              >
                提 交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'LoginSlug',
  components: {}
})
export default class LoginSlug extends Vue {
  private active = 'slug'
  private form = { slug: '' }
  private rules = {
    slug: [
      { required: true, message: '请输入Slug', trigger: 'blur' }
    ]
  }

  submitForm(formName: string) {
    (this.$refs[formName] as any).validate((valid) => {
      if (valid) this.toTarget()
    })
  }

  toTarget() {
    const query = this.$route.query
    const { protocol, origin, pathname } = window.location
    let url = origin.replace(`${protocol}//`, `${protocol}//${this.form.slug}.`) + pathname
    const keys = Object.keys(query)
    for (const key of keys) {
      if (key === 'slug' || key === 'tenant') continue
      url = url + `&${key}=${query[key]}`
    }
    url = url.replace('&', '?')
    window.location.replace(url)
  }
}
</script>

<style lang="scss" scoped>
.login-slug {
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f62ea;
  background-image: url('../../assets/bgc.png');
  background-size: contain;

  &-container {
    width: 500px;
    padding: 20px;

    .btn {
      width: 100%;
    }
  }
}
</style>
