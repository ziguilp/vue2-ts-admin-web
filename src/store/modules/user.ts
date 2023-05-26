/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-25 22:29:36
 * @FilePath      : /nls-admin/src/store/modules/user.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo, refreshToken, getAuthRights } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'
import router from '@/router'
import { AuthRightItem } from '@/api/types'

export interface IUserState {
    userId: string
    token: string
    name: string
    avatar: string
    introduction: string
    mobile: string
    roles: string[]
    permissionList: AuthRightItem[]
    permissionObj: any
}

let refreshTokenTimer: number | null = null

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
    public token = getToken() || ''
    public userId = ''
    public name = ''
    public mobile = ''
    public avatar = ''
    public introduction = ''
    public roles: string[] = []
    public permissionList: AuthRightItem[] = []
    public permissionObj: any = {}

    @Mutation
    private SET_TOKEN(token: string) {
        console.log('==更新store==', token)
        this.token = token
        console.log('==更新store完成==', this)
    }

    @Mutation
    private SET_USER_ID(userId: string) {
        this.userId = userId
    }

    @Mutation
    private SET_NAME(name: string) {
        this.name = name
    }

    @Mutation
    private SET_MOBILE(mobile: string) {
        this.mobile = mobile
    }

    @Mutation
    private SET_AVATAR(avatar: string) {
        this.avatar = avatar
    }

    @Mutation
    private SET_INTRODUCTION(introduction: string) {
        this.introduction = introduction
    }

    @Mutation
    private SET_ROLES(roles: string[]) {
        this.roles = roles
    }

    @Mutation
    private SET_PERMISSION(authRights: AuthRightItem[]) {
        console.log('SET_PERMISSION', authRights)
        this.permissionList = authRights
        const pl = authRights.reduce((p, c) => {
            p.push(c, ...(c.children || []))
            return p
        }, [] as AuthRightItem[])

        this.permissionObj = pl.reduce((p, c) => {
            p[c.key] = c.name
            return p
        }, {} as any)
    }

    @Action
    public async Login(userInfo: { username: string, password: string, roleId: number }) {
        let { username, password, roleId } = userInfo
        username = username.trim()
        const loginResult = await login({ username, password, role_id: roleId })
        console.log('===登录成功===', loginResult.access_token)
        setToken(loginResult.access_token)
        this.SET_USER_ID(loginResult.userInfo.userId)
        this.SET_TOKEN(loginResult.access_token)
        this.SET_AVATAR(loginResult.userInfo.avatar)
        this.SET_NAME(loginResult.userInfo.nickname)
        this.SET_MOBILE(loginResult.userInfo.mobile)
        this.SET_ROLES([loginResult.userInfo.role_name])
        this.StartRefreshToken()
        return loginResult
    }

    @Action
    public ResetToken() {
        removeToken()
        this.SET_TOKEN('')
        this.SET_ROLES([])
    }

    @Action
    public async GetUserInfo() {
        if (this.token === '') {
            throw Error('未登录')
        }
        const data = await getUserInfo()
        if (!data) {
            throw Error('获取信息失败')
        }
        const { role_name, nickname, avatar, mobile } = data
        this.SET_USER_ID(data.userId)
        this.SET_ROLES([role_name])
        this.SET_NAME(nickname)
        this.SET_MOBILE(mobile)
        this.SET_AVATAR(avatar)
    }

    @Action
    public async RefreshToken() {
        if (this.token === '') {
            throw Error('未登录')
        }
        const loginResult = await refreshToken()
        console.log('===token刷新成功===', loginResult)
        setToken(loginResult.access_token)
        this.SET_USER_ID(loginResult.userInfo.userId)
        this.SET_TOKEN(loginResult.access_token)
        this.SET_AVATAR(loginResult.userInfo.avatar)
        this.SET_NAME(loginResult.userInfo.nickname)
        this.SET_MOBILE(loginResult.userInfo.mobile)
        this.SET_ROLES([loginResult.userInfo.role_name])
    }

    @Action
    public async LogOut() {
        if (this.token === '') {
            throw Error('LogOut: token is undefined!')
        }
        await logout()
        setTimeout(() => {
            router.push('/login')
        })
        removeToken()
        this.SET_TOKEN('')
        this.SET_ROLES([])
    }

    @Action({ rawError: true })
    public async GetPermission({ refresh = false } = {}) {
        if (refresh || !this.permissionList || this.permissionList.length < 1) {
            const permissionList = await getAuthRights()
            this.SET_PERMISSION(permissionList)
        }
    }

    @Action({ rawError: true })
    public StartRefreshToken() {
        if (!refreshTokenTimer) {
            refreshTokenTimer = window.setInterval(() => {
                this.RefreshToken()
            }, 1800000)
        }
    }

    @Action
    public StopRefreshToken() {
        if (refreshTokenTimer) {
            window.clearInterval(refreshTokenTimer)
        }
    }
}

export const UserModule = getModule(User)
