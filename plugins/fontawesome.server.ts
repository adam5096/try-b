import { library } from '@fortawesome/fontawesome-svg-core'
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
  // 確保在服務端也註冊元件
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
