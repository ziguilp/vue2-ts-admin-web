import request from '@/utils/request'
import { SendCaptchaDto } from './types'

export const sendCaptcha = async(data: SendCaptchaDto) => {
    return (await request({
        url: '/common/captcha/send',
        method: 'POST',
        data
    })).data
}

export const printSku = async(skuNo: string) => {
    return (await request({
        url: `/common/printSkuInfo/${skuNo}`,
        method: 'GET'
    })).data
}

export const printLocated = async(located: string) => {
    return (await request({
        url: 'common/printLocation',
        params: {
            location: located
        },
        method: 'GET'
    })).data
}

export const dashboard = async() => {
    return (await request({
        url: 'dashboard',
        params: {
        },
        method: 'GET'
    })).data
}
