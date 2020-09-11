import Vue from 'vue'
import VueRouter from 'vue-router'

const Home =()=>import("views/home/Login");
const Index =()=>import("views/main/Index")
Vue.use(VueRouter)

  const routes = [
    {
      path:'/',
      redirect:'/index'
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/index',
      component: Index,
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
