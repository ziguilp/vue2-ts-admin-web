import request from '@/utils/request'
import { IpageDataDto } from './types'

export const MsgStatusConf = [
    {
        label: '待审核',
        value: 0
    },
    {
        label: '审核通过并发布',
        value: 1
    },
    {
        label: '审核未通过',
        value: 2
    }
]

/**
 * 读取商户发送的消息
 * @param param0
 * @returns
 */
export const getMerchantMsgList = async({ page, pageSize, data }: any) => {
    return ((await request({
        url: '/sysmsg/getMerchantSendMsg',
        method: 'get',
        params: {
            data,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}

export const checkMerchantMsg = async({ msgId, status, check_result }: any) => {
    return ((await request({
        url: '/sysmsg/msgcheck',
        method: 'POST',
        data: {
            msgId,
            status,
            check_result
        }
    })).data)
}

export const adminSendMsg = async({ title, content, medias, receiver }: any) => {
    return ((await request({
        url: '/sysmsg/admin/sendmsg',
        method: 'POST',
        data: {
            title, content, medias, receiver
        }
    })).data)
}

export const getAdminSendMsgList = async({ page, pageSize, data }: any) => {
    return ((await request({
        url: '/sysmsg/getAdminSendMsg',
        method: 'get',
        params: {
            data,
            page,
            pageSize
        }
    })).data) as IpageDataDto<any>
}
