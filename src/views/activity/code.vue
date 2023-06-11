<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-06-11 17:58:25
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 21:24:49
 * @FilePath      : /nls-admin/src/views/activity/code.vue
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
            size="900"
        >
            <div class="d-body-width">
                <div class="progress-con" v-if="timer">
                    <div class="progress-con-body">
                        <el-progress
                            :text-inside="true"
                            :stroke-width="26"
                            :percentage="process.process"
                        ></el-progress>
                    </div>
                </div>

                <custom-list :conf="config" ref="codelist">
                    <template slot="operations" scope="scope">
                        <el-button
                            slot="reference"
                            type="text"
                            size="small"
                            @click="downloadCodeExcel(scope.row)"
                            >码数据下载
                        </el-button>
                        <el-button
                            slot="reference"
                            type="text"
                            size="small"
                            v-if="scope.row.box_code_pending_num > 0"
                            @click="activeCode(scope.row)"
                            >激活本批次所有码
                        </el-button>
                    </template>
                </custom-list>
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
    CodeSummaryInfo,
    getAcivityCodesSummary,
    createBoxCode,
    queryCreateProcess,
    downloadCodeFile,
    activeWaveCode,
} from "@/api/activity";
import CustomForm from "@/components/custom-list/cps/form.vue";
import { ActivityInfo } from "@/api/activity";
import { IpageDataDto } from "@/api/types";

@Component({
    name: "ActivityReward",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    private drawerShow: boolean = false;
    private activity: ActivityInfo = {} as any;
    private isEditing: boolean = false;
    private title: string = "箱码甁码的统计情况";
    private timer = null;
    private process = {
        process: 0,
    };

    public init(act: ActivityInfo) {
        this.activity = act;
        this.drawerShow = true;
        this.title = `${this.activity?.name || ""}：箱码甁码的统计情况`;
        console.log(this.activity, this.$refs);

        setTimeout(() => {
            // @ts-ignore
            this.$refs.codelist.refresh();
        });
    }

    private getActInfoId() {
        return this.activity?.id || null;
    }

    private handleClose() {
        this.drawerShow = false;
    }

    private async activeCode(row: any) {
        const { wave_code } = row;
        try {
            await activeWaveCode(wave_code);
        } catch (error) {
            console.error(error);
        } finally {
            // @ts-ignore
            this.$refs.codelist.refresh();
        }
    }

    private queryProcess(waveCode: string) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        // @ts-ignore
        this.timer = setInterval(async () => {
            this.process = await queryCreateProcess(waveCode);
            if (this.process.process >= 100) {
                // @ts-ignore
                clearInterval(this.timer);
                setTimeout(() => {
                    this.timer = null;
                    // @ts-ignore
                    this.$refs.codelist.refresh();
                });
            }
        }, 2000);
    }

    unmounted() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private downloadCodeExcel(e: any) {
        console.log(`download`, e);
        const { wave_code } = e;
        try {
            downloadCodeFile(wave_code);
        } catch (error) {
            console.error(error);
        }
    }

    private config: CustomListConf = {
        columns: [
            {
                type: CustomListColumnType.TEXT,
                label: "批次",
                prop: "wave_code",
                canAdd: false,
                width: "200",
            },
            {
                type: CustomListColumnType.NUMBER,
                label: "箱码总数/待激活/已激活/已扫描",
                prop: "box_code_num",
                canAdd: false,
                min: 1,
                max: 20000,
                width: "200",
                showFormatInTable: (row: CodeSummaryInfo) => {
                    return `${row.box_code_num}/${row.box_code_pending_num}/${row.box_code_normal_num}/${row.box_code_used_num}`;
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                label: "甁码总数/待激活/已激活/已扫描",
                prop: "apply_code_num",
                canAdd: false,
                min: 1,
                max: 100,
                width: "200",
                showFormatInTable: (row: CodeSummaryInfo) => {
                    return `${row.apply_code_num}/${row.apply_code_pending_num}/${row.apply_code_normal_num}/${row.apply_code_used_num}`;
                },
            },
            {
                type: CustomListColumnType.NUMBER,
                prop: "num",
                label: "箱码数量",
                canAdd: true,
                showInTable: false,
                max: 20000,
            },
            {
                type: CustomListColumnType.NUMBER,
                prop: "boxCov",
                label: "箱容量",
                canAdd: true,
                showInTable: false,
                max: 100,
            },
        ] as CustomListColumn[],
        tableSelection: false,
        onSave: async (form: any) => {
            console.log({ form });
            const { waveCode } = await createBoxCode({
                activityId: this.getActInfoId(),
                num: form.num,
                boxCov: form.boxCov,
            });
            console.log(`结果`, waveCode);
            this.queryProcess(waveCode);
        },
        onLoadData: async (searchForm: any, idata: IpageDataDto<any>) => {
            if (!this.getActInfoId()) {
                return {
                    list: [],
                    total: 0,
                    pageSize: idata.pageSize,
                    pagcurrentPagee: idata.currentPage,
                };
            }
            const data = await getAcivityCodesSummary({
                activityId: this.getActInfoId(),
                page: parseInt(String(idata.currentPage)),
                pageSize: idata.pageSize,
            });
            return data;
        },
    };
}
</script>

<style lang="scss" scoped>
.d-body-width {
    width: 800px;
    height: 600px;
    overflow-y: scroll;
    .progress-con {
        position: fixed;
        z-index: 1111111;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        &-body {
            height: 20px;
            width: 400px;
        }
    }
}
</style>