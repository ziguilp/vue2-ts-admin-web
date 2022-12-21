/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-13 16:21:00
 * @FilePath      : /adminweb/src/settings.ts
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
 */
interface ISettings {
    title: string // Overrides the default title
    showSettings: boolean // Controls settings panel display
    showTagsView: boolean // Controls tagsview display
    showSidebarLogo: boolean // Controls siderbar logo display
    fixedHeader: boolean // If true, will fix the header component
    errorLog: string[] // The env to enable the errorlog component, default 'production' only
    sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
    devServerPort: number // Port number for webpack-dev-server
    mockServerPort: number // Port number for mock server
    uploadDir: string
}

// You can customize below settings :)
const settings: ISettings = {
    title: '管理系统',
    showSettings: false,
    showTagsView: true,
    fixedHeader: false,
    showSidebarLogo: true,
    errorLog: ['production'],
    sidebarTextTheme: true,
    devServerPort: 9527,
    mockServerPort: 9528,
    uploadDir: 'adminweb'
}

export default settings
