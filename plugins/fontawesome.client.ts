import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFacebook,
  faInstagram,
  faLine,
  faCcVisa,
  faCcMastercard,
  faCcJcb,
} from '@fortawesome/free-brands-svg-icons'
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faBell,
  faListAlt,
  faHeart,
  faQuestionCircle,
  faCalendarAlt,
  faClipboardList,
  faStar,
  faCircleUser,
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBriefcase,
  faCalendar,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

// 這很重要，我們會讓 Nuxt 來處理 CSS，而不是 Font Awesome 自己
config.autoAddCss = false

// 在這裡加入您想使用的圖示
library.add(
  faFacebook,
  faInstagram,
  faLine,
  faCcVisa,
  faCcMastercard,
  faCcJcb,
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faBell,
  faListAlt,
  faHeart,
  faQuestionCircle,
  faCalendarAlt,
  // @ts-ignore
  faHeartRegular,
  faClipboardList,
  faStar,
  faCircleUser,
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBriefcase,
  faCalendar,
  faUsers
)

export default defineNuxtPlugin((nuxtApp) => {
  // 註冊 FontAwesome 元件（專案中使用 kebab-case）
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  // 註冊 PascalCase 版本以提供相容性
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
