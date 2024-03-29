/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 13:12:15
 * @FilePath      : /nls-admin/src/components/common/permission.ts
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
 */
export const Permission = {
    install(vue: any, options: any = {}) {
        vue.prototype.$permission = {
            /**
             * 是否有权限
             * @param key
             */
            can(key: string, strictMode = true) {
                try {
                    if (!key) {
                        return true
                    }
                    if (this.isSuperAdmin()) {
                        return true;
                    }
                    const { permissionObj } = options.store.state.user
                    if (permissionObj && permissionObj[key]) {
                        return true
                    }
                    if (!strictMode && (!permissionObj || Object.keys(permissionObj).length === 0)) {
                        return true
                    }
                } catch (error) {

                }
                return false
            },
            /**
             * 满足任意权限之一
             * @param keys
             */
            anyCan(keys: string[], strictMode = true) {
                try {
                    if (keys.length === 0) return false
                    const { permissionObj } = options.store.state.user
                    if (permissionObj && Object.keys(permissionObj).length > 0) {
                        for (let index = 0; index < keys.length; index++) {
                            if (permissionObj[keys[index]]) return true
                        }
                    } else {
                        if (!strictMode) {
                            return true
                        }
                    }
                } catch (error) {

                }
                return false
            },
            /**
             * 满足所有权限
             * @param keys
             */
            allCan(keys: string[], strictMode = true) {
                try {
                    if (keys.length === 0) return false

                    const { permissionObj } = options.store.state.user
                    if (permissionObj && Object.keys(permissionObj).length > 0) {
                        for (let index = 0; index < keys.length; index++) {
                            if (!permissionObj[keys[index]]) return false
                        }
                        return true
                    } else {
                        if (!strictMode) {
                            return true
                        }
                    }
                } catch (error) {

                }
                return false
            },
            /**
             * 判断是否为超管
             * 默认判断当前用户是否为超管
             */
            isSuperAdmin(authRights?: string | string[]) {
                if ('undefined' === typeof authRights) {
                    const { roleRights } = options.store.state.user;
                    authRights = roleRights || []
                }
                if (authRights === '*' || (authRights instanceof Array && authRights.indexOf('*') > -1)) {
                    return true
                }
                return false
            },

        }
    }
}

export interface Permission {
    /**
     * 是否有权限
     * @param key
     * @param strictMode
     */
    can(key: string, strictMode?: boolean): boolean
    /**
     * 满足任意权限之一
     * @param keys
     * @param strictMode
     */
    anyCan(keys: string[], strictMode?: boolean): boolean
    /**
     * 满足所有权限
     * @param keys
     * @param strictMode
     */
    allCan(keys: string[], strictMode?: boolean): boolean
    /**
     * 是否为超管
     */
    isSuperAdmin(authRights?: string | string[]): boolean
}

declare module 'vue/types/vue' {
    interface Vue {
        /** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
        $permission: Permission
    }
}
