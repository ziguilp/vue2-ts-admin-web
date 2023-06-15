<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-15 12:14:06
 * @FilePath      : /nls-admin/src/views/user/list.vue
 * @Description   : 
 * 
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <custom-list ref="customList" :conf="config">
            <template slot="operations" scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="handleShowApplyLog(scope.row)"
                    >查看中奖记录</el-button
                >
            </template>
        </custom-list>
        <apply-log ref="applylog"></apply-log>
    </div>
</template>

<script lang="ts">
import {
    createAdmin,
    getOperateLog,
    getAdminList,
    getUserList,
    applyRefundDeposit,
} from "@/api/users";
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { getRoleList } from "@/api/role";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";
// @ts-ignore
import applyLog from "@/views/marketing/activity/applylog";

@Component({
    name: "AdminList",
    components: {
        applyLog,
    },
})
export default class extends Vue {
    private activeUser: any = null;
    private showSubscribe = false;
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                label: "昵称",
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "nickname",
                formRule: [
                    {
                        required: true,
                        message: "请填写昵称",
                        trigger: ["blur", "change"],
                    },
                ],
            },
            {
                type: CustomListColumnType.IMAGE,
                label: "头像",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "avatar",
                height: "60px",
                width: "60px",
                formRule: [],
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: true,
                canAdd: false,
                canEdit: false,
                label: "手机号",
                prop: "mobile",
                formRule: [
                    {
                        validator: (
                            rule: any,
                            val: any,
                            callback: Function
                        ) => {
                            if (!val) {
                                callback(new Error("请输入手机号"));
                            } else {
                                if (!isMobile(val)) {
                                    return callback(new Error("手机号无效"));
                                }
                                callback();
                            }
                        },
                        message: "请填写手机号",
                        trigger: "blur",
                    },
                ],
            },
            {
                type: CustomListColumnType.SELECT,
                label: "状态",
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "status",
                dataSource: {
                    key: "value",
                    value: [
                        {
                            label: "禁用",
                            value: "locked",
                        },
                        {
                            label: "正常",
                            value: "normal",
                        },
                    ],
                },
            },
            // {
            //     type: CustomListColumnType.TEXT,
            //     prop: "deposit_amount",
            //     label: "押金余额",
            // },
            // {
            //     type: CustomListColumnType.DATE,
            //     dateFormat: "YYYY-MM-DD HH:mm:ss",
            //     prop: "vip_expire_time",
            //     label: "会员到期时间",
            //     canAdd: false,
            //     canEdit: false,
            // },
            {
                type: CustomListColumnType.DATE,
                dateFormat: "YYYY-MM-DD HH:mm:ss",
                prop: "date_created",
                label: "注册时间",
                canAdd: false,
                canEdit: false,
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getUserList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            data.list.map((d: any) => {
                d.ctest = [];
                return d;
            });
            return data;
        },
    };

    private handleShowApplyLog(row: any) {
        // @ts-ignore
        this.$refs.applylog.init({
            title: `${row.nickname}的中奖记录`,
            userId: row.id,
        });
    }
}
</script>
