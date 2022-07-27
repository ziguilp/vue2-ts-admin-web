import request from '@/utils/request'
import { IpageDataDto } from './types'

export const getVipcards = async () => {
    const cards = (await request({
        url: `/vipcard/list`,
        method: 'GET'
    })).data

    return {
        total: cards.length,
        list: cards,
        currentPage: 1,
    } as IpageDataDto<any>
}

/**
 * 读取借阅订单
 * @param param0 
 * @returns 
 */
export const getVipcardOrderList = async ({ keyword, status, user_id = '', page, pageSize }: any) => {
    return ((await request({
        url: '/order/list',
        method: 'get',
        params: {
            order_type: 0,
            keyword,
            status,
            user_id,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}
