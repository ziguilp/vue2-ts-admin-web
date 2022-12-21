/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-12 16:14:04
 * @FilePath      : /adminweb/src/utils/util.ts
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
 */

export const isSkuNo = (str: string) => {
    return /^[A-Z]([\d]+)$/i.test(str)
}

export const getSkuNo = (str: string) => {
    if (isSkuNo(str)) {
        return str.toUpperCase()
    }
    return /.*?\/([A-Z][\d]+)$/i.test(str) ? (str.replace(/.*?\/([A-Z][\d]+)$/i, '$1')).toUpperCase() : ''
}

/**
 * 是否库位码
 * @param string
 * @returns
 */
export const isLocation = (str: string) => {
    str = (str || '').toUpperCase()
    return /^LOC([\d]+)\_(.*?)$/i.test(str)
}
