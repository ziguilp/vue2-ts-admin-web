/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-27 18:00:58
 * @FilePath      : /nls-admin/src/api/reward.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import request from '@/utils/request';
import { IpageDataDto, RoleDto } from './types'


/**
 * 抽奖奖品类型
 */
export enum MarketingLotteryRewardType {
    /**
     * 微信现金红包
     */
    WECHAT_RED_PACKAGE = 'wechat_red_package',
    /**
     * 实物
     */
    GOODS = 'goods',
    // /**
    //  * 优惠券
    //  */
    // COUPON = 'coupon'
}

export interface RewardInfo {
    id: number;
    merchant_id: number;
    activity_id: number;
    name: string;
    rate: number;
    reward_amount: number;
    reward_rela_id: number;
    reward_num: number;
    image: string;
    tip: string;
    type: MarketingLotteryRewardType;
    remark: string;
    date_created: Date;
    date_updated: Date;
    date_deleted: Date;
}


export const getRewardList = async ({
    activityId
}: any) => {
    return ((await request({
        url: '/marketing/activity/rewards/' + activityId,
        method: 'get',
    })).data) as IpageDataDto<RewardInfo>
}

export const createReward = async (data: any) => {
    return ((await request({
        url: '/marketing/activity/reward/add',
        method: 'POST',
        data
    })).data) as RewardInfo
}

export const editReward = async (data: any) => {
    return ((await request({
        url: '/marketing/activity/reward/edit',
        method: 'POST',
        data
    })).data) as RewardInfo
}
