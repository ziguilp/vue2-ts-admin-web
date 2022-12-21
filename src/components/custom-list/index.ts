/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2022-12-13 22:00:56
 * @FilePath      : /adminweb/src/components/custom-list/index.ts
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import CustomList from './list.vue';

export default {
    install: (Vue: any) => {
        Vue.component('CustomList', CustomList)
    }
}
