import request from '@/utils/request'
import { number } from 'echarts'
import moment from 'moment'
import { IpageDataDto } from './types'


/**
 * 订单类型
 */
export enum OrderType {
    /**
     * 会员订阅订单
     */
    VIP_ORDER,
    /**
     * 商品购买订单
     */
    GOODS,
    /**
     * 会员礼履约订单
     */
    GIFTS
}

/**
 * 订单状态
 */
export const OrderStatusConf = [
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
        value: 2,
    },
    {
        label: "部分退款",
        value: 3,
    },
    {
        label: "全部退款",
        value: 4,
    },
]

/**
 * 读取订单列表
 * @param param0 
 * @returns 
 */
export const getOrderList = async ({ page, pageSize, data }: any) => {
    return ((await request({
        url: '/order/list',
        method: 'get',
        params: {
            data,
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
        detail.goods = detail.order_goods.map((e: any) => {
            e.rmbYuan = {
                total_amount: (e.price as Number).div(100).toFixed(2)
            }
            return e
        })
        detail.status_conf = OrderStatusConf.reduce((p, c) => {
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