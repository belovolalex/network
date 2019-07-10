import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Friends from './pages/Friends.vue'
import Messages from './pages/Messages.vue'
import Auth from './pages/Auth.vue'
import User from './pages/User.vue'
import Error from './pages/Error.vue'
import { store } from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/auth',
      name: 'auth',
      meta: {layout: 'AuthLayout'},
      component: Auth
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages
    },
    {
      path: '/*',
      name: 'error',
      meta: {layout: 'AuthLayout'},
      component: Error
    }
  ]
})
router.beforeEach((to, from, next) => {
  let stateUser = localStorage.user
  if(stateUser == 'true') {
    !store.state.home.user.id.length ? store.dispatch('home/userInfo') : null
    next()
  } else {
    if(to.path !== '/auth') {
      next('/auth')
    } else {
      next()
    }
  }
})

export default router