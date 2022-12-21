/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-12 16:13:17
 * @FilePath      : /adminweb/src/utils/validate.ts
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
 */

export const isValidUsername = (str: string) => {
    return str.replace(/\s/g, '').length > 0
}

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const isMobile = (str: string) => {
    return /^1(3|4|5|6|7|8|9)([\d]{9})$/.test(str)
}
