export const Permission = {
    install(vue: any, options: any = {}) {
        vue.prototype.$permission = {
            /**
             * 是否有权限
             * @param key 
             */
            can(key: string, strictMode: boolean = true) {
                try {
                    if(!key){
                        return true
                    }
                    const { permissionObj } = options.store.state.user;
                    if (permissionObj && permissionObj[key]) {
                        return true
                    }
                    if (!strictMode && (!permissionObj || Object.keys(permissionObj).length == 0)) {
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
            anyCan(keys: string[], strictMode: boolean = true) {
                try {
                    if (keys.length == 0) return false
                    const { permissionObj } = options.store.state.user;
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
            allCan(keys: string[], strictMode: boolean = true) {
                try {
                    if (keys.length == 0) return false

                    const { permissionObj } = options.store.state.user;
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
             * 是否为超管
             */
            isSuperAdmin(authRights: string | string[]) {
                if(authRights === '*' || (authRights instanceof Array && authRights.indexOf("*") > -1)){
                    return true
                }
                return false
            }
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
    isSuperAdmin(authRights: string | string[]): boolean
}

declare module 'vue/types/vue' {
    interface Vue {
        /** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
        $permission: Permission
    }
}
