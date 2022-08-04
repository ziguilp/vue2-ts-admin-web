import request from '@/utils/request'
import { IpageDataDto, RoleDto } from './types'

export enum GitfPlanStatus {
    /**
    * 待发布
    */
    DRAFT,
    /**
     * 下架
     */
    DESTORYED,
    /**
     * 发布
     */
    SHOW,
}


/**
 * 会员礼计划周期
 */
export enum GitfPlanCycle {
    /**
     * 每周一次
     */
    WEEKLY,
    /**
     * 每月一次
     */
    MONTHLY,
    /**
    * 每季度一次
    */
    SEASONLY
}


/**
 * 会员礼计划退款协议
 */
export enum GitfPlanRefundPolicy {
    /**
    * 仅仅首次不满意随心退，后续不可退
    */
    SATISFYAFTERFIRST,
    /**
     * 首次不满意随心退,二次后协商退款
     */
    AFTERAGREEMENT,
    /**
     * 首次不满意随心退,二次后剩余权益随心退
     */
    SATISFY,
}


/**
 * 会员礼计划履约状态
 */
export enum GitfPlanItemStatus {
    /**
    * 待履约
    */
    DRAFT,
    /**
     * 履约中[备货、已发货]
     */
    SERVING,
    /**
     * 完成、用户已收货
     */
    DONE,
    /**
     * 不满意、退货
     */
    BACK,
}


export enum GiftSubscribeStatus {
    /**
     * 正常
     */
    NORMAL,
    /**
     * 锁定【转赠过程中会被锁定】
     */
    LOCKED,
    /**
     * 销毁
     */
    DESTORYED
}


export enum GiftTransferStatus {
    /**
     * 待领取
     */
    NORMAL,
    /**
     * 取消赠送
     */
    CANCEL,
    /**
     * 已领取
     */
    ACCESSED
}


/**
 * 会员礼来源
 */
export enum GitfPlanSubscribeSource {
    /**
     * 小程序购买
     */
    PURCHASE,

    /**
     * 被赠予
     */
    TRANSFERED,
}

export interface GiftPlan {
    id: number;
    merchant_id: number;
    name: string;
    icon: string;
    original_price: number;
    price: number;
    cycle: GitfPlanCycle;
    life_time: number;
    life_days: number;
    detail: string[];
    status: GitfPlanStatus;
    transable: boolean;
    refund_policy: GitfPlanRefundPolicy;
    date_created: Date;
    date_updated: Date;
    date_deleted: Date;
}

export const getGiftplanList = async ({ page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/giftplan/list',
        method: 'get',
        params: {
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<GiftPlan>
}

// subscribeList
export const getGiftplanSubscribeList = async ({ page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/giftplan/subscribeList',
        method: 'get',
        params: {
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<GiftPlan>
}
