import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

// Import components from Appup Components and register components globally
import * as Appup from 'ac-components';
for (let compKey in Appup) {
  Vue.component(Appup[compKey].name, Appup[compKey])
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
