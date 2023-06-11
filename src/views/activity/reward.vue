<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-26 20:09:38
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 15:29:52
 * @FilePath      : /nls-admin/src/views/activity/reward.vue
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
            <div
                class="d-body"
                v-if="!isEditing && rewards && rewards.length > 0"
            >
                <div class="btn">
                    <el-button-group>
                        <el-button type="primary" @click="setEditing(true)"
                            >新增</el-button
                        >
                    </el-button-group>
                </div>
                <el-table :data="rewards" height="300">
                    <template v-for="(item, index) in columns">
                        <el-table-column
                            v-if="item.showInTable"
                            :key="'t-b-' + item.prop"
                            :label="item.label"
                        >
                            <template slot-scope="scope">
                                <slot :name="item.prop" v-bind:row="scope.row">
                                    <template v-if="item.showFormatInTable">
                                        <el-tooltip
                                            :content="
                                                item.showFormatInTable(
                                                    scope.row
                                                )
                                            "
                                            placement="top"
                                        >
                                            <el-tag
                                                type="primary"
                                                @click="editRow(scope.row)"
                                                style="cursor: pointer"
                                                >{{
                                                    item.showFormatInTable(
                                                        scope.row
                                                    )
                                                }}</el-tag
                                            >
                                        </el-tooltip>
                                    </template>
                                    <template v-else>{{
                                        scope.row[item.prop]
                                    }}</template>
                                </slot>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>

            <div
                class="d-body"
                :style="'dispaly:' + isEditing ? 'block' : 'none'"
            >
                <custom-form
                    ref="mainform"
                    class="d-body-form"
                    :columns="columns"
                ></custom-form>
                <div class="drawer__footer">
                    <el-button @click="close()">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="submit()"
                        :loading="loading"
                        >{{ loading ? "提交中 ..." : "确 定" }}</el-button
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
import {
    createReward,
    editReward,
    getRewardList,
    MarketingLotteryRewardType,
    RewardInfo,
} from "@/api/reward";
import CustomForm from "@/components/custom-list/cps/form.vue";
import CustomTable from "@/components/custom-list/list.vue";
import { IpageDataDto } from "@/api/types";
import moment from "moment";
import { ActivityInfo } from "@/api/activity";

@Component({
    name: "ActivityReward",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    /**
     * 活动基本信息
     */
    private activity!: ActivityInfo;

    private isEditing: boolean = false;

    private drawerShow: boolean = false;

    private title: string = "";

    private rewards: RewardInfo[] = [];

    private loading: boolean = false;

    public init(actovity: ActivityInfo) {
        const act = { ...actovity };
        const now = moment().unix();
        if (now > moment(act.date_end).unix()) {
            act.statusText = "over";
        } else if (now > moment(act.date_start).unix()) {
            act.statusText = "going";
        } else {
            act.statusText = "pending";
        }
        this.activity = act;
        this.title = `${this.activity?.name}:的奖品`;
        this.getList();
        this.show();
    }

    private async getList() {
        const { list } = await getRewardList({
            activityId: this.activity.id,
        });
        this.rewards = list;
        if (!list || list.length == 0) {
            this.setEditing(true);
        } else {
            this.setEditing(false);
        }
    }

    public setEditing(e: boolean) {
        this.isEditing = e;
    }

    private editRow(row: RewardInfo) {
        this.setEditing(true);
        (this.$refs.mainform as CustomForm).init({
            ...(row as any),
            reward_amount: Number(row.reward_amount).div(100).toFixed(2),
        });
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
                if (this.isEditing) {
                    return this.setEditing(false);
                }
                done();
            })
            .catch((_) => {});
    }

    private async submit() {
        const form = this.$refs.mainform as CustomForm;
        const valid = await form.validate();
        try {
            this.loading = true;
            if (!valid) {
                return;
            }
            const vals = form.getFormValue();
            vals.activity_id = this.activity.id;
            if (vals.reward_amount) {
                vals.reward_amount = Number(vals.reward_amount).mul(100);
            }
            if (vals.id) {
                await editReward(vals).then((_) => {
                    this.getList();
                });
            } else {
                await createReward(vals).then((_) => {
                    this.getList();
                });
            }
        } catch (error) {
            console.log("error submit!!", error);
            return false;
        } finally {
            this.loading = false;
        }
        return false;
    }

    get readOnlyExpOver() {
        return this.activity && this.activity.statusText === "over"
            ? true
            : false;
    }

    get readOnlyExpPending() {
        return this.activity &&
            (this.activity.statusText === "pending" ||
                this.activity.status === "ban")
            ? false
            : true;
    }

    get columns() {
        return [
            {
                type: CustomListColumnType.SELECT,
                label: "类型",
                prop: "type",
                dataSource: {
                    key: "value",
                    labelKey: "label",
                    value: [
                        {
                            label: "现金红包",
                            value: MarketingLotteryRewardType.WECHAT_RED_PACKAGE,
                        },
                        {
                            label: "实物",
                            value: MarketingLotteryRewardType.GOODS,
                        },
                        {
                            label: "空奖",
                            value: MarketingLotteryRewardType.OTHER,
                        },
                    ],
                },
                formRule: [{ required: true }],
                // readonly: this.readOnlyExpPending,
            },
            {
                type: CustomListColumnType.TEXT,
                label: "名称",
                showInTable: true,
                prop: "name",
                formRule: [{ required: true }],
                readonly: this.readOnlyExpOver,
                showFormatInTable: (row: RewardInfo) => {
                    return row.type ==
                        MarketingLotteryRewardType.WECHAT_RED_PACKAGE
                        ? `${row.name}:微信现金红包￥${Number(
                              row.reward_amount.div(100).toFixed(2)
                          )}`
                        : row.name;
                },
            },
            {
                type: CustomListColumnType.IMAGE,
                label: "图片",
                prop: "image",
                readonly: this.readOnlyExpOver,
            },
            {
                type: CustomListColumnType.NUMBER,
                label: "红包金额[元]",
                precision: 2,
                prop: "reward_amount",
                // readonly: this.readOnlyExpPending,
                editableWhen: (form: any) => {
                    return (
                        form.type ===
                        MarketingLotteryRewardType.WECHAT_RED_PACKAGE
                    );
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                label: "中奖概率",
                placeholder: "中奖概率-千分之‰",
                prop: "rate",
                min: 0,
                max: 1000,
                formRule: [{ required: true }],
                showInTable: true,
                readonly: this.readOnlyExpOver,
                showFormatInTable: (row: RewardInfo) => {
                    return `${row.rate}‰`;
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                label: "奖品数量",
                prop: "reward_num",
                min: 0,
                formRule: [{ required: true }],
                showInTable: true,
                readonly: this.readOnlyExpOver,
            },
            {
                type: CustomListColumnType.TEXTAREA,
                label: "中奖后给用户的领取提示",
                prop: "tip",
                readonly: this.readOnlyExpOver,
            },
            {
                type: CustomListColumnType.TEXT,
                label: "红包祝福语",
                prop: "wishing",
                readonly: this.readOnlyExpOver,
            },
            {
                type: CustomListColumnType.TEXT,
                label: "红包备注",
                prop: "remark",
                readonly: this.readOnlyExpOver,
            },
        ] as CustomListColumn[];
    }
}
</script>

<style lang="scss">
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