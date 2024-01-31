// import './assets/main.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as bootstrap from 'bootstrap'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(bootstrap)
axios.defaults.baseURL = 'https://vue3-course-api.hexschool.io/v2';
axios.prototype.$http = axios;

app.mount('#app')
