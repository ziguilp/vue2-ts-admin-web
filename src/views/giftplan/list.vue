<template>
    <div>
        <custom-list :conf="config" ref="giftplanlist">
            <template slot="operations" scope="scope"> - </template>
        </custom-list>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { getGiftplanList, GiftPlan, GitfPlanStatus } from "@/api/giftplan";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "GiftPlanList",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    @Prop({
        type: Number,
    })
    merchant_id!: number;

    get merchantId() {
        return this.merchant_id || this.$route.query.merchantId || "";
    }

    @Watch("merchantId")
    merchantIdChange() {
        (this.$refs.giftplanlist as any).refresh();
    }

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
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "名称",
                prop: "name",
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "icon",
                label: "图标",
                width: "60px",
                height: "60px",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "original_price",
                label: "原价",
                showInTable: false,
                showInDetail: true,
                showFormatInTable: (row: GiftPlan) => {
                    return row.original_price.div(100).toFixed(2);
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "price",
                label: "售价",
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: GiftPlan) => {
                    return row.price.div(100).toFixed(2);
                },
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "intro",
                label: "详情",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "状态",
                prop: "status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "待发布",
                            value: GitfPlanStatus.DRAFT,
                        },
                        {
                            label: "发布",
                            value: GitfPlanStatus.SHOW,
                        },
                        {
                            label: "下架",
                            value: GitfPlanStatus.DESTORYED,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.TEXT,
                showInTable: true,
                showInDetail: true,
                prop: "subscribe_times",
                label: "订阅次数",
            },
            {
                type: CustomListColumnType.TEXT,
                showInTable: true,
                showInDetail: true,
                prop: "subscribe_users",
                label: "订阅人数",
            },
            {
                type: CustomListColumnType.TEXT,
                showInTable: true,
                showInDetail: true,
                prop: "remain_life_times",
                label: "剩余未完成的履约次数",
            },
            {
                type: CustomListColumnType.TEXT,
                showInTable: true,
                showInDetail: true,
                prop: "serving_ing",
                label: "履约中",
                showFormatInTable: (row: any) => {
                    return Number(row.serving_ing).add(
                        Number(row.serving_draft)
                    );
                },
            },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getGiftplanList({
                data: {
                    ...searchForm,
                    merchant_id: this.merchantId,
                },
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };
}
</script>
