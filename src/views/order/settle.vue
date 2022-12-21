<template>
    <div>
        <custom-list ref="list" :conf="config">
            <template slot="operations" scope="scope">
                <el-button
                    v-if="true"
                    type="text"
                    size="small"
                    @click="handleDetail(scope.row)"
                    >{{
                        scope.row.status === 0
                            ? "审核"
                            : scope.row.status === 1
                            ? "确认打款"
                            : "详情"
                    }}
                    <!-- <el-divider direction="vertical"></el-divider> -->
                </el-button>
            </template>
        </custom-list>

        <DetailVue ref="detail" @refresh="refresh"></DetailVue>
    </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    getSettleList,
    MerchantSettleStatus,
    SettleStatusConf,
} from "@/api/settle";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";
import DetailVue from "./components/settleDetail.vue";
@Component({
    name: "SettleLog",
    components: {
        DetailVue,
    },
})
export default class extends Vue {
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                label: "商户",
                canSearch: false,
                showInTable: true,
                canAdd: false,
                canEdit: false,
                prop: "merchant_info.name",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "结算号",
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "settle_no",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "结算账户",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "account_no",
                showFormatInTable: (row: any) => {
                    return `${row.bank}:${row.account_name}:${row.account_no}`;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                label: "结算金额",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "settle_amount",
                showFormatInTable: (row: any) => {
                    return Number(row.settle_amount).div(100).toFixed(2);
                },
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
                    value: SettleStatusConf,
                },
            },
            {
                type: CustomListColumnType.DATE,
                dateFormat: "YYYY-MM-DD HH:mm:ss",
                prop: "date_created",
                label: "时间",
                canAdd: false,
                canEdit: false,
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getSettleList({
                data: searchForm,
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private handleDetail(row: any) {
        (this.$refs.detail as DetailVue).init(row.settle_no);
    }

    private refresh() {
        (this.$refs.list as any).refresh(false);
    }
}
</script>
