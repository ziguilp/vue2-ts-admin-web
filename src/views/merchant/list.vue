<template>
    <div>
        <custom-list :conf="config" ref="merchantlist">
            <template slot="extbtns" scope="scope">
                <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.check_status === 0"
                    @click="handleShowCheckForm(scope.row)"
                    >审核 <el-divider direction="vertical"></el-divider
                ></el-button>

                <el-popover
                    placement="top-start"
                    :title="`${scope.row.name} 登录账号`"
                    width="200"
                    trigger="click"
                >
                    <div style="display: flex; flex-direction: column">
                        <p>{{ `ID:${scope.row.user_info.id}` }}</p>
                        <p>{{ `昵称:${scope.row.user_info.nickname}` }}</p>
                        <p>{{ `手机:${scope.row.user_info.mobile}` }}</p>
                        <p>{{ `邮箱:${scope.row.user_info.email}` }}</p>
                    </div>
                    <el-button slot="reference" type="text" size="small"
                        >查看登录账号
                        <el-divider direction="vertical"></el-divider
                    ></el-button>
                </el-popover>

                <el-button
                    slot="reference"
                    type="text"
                    size="small"
                    @click="handleShowGiftPlans(scope.row)"
                    >会员礼 <el-divider direction="vertical"></el-divider
                ></el-button>

                <el-button slot="reference" type="text" size="small"
                    >查看会员
                </el-button>
            </template>
        </custom-list>

        <CustomForm ref="checkform" :conf="checkConf"></CustomForm>

        <el-dialog
            width="1100px"
            :title="activeMerchant ? `${activeMerchant.name}会员礼` : ''"
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
    getMerchantList,
    merchantBan,
    merchantCheck,
    MerchantInfoCheckStatus,
    MerchantInfoOnlineStatus,
} from "@/api/merchant";
import CustomForm from "@/components/custom-list/editForm.vue";
import GiftPlanListVue from "../giftplan/list.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "MerchantList",
    components: {
        CustomForm,
        GiftPlanListVue,
    },
})
export default class extends Vue {
    private activeMerchant: any = null;
    private showMerchantGiftPlan: boolean = false;
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
                label: "绑定的用户ID",
                prop: "bind_user_id",
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "商户名称",
                canSearch: true,
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "image",
                label: "头像",
                width: "60px",
                height: "60px",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "intro",
                label: "简介",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "address",
                label: "地址",
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.province + row.city + row.area + row.address;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "location_lng",
                label: "经纬度",
                showInTable: false,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "mobile",
                label: "联系电话",
                canSearch: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "wechat",
                label: "微信号",
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "审核状态",
                prop: "check_status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "待审核",
                            value: MerchantInfoCheckStatus.WAIT_CHECK,
                        },
                        {
                            label: "审核通过",
                            value: MerchantInfoCheckStatus.CHECK_SUCCESS,
                        },
                        {
                            label: "审核未通过",
                            value: MerchantInfoCheckStatus.CHECK_FAILED,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "check_result",
                label: "审核结果",
                showInDetail: true,
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
                            label: "下线",
                            value: MerchantInfoOnlineStatus.OFFLINE,
                        },
                        {
                            label: "在线",
                            value: MerchantInfoOnlineStatus.ONLINE,
                        },
                        {
                            label: "封禁",
                            value: MerchantInfoOnlineStatus.BAN,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "master",
                label: "法人代表姓名",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "master_idcard",
                label: "法人代表身份证号码",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGES,
                prop: "master_idcard_images",
                label: "法人代表身份证",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "contact",
                label: "联系人",
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGE,
                prop: "contact_avatar",
                label: "联系人头像",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "contact_explain",
                label: "联系人介绍",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "license",
                label: "主体名称",
                showInDetail: true,
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "license_no",
                label: "统一信用代码",
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGES,
                prop: "qualifications",
                label: "资质照片",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.DATE,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "注册时间",
                prop: "date_created",
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getMerchantList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private checkConf: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                prop: "name",
                label: "商户名称",
                canAdd: false,
                canEdit: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "审核结果",
                prop: "check_status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "待审核",
                            value: MerchantInfoCheckStatus.WAIT_CHECK,
                        },
                        {
                            label: "审核通过",
                            value: MerchantInfoCheckStatus.CHECK_SUCCESS,
                        },
                        {
                            label: "审核未通过",
                            value: MerchantInfoCheckStatus.CHECK_FAILED,
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "check_result",
                label: "原因",
                canEdit: true,
                showInDetail: true,
                showInTable: false,
            },
        ],
        onLoadData: () => {},
        onSave: async (form: any) => {
            console.log(`审核`, form);
            if (form.check_status === MerchantInfoCheckStatus.WAIT_CHECK) {
                this.$message.error(`请选择审核结果`);
                throw new Error(`请选择审核结果`);
            }
            if (form.check_status === MerchantInfoCheckStatus.CHECK_FAILED) {
                this.$message.error(`请输入审核未通过原因`);
                if (!form.check_result) {
                    throw new Error(`请输入审核未通过原因`);
                }
            }

            const res = await merchantCheck({
                merchantId: form.id,
                checkStatus: form.check_status,
                reason: form.check_result,
            });

            if (res) {
                (this.$refs.merchantlist as any).refresh();
            }

            return res;
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
}
</script>
