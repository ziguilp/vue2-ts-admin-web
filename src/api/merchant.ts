/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-07 11:08:35
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

export const getMerchantInfo = async (mid: number) => {
    return ((await request({
        url: '/marketing/merchant/detail/' + mid,
        method: 'GET',
    })).data) as MerchantInfo
}

/**
 * 充值记录
 */
export const getRechargeLog = async ({ keyword, page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/marketing/merchant/recharge/log',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<any>
}