import request from '@/utils/request'
import { IpageDataDto } from './types'

/**
 * Agent状态
 */
export enum MarketingAgentStatus {
    /**
     * 未启用
     */
    PENDING = 'pending',
    /**
     * 正常
     */
    NORMAL = 'normal',
    /**
     * 禁用
     */
    BAN = 'ban',

}

export interface AgentInfo {

    id: number;


    mch_agent_no: number;


    user_id: string;


    agent_code: string;


    merchant_id: number;


    name: string;


    contact_user: string;


    contact_mobile: string;


    mch_employer_id: string;


    lng: number;


    lat: number;


    address: string;


    status: MarketingAgentStatus;


    remark: string;

    /**
     * 注册时间
     */

    date_reg: Date;


    date_created: Date;


    date_updated: Date;


    date_deleted: Date;
}

export const getAgentList = async ({ page, pageSize, data = {} }: any) => {
    const res: IpageDataDto<AgentInfo> = ((await request({
        url: '/marketing/agent/list',
        method: 'get',
        params: {
            page,
            pageSize,
            data
        }
    })).data)

    return res
}