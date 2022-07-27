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
    status: UserStatusDto
    userId: string
}

export interface LoginResult {
    access_token: string
    userInfo: UserInfoDto
}

export interface IpageDataDto<T>{
    list: T[]
    total: number
    currentPage: number
    pageSize?: number
}

export interface IpageParam{
    page: number
    pageSize: number
}

export interface GetListParam {
    elecSiteId: number
    pageParam: IpageParam
    refresh?: boolean
}


export interface AuthRightItem{
    id?: number
    key: string
    name: string
    children?: AuthRightItem[]
}

export interface RoleDto{
    id?: number
    name: string
    explain: string
    rights: string[]
}