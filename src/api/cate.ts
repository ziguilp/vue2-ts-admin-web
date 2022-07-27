import request from '@/utils/request'
import { number } from 'echarts'
import { IpageDataDto } from './types'

export enum CategoryType{
    BOOK = 'book',
    GOODS = 'goods',
    VIPCARD = 'vipcard'
}

export interface CategoryItem{
    id?: number,
    name: string,
    model_type: CategoryType,
    parent_id?: number
}

export const getCateList = async ({  page, pageSize }: any, type = CategoryType.BOOK) => {
    const list:CategoryItem[] = ((await request({
        url: `/category/list/${type}`,
        method: 'get'
    })).data) 

    return {
        total: list.length,
        currentPage: 1,
        pageSize: list.length,
        list
    } as IpageDataDto<CategoryItem>
}

export const addCate = async (data: CategoryItem) => {
    return ((await request({
        url: '/category',
        method: 'POST',
        data
    })).data)
}

export const editCate = async (data: CategoryItem) => {
    return ((await request({
        url: `/category/${data.id}`,
        method: 'PATCH',
        data
    })).data)
}