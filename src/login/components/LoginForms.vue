<template>
  <div class="login-forms">
    <h2>{{ form.label }}</h2>
    <el-form
      ref="lform"
      :model="model"
    >
      <template v-for="(item, idx) in form.items">
        <el-form-item
          v-if="item.type !== 'hidden'"
          :key="idx"
          :prop="item.name"
          :rules="rules[item.name]"
        >
          <el-input
            v-model="model[item.name]"
            :type="item.type === 'password' ? type : item.type"
            :name="item.name"
            :placeholder="item.placeholder"
            @copy.native.capture="onCopy($event, item.name)"
          >
            <img
              v-if="item.type === 'password'"
              slot="suffix"
              :src="eyeIcon"
              @click="handleIconClick"
            >
            <login-button
              v-if="item.append"
              slot="append"
              :config="item.append"
              :action="btnClickHandler"
            />
          </el-input>
        </el-form-item>
      </template>
      <login-button
        :long="true"
        :config="form.submit"
        :action="btnClickHandler"
      />
    </el-form>
    <div
      v-if="config.bottoms"
      class="bottoms"
    >
      <login-button
        v-for="(b, bidx) in config.bottoms"
        :key="bidx"
        :config="b"
        :action="btnClickHandler"
        type="text"
        class="bottoms-btn"
      />
    </div>
    <div
      v-if="forms.length"
      class="other-methods"
    >
      <template v-for="(f, fidx) in forms">
        <el-button
          v-if="fidx !== index"
          :key="fidx"
          @click="switchMethod(fidx)"
        >
          {{ f.label }}
        </el-button>
      </template>
    </div>
    <div
      v-if="config.extend"
      class="third-login"
    >
      <el-divider>{{ config.extend.title }}</el-divider>
      <login-button
        v-for="(e, eidx) of config.extend.buttons"
        :key="eidx"
        :config="e"
        :action="btnClickHandler"
        type="text"
      />
    </div>
    <div v-if="isViewProtocal">
      <protocal
        :title="title"
        :content="content"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { LoginPagesConfig, ButtonConfig } from '../interface'
import LoginButton from './LoginButton.vue'
import Protocal from './Protocal.vue'
import { RULES, getRegexRule, DEFAULT_PASSWORD_RULE } from '../utils/rules'
import http from '../http'
import { errors } from '@/constants/error'
import LoginStore from '../store/login'

@Component({
  name: 'LoginForms',
  components: {
    LoginButton,
    Protocal
  }
})
export default class LoginForms extends Vue {
  @Prop({ required: true }) configs?: LoginPagesConfig

  @Watch('form')
  onFormChange() {
    this.resetFields()
    this.setModelAndRule()
  }

  private index = 0;

  private model: any = {}
  private rules = {}

  private btn: ButtonConfig = {}

  private page = ''

  private isViewProtocal = false

  private title = '' // protocal title
  private content = '' // protocal content

  private isOpen = false // eye icon status

  get type() {
    return this.isOpen ? 'text' : 'password'
  }

  get eyeIcon() {
    return this.isOpen ? require('../assets/eye.svg') : require('../assets/eye-close.svg')
  }

  get passwordRule() {
    const { regular, title } = LoginStore.RigisterPasswordComplexity
    const regex = regular ? new RegExp(regular) : DEFAULT_PASSWORD_RULE.regex
    const hint = title || DEFAULT_PASSWORD_RULE.hint
    return getRegexRule(hint, regex)
  }

  get pages() {
    return this.configs ? Object.keys(this.configs) : []
  }

  get config() {
    return this.configs ? this.configs[this.page] : {}
  }

  get forms() {
    return this.config ? this.config.forms : []
  }

  get form() {
    return this.forms ? this.forms[this.index] : {}
  }

  get submit() {
    return this.form.submit
  }

  handleIconClick() {
    this.isOpen = !this.isOpen
  }

  handleCancel() {
    this.isViewProtocal = false
  }

  handleOk() {
    this.isViewProtocal = false
    this.switchPage()
  }

  setModelAndRule() {
    const items = this.form.items
    this.model = {}
    this.rules = {}
    if (items && items?.length > 0) {
      for (const item of items) {
        if (item.name) {
          this.$set(this.model, item.name, item.value || '')
          this.$set(this.rules, item.name, [RULES.required])
          this.addOtherRule(item.name)
        }
      }
    }
  }

  addOtherRule(name = '') {
    if (RULES[name]) this.rules[name].push(RULES[name])
    if (name === 'checkpassword') {
      Array.prototype.push.apply(this.rules[name], [this.passwordRule,
        { validator: this.checkPassword, trigger: 'blur' }])
    }
  }

  resetRules() {
    if (this.page === 'register') {
      this.$set(this.rules, 'password', [
        RULES.required,
        this.passwordRule,
        { validator: this.validateCheckPassword, trigger: 'blur' }
      ])
    } else {
      this.$set(this.rules, 'password', [
        RULES.required
      ])
    }
  }

  validateCheckPassword(rule: any, value: string, callback: Function) {
    if (this.model.checkpassword) {
      (this.$refs.lform as any).validateField('checkpassword')
    }
    callback()
  }

  checkPassword(rule: any, value: string, callback: Function) {
    if (value !== this.model.password) {
      callback(new Error('两次输入的密码不同'))
    } else {
      callback()
    }
  }

  switchMethod(index) {
    this.index = index
  }

  async btnClickHandler(btn: ButtonConfig) {
    this.btn = btn
    if (btn.http && !btn.delay) this.btnHttpCheck()
    if (btn.gopage && !btn.http) this.goPage()
    if (btn.redirect) this.redirect()
    if (btn.delay) await this.btnRequest()
  }

  btnHttpCheck() {
    const el = this.$refs.lform as any
    el.validate((valid) => {
      if (valid) {
        this.btnRequest()
      } else {
        return false
      }
    })
  }

  goPage() {
    const agreement = this.btn.agreement
    if (agreement) {
      this.isViewProtocal = true
      const { title, content } = agreement
      if (title) this.title = title
      if (content) this.content = content
    } else {
      this.switchPage()
    }
  }

  switchPage(page = '') {
    this.page = page || this.btn.gopage!
    this.index = 0
    this.resetRules()
  }

  redirect() {
    let redirectParams = ''
    const params = this.btn.redirect!.params
    for (const key in params) {
      redirectParams += `&${key}=${params[key]}`
    }
    redirectParams = redirectParams.substring(1)
    const url = this.btn.redirect!.url + '?' + redirectParams
    window.location.replace(url)
  }

  // btnDelayCheck() {
  //   const params = this.btn.http!.params || {};
  //   (this.$refs.lform as any).validateField(Object.keys(params), async (err) => {
  //     if (!err) {
  //       await this.btnRequest()
  //     } else {
  //       this.$message({
  //         message: err,
  //         type: 'error',
  //         showClose: true
  //       })
  //     }
  //   })
  // }

  async btnRequest() {
    let { url, method } = this.btn.http!
    if (url.includes('tenant_uuid') && LoginStore.TenantUUID) {
      url = url.replace('tenant_uuid', LoginStore.TenantUUID)
    }
    const resp = await http[method](url, this.model)
    const data = resp && resp.data
    if (data) this.response(data)
  }

  async response(resp: any) {
    const { error, data } = resp
    if (error && error !== '0') {
      if (error === '10029') {
        this.switchPage('password')
      }
      this.$message({
        type: 'error',
        showClose: true,
        message: errors[error] || data?.message
      })
    } else {
      if (this.btn.delay) {
        this.$message({
          message: '验证码发送成功，请注意查收',
          type: 'success',
          showClose: true
        })
      } else if (this.btn.gopage) {
        this.$message({
          message: '重置密码成功，请登录',
          type: 'success',
          showClose: true
        })
        this.switchPage()
      } else if (data?.token) {
        LoginStore.token = data.token
        // third party account
        if (LoginStore.ThirdUserID && LoginStore.BindUrl) {
          const parmas = {
            user_id: LoginStore.ThirdUserID
          }
          const url = LoginStore.BindUrl
          const method = 'post'
          await http[method](url, parmas)
          LoginStore.BindUrl = ''
          LoginStore.ThirdUserID = ''
        }
        // next url
        const next = LoginStore.NextUrl
        if (next) {
          const prefix = next.includes('?') ? '&' : '?'
          window.location.href = next + `${prefix}token=` + LoginStore.token
          LoginStore.NextUrl = ''
        } else {
          window.location.reload()
        }
      }
    }
  }

  addKeyPressEvent() {
    const that = this
    window.document.onkeypress = async function(e:KeyboardEvent) {
      if (e.code === 'Enter') {
        if (that.submit) {
          that.btnClickHandler(that.submit)
        }
      }
    }
  }

  onCopy(e: Event, name: string) {
    if (name.includes('password')) {
      e.preventDefault()
      return false
    }
  }

  resetFields() {
    this.$nextTick(() => {
      (this.$refs.lform as any).resetFields()
    })
  }

  created() {
    this.page = this.pages[0]
    this.setModelAndRule()
    this.addKeyPressEvent()
  }
}
</script>

<style lang="scss" scoped>
.login-forms {
  width: 400px;
}

.bottoms {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  &-btn {
    margin-left: 0px;
  }
}

.other-methods {
  margin: 20px 0 10px 0;
  display: flex;
  flex-wrap: wrap;

  .el-button {
    margin: 5px;
  }
}

.third-login {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

::v-deep .el-input__suffix {
  top: 3px;
}
</style>
