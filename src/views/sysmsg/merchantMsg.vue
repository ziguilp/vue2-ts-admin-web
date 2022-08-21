<template>
    <div>
        <custom-list :conf="config" ref="merchantlist">
            <template slot="extbtns" scope="scope">
                <el-button
                    type="text"
                    size="small"
                    v-if="scope.row.status === 0"
                    @click="handleShowCheckForm(scope.row)"
                    >审核 <el-divider direction="vertical"></el-divider
                ></el-button>
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

        <el-dialog
            width="1100px"
            :title="activeMerchant ? `${activeMerchant.name}会员` : ''"
            :visible.sync="showMembers"
        >
            <MembersVue
                :merchant_id="activeMerchant ? activeMerchant.id : 0"
            ></MembersVue>
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
    checkMerchantMsg,
    getMerchantMsgList,
    MsgStatusConf,
} from "@/api/sysmsg";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "MerchantMsgList",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    private activeMerchant: any = null;
    private showMerchantGiftPlan: boolean = false;
    private showMembers: boolean = false;
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
                showInTable: true,
                label: "商户",
                prop: "merchant_info.name",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                label: "标题",
                prop: "title",
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "content",
                label: "内容",
                showInTable: true,
                showInDetail: true,
                showFormatInTable: (row: any) => {
                    return row.content.slice(0, 10) + "...";
                },
            },
            {
                type: CustomListColumnType.IMAGES,
                prop: "images",
                label: "图片",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "审核状态",
                prop: "status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: MsgStatusConf,
                },
            },
            {
                type: CustomListColumnType.TEXT,
                prop: "check_result",
                label: "审核结果",
                showInDetail: true,
                showInTable: false,
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getMerchantMsgList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            data.list = data.list.map((e: any) => {
                e.images = e.medias
                    .filter((i: any) => i.type == "image")
                    .map((it: any) => it.url);
                return e;
            });
            return data;
        },
    };

    private checkConf: CustomListConf = {
        forminline: false,
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
                showInTable: true,
                showInDetail: false,
                label: "商户",
                prop: "merchant_info.name",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                showInTable: true,
                showInDetail: true,
                label: "标题",
                prop: "title",
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "content",
                label: "内容",
                showInTable: false,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.IMAGES,
                prop: "images",
                label: "图片",
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: true,
                canAdd: false,
                canEdit: true,
                showInTable: true,
                label: "审核结果",
                prop: "status",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: MsgStatusConf,
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
            if (form.status === 0) {
                this.$message.error(`请选择审核结果`);
                throw new Error(`请选择审核结果`);
            } else if (form.status === 2) {
                this.$message.error(`请输入审核未通过原因`);
                if (!form.check_result) {
                    throw new Error(`请输入审核未通过原因`);
                }
            } else {
                form.check_result = "审核通过";
            }

            const res = await checkMerchantMsg({
                msgId: form.id,
                status: form.status,
                check_result: form.check_result,
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
}
</script>
