import { FunctionNode } from 'arkfbp/lib/functionNode'
import introJs from 'intro.js'
import 'intro.js/minified/introjs.min.css'
import { AppModule } from '@/store/modules/app'

const introSteps = [
  {
    element: document.getElementsByClassName('buttons')[0],
    intro: '在管理应用中勾选常用应用子系统。勾选的将显示在应用市集中，不勾选的将会隐藏。',
    position: 'bottom'
  },
  {
    element: document.getElementsByClassName('card-panel')[0],
    intro: '绑定各应用子系统登录账号。依次点击各子系统图标，输入相应子系统原登录用户名和密码，确认提交，等待相应子系统验证通过后，即绑定成功。此后各用户在本门户中即可实现统一入口、统一账号，即可一站式登录各子系统。',
    position: 'bottom'
  },
  {
    element: document.getElementsByClassName('header-search')[0],
    intro: '进行应用的搜索，并快速进入该应用',
    position: 'bottom'
  },
  {
    element: document.getElementsByClassName('notice-center')[0],
    intro: '查阅当前的最新通知公告',
    position: 'bottom'
  },
  {
    element: document.getElementById('screenfull'),
    intro: '全屏显示该门户网页',
    position: 'bottom'
  },
  {
    element: document.getElementById('size-select'),
    intro: '切换页面布局',
    position: 'bottom'
  },
  {
    element: document.getElementsByClassName('international')[0],
    intro: '切换语言',
    position: 'bottom'
  },
  {
    element: document.getElementsByClassName('avatar-container')[0],
    intro: '选择退出该系统',
    position: 'right'
  }
]

const introOptions = {
  prevLabel: "上一步",
  nextLabel: "下一步",
  skipLabel: "跳过",
  doneLabel: "结束引导",
  overlayOpacity: .7,
  hidePrev: true,
  hideNext: true,
  showStepNumbers: true,
  showProgress: true,
  highlightClass: "highlight",
  exitOnOverlayClick: false,
  tooltipClass: "tool-tip",
  steps: introSteps
}

export class IntroNode extends FunctionNode {
  async run() {
    if (AppModule.introStatus === true) {
      introJs().setOptions(introOptions).start()
      AppModule.SetIntroStatus('unneeded')
    }
  }
}