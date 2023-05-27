<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-27 12:30:35
 * @FilePath      : /nls-admin/src/components/custom-list/editForm.vue
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
-->
<template>
    <div class="turbo-form text-left">
        <!-- <el-dialog
            v-loading="loading"
            :title="title || (form && form.id ? '修改' : '新增')"
            :visible.sync="dialogVisible"
            width="800px"
            :before-close="handleClose"
        > -->
        <el-drawer
            ref="drawer"
            v-loading="loading"
            :title="title || (form && form.id ? '修改' : '新增')"
            :visible.sync="dialogVisible"
            direction="rtl"
            :before-close="handleClose"
        >
            <div class="d-body">
                <CustomForm
                    ref="mainform"
                    :inline="conf.forminline || false"
                    :columns="columns"
                    :rules="formRules"
                    :readonly="readonly"
                ></CustomForm>
                <div class="drawer__footer">
                    <el-button v-if="readonly" @click="close()"
                        >关 闭</el-button
                    >
                    <el-button v-if="!readonly" @click="close()"
                        >取 消</el-button
                    >
                    <el-button
                        v-if="!readonly"
                        type="primary"
                        @click="handleSave()"
                        >提 交</el-button
                    >
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Form as ElForm, Input, Message } from "element-ui";
import { createAdmin } from "@/api/users";
import { RoleDto } from "@/api/types";
import { getRoleList } from "@/api/role";
import { PropType } from "vue";
import { CustomListConf, CustomListColumn } from "./customType";
import CustomForm from "./cps/form.vue";

@Component({
    name: "EditForm",
    components: {
        CustomForm,
    },
})
export default class extends Vue {
    @Prop({
        type: Object as PropType<CustomListConf>,
        required: true,
    })
    readonly conf!: CustomListConf;

    @Prop({
        type: String,
        required: false,
    })
    readonly title!: "";

    private loading = false;
    private dialogVisible = false;
    private readonly = false;
    private form: any = {};
    private datePickerOptions = {
        disabledDate(time: Date) {
            return time.getTime() < Date.now() - 8.64e7;
        },
    };

    get columns() {
        return this.conf.columns.reduce((p, c) => {
            if (
                (this.form.id && (c.canEdit || c.showInDetail)) ||
                (!this.form.id && c.canAdd)
            ) {
                p.push({
                    ...c,
                    readonly:
                        typeof c.readonly === "undefined"
                            ? this.form.id && !c.canEdit
                                ? true
                                : undefined
                            : c.readonly,
                });
            }
            return p;
        }, [] as CustomListColumn[]);
    }

    get formRules() {
        const rules: any = {};
        this.columns.map((e) => {
            if (e.formRule) {
                if (e.formRule instanceof Array) {
                    rules[e.prop] = e.formRule;
                } else if (e.formRule instanceof Function) {
                    rules[e.prop] = [
                        {
                            validator: async (
                                rule: any,
                                val: any,
                                callback: Function
                            ) => {
                                try {
                                    e.formRule &&
                                        e.formRule instanceof Function &&
                                        e.formRule(val, this.getForm());
                                } catch (error) {
                                    // @ts-ignore
                                    return callback(new Error(error.message));
                                }
                                callback();
                            },
                            trigger: ["blur", "change"],
                        },
                    ];
                }
            }
        });
        return rules;
    }

    mounted() {}

    public async init({ form = {}, readonly = true }: any = {}) {
        this.readonly = readonly;
        this.dialogVisible = true;
        this.loading = true;
        if (form) {
            this.form = { ...form };
        } else {
            this.form = {};
        }
        setTimeout(() => {
            (this.$refs.mainform as CustomForm).init({ ...this.form });
            this.loading = false;
        });
    }

    public close() {
        (this.$refs.drawer as any).closeDrawer();
    }

    public handleClose(done?: any) {
        const formVal = this.getForm();
        const vals = Object.values(formVal).filter((e) => !!e);
        if (this.readonly || !vals || vals.length < 1) {
            this.dialogVisible = false;
            return;
        }

        // 信息一致时不提醒
        const lks = Object.keys(this.form);
        const vks = Object.keys(formVal);
        let diff = false;
        if (lks.length != vks.length) {
            console.log(`vdiff-l`, this.form, formVal);
            diff = true;
        }
        if (!diff) {
            for (let index = 0; index < lks.length; index++) {
                const k = lks[index];
                if (this.form[k] != formVal[k]) {
                    console.log(`vdiff`, k, this.form, formVal);
                    diff = true;
                    break;
                }
            }
        }
        if (diff) {
            // 未保存信息时提醒保存
            this.$confirm("内容尚未保存，确认关闭？")
                .then((_) => {
                    done ? done() : (this.dialogVisible = false);
                })
                .catch((_) => {});
        } else {
            this.dialogVisible = false;
        }
    }

    private async handleSave() {
        const valid = await (this.$refs.mainform as CustomForm).validate();
        try {
            this.loading = true;
            if (valid && this.conf.onSave) {
                return await this.conf.onSave(this.getForm()).then(() => {
                    const form = this.getForm();
                    this.$emit("refresh", !form.id);
                    this.handleClose();
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

    private getForm() {
        return (this.$refs.mainform as CustomForm).getFormValue();
    }
}
</script>

<style lang="scss" scope>
.d-body {
    padding: 0 20px;
    position: relative;
    min-width: 300px;
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
