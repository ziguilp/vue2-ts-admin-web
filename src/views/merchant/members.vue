<template>
    <div>
        <custom-list :conf="config" ref="memberslist">
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
import { getMerchantMembers } from "@/api/merchant";
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
        (this.$refs.memberslist as any).refresh();
    }

    @Watch("merchantId")
    merchantIdChange() {
        (this.$refs.memberslist as any).refresh();
    }

    private config: CustomListConf = {
        columns: [
            // {
            //     type: CustomListColumnType.NUMBER,
            //     canSearch: false,
            //     canAdd: false,
            //     canEdit: false,
            //     showInTable: true,
            //     label: "序号",
            //     prop: "merchant_id",
            // },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "用户ID",
                prop: "user_id",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "用户昵称",
                prop: "user_info.nickname",
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "user_info.avatar",
                label: "图标",
                width: "60px",
                height: "60px",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.NUMBER,
                prop: "total",
                label: "订阅总数",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.NUMBER,
                showInTable: true,
                showInDetail: true,
                prop: "in_service_num",
                label: "服务中数量",
            },
            {
                type: CustomListColumnType.NUMBER,
                showInTable: true,
                showInDetail: true,
                prop: "expire_num",
                label: "已过期数量",
            },
            {
                type: CustomListColumnType.NUMBER,
                showInTable: true,
                showInDetail: true,
                prop: "destoryed_num",
                label: "转赠/退款数量",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getMerchantMembers({
                data: {
                    ...searchForm,
                    merchant_id: this.merchantId,
                    user_id: this.userId,
                },
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };
}
</script>
