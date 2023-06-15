<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-06-15 10:32:26
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-15 12:47:16
 * @FilePath      : /nls-admin/src/views/marketing/activity/applylog.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <el-drawer
            ref="drawer"
            :title="title"
            :visible.sync="drawerShow"
            direction="rtl"
            :before-close="handleClose"
            size="900"
        >
            <div class="d-body-width">
                <custom-list :conf="config" ref="list">
                    <template slot="operations" scope="scope">
                        <!-- <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.status === 0"
                    @click="handleShowCheckForm(scope.row)"
                    >审核 <el-divider direction="vertical"></el-divider
                ></el-button> -->
                        <div></div>
                    </template>
                </custom-list>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { applyLog } from "@/api/activity";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";
import moment from "moment";
import Codes from "./code.vue";

@Component({
    name: "applylogList",
    components: {
        CustomForm,
        Codes,
    },
})
export default class extends Vue {
    private title: string = "";
    private user_id: string = "";
    private drawerShow: boolean = false;

    public init({ title, userId }: any) {
        this.drawerShow = true;
        // @ts-ignore
        this.user_id = userId;
        this.title = title;

        setTimeout(() => {
            (this.$refs.list as any).refresh();
        }, 100);
    }

    private getUserId() {
        return this.user_id;
    }

    private handleClose() {
        this.drawerShow = false;
    }

    private config: CustomListConf = {
        hideOperations: true,
        columns: [
            {
                type: CustomListColumnType.NUMBER,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: false,
                label: "序号",
                prop: "id",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "用户",
                prop: "user_id",
                showFormatInTable: (row: any) => {
                    return row.user_info.mobile || row.user_info.nickname;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "奖品",
                canEdit: false,
                canAdd: false,
                canSearch: false,
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    if (row.reward?.type == "wechat_red_package") {
                        return `${row.reward?.name}:微信现金红包：￥${Number(
                            row.reward.reward_amount
                        ).div(100)}`;
                    }
                    return row.reward?.name;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "main_image",
                label: "地址",
                width: "140px",
                height: "80px",
                canAdd: true,
                canEdit: true,
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.location?.address;
                },
            },
            // {
            //     type: CustomListColumnType.TEXTAREA,
            //     prop: "intro",
            //     label: "简介",
            //     showInTable: false,
            //     showInDetail: true,
            // },
            // {
            //     type: CustomListColumnType.SELECT,
            //     canSearch: true,
            //     canAdd: false,
            //     canEdit: true,
            //     showInTable: true,
            //     showInDetail: true,
            //     label: "类型",
            //     prop: "type",
            //     dataSource: {
            //         key: "value",
            //         labelKey: "label",
            //         value: [
            //             {
            //                 label: "抽奖",
            //                 value: MarketingActivityType.LOTTERY,
            //             },
            //         ],
            //     },
            // },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                showInDetail: true,
                label: "时间",
                prop: "date_applyed",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            console.log({
                loading: this.user_id,
            });
            if (!this.getUserId()) {
                return {
                    list: [],
                    total: 0,
                    currentPage: 1,
                    pageSize: 10,
                };
            }
            const data: any = await applyLog({
                data: {
                    ...searchForm,
                    user_id: this.getUserId(),
                },
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };
}
</script>