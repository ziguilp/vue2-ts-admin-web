<template>
    <div>
        <custom-list ref="pagelist" :conf="config"> </custom-list>
    </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    getCmsPageList,
    getCmsContentList,
    savePage,
    saveContent,
} from "@/api/cms";
import { IpageDataDto } from "@/api/types";
import { nextTick } from "process";

@Component({
    name: "CmsPage",
    components: {},
})
export default class extends Vue {
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "序号",
                prop: "id",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: true,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "名称",
                prop: "name",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "链接",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                prop: "link",
            },
            {
                type: CustomListColumnType.DATE,
                label: "添加时间",
                prop: "date_created",
                showInTable: true,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                formRule: [],
                dateFormat: "YYYY-MM-DD HH:mm:ss",
            },
        ],
        tableSelection: false,
        async onLoadData(searchForm: any, idata: IpageDataDto<any>) {
            const data = await getCmsPageList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
        async onSave(form: any) {
            const res = await savePage({
                ...form,
            });
            return res;
        },
    };
}
</script>
