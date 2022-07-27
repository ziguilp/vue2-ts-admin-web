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
                    <label>{{ detail.mobile }}</label>
                </span>
                <span class="address">
                    <label class="">地址:</label>
                    <label
                        >{{ detail.od_province }}{{ detail.od_city
                        }}{{ detail.od_area }}{{ detail.od_detail }}</label
                    >
                </span>
                <canvas id="qrcode"></canvas>
            </div>
            <div class="goods-list">
                <el-table
                    :data="detail.goods"
                    height="250"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55"
                        :selectable="selectable"
                    >
                    </el-table-column>
                    <el-table-column
                        label="条码"
                        prop="goods_barcode"
                    ></el-table-column>
                    <el-table-column
                        label="SKU编码"
                        prop="sku_no"
                    ></el-table-column>
                    <el-table-column
                        label="名称"
                        prop="goods_name"
                    ></el-table-column>
                    <el-table-column label="图片" prop="goods_image">
                        <template slot-scope="scope">
                            <el-image
                                style="height: 60px; width: 40px"
                                :src="scope.row.goods_image"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="库位"
                        prop="located"
                    ></el-table-column>
                    <el-table-column label="状态" prop="sku_status">
                        <template slot-scope="scope">
                            <el-tag
                                :type="formatEnum(scope.row.sku_status).type"
                                >{{
                                    formatEnum(scope.row.sku_status).label
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button
                v-if="detail.status == 2 || detail.status == 3"
                type="warning"
                @click="confirmBack"
                >确认归还</el-button
            >
            <el-button
                v-if="detail.status == 2 || detail.status == 3"
                type="danger"
                @click="confirmBroken"
                >书籍损坏</el-button
            >
        </span>
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
import {
    cancelOrder,
    getOrderDetail,
    returnOrder,
    returnOrderBroken,
} from "@/api/order";
import { IpageDataDto } from "@/api/types";
import { SkuStatusConf } from "@/api/sku";

@Component({
    name: "BorrowOrderDetail",
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
            let r = await returnOrder({
                orderSn: this.orderSn,
                skuList: this.choosed.map((e) => {
                    return {
                        skuId: e.sku_id,
                        skuNo: e.sku_no,
                    };
                }),
            });

            console.log(`归还结果`, r);
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
            let r = await returnOrderBroken({
                orderSn: this.orderSn,
                skuList: this.choosed.map((e) => {
                    return {
                        skuId: e.sku_id,
                        skuNo: e.sku_no,
                    };
                }),
            });

            console.log(`归还结果`, r);
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