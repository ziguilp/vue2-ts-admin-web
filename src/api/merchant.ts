/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-26 10:26:58
 * @FilePath      : /nls-admin/src/api/merchant.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import request from '@/utils/request'
import { OrderType } from './order';
import { IpageDataDto, RoleDto } from './types'

/**
 * 营销商户状态
 */
export enum MarketingMerchantStatus {
    /**
     * 正常
     */
    NORMAL = 'normal',
    /**
     * 禁用
     */
    BAN = 'ban'
}

export interface MerchantInfo {
    id: number;
    user_id: string;
    name: string;
    logo: string;
    contact_user: string;
    contact_mobile: string;
    kefu_mobile: string;
    status: MarketingMerchantStatus;
    account_balance: number;
    fee_rate: number;
    remark: string;
    date_created: Date
    date_updated: Date
    date_deleted: Date
}

export const getMerchantList = async ({ keyword, page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/marketing/merchant/list',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<MerchantInfo>
}

export const createMerchant = async (data: any) => {
    return ((await request({
        url: '/marketing/merchant/add',
        method: 'POST',
        data
    })).data) as MerchantInfo
}

export const editMerchant = async (data: any) => {
    return ((await request({
        url: '/marketing/merchant/edit',
        method: 'POST',
        data
    })).data) as MerchantInfo
}

/**
 * 商户自行发起充值
 * @param amount 充值金额元 
 * @returns 
 */
export const merchantRecharge = async ({
    amount
}: { amount: number }) => {
    return ((await request({
        url: `/order/createOrder`,
        method: 'POST',
        data: {
            orderType: OrderType.MERCHANT_RECHARGE,
            orderGoodsList: [
                {
                    goodsType: OrderType.MERCHANT_RECHARGE,
                    goodsId: 0,
                    goodsNum: Number(amount).mul(100)
                }
            ]
        },
    })).data)
}

/**
 * 超管给他充值[直接到账]
 */
export const merchantRechargeByAdmin = async (data: {
    /**
     * 充值金额元
     */
    amount: number,
    /**
     * 充值方式
     */
    way: 'cash' | 'bank' | 'wechat' | 'alipay',
    /**
     * 三方流水号
     */
    thirdOrderSn?: string
}) => {
    return ((await request({
        url: `/merchant/rechargeByAdmin`,
        method: 'POST',
        data
    })).data)
}