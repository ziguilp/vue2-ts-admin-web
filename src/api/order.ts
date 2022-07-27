import request from '@/utils/request'
import { number } from 'echarts'
import moment from 'moment'
import { IpageDataDto } from './types'

/**
 * 订单状态
 */
export const OrderStatusConf = [
    {
        label: "作废",
        value: 0,
    },
    {
        label: "待配送",
        value: 1,
    },
    {
        label: "已送达",
        value: 2,
    },
    {
        label: "部分归还",
        value: 3,
    },
    {
        label: "全部归还",
        value: 4,
    },
    {
        label: "退款中",
        value: 5,
    },
    {
        label: "部分退款",
        value: 6,
    },
    {
        label: "全部退款",
        value: 7,
    },
]

/**
 * 订单状态
 */
export const VipcardOrderStatusConf = [
    {
        label: "作废",
        value: 0,
    },
    {
        label: "待支付",
        value: 1,
    },
    {
        label: "已支付",
        value: 4,
    },
    {
        label: "退款中",
        value: 5,
    },
    {
        label: "部分退款",
        value: 6,
    },
    {
        label: "全部退款",
        value: 7,
    },
]

/**
 * 读取借阅订单
 * @param param0 
 * @returns 
 */
export const getBorrowOrderList = async ({ keyword, status, user_id = '', page, pageSize }: any) => {
    return ((await request({
        url: '/order/list',
        method: 'get',
        params: {
            keyword,
            status,
            user_id,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}

/*
* 订单详情
* @param param0 
* @returns 
*/
export const getOrderDetail = async ({ orderSn }: any) => {
    const detail = ((await request({
        url: `/order/detail/${orderSn}`,
        method: 'get',
    })).data)
    if (detail) {
        detail.date_created_text = moment(detail.date_created).format('YYYY-MM-DD HH:mm')
        detail.rmbYuan = {
            total_amount: (detail.total_amount as Number).div(100).toFixed(2),
            total_original_amount: (detail.total_original_amount as Number).div(100).toFixed(2),
        }
        detail.goods = detail.goods.map((e: any) => {
            e.rmbYuan = {
                total_amount: (e.price as Number).div(100).toFixed(2)
            }
            return e
        })
        detail.status_conf = (detail.order_type == 1 ? OrderStatusConf : VipcardOrderStatusConf).reduce((p, c) => {
            if (c.value == detail.status) {
                p = c
            }
            return p
        }, {})
    }
    console.log({ detail })
    return detail
}


/*
* 借阅订单确认
* @param param0 
* @returns 
*/
export const confirmOrder = async ({ orderSn }: any) => {
    return ((await request({
        url: `/order/confirm/${orderSn}`,
        method: 'POST',
    })).data)
}

/*
* 归还订单
* @param param0 
* @returns 
*/
export const returnOrder = async ({ orderSn, skuList }: any) => {
    return ((await request({
        url: `/order/back/${orderSn}`,
        method: 'POST',
        data: { skuList }
    })).data)
}

/*
* 归还订单
* @param param0 
* @returns 
*/
export const returnOrderBroken = async ({ orderSn, skuList }: any) => {
    return ((await request({
        url: `/order/broken/${orderSn}`,
        method: 'POST',
        data: { skuList }
    })).data)
}

/*
* 取消订单
* @param param0 
* @returns 
*/
export const cancelOrder = async ({ orderSn }: any) => {
    return ((await request({
        url: `/order/cancel/${orderSn}`,
        method: 'POST',
    })).data)
}

/*
* 订单退款
* @param param0 
* @returns 
*/
export const refund = async ({ orderGoodsId, refundAmount, reason }: any) => {
    return ((await request({
        url: `/payment/refund`,
        method: 'POST',
        data: {
            orderGoodsId,
            refundAmount,
            reason
        }
    })).data)
}