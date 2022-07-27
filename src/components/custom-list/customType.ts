import { Table, TableColumn } from "element-ui"

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
}


export interface CustomDataSource {
    value: any[] | Object | Function,
    key: string,
    labelKey?: string
}

export interface CustomListColumn {
    prop: string,
    label: string,
    placeholder?: string,
    type: CustomListColumnType,
    canSearch?: Boolean,
    canAdd?: Boolean,
    canEdit?: Boolean,
    // 如果是select之类的
    dataSource?: CustomDataSource,
    /**
     * 多选
     */
    multiple?: Boolean,
    showInTable?: Boolean,
    tableConf?: TableColumn,
    //**参照formRule */
    formRule?: any[] | Function,
    height?: any,
    width?: any,
    dateFormat?: string,
    // 数值输入
    max?: number,
    min?: number,
    /**
     * 数值精度
     */
    precision?: number
}

export interface CustomListOperationItem {
    label: string,
    buttonType: 'success' | 'primary' | 'info' | 'danger' | 'warning',
    handle: Function
}

export interface CustomListConf {
    columns: CustomListColumn[],
    tableSelection?: Boolean,
    hideOperations?: Boolean,
    onLoadData: Function,
    onSave?: Function,
    onDelete?: Function,
    onExport?: Function,
    showExport?: Function,
    onTableSelectionChange?: Function,
    permissionAddMark?: string,
    permissionUpdateMark?: string,
    permissionDeleteMark?: string,
    permissionExportMark?: string,
    operations?: CustomListOperationItem[]
}