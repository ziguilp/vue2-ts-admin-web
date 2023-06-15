<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-15 08:42:42
 * @FilePath      : /nls-admin/src/views/marketing/agent/list.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <custom-list :conf="config" ref="agentlist">
            <template slot="extbtns" scope="scope">
                <!-- <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowRecharge(scope.row)"
                    >余额充值
                </el-button> -->

                <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="showQrcode(scope.row)"
                    >二维码</el-button
                >
            </template>
        </custom-list>

        <Qrcode ref="qrcode" title.sync="店主二维码"></Qrcode>

        <!-- <CustomForm ref="checkform" :conf="checkConf"></CustomForm> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { AgentInfo, getAgentList, MarketingAgentStatus } from "@/api/agent";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";
import Qrcode from "./components/qrcode.vue";

@Component({
    name: "agentlist",
    components: {
        CustomForm,
        // Recharge,
        Qrcode,
    },
})
export default class extends Vue {
    private qrcodeDrawer = false;
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
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "门店名称",
                prop: "name",
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "contact_user",
                label: "联系人和联系方式",
                canAdd: false,
                canEdit: false,
                canSearch: false,
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: AgentInfo) => {
                    return `${row.contact_user}:${row.contact_mobile}`;
                },
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
                prop: "address",
                label: "地址",
                canAdd: true,
                canEdit: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                // canEdit: this.$permission.can("toggleban_marketing_merchant"),
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
                            value: MarketingAgentStatus.BAN,
                        },
                        {
                            label: "正常",
                            value: MarketingAgentStatus.NORMAL,
                        },
                    ],
                },
            },

            {
                type: CustomListColumnType.TEXT,
                prop: "remark",
                label: "备注",
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInDetail: true,
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
                prop: "date_reg",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getAgentList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private handleShowRecharge(row: any) {
        // (this.$refs.recharge as Recharge).init(row);
    }

    private showQrcode(row: AgentInfo) {
        // @ts-ignore
        this.$refs.qrcode.init(row);
    }
}
</script>
