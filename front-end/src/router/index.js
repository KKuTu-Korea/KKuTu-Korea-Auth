import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Success from '@/pages/Success'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      props: true
    },
    {
      path: '/success',
      component: Success,
      props: true
    }
  ]
})
