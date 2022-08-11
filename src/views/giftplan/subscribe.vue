<template>
    <div>
        <custom-list :conf="config" ref="giftplanlist">
            <template slot="intro" scope="scope">
                <el-popover
                    placement="top-start"
                    :title="scope.row.gift_plan_name"
                    width="200"
                    style="cursor: pointer"
                    trigger="click"
                >
                    <div>
                        <p>订阅商户:{{ `${scope.row.merchant_info.name}` }}</p>
                        <p>有效期:{{ `${scope.row.gift_plan_life_days}` }}天</p>
                        <p>总次数:{{ `${scope.row.gift_plan_life_time}` }}</p>
                        <p>
                            履约周期:{{ `${scope.row.gift_plan_cycle}` }}天/次
                        </p>
                        <p>
                            服务内容:
                            <li v-for="(vo, i) in scope.row.gift_plan_detail">
                                {{ vo }}
                            </li>
                        </p>
                    </div>
                    <el-tag slot="reference">{{
                        scope.row.gift_plan_name
                    }}</el-tag>
                </el-popover>
            </template>
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
import {
    getGiftplanSubscribeList,
    GiftPlan,
    GiftSubscribeStatus,
    GitfPlanStatus,
    GitfPlanSubscribeSource,
} from "@/api/giftplan";
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

    @Prop({
        type: String,
    })
    user_id!: string;

    get merchantId() {
        return this.merchant_id || this.$route.query.merchantId || "";
    }

    get userId() {
        return this.user_id || this.$route.query.userId || "";
    }

    @Watch("userId")
    userIdChange() {
        (this.$refs.giftplanlist as any).refresh();
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
                prop: "gift_plan_subscribe_id",
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "gift_plan_icon",
                label: "图标",
                width: "60px",
                height: "60px",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "gift_plan_price",
                label: "售价",
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.gift_plan_price.div(100).toFixed(2);
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
                prop: "source",
                label: "来源",
                showInTable: true,
                showInDetail: true,
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "购买",
                            value: GitfPlanSubscribeSource.PURCHASE,
                        },
                        {
                            label: "被赠送",
                            value: GitfPlanSubscribeSource.TRANSFERED,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "状态",
                prop: "gift_plan_subscribe_status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "锁定中",
                            value: GiftSubscribeStatus.LOCKED,
                        },
                        {
                            label: "生效中",
                            value: GiftSubscribeStatus.NORMAL,
                        },
                        {
                            label: "已失效",
                            value: GiftSubscribeStatus.DESTORYED,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.TEXT,
                showInTable: true,
                showInDetail: true,
                prop: "remain_life_times",
                label: "剩余次数",
            },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "过期时间",
                prop: "date_expire",
            },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "生效时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getGiftplanSubscribeList({
                data: {
                    ...searchForm,
                    merchant_id: this.merchantId,
                    user_id: this.userId,
                },
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            // data.list = data.list.map((e: any) => {});
            return data;
        },
    };
}
</script>
