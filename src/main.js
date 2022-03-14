import { createApp } from 'vue'
import App from './App.vue'
import "../public/global.css"
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(ElementPlus)
.mount('#app')
