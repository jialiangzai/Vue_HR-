import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的插件包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
Vue.use(VueI18n) // 全局注册国际化包

// 1. 依赖插件vue-i18n@8.24.3====》切换不同语言插件版本注意
// 2. 准备国际化语言包 人资中英(每个语言包中要包含翻译)
// 3. 借助插件vue-i18n@8.24.3切换不同语言包
// 4. 翻译分 组件库中的文字(element)+网站中自定义内容
// 引入自定义中文包
import customZH from './zh'
// 引入自定义英文包
import customEN from './en'
import Cookie from 'js-cookie'

// 创建国际化插件的实例
const i18n = new VueI18n({
  // 指定语言类型 zh表示中文  en表示英文
  // locale指定的值和要messages对象中定义的语言包key保持一致
  // locale: 'en',
  // 指定语言类型 zh表示中文  en表示英文
  locale: Cookie.get('lang') || 'zh',
  // locale: 'zh',
  // 将elementUI语言包加入到插件语言数据里
  // 当前语言包
  messages: {
    // 英文环境下的语言数据
    en: {
      ...elementEN,
      // 网页内容
      ...customEN
    },
    // 中文环境下的语言数据
    zh: {
      ...elementZH,
      // 网页内容
      ...customZH

    }
  }
})
console.log('实例', i18n)
// 导出多语实例
export default i18n
