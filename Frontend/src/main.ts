import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { VueSelect } from "vue-select"

createApp(App)
    .use(router)
    .component("v-select", VueSelect)
    .mount('#app')
