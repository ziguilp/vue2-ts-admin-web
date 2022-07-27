import request from '@/utils/request'

export const printSku = async (skuNo: string) => {
    return (await request({
        url: `/common/printSkuInfo/${skuNo}`,
        method: 'GET'
    })).data
}

export const printLocated = async (located: string) => {
    return (await request({
        url: `common/printLocation`,
        params: {
            location: located
        },
        method: 'GET'
    })).data
}

export const dashboard = async () => {
    return (await request({
        url: `dashboard`,
        params: {
        },
        method: 'GET'
    })).data
}