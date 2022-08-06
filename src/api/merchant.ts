import request from '@/utils/request'
import { IpageDataDto, RoleDto } from './types'


export enum MerchantInfoCheckStatus {
    /**
     * 信息待审核
     */
    WAIT_CHECK,

    /**
     * 信息待审核驳回
     */
    CHECK_FAILED,
    /**
     * 信息待审核
     */
    CHECK_SUCCESS,
}


export enum MerchantInfoOnlineStatus {
    /**
     * 下线
     */
    OFFLINE,

    /**
     * 上线
     */

    ONLINE,
    /**
     * 封禁
     */
    BAN,
}


export interface MerchantInfo {
    id: number;
    bind_user_id: string;
    name: string;
    image: string;
    intro: string;
    level: number;
    province: string;
    city: string;
    area: string;
    address: string;
    location_lng: number;
    location_lat: number;
    mobile: string;
    wechat: string;
    master: string;
    master_idcard: string;
    master_idcard_images: string[];
    contact: string;
    contact_avatar: string;
    contact_explain: string;
    license: string;
    license_no: string;
    qualifications: string[];
    check_status: MerchantInfoCheckStatus;
    check_result: string;
    status: MerchantInfoOnlineStatus;
    sales_man: string;
    service_man: string;
    balance: number;
    date_created: Date;
    date_updated: Date;
    date_deleted: Date;
}

export const getMerchantList = async ({ keyword, page, pageSize, data = {} }: any) => {
    return ((await request({
        url: '/merchant/list',
        method: 'get',
        params: {
            keyword,
            page,
            pageSize,
            data
        }
    })).data) as IpageDataDto<MerchantInfo>
}


export const merchantCheck = async ({
    merchantId,
    checkStatus,
    reason
}: any) => {
    return ((await request({
        url: `/merchant/check`,
        method: 'POST',
        data: {
            merchantId,
            checkStatus,
            reason
        }
    })).data) as any
}


export const merchantBan = async ({
    merchantId,
    status,
    reason
}: any) => {
    return ((await request({
        url: `/merchant/toggleBan`,
        method: 'post',
        data: {
            merchantId,
            status,
            reason
        }
    })).data) as any
}

export const getMerchantMembers = async ({
    data,
    page = 1,
    pageSize = 10
}: any) => {
    return ((await request({
        url: `/merchant/membersList`,
        method: 'get',
        params: {
            data,
            page,
            pageSize
        }
    })).data) as any
}

