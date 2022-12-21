import request from '@/utils/request'
import { IpageDataDto, RoleDto } from './types'

export interface BookItem {
    id?: number
    isbn: string
    name: string
    image: string
    publisher: string
    pubdate: Date | string
    page: number
    suit_num: number
    authors: string[]
    translators: string[]
    category_ids: number[]
    tags: string[]
    price: number
    catalog: string
    brief: string
    keyong?: number|string
    locked?: number|string
}

export const getBookList = async({ keyword, category_id, page, pageSize }: any) => {
    return ((await request({
        url: '/book/list',
        method: 'get',
        params: {
            keyword,
            category_id,
            page,
            pageSize
        }
    })).data) as IpageDataDto<BookItem>
}

export const addBook = async(data: BookItem) => {
    return ((await request({
        url: '/book',
        method: 'POST',
        data
    })).data)
}

export const editBook = async(data: BookItem) => {
    return ((await request({
        url: `/book/${data.id}`,
        method: 'PATCH',
        data
    })).data) as BookItem
}

export const getBookInfoByIsbn = async(isbn: string) => {
    return ((await request({
        url: `/book/isbn/${isbn}`,
        method: 'get'
    })).data) as BookItem
}
