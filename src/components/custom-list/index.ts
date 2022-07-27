import Vue from 'vue';
import { CustomListConf } from './customType';
import CustomList from './list.vue'

export default {
    install: (Vue: any) => {
        Vue.component(`CustomList`, CustomList);
    }
}
