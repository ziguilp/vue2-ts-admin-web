/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-27 18:01:16
 * @FilePath      : /nls-admin/src/api/activity.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import request from '@/utils/request'
import { OrderType } from './order';
import { IpageDataDto, RoleDto } from './types'


/**
 * 营销活动类型
 */
export enum MarketingActivityType {
    /**
     * 抽奖
     */
    LOTTERY = 'lottery',
}

/**
 * 营销活动状态
 */
export enum MarketingActivityStatus {
    /**
     * 正常
     */
    NORMAL = 'normal',
    /**
     * 禁用
     */
    BAN = 'ban'
}

export interface ActivityInfo {
    id: number;
    merchant_id: number;
    name: string;
    logo: string;
    main_image: string;
    rule: string;
    type: MarketingActivityType;
    status: MarketingActivityStatus;
    activity_adapter: string;
    remark: string;
    date_start: Date;
    date_end: Date;
    date_created: Date;
    date_updated: Date;
    date_deleted: Date;
    statusText?: 'pending' | 'going' | 'over';
}


export const getAcivityList = async ({ keyword, page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/marketing/activity/list',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<ActivityInfo>
}

export const createActivity = async (data: any) => {
    return ((await request({
        url: '/marketing/activity/add',
        method: 'POST',
        data
    })).data) as ActivityInfo
}

export const editActivity = async (data: any) => {
    return ((await request({
        url: '/marketing/activity/edit',
        method: 'POST',
        data
    })).data) as ActivityInfo
}
