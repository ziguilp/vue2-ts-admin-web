/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-14 22:17:52
 * @FilePath      : /nls-admin/src/permission.ts
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'

NProgress.configure({ showSpinner: false })

const whiteList = ['/', '/login', '/404', '/cms/detail/:alias']

export const isInWhiteList = (to: any) => {
    try {
        if (whiteList.indexOf(to.path) !== -1) {
            return true
        }

        if (whiteList.indexOf(to.matched[0].path) !== -1) {
            return true
        }
    } catch (error) {

    }
    return false
}

router.beforeEach(async (to: Route, _: Route, next: any) => {
    // Start progress bar
    NProgress.start()

    // Determine whether the user has logged in
    if (UserModule.token) {
        if (to.path === '/login') {
            // If is logged in, redirect to the home page
            next({ path: '/' })
            NProgress.done()
        } else {
            // Check whether the user has obtained his permission roles
            if (UserModule.roles.length === 0) {
                try {
                    // Get user info, including roles
                    await UserModule.GetUserInfo()
                    // Set the replace: true, so the navigation will not leave a history record
                    next({ ...to, replace: true })
                } catch (err: any) {
                    // Remove token and redirect to login page
                    UserModule.ResetToken()
                    Message.error(err.message || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            } else {
                next()
            }
        }
    } else {
        // Has no token
        if (isInWhiteList(to)) {
            // In the free login whitelist, go directly
            next()
        } else {
            // Other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach((to: Route) => {
    // Finish progress bar
    NProgress.done()

    // set page title
    document.title = to.meta?.title
})
