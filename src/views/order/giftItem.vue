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
                    title="服务内容"
                    width="300"
                    trigger="click"
                >
                    <div>
                        <p>
                            <li
                                v-for="(vo, i) in scope.row.order_goods[0]
                                    .goods_info.gift_plan_detail"
                            >
                                {{ vo }}
                            </li>
                        </p>
                    </div>
                    <el-button
                        slot="reference"
                        type="primary"
                        plain
                        size="small"
                        >{{
                            scope.row.order_goods[0].goods_info.gift_plan_name
                        }}({{ scope.row.order_goods[0].goods_info.rank }}/{{
                            scope.row.order_goods[0].goods_info
                                .subscribe_life_times
                        }})</el-button
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
import {
    getOrderList,
    cancelOrder,
    OrderStatusConf,
    OrderType,
    OrderDeliveryStatus,
    OrderDeliveryStatusConf,
    OrderGiftStatusConf,
} from "@/api/order";
import { IpageDataDto } from "@/api/types";
import DetailVue from "./components/giftItemDetail.vue";
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
                label: "订单号",
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "order_sn",
            },
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
                label: "手机号",
                canSearch: true,
                showInTable: false,
                canAdd: false,
                canEdit: false,
                prop: "mobile",
            },
            {
                type: CustomListColumnType.TEXT,
                label: "用户ID",
                canSearch: false,
                canAdd: false,
                canEdit: false,
                prop: "user_id",
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "收件人",
                prop: "mobile",
                showFormatInTable: (row: any) => {
                    const od = row.order_delivery;
                    if (!od) return "";
                    return `${od.name}/${od.mobile}/${od.province}${od.city}${od.area}${od.detail}`;
                },
            },
            {
                type: CustomListColumnType.TEXT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "会员礼",
                prop: "goods",
            },
            {
                type: CustomListColumnType.SELECT,
                canSearch: false,
                canAdd: false,
                canEdit: false,
                label: "服务状态",
                prop: "order_goods.0.status",
                dataSource: {
                    key: "value",
                    value: OrderGiftStatusConf,
                },
            },
            {
                type: CustomListColumnType.SELECT,
                label: "物流状态",
                showInTable: true,
                canSearch: true,
                canAdd: false,
                canEdit: false,
                prop: "order_delivery.status",
                dataSource: {
                    key: "value",
                    value: OrderDeliveryStatusConf,
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
            const data: any = await getOrderList({
                data: {
                    ...searchForm,
                    order_type: OrderType.GIFTS,
                },
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
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
