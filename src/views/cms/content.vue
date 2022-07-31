<template>
    <div>
        <custom-list ref="pagelist" :conf="config">
            <template slot="extbtns" scope="scope">
                <el-button
                    type="text"
                    v-if="scope.row.content"
                    size="small"
                    @click="handelShowInNextTab(scope.row)"
                >
                    预览
                </el-button>
            </template>
        </custom-list>
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
    CmsContent,
} from "@/api/cms";
import { IpageDataDto } from "@/api/types";
import { nextTick } from "process";

@Component({
    name: "CmsContent",
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
                type: CustomListColumnType.SELECT,
                label: "页面",
                canSearch: true,
                canAdd: true,
                canEdit: true,
                showInTable: false,
                prop: "page_id",
                multiple: false,
                formRule: [{ required: true }],
                dataSource: {
                    value: async () => {
                        return (
                            await getCmsPageList({
                                page: 1,
                                pageSize: 100,
                            })
                        ).list;
                    },
                    key: "id",
                    labelKey: "name",
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "cmsPage",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "页面",
                showFormatInTable: (v: any) => {
                    return v.name;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                label: "标题",
                canSearch: true,
                canAdd: true,
                canEdit: true,
                prop: "title",
                formRule: [{ required: true }],
            },
            {
                type: CustomListColumnType.IMAGE,
                label: "封面",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                prop: "image",
            },
            {
                type: CustomListColumnType.RICHTEXT,
                label: "内容",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInTable: false,
                prop: "content",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: true,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "别名",
                prop: "alias",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "位置",
                canSearch: true,
                canAdd: true,
                canEdit: true,
                prop: "position",
                formRule: [{ required: true }],
            },
            {
                type: CustomListColumnType.DATETIME_RANGER,
                label: "展示时间",
                prop: "date_show_ranger",
                showInTable: true,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                formRule: [{ required: true }],
                dateFormat: "YYYY-MM-DD HH:mm:ss",
            },
        ],
        tableSelection: false,
        async onLoadData(searchForm: any, idata: IpageDataDto<CmsContent>) {
            const data = await getCmsContentList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });

            data.list = data.list.map((e: any) => {
                e.date_show_ranger = [
                    new Date(e.date_show_start),
                    new Date(e.date_show_end),
                ];
                return e;
            });

            return data;
        },
        async onSave(form: any) {
            const timeRange = form.date_show_ranger;

            const res = await saveContent({
                ...form,
                date_show_start: timeRange[0],
                date_show_end: timeRange[1],
            });
            return res;
        },
    };

    handelShowInNextTab(row: CmsContent) {
        if (!row.alias) {
            return this.$message.error("未设置别名");
        }
        window.open("/cms/detail/" + row.alias);
    }
}
</script>
