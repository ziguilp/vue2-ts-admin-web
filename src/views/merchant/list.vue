<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-29 08:55:09
 * @FilePath      : /nls-admin/src/views/merchant/list.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <custom-list :conf="config" ref="merchantlist">
            <template slot="extbtns" scope="scope">
                <!-- <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.status === 0"
                    @click="handleShowCheckForm(scope.row)"
                    >审核 <el-divider direction="vertical"></el-divider
                ></el-button> -->

                <!-- <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowGiftPlans(scope.row)"
                    >营销活动 <el-divider direction="vertical"></el-divider
                ></el-button> -->

                <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowMembers(scope.row)"
                    >余额充值
                </el-button>
            </template>
        </custom-list>

        <!-- <CustomForm ref="checkform" :conf="checkConf"></CustomForm> -->

        <el-dialog
            width="1100px"
            :title="activeMerchant ? `${activeMerchant.name}的营销活动` : ''"
            :visible.sync="showMerchantGiftPlan"
        >
            <GiftPlanListVue
                :merchant_id="activeMerchant ? activeMerchant.id : 0"
            ></GiftPlanListVue>
        </el-dialog>
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
    MarketingMerchantStatus,
    MerchantInfo,
} from "@/api/merchant";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "MerchantList",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    private activeMerchant: any = null;
    private showMerchantGiftPlan = false;
    private showMembers = false;
    private config: CustomListConf = {
        permissionAddMark: "create_marketing_merchant",
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
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "账户ID",
                prop: "user_id",
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "名称",
                canEdit: true,
                canSearch: true,
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "logo",
                label: "头像",
                width: "60px",
                height: "60px",
                canEdit: true,
                showInTable: true,
                showInDetail: true,
            },
            // {
            //     type: CustomListColumnType.TEXTAREA,
            //     prop: "intro",
            //     label: "简介",
            //     showInTable: false,
            //     showInDetail: true,
            // },
            {
                type: CustomListColumnType.TEXT,
                prop: "contact_user",
                showInDetail: true,
                canEdit: true,
                label: "联系人",
                showInTable: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "contact_mobile",
                showInDetail: true,
                label: "联系电话",
                canEdit: true,
                canSearch: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "kefu_mobile",
                label: "客服电话",
                canSearch: false,
                canEdit: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "account_balance",
                label: "账户余额",
                showInDetail: false,
                canSearch: false,
                canEdit: false,
                showFormatInTable: (row: MerchantInfo) => {
                    return Number(row.account_balance).div(100).toFixed(2);
                },
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: this.$permission.can("toggleban_marketing_merchant"),
                showInTable: true,
                showInDetail: true,
                label: "状态",
                prop: "status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "封禁",
                            value: MarketingMerchantStatus.BAN,
                        },
                        {
                            label: "正常",
                            value: MarketingMerchantStatus.NORMAL,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: true,
                canEdit: this.$permission.isSuperAdmin(),
                showInTable: true,
                label: "充值服务费率[千分之](‰)",
                min: 0,
                max: 300,
                prop: "fee_rate",
            },
            // {
            //     type: CustomListColumnType.TEXT,
            //     prop: "license",
            //     label: "主体名称",
            //     showInDetail: true,
            // },
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
                label: "注册时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onSave: async (form: any) => {
            console.log("save", form);
            if (form.id) {
                return await editMerchant(form);
            } else {
                return await createMerchant(form);
            }
        },
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getMerchantList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private handleShowCheckForm(row: any) {
        (this.$refs.checkform as CustomForm).init({
            form: row,
            readonly: false,
        });
    }

    private handleShowGiftPlans(row: any) {
        this.showMerchantGiftPlan = true;
        this.activeMerchant = row;
    }

    private handleShowMembers(row: any) {
        this.showMembers = true;
        this.activeMerchant = row;
    }
}
</script>
