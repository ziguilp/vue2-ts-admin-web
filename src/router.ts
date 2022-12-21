/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-19 20:09:45
 * @FilePath      : /adminweb/src/router.ts
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
 */
import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    permission: ''/['']/() => {}
}
*/

export default new Router({
    mode: 'history', // Enable this if you need.
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
            meta: {
                hidden: true,
                title: '系统登录',
            }
        },
        {
            path: '/404',
            name: 'notfound',
            component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
            meta: {
                hidden: true
            }
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
                    name: 'adminUserList',
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
                    path: 'giftsubscribe',
                    name: 'giftSubscribe',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/list.vue'),
                    meta: {
                        title: '会员订阅',
                        icon: 'users',
                        permission: 'read_userlist'
                    }
                }
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
                }
            ]
        },
        {
            path: '/order',
            component: Layout,
            redirect: '/order/list',
            meta: {
                title: '订单管理',
                icon: 'sjbb'
            },
            children: [
                {
                    path: 'gift',
                    name: 'gift',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/list.vue'),
                    meta: {
                        title: '订单列表',
                        icon: 'circle'
                    }
                }
            ]
        },
        {
            path: '/settle',
            component: Layout,
            redirect: '/settle/list',
            meta: {
                title: '结算管理',
                icon: 'gl1'
            },
            children: [
                {
                    path: 'list',
                    name: 'settleList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/settle.vue'),
                    meta: {
                        title: '结算单',
                        icon: 'circle'
                    }
                },
                {
                    path: 'waitfor',
                    name: 'waitforSettle',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/waitforsettle.vue'),
                    meta: {
                        title: '待结算',
                        icon: 'circle'
                    }
                }
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
        {
            path: '/sysmsg',
            component: Layout,
            redirect: '/sysmsg/merchantMsglist',
            meta: {
                title: '消息管理',
                icon: 'gl2'
            },
            children: [
                {
                    path: 'adminMsgList',
                    name: 'adminMsgList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/sysmsg/adminMsg.vue'),
                    meta: {
                        title: '系统消息',
                        icon: 'circle'
                    }
                }
            ]
        }
    ]
})
