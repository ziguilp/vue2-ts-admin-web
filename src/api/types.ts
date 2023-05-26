/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-26 09:35:24
 * @FilePath      : /nls-admin/src/api/types.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
export interface IArticleData {
    id: number
    status: string
    title: string
    abstractContent: string
    fullContent: string
    sourceURL: string
    imageURL: string
    timestamp: string | number
    platforms: string[]
    disableComment: boolean
    importance: number
    author: string
    reviewer: string
    type: string
    pageviews: number
}

export enum UserStatusDto {
    NORMAL = 'normal',
    LOCKED = 'locked'
}

export interface UserInfoDto {
    avatar: string
    date_created?: Date
    mobile: string
    nickname: string
    roleId?: number
    role_name: string
    role_rights: string[]
    status: UserStatusDto
    userId: string
}

export interface LoginResult {
    access_token: string
    userInfo: UserInfoDto
}

export interface IpageDataDto<T> {
    list: T[]
    total: number
    currentPage: number
    pageSize?: number
}

export interface IpageParam {
    page: number
    pageSize: number
}

export interface GetListParam {
    elecSiteId: number
    pageParam: IpageParam
    refresh?: boolean
}

export interface AuthRightItem {
    id?: number
    key: string
    name: string
    children?: AuthRightItem[]
}

export interface RoleDto {
    id?: number
    name: string
    explain: string
    rights: string[]
}

/**
 * 验证码事件
 */
export enum CaptchaVerifyEventType {
    /**
     * 测试
     */
    TEST = 'test',
    /**
    * 登录
    */
    LOGIN = 'login',
    /**
     * 账户注册
     */
    REGISTER = 'register',
    /**
     * 修改密码
     */
    MODIFY_PASSWORD = 'modify_password',
    /**
     * 重置密码
     */
    RESET_PASSWORD = 'reset_password',
}

export interface SendCaptchaDto {
    username: string
    event: CaptchaVerifyEventType
}
