<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2022-12-12 16:09:29
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-05-26 08:13:24
 * @FilePath      : /nls-admin/src/components/custom-list/editForm.vue
 * @Description   :
 *
 * Copyright (c) 2022 by turbo 664120459@qq.com, All Rights Reserved.
-->
<template>
    <div class="turbo-form text-left">
        <el-dialog
            v-loading="loading"
            :title="title || (form && form.id ? '修改' : '新增')"
            :visible.sync="dialogVisible"
            width="800px"
            :before-close="handleClose"
        >
            <div>
                <CustomForm
                    ref="mainform"
                    :inline="conf.forminline"
                    :columns="columns"
                    :rules="formRules"
                    :readonly="readonly"
                ></CustomForm>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="readonly" @click="dialogVisible = false"
                    >关 闭</el-button
                >
                <el-button v-if="!readonly" @click="dialogVisible = false"
                    >取 消</el-button
                >
                <el-button v-if="!readonly" type="primary" @click="handleSave()"
                    >提 交</el-button
                >
            </span>
        </el-dialog>
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
            (this.$refs.mainform as CustomForm).init(this.form);
            this.loading = false;
        });
    }

    public handleClose() {
        this.dialogVisible = false;
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
