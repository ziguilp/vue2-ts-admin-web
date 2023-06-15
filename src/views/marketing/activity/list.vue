<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 18:03:01
 * @FilePath      : /nls-admin/src/views/activity/list.vue
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

                <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowCodes(scope.row)"
                    >活动码管理
                </el-button>

                <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowRewards(scope.row)"
                    >活动奖品
                </el-button>
            </template>
        </custom-list>
        <Reward ref="rewardRef"></Reward>
        <Codes ref="codesRef"></Codes>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    getAcivityList,
    createActivity,
    MarketingActivityStatus,
    ActivityInfo,
    MarketingActivityType,
    editActivity,
} from "@/api/activity";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";
import moment from "moment";
import Reward from "./reward.vue";
import Codes from "./code.vue";

@Component({
    name: "ActivityList",
    components: {
        CustomForm,
        Reward,
        Codes,
    },
})
export default class extends Vue {
    private activeMerchant: any = null;
    private showMerchantGiftPlan = false;
    private showMembers = false;
    private config: CustomListConf = {
        permissionAddMark: "add_activity",
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
                label: "商户ID",
                prop: "merchant_id",
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "名称",
                canEdit: true,
                canAdd: true,
                canSearch: true,
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "logo",
                label: "活动LOGO",
                width: "60px",
                height: "60px",
                canAdd: true,
                canEdit: true,
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "main_image",
                label: "宣发图",
                width: "140px",
                height: "80px",
                canAdd: true,
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
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                showInDetail: true,
                label: "类型",
                prop: "type",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "抽奖",
                            value: MarketingActivityType.LOTTERY,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.RICHTEXT,
                prop: "rule",
                label: "活动规则",
                canAdd: true,
                canEdit: true,
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.DATETIME,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "开始时间",
                prop: "date_start",
            },
            {
                type: CustomListColumnType.DATETIME,
                canSearch: false,
                canAdd: true,
                canEdit: true,
                showInTable: true,
                label: "结束时间",
                prop: "date_end",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "附言",
                prop: "remark",
                canAdd: true,
                canEdit: true,
                showInTable: false,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                showInDetail: true,
                label: "状态",
                prop: "status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "活动停止",
                            value: MarketingActivityStatus.BAN,
                        },
                        {
                            label: "正常进行",
                            value: MarketingActivityStatus.NORMAL,
                        },
                    ],
                },
                showFormatInTable: (row: ActivityInfo) => {
                    const now = moment().unix();
                    if (moment(row.date_start).unix() > now) {
                        return `未开始`;
                    }
                    if (moment(row.date_end).unix() < now) {
                        return `已结束`;
                    }
                    return MarketingActivityStatus.BAN === row.status
                        ? "活动停止"
                        : "正常进行";
                },
            },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                showInDetail: true,
                label: "创建时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onSave: async (form: any) => {
            if (form.id) {
                return await editActivity(form);
            } else {
                form.type = MarketingActivityType.LOTTERY;
                return await createActivity(form);
            }
        },
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getAcivityList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private handleShowRewards(row: ActivityInfo) {
        const ele = this.$refs.rewardRef as Reward;
        ele.init(row);
    }

    private handleShowCodes(row: ActivityInfo) {
        const ele = this.$refs.codesRef as Codes;
        ele.init(row);
    }
}
</script>
