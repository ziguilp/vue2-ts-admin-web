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
 * 商品类型
 */
export enum OrderGoodsType {
    /**
     * 会员礼品订阅
     */
    VIP_ORDER,
    /**
     * 商品
     */
    GOODS,
    /**
     * 会员礼品
     */
    GIFTS
}

export enum OrderGoodsStatus {
    /**
      * 已作废
      */
    CANCEL,

    /**
     * 待支付
     */
    BEFORE_PAY,

    /**
     * 已支付
     */
    PAYDONE,

    /**
     * 部分已退款
     */
    REFUND_PARTLY,

    /**
     * 全部已退款
     */
    REFUND_ALL,
    /**
    * 完成签收
    */
    RECEIVED,
}


export enum OrderGoodsSettleStatus {
    /**
     * 待结算
     */
    UNSETTLE,
    /**
    * 结算中
    */
    SETTLEING,
    /**
    * 结算完成
    */
    SETTLEDONE,
}


/**
 * 运单状态
 */
export enum OrderDeliveryStatus {
    /**
     * 已废弃
     */
    ABANDON,
    /**
     * 待绑定物流单
     */
    UNTRACK,
    /**
     * 待揽收
     */
    PACKING,
    /**
     * 运输中
     */
    TRANSING,
    /**
     * 已送达
     */
    RECEIVED,
    /**
    * 发货异常
    */
    EXCEPTION,
    /**
     * 退回中
     */
    REFUNDING,
    /**
    * 退回完成
    */
    REFUNDED,
    /**
    * 退回异常
    */
    REFUNDEXCEPTION,
}

export const OrderGoodsStatusConf = [
    { value: OrderGoodsStatus.CANCEL, label: "已取消" },
    { value: OrderGoodsStatus.BEFORE_PAY, label: "待支付" },
    { value: OrderGoodsStatus.PAYDONE, label: "已支付" },
    { value: OrderGoodsStatus.REFUND_PARTLY, label: "有退款" },
    { value: OrderGoodsStatus.REFUND_ALL, label: "全额退款" },
    { value: OrderGoodsStatus.RECEIVED, label: "订单已签收" },
]

export const SubscribeOrderGoodsStatusConf = [
    { value: OrderGoodsStatus.CANCEL, label: "已取消" },
    { value: OrderGoodsStatus.BEFORE_PAY, label: "待支付" },
    { value: OrderGoodsStatus.PAYDONE, label: "已支付" },
    { value: OrderGoodsStatus.REFUND_PARTLY, label: "有退款" },
    { value: OrderGoodsStatus.REFUND_ALL, label: "全额退款" },
]

export const OrderGoodsSettleStatusConf = [
    { value: OrderGoodsSettleStatus.UNSETTLE, label: "待结算" },
    { value: OrderGoodsSettleStatus.SETTLEING, label: "结算中" },
    { value: OrderGoodsSettleStatus.SETTLEDONE, label: "结算完成" },
]

export const OrderGiftStatusConf = [
    { value: OrderGoodsStatus.CANCEL, label: "已取消" },
    { value: OrderGoodsStatus.PAYDONE, label: "进行中" },
    { value: OrderGoodsStatus.RECEIVED, label: "确认完成" },
]

export const OrderDeliveryStatusConf = [
    {
        label: "备货中",
        value: OrderDeliveryStatus.UNTRACK,
    },
    {
        label: "待揽收",
        value: OrderDeliveryStatus.PACKING,
    },
    {
        label: "运输中",
        value: OrderDeliveryStatus.TRANSING,
    },
    {
        label: "已签收",
        value: OrderDeliveryStatus.RECEIVED,
    },
    {
        label: "发货异常",
        value: OrderDeliveryStatus.EXCEPTION,
    },
    {
        label: "退货中",
        value: OrderDeliveryStatus.REFUNDING,
    },
    {
        label: "退货完成",
        value: OrderDeliveryStatus.REFUNDED,
    },
    {
        label: "退货异常",
        value: OrderDeliveryStatus.REFUNDEXCEPTION,
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

        if (detail.order_type == OrderType.GIFTS) {
            detail.status_conf = OrderDeliveryStatusConf.reduce((p, c) => {
                if (c.value == detail.order_delivery.status) {
                    p = c
                }
                return p
            }, {})
        } else {
            detail.status_conf = OrderStatusConf.reduce((p, c) => {
                if (c.value == detail.status) {
                    p = c
                }
                return p
            }, {})
        }

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