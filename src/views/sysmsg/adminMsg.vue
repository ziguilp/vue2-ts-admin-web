<template>
    <div>
        <custom-list :conf="config" ref="merchantlist">
            <template slot="content" scope="scope">
                <el-popover
                    placement="top-start"
                    title="内容"
                    width="300"
                    trigger="click"
                    :content="scope.row.content"
                >
                    <el-tag slot="reference" type="primary" plain size="small"
                        >{{ scope.row.content.slice(0, 10) }}...</el-tag
                    >
                </el-popover>
            </template>
            <template slot="operations">
                <div></div>
            </template>
        </custom-list>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    adminSendMsg,
    checkMerchantMsg,
    getAdminSendMsgList,
    getMerchantMsgList,
    MsgStatusConf,
} from "@/api/sysmsg";
import CustomForm from "@/components/custom-list/editForm.vue";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "AdminMsgList",
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
                label: "消息批次号",
                prop: "msg_no",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: true,
                canEdit: false,
                showInTable: true,
                label: "标题",
                prop: "title",
            },
            {
                type: CustomListColumnType.TEXTAREA,
                prop: "content",
                label: "内容",
                canAdd: true,
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
                canAdd: true,
                max: 9,
                showInTable: true,
                showInDetail: true,
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: false,
                canAdd: true,
                canEdit: false,
                showInTable: false,
                showInDetail: false,
                label: "接收人",
                prop: "receiver",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        { label: "所有商户", value: "MERCHANT" },
                        { label: "所有用户", value: "ALL_MEMBERS" },
                        { label: "所有会员", value: "VIP_MEMBERS" },
                        { label: "所有非会员", value: "NO_VIP_MEMBERS" },
                    ],
                },
            },
        ],
        tableSelection: false,
        onSave: async (form: any) => {
            console.log(`saveForm`, form);
            // adminSendMsg
            return await adminSendMsg({
                title: form.title,
                content: form.content,
                medias: form.images.map((e: string) => {
                    return {
                        type: "image",
                        url: e,
                    };
                }),
                receiver: form.receiver,
            });
        },
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getAdminSendMsgList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            data.list = data.list.map((e: any) => {
                e.images = (e.medias || [])
                    .filter((i: any) => i.type == "image")
                    .map((it: any) => it.url);
                return e;
            });
            return data;
        },
    };
}
</script>
