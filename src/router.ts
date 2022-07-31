import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'
import { AuthRightItem } from './api/types'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export default new Router({
    mode: 'history',  // Enable this if you need.
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
            meta: { hidden: true, title: '系统登录' }
        },
        {
            path: '/404',
            name: 'notfound',
            component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
            meta: { hidden: true }
        },
        {
            path: '/',
            component: Layout,
            redirect: '/dashboard',
            children: [
                {
                    path: 'dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
                    meta: {
                        title: 'Dashboard',
                        icon: 'dashboard'
                    }
                }
            ]
        },
        {
            path: '/admin',
            component: Layout,
            redirect: '/admin/list',
            meta: {
                title: '权限管理',
                icon: 'users',
                permission: 'attach_AuthController'
            },
            children: [
                {
                    path: 'role',
                    name: 'roleList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/admin/role.vue'),
                    meta: {
                        title: '角色管理',
                        icon: 'users',
                        permission: 'read_role_list'
                    }
                },
                {
                    path: 'list',
                    name: 'userList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/admin/list.vue'),
                    meta: {
                        title: '用户列表',
                        icon: 'users',
                        permission: 'read_userlist'
                    }
                },
                {
                    path: 'profile',
                    name: 'userProfile',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/admin/profile.vue'),
                    meta: {
                        title: '用户信息',
                        icon: 'user',
                        permission: 'read_userinfo'
                    }
                }
            ]
        },
        {
            path: '/user',
            component: Layout,
            redirect: '/user/list',
            meta: {
                title: '会员管理',
                icon: 'users',
                permission: 'attach_AuthController'
            },
            children: [
                {
                    path: 'list',
                    name: 'userList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/user/list.vue'),
                    meta: {
                        title: '会员列表',
                        icon: 'users',
                        permission: 'read_userlist'
                    }
                },
                {
                    path: 'vipcard',
                    name: 'vipcard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/user/list.vue'),
                    meta: {
                        title: '会员卡',
                        icon: 'users',
                        permission: 'read_userlist'
                    }
                },
                {
                    path: 'vipcard/order',
                    name: 'vipcardLog',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/vipcard.vue'),
                    meta: {
                        title: '会员卡订单',
                        icon: 'users',
                        permission: 'read_userlist'
                    }
                },
            ]
        },

        {
            path: '/cms',
            component: Layout,
            redirect: '/cms/content/list',
            meta: {
                title: 'CMS管理',
                icon: 'setting',
                permission: ['cms_page_edit', 'cms_page_del', 'cms_content_edit', 'cms_page', 'cms_content']
                // (item: AuthRightItem, pksObj: any) => {

                // }
            },
            children: [
                {
                    path: 'page/list',
                    name: 'pageList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/cms/page.vue'),
                    meta: {
                        title: '页面',
                        icon: 'circle'
                    }
                },
                {
                    path: 'content/list',
                    name: 'contentList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/cms/content.vue'),
                    meta: {
                        title: '内容',
                        icon: 'circle'
                    }
                },
            ]
        },
        {
            path: '/book',
            component: Layout,
            redirect: '/book/list',
            meta: {
                title: '书籍管理',
                icon: 'gl1'
            },
            children: [
                {
                    path: 'cate',
                    name: 'cate',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/book/cate.vue'),
                    meta: {
                        title: '分类',
                        icon: 'circle'
                    }
                },
                {
                    path: 'list',
                    name: 'list',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/book/index.vue'),
                    meta: {
                        title: '书籍列表',
                        icon: 'circle'
                    }
                },
                {
                    path: 'location',
                    name: 'locates',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/book/locates.vue'),
                    meta: {
                        title: '库位管理',
                        icon: 'circle'
                    }
                },
                {
                    path: 'skubind',
                    name: 'skubind',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/book/skubind.vue'),
                    meta: {
                        title: 'SKU绑定',
                        icon: 'circle'
                    }
                },
            ]
        },
        {
            path: '/order',
            component: Layout,
            redirect: '/order/borrow',
            meta: {
                title: '订单管理',
                icon: 'sjbb'
            },
            children: [
                {
                    path: 'borrow',
                    name: 'borrow',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/borrow.vue'),
                    meta: {
                        title: '借阅订单',
                        icon: 'circle'
                    }
                },
            ]
        },
        {
            path: '/cms/detail/:alias',
            name: 'cmsView',
            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/cms/detail.vue'),
            meta: {
                title: '内容',
                icon: 'circle',
                hidden: true
            }
        },
    ]
})
