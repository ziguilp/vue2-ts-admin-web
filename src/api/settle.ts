import request from '@/utils/request'
import { IpageDataDto } from './types'

/**
 * 结算状态
 */
export enum MerchantSettleStatus {
    /**
     * 审核中
     */
    CHECKING,

    /**
    * 打款中
    */
    CHECKDONE,

    /**
    * 打款完成
    */
    OVER,

    /**
     * 未通过审核
     */
    CHECK_FAILED,
}

export const SettleStatusConf = [
    {
        label: '审核未通过',
        value: MerchantSettleStatus.CHECK_FAILED
    },
    {
        label: '打款完成',
        value: MerchantSettleStatus.OVER
    },
    {
        label: '待审核',
        value: MerchantSettleStatus.CHECKING
    },
    {
        label: '通过待打款',
        value: MerchantSettleStatus.CHECKDONE
    }
]

/**
 * 读取待结算的
 * @param param0
 * @returns
 */
export const getWaitForSettleList = async({ page, pageSize, data }: any) => {
    return ((await request({
        url: '/settle/unsettle_list',
        method: 'get',
        params: {
            data,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}

/**
 * 读取结算单
 * @param param0
 * @returns
 */
export const getSettleList = async({ page, pageSize, data }: any) => {
    return ((await request({
        url: '/settle/list',
        method: 'get',
        params: {
            data,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}

export const getSettleDetail = async({ settleNo }: any) => {
    return ((await request({
        url: `/settle/detail/${settleNo}`,
        method: 'get'
    })).data)
}

export const settleCheck = async({ settleNo, status, reason }: any) => {
    return ((await request({
        url: '/settle/check',
        method: 'POST',
        data: {
            settleNo, status, reason: reason || ''
        }
    })).data)
}

export const settleConfirmTrans = async({ settleNo, settle_image, reason }: any) => {
    return ((await request({
        url: '/settle/transOver',
        method: 'POST',
        data: {
            settleNo, settle_image, reason: reason || ''
        }
    })).data)
}
