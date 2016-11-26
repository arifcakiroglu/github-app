import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import App from './App'
import routes from './routes'

import 'github-markdown-css/github-markdown.css'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
});


/* eslint-disable no-new */
window.Vue = new Vue({
  router,
  ...App
}).$mount('#app')
