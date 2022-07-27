<template>
    <div>
        <custom-list ref="list" :conf="config">
            <template slot="goods" scope="scope">
                {{ booksContent(scope.row) }}
            </template>
            <template slot="operations" scope="scope">
                <el-button
                    v-if="true"
                    type="text"
                    size="small"
                    @click="handleDetail(scope.row)"
                    >详情<el-divider direction="vertical"></el-divider>
                </el-button>

                <!-- <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    size="small"
                    @click="handleCancel(scope.row)"
                    >取消<el-divider direction="vertical"></el-divider>
                </el-button> -->
            </template>
        </custom-list>

        <DetailVue ref="detail"></DetailVue>
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
    cancelOrder,
    confirmOrder,
    getBorrowOrderList,
    OrderStatusConf,
    VipcardOrderStatusConf,
} from "@/api/order";
import { getVipcardOrderList } from "@/api/vipcard";
import { isMobile } from "@/utils/validate";
import { IpageDataDto } from "@/api/types";
import DetailVue from "./components/vipcardDetail.vue";
@Component({
    name: "BorrowOrder",
    components: {
        DetailVue,
    },
})
export default class extends Vue {
    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                label: "检索词",
                canSearch: true,
                showInTable: false,
                canAdd: false,
                canEdit: false,
                placeholder: "订单号/手机号",
                prop: "keyword",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "订单号",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "order_sn",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "用户",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "nickname",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "订单内容",
                prop: "goods",
            },
            {
                type: CustomListColumnType.SELECT,
                label: "状态",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "status",
                dataSource: {
                    key: "value",
                    value: VipcardOrderStatusConf,
                },
            },
            {
                type: CustomListColumnType.SELECT,
                label: "状态",
                showInTable: false,
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "status_search",
                dataSource: {
                    key: "value",
                    value: [
                        {
                            label: "待支付",
                            value: "waitConfirm",
                        },
                        {
                            label: "已支付",
                            value: "done",
                        },
                    ],
                },
            },
            {
                type: CustomListColumnType.DATE,
                dateFormat: "YYYY-MM-DD HH:mm:ss",
                prop: "date_created",
                label: "下单时间",
                canAdd: false,
                canEdit: false,
            },
        ],
        tableSelection: false,
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            const data: any = await getVipcardOrderList({
                keyword: searchForm.keyword || "",
                status: searchForm.status_search || "",
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };

    private booksContent(row: any) {
        return row.goods
            .map((e: any) => {
                return `${e.goods_name}`;
            })
            .join("、");
    }

    private handleDetail(row: any) {
        (this.$refs.detail as DetailVue).init(row.order_sn);
    }

    private handleCancel(row: any) {
        this.$turboConfirm
            .confirm({
                type: "warning",
                title: "取消",
                content: "确定要取消当前订单吗？",
            })
            .then(async () => {
                const res = await cancelOrder({ orderSn: row.order_sn });
                if (res) {
                    (this.$refs.list as any).refresh();
                }
            })
            .catch((e) => {
                console.log("取消");
            });
    }

    private async handlePrint() {}
}
</script>
