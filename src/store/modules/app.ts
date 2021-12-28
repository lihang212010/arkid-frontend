import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, getSize, getIntroStatus, setSidebarStatus, setLanguage, setSize, setIntroStatus } from '@/utils/cookies'
import { getLocale } from '@/lang'
import store from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

type IntroStatus = 'needed' | 'unneeded'

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
  introStatus: boolean
  isBind: boolean
  curApp: {
    uuid: string
    name: string
  }
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public language = getLocale()
  public size = getSize() || 'medium'

  public introStatus = getIntroStatus() !== 'unneeded'

  public isBind = true

  public curApp = {
    uuid: '',
    name: ''
  }

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }

  @Mutation
  private SET_INTRO_STATUS(status: IntroStatus) {
    if (status === 'needed') {
      this.introStatus = true
    }
    if (status === 'unneeded') {
      this.introStatus = false
    }
    setIntroStatus(status)
  }

  @Mutation
  private SET_APP_BIND_STATUS(status: boolean) {
    this.isBind = status
  }

  @Mutation
  private SET_CURRENT_APP({ uuid, name }) {
    this.curApp = {
      uuid: uuid,
      name: name,
    }
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }

  @Action
  public SetIntroStatus(status: IntroStatus) {
    this.SET_INTRO_STATUS(status)
  }

  @Action
  public SetAppBindStatus(status: boolean) {
    this.SET_APP_BIND_STATUS(status)
  }

  @Action
  public SetCurrentApp({ uuid, name }) {
    this.SET_CURRENT_APP({ uuid, name })
  }
}

export const AppModule = getModule(App)
