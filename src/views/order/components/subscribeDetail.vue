<template>
    <el-dialog :title="title" :visible.sync="showDetail" width="800px">
        <div class="order-body">
            <div class="order-info" v-if="detail && detail.order_sn">
                <span>
                    <label class="">订单号:</label>
                    <label>{{ detail.order_sn }}</label>
                </span>

                <span>
                    <label class="">订单金额:</label>
                    <label>{{ detail.rmbYuan.total_amount }}</label>
                </span>

                <span>
                    <label class="">用户昵称:</label>
                    <label>{{ detail.nickname }}</label>
                </span>

                <span>
                    <label class="">下单时间:</label>
                    <label>{{ detail.date_created_text }}</label>
                </span>

                <span>
                    <label class="">联系电话:</label>
                    <label>{{ detail.mobile }}</label>
                </span>
                <span class="address">
                    <label class="">地址:</label>
                    <label
                        >{{ detail.od_province }}{{ detail.od_city
                        }}{{ detail.od_area }}{{ detail.od_detail }}</label
                    >
                </span>
            </div>
            <div class="goods-list">
                <el-table
                    :data="detail.goods"
                    height="250"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <!-- <el-table-column
                        type="selection"
                        width="55"
                        :selectable="selectable"
                    >
                    </el-table-column> -->
                    <el-table-column
                        label="商品"
                        prop="goods_info.name"
                    ></el-table-column>
                    <el-table-column label="图片" prop="goods_info.icon">
                        <template slot-scope="scope">
                            <el-image
                                style="height: 90px; width: 60px"
                                :src="scope.row.goods_info.icon"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订单金额"
                        prop="rmbYuan.total_amount"
                    ></el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template slot-scope="scope">
                            <el-tag :type="formatEnum(scope.row.status).type">{{
                                formatEnum(scope.row.status).label
                            }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算状态" prop="settle_status">
                        <template slot-scope="scope">
                            <el-tag
                                :type="
                                    formatSettleEnum(scope.row.settle_status)
                                        .type
                                "
                                >{{
                                    formatSettleEnum(scope.row.settle_status)
                                        .label
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div></div>
                            <!-- 该退款交给用户端 -->
                            <!-- <el-button
                                v-if="canRefund(scope.row)"
                                type="text"
                                size="small"
                                @click="handleRefund(scope.row)"
                                >退款</el-divider>
                            </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    cancelOrder,
    getOrderDetail,
    OrderGoodsSettleStatusConf,
    refund,
    SubscribeOrderGoodsStatusConf,
} from "@/api/order";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "SubscribeOrderDetail",
    components: {},
})
export default class extends Vue {
    private orderSn: string = "";

    private detail: any = {};

    private choosed: any[] = [];

    private loading: boolean = false;

    private showDetail: boolean = false;

    @Watch("orderSn")
    orderSnChange() {
        console.log(`orderSnChange`, this.orderSn);
        this.getData();
    }

    get title() {
        return (
            `${this.orderSn}` +
            (this.detail.order_sn ? `[${this.detail.status_conf.label}]` : "")
        );
    }

    public init(orderSn: string) {
        this.orderSn = orderSn;
        this.showDetail = true;
    }

    private async getData() {
        try {
            if (!this.orderSn) {
                this.$message("订单号错误");
                return;
            }
            this.loading = true;
            this.detail = await getOrderDetail({ orderSn: this.orderSn });
        } catch (error) {
            console.error(error);
        } finally {
            this.choosed = [];
            this.loading = false;
        }
    }
    private selectable(row: any) {
        if (
            (this.detail.status == 2 || this.detail.status == 3) &&
            row.sku_status === 2
        ) {
            return true;
        }
        return false;
    }
    private handleSelectionChange(e: any) {
        this.choosed = e;
    }

    private handleRefund(row: any) {
        this.$turboConfirm
            .confirm({
                type: "warning",
                title: "取消",
                content: "确定对该订单商品退款吗？",
            })
            .then(async () => {
                const res = await refund({
                    orderGoodsId: row.order_goods_id,
                    refundAmount: row.price,
                    reason: "取消",
                });
                if (res) {
                    this.getData();
                }
            })
            .catch((e) => {
                console.log("取消");
            });
    }

    private formatEnum(value: any) {
        const conf = ["danger", "success", "warning", "info", "primary"];
        let i = SubscribeOrderGoodsStatusConf.findIndex(
            (v: any) => v.value === value
        );
        if (i > -1) {
            return {
                label: SubscribeOrderGoodsStatusConf[i].label,
                type: conf[i % 5],
            };
        }
        return {
            label: value,
            type: "primary",
        };
    }

    private formatSettleEnum(value: any) {
        const conf = ["danger", "success", "warning", "info", "primary"];
        let i = OrderGoodsSettleStatusConf.findIndex(
            (v: any) => v.value === value
        );
        if (i > -1) {
            return {
                label: OrderGoodsSettleStatusConf[i].label,
                type: conf[i % 5],
            };
        }
        return {
            label: value,
            type: "primary",
        };
    }

    private canRefund(row: any) {
        if (this.detail.status != 4 && this.detail.status != 6) {
            return false;
        }
        if (row.sku_status == 2) {
            return true;
        }
        return false;
    }
}
</script>

<style lang="scss" scoped>
.order-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 10px;
    .address {
        grid-area: 2 / 2 / span 1 / span 2;
    }
}
.goods-list {
    margin-top: 30px;
}
</style>