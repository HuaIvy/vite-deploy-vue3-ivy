import './assets/all.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as bootstrap from 'bootstrap'
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

// 引入 VeeValidate 元件跟功能
import {
    Field, Form, ErrorMessage, defineRule, configure
  } from 'vee-validate';
  // 引入 VeeValidate 的驗證規則
  import * as AllRules from '@vee-validate/rules';
  // 引入 VeeValidate 的 i18n 功能
  import { loadLocaleFromURL, localize, setLocale } from '@vee-validate/i18n';
  // 引入 VeeValidate 的繁體中文語系檔
  import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import App from './App.vue'
import router from './router'

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
  });

  //讀取外部的資源
  loadLocaleFromURL('../public/locale/zh_TW.json');

  //套用語系
  configure({
    generateMessage: localize('zh_TW: zhTW'),
    validateOnInput: true,
  });

  
  // 將當前 VeeValidate 的語系設定為繁體中文
  // configure({
  //   generateMessage: localize({ zh_TW: zhTW }),
  //   validateOnInput: true,
  // });

  setLocale('zh_TW');
  

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(bootstrap)
app.use(LoadingPlugin)



axios.defaults.baseURL = import.meta.env.VITE_PATH;;
axios.prototype.$http = axios;

app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app')
