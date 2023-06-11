<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-03 12:18:41
 * @FilePath      : /nls-admin/src/views/merchant/rechargelog.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <custom-list :conf="config" ref="merchantlist">
            <!-- <template slot="operations" scope="scope">
                <a></a>
            </template> -->
        </custom-list>

        <!-- <CustomForm ref="checkform" :conf="checkConf"></CustomForm> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    createMerchant,
    editMerchant,
    getMerchantList,
    getRechargeLog,
    MarketingMerchantStatus,
    MerchantInfo,
} from "@/api/merchant";
import CustomForm from "@/components/custom-list/editForm.vue";
import Recharge from "./components/recharge.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "MerchantList",
    components: {
        CustomForm,
        Recharge,
    },
})
export default class extends Vue {
    private config: CustomListConf = {
        hideOperations: true,
        columns: [
            // {
            //     type: CustomListColumnType.NUMBER,
            //     canSearch: false,
            //     canAdd: false,
            //     canEdit: false,
            //     showInTable: true,
            //     label: "序号",
            //     prop: "id",
            // },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "商户",
                prop: "merchant_id",
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "商户名称",
                canEdit: true,
                canSearch: true,
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.merchant?.name || "";
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "order_sn",
                label: "流水号",
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.payment_info?.third_order_sn || "";
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                prop: "amount",
                label: "充值金额",
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return Number(row.amount).div(100).toFixed(2);
                },
            },
            {
                type: CustomListColumnType.DATE_RANGER,
                prop: "timeRange",
                canSearch: true,
                label: "充值时间",
                showInTable: false,
            },
            // {
            //     type: CustomListColumnType.TEXT,
            //     prop: "license_no",
            //     label: "统一信用代码",
            //     showInTable: true,
            //     showInDetail: true,
            // },
            // {
            //     type: CustomListColumnType.IMAGES,
            //     prop: "qualifications",
            //     label: "资质照片",
            //     showInTable: false,
            //     showInDetail: true,
            // },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                showInDetail: true,
                label: "充值时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const pdata = { ...searchForm };
            if (searchForm.timeRange && searchForm.timeRange.length > 0) {
                pdata.date_created_start = searchForm.timeRange[0];
                if (searchForm.timeRange.length > 1) {
                    pdata.date_created_end = searchForm.timeRange[1];
                }
            }
            const data: any = await getRechargeLog({
                data: pdata,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private handleShowRecharge(row: any) {
        (this.$refs.recharge as Recharge).init(row);
    }
}
</script>
