import request from '@/utils/request'
import { IpageDataDto, RoleDto } from './types'

export const getRoleList = async () => {
    return ((await request({
        url: '/role/list',
        method: 'get'
    })).data) as IpageDataDto<RoleDto>
}

export const createRole = async (role: RoleDto) => {
    return ((await request({
        url: '/role/create',
        method: 'post',
        data: role
    })).data) as RoleDto
}

export const updateRole = async (role: RoleDto) => {
    return ((await request({
        url: '/role/update',
        method: 'post',
        data: role
    })).data) as RoleDto
}

export const deleteRole = async (role: RoleDto) => {
    return ((await request({
        url: `/role/delete/${role.id}`,
        method: 'post'
    })).data) as RoleDto
}

export const refreshAuthRightsConf = async () => {
    return ((await request({
        url: `/refreshRights`,
        method: 'get'
    })).data) as boolean
}