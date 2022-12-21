import request from '@/utils/request'
import { number } from 'echarts'
import { IpageDataDto } from './types'

export enum SkuType {
    BOOK = 'book',
    GOODS = 'goods',
    VIPCARD = 'vipcard'
}

/**
 * SKU状态
 */
export enum SkuStatusDto {
    /**
     * 在架
     */
    ON_SHELF,

    /**
     * 锁定
     */
    LOCKED,

    /**
    * 借出
    */
    BORROW_OUT,

    /**
     * 售出
     */
    SALED,

    /**
     * 库中待上架
     */
    WAIT_ON_SHELF,

    /**
    * 报废
    */
    DESTORYED,
}

export interface SkuItem {
    id?: number
    sku_no?: string
    goods_type: SkuType
    goods_id: number
    located: string
    vendor: string
    num: number
    quality: number
    price: number
    remark: string
}

export const SkuStatusConf = [
    { value: SkuStatusDto.ON_SHELF, label: '在架' },
    { value: SkuStatusDto.LOCKED, label: '锁定' },
    { value: SkuStatusDto.BORROW_OUT, label: '借出' },
    { value: SkuStatusDto.SALED, label: '已卖出' },
    { value: SkuStatusDto.WAIT_ON_SHELF, label: '待入库' },
    { value: SkuStatusDto.DESTORYED, label: '报废' }
]

export const getSkuList = async({ goodsId, page, pageSize }: any, type = SkuType.BOOK) => {
    const data: any = ((await request({
        url: `/sku/list/${type}/${goodsId}`,
        method: 'get'
    })).data)

    data.list = data.list.map((e: any) => {
        e.price = Number(Number(e.price / 100).toFixed(2))
        e.quality = parseInt(e.quality_current)
        return e
    })

    return data as IpageDataDto<SkuItem>
}

export const addSku = async(data: SkuItem) => {
    return ((await request({
        url: '/sku/create',
        method: 'POST',
        data
    })).data)
}

export const editSku = async(data: SkuItem) => {
    return ((await request({
        url: '/sku/update',
        method: 'POST',
        data
    })).data)
}

export const getSkuInfoBySkuId = async(skuId: number) => {
    return ((await request({
        url: `/sku/${skuId}`,
        method: 'get'
    })).data) as SkuItem
}

export const getSkuInfoBySkuNo = async(skuNo: string) => {
    return ((await request({
        url: `/sku/skuno/${skuNo}`,
        method: 'get'
    })).data) as SkuItem
}

export const bindSku = async({ isbn, skuNo, located }: any) => {
    return ((await request({
        url: '/sku/bind',
        method: 'POST',
        data: {
            isbn,
            skuNo,
            located
        }
    })).data) as SkuItem
}

export const getSkuLocatesList = async() => {
    const list: any[] = ((await request({
        url: '/sku/locates',
        method: 'get'
    })).data)

    return {
        total: list.length,
        currentPage: 1,
        list
    }
}

export const getGoodsOfLocate = async(located: string) => {
    return ((await request({
        url: `/sku/located/${located}`,
        method: 'get'
    })).data) as IpageDataDto<any>
}
