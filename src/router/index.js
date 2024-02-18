import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/login/Login.vue'
import ProductListView from '../views/ProductListView.vue'
import ProductCart from '../views/ProductCart.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/productlist',
      name: 'ProductListView',
      component: ProductListView

    },
    {
      path: '/productcart',
      name: 'ProductCart',
      component: ProductCart

    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
