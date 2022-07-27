export const isIsbn = (str: string | number | null) => {
    return str && /^978([\d]{10})$/.test(String(str));
}


export const isSkuNo = (str: string) => {
    return /^[A-Z]([\d]+)$/i.test(str)
}

export const getSkuNo = (str: string) => {
    if (isSkuNo(str)) {
        return str.toUpperCase()
    }
    return /.*?\/([A-Z][\d]+)$/i.test(str) ? (str.replace(/.*?\/([A-Z][\d]+)$/i, '$1')).toUpperCase() : '';
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