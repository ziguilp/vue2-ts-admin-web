import request from '@/utils/request'
import { IpageDataDto } from './types'

export interface CmsContent {
    id: number
    alias: string
    page_id: number
    position: string
    title: string
    content: string
    image: string
    extra: { [key: string]: any }
    user_created: string
    date_show_start: Date
    date_show_end: Date
    date_created: Date
    date_updated: Date
    date_deleted: Date
    cmsPage: CmsPage
}

export interface CmsPage {
    id: number
    name: string
    link: string
    date_created: Date
    date_updated: Date
    date_deleted: Date
    contents: CmsContent[]
}

export const getCmsPageList = async({ page, pageSize, data = {} }: any) => {
    const res: IpageDataDto<CmsPage> = ((await request({
        url: '/cms/page/list',
        method: 'get',
        params: {
            page,
            pageSize,
            data
        }
    })).data)

    return res
}

export const savePage = async(data: CmsPage) => {
    return ((await request({
        url: '/cms/page/save',
        method: 'POST',
        data
    })).data)
}

export const getCmsContentList = async({ page, pageSize, data = {} }: any) => {
    const res: IpageDataDto<CmsContent> = ((await request({
        url: '/cms/content/list',
        method: 'get',
        params: {
            page,
            pageSize,
            data
        }
    })).data)

    return res
}

export const saveContent = async(data: CmsContent) => {
    return ((await request({
        url: '/cms/content/save',
        method: 'POST',
        data
    })).data)
}

export const getCmsDetailById = async(id: number) => {
    return ((await request({
        url: `/cms/content/${id}`,
        method: 'get'
    })).data) as CmsContent
}

export const getCmsDetailByAlias = async(alias: string) => {
    return ((await request({
        url: `/cms/content/detail/${alias}`,
        method: 'get'
    })).data) as CmsContent
}
