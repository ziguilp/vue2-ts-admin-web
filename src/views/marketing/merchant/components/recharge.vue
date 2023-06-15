<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-06-02 17:39:06
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-07 10:20:39
 * @FilePath      : /nls-admin/src/views/merchant/components/recharge.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-26 20:09:38
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-03 10:13:28
 * @FilePath      : /nls-admin/src/views/merchant/components/recharge.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <div>
        <el-drawer
            ref="drawer"
            :title="title"
            :visible.sync="drawerShow"
            direction="rtl"
            :before-close="handleClose"
        >
            <div class="d-body">
                <custom-form
                    ref="mainform"
                    class="d-body-form"
                    :columns="columns"
                    v-model="formVal"
                ></custom-form>
                <div class="drawer__footer">
                    <el-button @click="close()">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="submit()"
                        :loading="loading"
                        >{{ loading ? "提交中 ..." : btnText }}</el-button
                    >
                </div>
            </div>
        </el-drawer>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumn,
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import CustomForm from "@/components/custom-list/cps/form.vue";
import CustomTable from "@/components/custom-list/list.vue";
import { IpageDataDto } from "@/api/types";
import moment from "moment";
import { ActivityInfo } from "@/api/activity";
import { MerchantInfo } from "@/api/merchant";
import { confirmPaydone, createMerchantReOrder, payorder } from "@/api/order";

@Component({
    name: "ActivityReward",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    /**
     * 基本信息
     */
    private merchant!: MerchantInfo;

    private drawerShow: boolean = false;

    private title: string = "";

    private loading: boolean = false;

    private formVal: any = {};

    @Watch("formVal", { deep: true })
    formchange() {
        console.log({ fl: this.formVal });
        if (this.formVal.amount > 0) {
            this.formVal.fee = Number(
                Number(this.formVal.amount)
                    .mul(this.merchant.fee_rate)
                    .div(1000)
            ).toFixed(2);
        }
        if (this.formVal.paid == "no") {
            this.formVal.payway = "wechat";
        }
    }

    @Watch("formVal", { deep: true })
    get btnText() {
        const { amount, fee, paid, payway } = this.formVal;
        if (paid === "no") {
            return `支付￥${Number(amount).add(Number(fee))}`;
        }
        return "提交";
    }

    public init(merchant: MerchantInfo) {
        this.merchant = { ...merchant };
        console.log(`商户信息`, merchant);
        this.title = `${this.merchant?.name}:营销账号充值`;
        this.show();
    }

    public show() {
        this.drawerShow = true;
    }

    public close() {
        (this.$refs.drawer as any).closeDrawer();
    }

    private handleClose(done: any) {
        // 未保存信息时提醒保存
        this.$confirm("确认关闭？")
            .then((_) => {
                done();
            })
            .catch((_) => {});
    }

    private async submit() {
        if (this.loading) return;
        const form = this.$refs.mainform as CustomForm;
        const valid = await form.validate();
        try {
            this.loading = true;
            if (!valid) {
                return;
            }
            const {
                amount,
                fee,
                paid,
                payway,
                third_order_sn = "",
                remark = "",
            } = form.getFormValue();
            if (!amount || amount <= 0) {
                return this.$message.error(`充值金额无效`);
            }
            if (!paid) {
                return this.$message.error(`是否支付过了？`);
            }
            if (!payway) {
                return this.$message.error(`请选择支付渠道`);
            }
            if (paid == "no" && payway != "wechat") {
                return this.$message.error(`只可使用微信进行支付`);
            }

            if (
                paid == "yes" &&
                (!third_order_sn || third_order_sn.length < 10)
            ) {
                return this.$message.error(`支付流水号有误`);
            }

            const { order, orderGoodsList } = await createMerchantReOrder(
                this.merchant.user_id,
                amount
            );

            if (!order) {
                return this.$message.error(`订单创建失败`);
            }

            let res = null;

            if (paid == "no") {
                // 尚未支付的订单，发起支付并弹出支付二维码
                res = await payorder(order.order_sn);
                // 由于系统尚未接入微信Native支付，先不做
            } else {
                // 已支付的直接进行确认支付
                res = await confirmPaydone({
                    order_no: order.order_sn,
                    amount: Number(order.total_amount),
                    tradeWay: payway,
                    third_order_no: third_order_sn,
                    remark,
                });
            }

            if (res === "SUCCESS") {
                // 支付确认成功的，充值完成
                this.$message.success(`充值成功`);
                // @ts-ignore
                this.$refs.mainform.init();
                // @ts-ignore
                this.$parent.$refs.merchantlist.refresh();
                this.close();
            }

            console.log(`充值订单`, res);
        } catch (error) {
            console.log("error submit!!", error);
            return false;
        } finally {
            this.loading = false;
        }
        return false;
    }

    @Watch("merchant", { deep: true })
    get columns() {
        return [
            {
                type: CustomListColumnType.NUMBER,
                label: `充值金额[元]`,
                prop: "amount",
                precision: 2,
                formRule: [{ required: true }],
                readonly: false,
            },
            {
                type: CustomListColumnType.NUMBER,
                label: `另需服务费[元]`,
                prop: "fee",
                precision: 2,
                formRule: [{ required: true }],
                readonly: true,
            },
            {
                type: CustomListColumnType.SELECT,
                label: "是否已支付",
                prop: "paid",
                editableWhen: () => {
                    return this.$permission.isSuperAdmin();
                },
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "尚未支付",
                            value: "no",
                        },
                        {
                            label: "已通过其他方式支付",
                            value: "yes",
                        },
                    ],
                },
                formRule: [{ required: true }],
                readonly: false,
            },
            {
                type: CustomListColumnType.SELECT,
                label: "选择支付渠道",
                prop: "payway",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "微信",
                            value: "wechat",
                        },
                        {
                            label: "对公转账",
                            value: "bank",
                        },
                    ],
                },
                formRule: [{ required: true }],
                readonly: false,
            },
            {
                type: CustomListColumnType.TEXT,
                label: "请输入转账或支付流水号",
                prop: "third_order_sn",
                editableWhen: (form: any) => {
                    return form.paid === "yes";
                },
            },
            {
                type: CustomListColumnType.TEXT,
                label: "备注",
                prop: "remark",
            },
        ] as CustomListColumn[];
    }
}
</script>

<style lang="scss" scope>
.d-body {
    padding: 0 20px;
    position: relative;
    height: calc(100vh - 60px);
    overflow-y: scroll;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    &-form {
        flex: 1;
    }
    .drawer__footer {
        display: flex;
        justify-content: flex-end;
        padding: 20px 0;
        width: 100%;
    }
}
</style>