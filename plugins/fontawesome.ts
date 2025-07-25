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
  faUserCircle,
  faSignOutAlt,
  faListAlt,
  faHeart,
  faQuestionCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'

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
  faUserCircle,
  faSignOutAlt,
  faListAlt,
  faHeart,
  faQuestionCircle,
  faCalendarAlt
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
