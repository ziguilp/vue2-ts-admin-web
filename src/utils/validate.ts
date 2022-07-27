
export const isValidUsername = (str: string) => {
    return str.replace(/\s/g, '').length > 0
}

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

/**
 * 功率容量格式
 * @param str
 */
export const toPowerCapacity = (str:string) => {
    return Number(Number(str).toFixed(3))
}

export const isMobile = (str:string) => {
    return /^1(3|4|5|6|7|8|9)([\d]{9})$/.test(str)
}