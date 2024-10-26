import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/layout/LayoutView.vue'),
      children: [
        {
          path: 'class',
          name: 'class',
          component: () => import('@/views/class/ClassView.vue'),
          children: [
            {
              path: '',
              name: 'classOverView',
              component: () => import('@/views/class/components/ClassOverView.vue')
            },
            {
              path: ':id',
              name: 'classDetailView',
              component: () => import('@/views/class/components/ClassDetailView.vue')
            }
          ]
        },
        {
          path: 'task',
          name: 'task',
          component: () => import('@/views/task/taskView.vue'),
          children: [
            {
              path: '',
              name: 'taskOverView',
              component: () => import('@/views/task/components/taskOverView.vue')
            },
            {
              path: ':id',
              name: 'taskCompletionView',
              component: () => import('@/views/task/components/taskcompletionView.vue')
            },
            {
              path: 'answer/:studentId',
              name: 'taskCorrectView',
              component: () => import('@/views/task/components/taskCorrectView.vue')
            },
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

export default router
