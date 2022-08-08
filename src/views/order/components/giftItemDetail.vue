<template>
    <el-dialog
        :title="title"
        :visible.sync="showDetail"
        width="800px"
        id="orderDetail"
    >
        <div class="order-body">
            <div class="order-info">
                <span>
                    <label class="">订单号:</label>
                    <label>{{ detail.order_sn }}</label>
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
                    <label>{{ detail.order_delivery.mobile }}</label>
                </span>
                <span class="address">
                    <label class="">地址:</label>
                    <label
                        >{{ detail.order_delivery.province
                        }}{{ detail.order_delivery.city
                        }}{{ detail.order_delivery.area
                        }}{{ detail.order_delivery.detail }}</label
                    >
                </span>
                <canvas id="qrcode"></canvas>
            </div>

            <div v-if="detail.order_delivery">
                <el-card v-if="detail.order_delivery.refund_express_no">
                    <div slot="header">
                        退货物流：{{ detail.order_delivery.refund_express_com }}
                        {{ detail.order_delivery.refund_express_no }}
                    </div>
                    <div class="router">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in detail
                                    .order_delivery.refund_express_routes"
                                :key="`rf-wl-${index}`"
                                :timestamp="activity.time"
                            >
                                {{ activity.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>

                <el-card v-if="detail.order_delivery.express_no">
                    <div slot="header">
                        发货物流：{{ detail.order_delivery.express_com }}
                        {{ detail.order_delivery.express_no }}
                    </div>
                    <div class="router">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in detail
                                    .order_delivery.express_routes"
                                :key="`f-wl-${index}`"
                                :timestamp="activity.time"
                            >
                                {{ activity.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>
            </div>
        </div>
    </el-dialog>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import printJs from "print-js";
import QRCode from "qrcode";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { cancelOrder, getOrderDetail } from "@/api/order";
import { IpageDataDto } from "@/api/types";
import { SkuStatusConf } from "@/api/sku";

@Component({
    name: "GiftItemOrderDetail",
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
            setTimeout(() => {
                QRCode.toCanvas(
                    document.getElementById("qrcode"),
                    this.orderSn
                );
            }, 100);
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

    private async confirmBack() {
        if (this.choosed.length < 1) {
            return this.$message("请选择书籍");
        }
        this.loading = true;
        try {
            // let r = await returnOrder({
            //     orderSn: this.orderSn,
            //     skuList: this.choosed.map((e) => {
            //         return {
            //             skuId: e.sku_id,
            //             skuNo: e.sku_no,
            //         };
            //     }),
            // });

            // console.log(`归还结果`, r);
            await this.getData();
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    private async confirmBroken() {
        if (this.choosed.length < 1) {
            return this.$message("请选择书籍");
        }
        this.loading = true;
        try {
            // let r = await returnOrderBroken({
            //     orderSn: this.orderSn,
            //     skuList: this.choosed.map((e) => {
            //         return {
            //             skuId: e.sku_id,
            //             skuNo: e.sku_no,
            //         };
            //     }),
            // });

            // console.log(`归还结果`, r);
            await this.getData();
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }

    private formatEnum(value: any) {
        const conf = ["danger", "success", "warning", "info", "primary"];
        let i = SkuStatusConf.findIndex((v: any) => v.value === value);
        if (i > -1) {
            return {
                label: SkuStatusConf[i].label,
                type: conf[i % 5],
            };
        }
        return {
            label: value,
            type: "primary",
        };
    }

    public print() {
        printJs({
            printable: "orderDetail",
            css: "/print.css",
            type: "html",
            showModal: true,
            documentTitle: this.orderSn,
        });
        setTimeout(() => {
            this.showDetail = false;
        }, 200);
    }
}
</script>

<style lang="scss" scoped>
.order-info {
    display: grid;
    grid-template-columns: 20% 40% 40%;
    row-gap: 10px;
    .address {
        grid-area: 3 / 2 / span 1 / span 2;
    }
    #qrcode {
        grid-area: 1 / 1 / span 3 / span 1;
    }
}
.goods-list {
    margin-top: 30px;
}
</style>