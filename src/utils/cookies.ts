import Cookies from 'js-cookie'
import { UserModule } from '@/store/modules/user'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

const introKey = UserModule.username ? `${UserModule.username}_intro_status` : 'intro_status'
export const getIntroStatus = () => window.localStorage.getItem(introKey)
export const setIntroStatus = (status: string) => window.localStorage.setItem(introKey, status)