<template>
    <div id="borroworders">
        <custom-list ref="list" :conf="config">
            <!-- <template slot="header-tools">
                <el-button
                    type="primary"
                    icon="el-icon-print"
                    @click="handlePrint"
                    >打印未发货订单</el-button
                >
            </template> -->
            <template slot="goods" scope="scope">
                <el-popover
                    placement="top-start"
                    title="书籍"
                    width="300"
                    trigger="click"
                    :content="booksContent(scope.row)"
                >
                    <el-button
                        slot="reference"
                        type="primary"
                        plain
                        size="small"
                        >共{{ scope.row.goods.length }}本,点击查看</el-button
                    >
                </el-popover>
            </template>
            <template slot="operations" scope="scope">
                <el-button
                    v-if="true"
                    type="text"
                    size="small"
                    @click="handleDetail(scope.row)"
                    >详情<el-divider direction="vertical"></el-divider>
                </el-button>

                <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    size="small"
                    @click="handleCancel(scope.row)"
                    >取消<el-divider direction="vertical"></el-divider>
                </el-button>

                <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    size="small"
                    @click="handlePrint(scope.row)"
                    >打印面单<el-divider direction="vertical"></el-divider>
                </el-button>

                <el-button
                    v-if="scope.row.status === 1"
                    type="text"
                    size="small"
                    @click="handleSendout(scope.row)"
                    >配送完成
                    <!-- <el-divider direction="vertical"></el-divider> -->
                </el-button>
            </template>
        </custom-list>

        <DetailVue ref="detail"></DetailVue>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { cancelOrder, OrderStatusConf } from "@/api/order";
import { IpageDataDto } from "@/api/types";
import DetailVue from "./components/borrowDetail.vue";
import printJS from "print-js";

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
                placeholder: "订单号/手机号/书籍名称/SKU编码/条码",
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
                label: "手机号",
                prop: "mobile",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "书籍数量",
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
                    value: OrderStatusConf,
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
                            label: "待配送",
                            value: "waitConfirm",
                        },
                        {
                            label: "待归还",
                            value: "waitReturn",
                        },
                        {
                            label: "已归还",
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
            // const data: any = await getBorrowOrderList({
            //     keyword: searchForm.keyword || "",
            //     status: searchForm.status_search || "",
            //     page: parseInt(String(idata.currentPage)),
            //     pageSize: idata.pageSize,
            // });
            // return data;
        },
    };

    private booksContent(row: any) {
        return row.goods
            .map((e: any) => {
                return `《${e.goods_name}》(${e.located || "未入库"})`;
            })
            .join("、");
    }

    private handleDetail(row: any) {
        (this.$refs.detail as DetailVue).init(row.order_sn);
    }

    private handleSendout(row: any) {
        this.$turboConfirm
            .confirm({
                type: "warning",
                title: "配送",
                content: "确定当前订单已配送吗？",
            })
            .then(async () => {
                // const res = await confirmOrder({ orderSn: row.order_sn });
                // if (res) {
                //     (this.$refs.list as any).refresh();
                // }
            })
            .catch((e) => {
                console.log("取消");
            });
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

    private async handlePrint(row: any) {
        // printJS({
        //     printable: "docs/printjs.pdf'",
        //     type: "pdf",
        //     header: "待发货",
        // });
        (this.$refs.detail as DetailVue).init(row.order_sn);
        setTimeout(() => {
            (this.$refs.detail as DetailVue).print();
        }, 1000);
    }
}
</script>
