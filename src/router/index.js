import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import admin from '@/components/admin'
import post from '@/components/post'
import SinglePost from '@/components/SinglePost'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/admin/post/:id',
      name: 'post',
      component: post
    },
    {
      path: '/post/:id',
      name: 'SinglePost',
      component: SinglePost
    }
  ]
})
