<template>
    <el-dialog :title="title" :visible.sync="showDetail" width="800px">
        <div class="order-body">
            <div class="order-info" v-if="detail && detail.rmb">
                <!-- <span>
                    <label class="">结算号:</label>
                    <label>{{ detail.settle_no }}</label>
                </span> -->

                <span>
                    <label>状态： </label>
                    <label>
                        <el-tag :type="formatEnum(detail.status).type">{{
                            formatEnum(detail.status).label
                        }}</el-tag>
                    </label>
                </span>

                <span>
                    <label class="">结算金额:</label>
                    <label>{{ detail.rmb.settle_amount }}</label>
                </span>

                <span>
                    <label class="">服务费:</label>
                    <label>{{ detail.rmb.service_amount }}</label>
                </span>

                <span>
                    <label class="">应打款金额:</label>
                    <label
                        style="font-size: 16px; font-weight: 600; color: red"
                        >{{ detail.rmb.transfer_amount }}</label
                    >
                </span>

                <span>
                    <label class="">商户昵称:</label>
                    <label>{{ detail.merchant_info.name }}</label>
                </span>

                <span>
                    <label class="">结算时间:</label>
                    <label>{{ detail.date_created_text }}</label>
                </span>

                <span class="account-detail">
                    <label class="">收款账户:</label>
                    <label
                        >{{ detail.bank }}-{{ detail.account_name }}-{{
                            detail.account_no
                        }}</label
                    >
                </span>

                <span>
                    <label class="">备注:</label>
                    <label>{{ detail.remark }}</label>
                </span>
            </div>

            <div style="margin-top: 20px" v-if="detail.status == 2">
                <h4>付款凭证：</h4>
                <div>
                    <el-image
                        :src="detail.transfer_image"
                        :preview-src-list="[detail.transfer_image]"
                    ></el-image>
                </div>
            </div>
            <div class="goods-list">
                <el-table
                    :data="goods"
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
                    <el-table-column label="商品" prop="goods_info.name">
                        <template slot-scope="scope">
                            {{ scope.row.goods_info.name }}
                        </template>
                    </el-table-column>
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
                        prop="rmb.total_amount"
                    ></el-table-column>
                    <el-table-column
                        label="-(退款金额"
                        prop="rmb.refund_amount"
                    ></el-table-column>
                    <el-table-column
                        label="+服务费)"
                        prop="rmb.settle_fee"
                    ></el-table-column>
                    <el-table-column
                        label="=结算额"
                        prop="rmb.settle_amount"
                    ></el-table-column>
                </el-table>
            </div>
        </div>

        <div v-if="detail && detail.status == 0" style="margin-top: 20px">
            <h4>审核：</h4>
            <CustomForm :columns="checkColumns" ref="checkForm"> </CustomForm>
        </div>

        <div v-if="detail && detail.status == 1" style="margin-top: 20px">
            <h4>打款：</h4>
            <CustomForm :columns="transColumns" ref="transForm"> </CustomForm>
        </div>

        <span slot="footer" class="dialog-footer">
            <template v-if="detail && detail.status == 0">
                <el-button type="primary" @click="submitCheck"
                    >提交审核</el-button
                >
            </template>

            <template v-if="detail && detail.status == 1">
                <el-button type="primary" @click="submitTrans"
                    >确认已打款</el-button
                >
            </template>
        </span>
    </el-dialog>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumn,
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import {
    getSettleDetail,
    MerchantSettleStatus,
    settleCheck,
    settleConfirmTrans,
    SettleStatusConf,
} from "@/api/settle";
import { IpageDataDto } from "@/api/types";
import moment from "moment";
import CustomForm from "@/components/custom-list/cps/form.vue";

@Component({
    name: "SettleDetail",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    private settleNo: string = "";

    private detail: any = {};

    private goods: any[] = [];

    private choosed: any[] = [];

    private loading: boolean = false;

    private showDetail: boolean = false;

    @Watch("settleNo")
    settleNoChange() {
        console.log(`settleNoChange`, this.settleNo);
        // this.getData();
    }

    get title() {
        return `${this.settleNo}`;
    }

    public init(settleNo: string) {
        this.settleNo = settleNo;
        this.showDetail = true;
        this.getData();
    }

    private async getData() {
        try {
            if (!this.settleNo) {
                this.$message.error("结算单号错误");
                return;
            }
            this.loading = true;
            let { settle, order_goods } = await getSettleDetail({
                settleNo: this.settleNo,
            });
            if (!settle) {
                this.$message.error("结算单未找到");
                return;
            }
            this.detail = {
                ...settle,
                rmb: {
                    settle_amount: Number(settle.settle_amount)
                        .div(100)
                        .toFixed(2),
                    service_amount: Number(settle.service_amount)
                        .div(100)
                        .toFixed(2),
                    transfer_amount: Number(settle.transfer_amount)
                        .div(100)
                        .toFixed(2),
                },
                date_created_text: moment(settle.date_created).format(
                    "YYYY-MM-DD HH:mm:ss"
                ),
            };
            this.goods = order_goods.map((e: any) => {
                e.rmb = {
                    total_amount: Number(e.total_amount).div(100).toFixed(2),
                    refund_amount: Number(e.refund_amount).div(100).toFixed(2),
                    settle_amount: Number(e.settle_amount).div(100).toFixed(2),
                    settle_fee: Number(e.settle_fee).div(100).toFixed(2),
                };
                return e;
            });
        } catch (error) {
            console.error(error);
        } finally {
            this.choosed = [];
            this.loading = false;
        }
    }

    private checkColumns: CustomListColumn[] = [
        {
            type: CustomListColumnType.SELECT,
            label: "审核结果",
            prop: "status",
            dataSource: {
                key: "value",
                value: [
                    {
                        label: "未通过",
                        value: MerchantSettleStatus.CHECK_FAILED,
                    },
                    {
                        label: "通过",
                        value: MerchantSettleStatus.CHECKDONE,
                    },
                ],
            },
        },
        {
            type: CustomListColumnType.TEXT,
            label: "原因",
            placeholder: "如果不通过需填写",
            prop: "reason",
        },
    ];

    private async submitCheck() {
        const form = this.$refs.checkForm;

        if (!form) {
            return this.$message.error(`checkForm初始化失败`);
        }

        const data = (form as CustomForm).getFormValue();

        if (
            data.status != MerchantSettleStatus.CHECKDONE &&
            data.status != MerchantSettleStatus.CHECK_FAILED
        ) {
            return this.$message.error(`请审核`);
        }

        if (data.status == MerchantSettleStatus.CHECK_FAILED && !data.reason) {
            return this.$message.error(`请输入原因`);
        }

        const res = await settleCheck({
            settleNo: this.detail.settle_no,
            ...data,
        });

        this.getData();

        this.$emit("refresh");
    }

    private transColumns: CustomListColumn[] = [
        {
            type: CustomListColumnType.IMAGE,
            label: "凭证",
            prop: "settle_image",
        },
        {
            type: CustomListColumnType.TEXT,
            label: "备注",
            placeholder: "可空",
            prop: "reason",
        },
    ];

    private async submitTrans() {
        const form = this.$refs.transForm;

        if (!form) {
            return this.$message.error(`transForm初始化失败`);
        }

        const data = (form as CustomForm).getFormValue();

        if (data.ssettle_image) {
            return this.$message.error(`请上传打款凭证`);
        }

        const res = await settleConfirmTrans({
            settleNo: this.detail.settle_no,
            ...data,
        });

        this.getData();

        this.$emit("refresh");
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
                // const res = await refund({
                //     orderGoodsId: row.order_goods_id,
                //     refundAmount: row.price,
                //     reason: "取消",
                // });
                // if (res) {
                //     this.getData();
                // }
            })
            .catch((e) => {
                console.log("取消");
            });
    }

    private formatEnum(value: any) {
        const conf = ["danger", "success", "warning", "info", "primary"];
        let i = SettleStatusConf.findIndex((v: any) => v.value === value);
        if (i > -1) {
            return {
                label: SettleStatusConf[i].label,
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
    .account-detail {
        grid-area: 3 / 1 / span 1 / span 2;
    }
}
.goods-list {
    margin-top: 30px;
}
</style>