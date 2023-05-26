/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-27 07:23:23
 * @FilePath      : /nls-admin/src/components/custom-list/customType.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import { CaptchaVerifyEventType } from '@/api/types'
import { Table, TableColumn } from 'element-ui'

export enum CustomListColumnType {
    /**
     * 文本输入
     */
    TEXT = 'text',
    /**
     * 文本输入
     */
    TEXT_ARRAY = 'text-array',
    /**
     * 富文本输入
     */
    RICHTEXT = 'rich-text',
    /**
    * 文本输入
    */
    TEXTAREA = 'textarea',
    /**
     * 密码输入
     */
    PASSWORD = 'password',
    /**
     * 数字
     */
    NUMBER = 'number_input',
    /**
     * 图片
     */
    IMAGE = 'image',
    /**
    * 图片
    */
    IMAGES = 'images',
    /**
    * 年
    */
    YEAR = 'year',
    /**
     * 年区间
     */
    YEAR_RANGER = 'year-ranger',
    /**
     * 日期
     */
    DATE = 'date',
    /**
     * 日期区间
     */
    DATE_RANGER = 'date-ranger',
    /**
     * 日期时间
     */
    DATETIME = 'datetime',
    /**
     * 日期时间区间
     */
    DATETIME_RANGER = 'datetime-ranger',
    /**
     * 选择
     */
    SELECT = 'select',
    /**
    * 选择
    */
    RADIO = 'radio',

    /**
     * 选择
     */
    CHECKBOX = 'checkbox',
    /**
     * 选择
     */
    SWITCH = 'switch',
    /**
     * 验证码
     */
    CAPTCHA = 'captcha',
}

export interface CustomDataSource {
    value: any[] | Object | Function
    key: string
    labelKey?: string
}

export interface CustomListColumn {
    prop: string
    label: string
    placeholder?: string
    type: CustomListColumnType
    canSearch?: Boolean
    canAdd?: Boolean
    canEdit?: Boolean
    /**
     * 当条件达成时才可进行编辑，否则值置空
     */
    editableWhen?: Function;
    // 如果是select之类的
    dataSource?: CustomDataSource
    /**
     * 多选
     */
    multiple?: Boolean
    showInTable?: Boolean
    showInDetail?: Boolean
    readonly?: Boolean
    tableConf?: TableColumn
    //* *参照formRule */
    formRule?: any[] | Function
    height?: any
    width?: any
    dateFormat?: string
    /**
     * 数值输入或者图片上传最大数量
     */
    max?: number
    /**
     * 数值输入最小数
     */
    min?: number
    /**
     * 数值精度
     */
    precision?: number
    showFormatInTable?: Function
    sortable?: boolean | 'custom'
    /**
     * 验证码
     */
    captchaEvent?: CaptchaVerifyEventType
}

export interface CustomListOperationItem {
    label: string
    buttonType: 'success' | 'primary' | 'info' | 'danger' | 'warning'
    handle: Function
}

export interface CustomListConf {
    forminline?: boolean
    columns: CustomListColumn[]
    tableSelection?: Boolean
    hideOperations?: Boolean
    onLoadData: Function
    onSave?: Function
    onDelete?: Function
    onExport?: Function
    showExport?: Function
    onTableSelectionChange?: Function
    onSortChange?: Function
    permissionAddMark?: string
    permissionUpdateMark?: string
    permissionDeleteMark?: string
    permissionExportMark?: string
    operations?: CustomListOperationItem[]
}
