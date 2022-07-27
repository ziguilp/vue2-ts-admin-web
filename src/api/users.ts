import request from '@/utils/request'
import { AuthRightItem, LoginResult, UserInfoDto } from './types'

export const getUserInfo = async () => {
    return ((await request({
        url: '/auth/userInfo',
        method: 'get'
    })).data) as UserInfoDto
}

export const refreshToken = async () => {
    return ((await request({
        url: '/auth/refresh',
        method: 'post'
    })).data) as LoginResult
}

export const getUserList = async ({ keyword, page, pageSize }: any) => {
    return ((await request({
        url: '/auth/userlist',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize: pageSize || 10
        }
    })).data) as UserInfoDto
}

export const getAdminList = async ({ keyword, page, pageSize }: any) => {
    return ((await request({
        url: '/auth/adminlist',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize: pageSize || 10
        }
    })).data) as UserInfoDto
}

export const login = async (data: any): Promise<LoginResult> => {
    return ((await request({
        url: '/auth/login',
        method: 'post',
        data
    })).data) as LoginResult
}

export const logout = () =>
    request({
        url: '/auth/logout',
        method: 'get'
    })

export const getOperateLog = async ({ page, pageSize, user_id }: any) => {
    return ((await request({
        url: `/auth/operatorLog`,
        method: 'GET',
        params: {
            page,
            pageSize,
            user_id
        }
    })).data)
}

export const modifyPwd = async ({ oldPassword, newPassword }: any) => {
    return ((await request({
        url: `/auth/modify/password`,
        method: 'POST',
        data: {
            captcha: '12344442123',
            old_password: oldPassword,
            new_password: newPassword
        }
    })).data)
}

/**
 * 添加管理员
 */
export const createAdmin = async (data: any) => {
    return ((await request({
        url: `/auth/regAdmin`,
        method: 'POST',
        data
    })).data)
}

/**
 * 读取当前用户的权限配置
 */
export const getAuthRights = async () => {
    return ((await request({
        url: `/auth/rightslist`,
        method: 'GET',
    })).data) as AuthRightItem[]
}

/**
 * 申请退押金
 */
export const applyRefundDeposit = async (userId: string) => {
    return ((await request({
        url: `/payment/refundDeposit/${userId}`,
        method: 'POST',
    })).data) as any
}