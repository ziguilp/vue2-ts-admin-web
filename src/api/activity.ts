/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 21:30:59
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

export interface CodeSummaryInfo {
    merchant_id: number;
    activity_id: number;
    wave_code: string;
    /**
     * 该批次甁码总数
     */
    apply_code_num: number;
    /**
     * 该批次箱码总数
     */
    box_code_num: number;
    /**
     * 该批次甁码尚未激活数量
     */
    apply_code_pending_num: number;
    /**
     * 该批次甁码尚已激活数量
     */
    apply_code_normal_num: number;
    /**
     * 该批次甁码已扫数量
     */
    apply_code_used_num: number;
    /**
     * 该批次箱码尚未激活数量
     */
    box_code_pending_num: number;
    /**
     * 该批次箱码尚已激活数量
     */
    box_code_normal_num: number;
    /**
     * 该批次箱码扫过数量
     */
    box_code_used_num: number;
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

export const getAcivityCodesSummary = async ({ page, pageSize, activityId }: any) => {
    return ((await request({
        url: `/marketing/boxcode/summary/info`,
        params: {
            activity_id: activityId,
            page,
            pageSize,
        }
    })).data) as IpageDataDto<CodeSummaryInfo>;
}

export const createBoxCode = async ({ activityId,
    num,
    boxCov }: any) => {
    return ((await request({
        url: '/marketing/activity/createApplyCode',
        method: 'POST',
        data: {
            activityId,
            num,
            boxCov
        }
    })).data) as {
        waveCode: string
    }
}


export const queryCreateProcess = async (waveCode: string) => {
    const res = ((await request({
        url: `/marketing/activity/waveStatus/${waveCode}`,
        method: 'GET',
    })).data) as {
        waveCode: string;
        totalNum: number;
        doneNum: number;
        activity_id: number;
    };

    return {
        ...res,
        process: Number(res.doneNum || 0).div(res.totalNum).mul(100)
    }
}

export const activeWaveCode = async (waveCode: string) => {
    // @ts-ignore
    const res = ((await request({
        url: `/marketing/boxcode/activeWaveCode/${waveCode}`,
        method: "POST",
        showLoading: true
    })).data) as boolean;
}

export const downloadCodeFile = async (waveCode: string) => {
    // @ts-ignore
    const res = (await request({
        url: `/marketing/activity/downloadCode/${waveCode}`,
        responseType: 'blob',
        showLoading: true
    }))
    console.log(`下载`, res)
}