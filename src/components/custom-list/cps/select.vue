<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-02 21:18:02
 * @FilePath      : /nls-admin/src/components/custom-list/cps/select.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <el-select
        v-model="val"
        :placeholder="placeholder"
        :style="rootStyle"
        :disabled="disabled"
        clearable
        :multiple="multiple"
        @change="changeVal"
    >
        <el-option
            v-for="v in options"
            :label="v[dataSource.labelKey] || v.label"
            :value="v[dataSource.key || 'id']"
            :key="'custom-select-' + prop + v[dataSource.key || 'id']"
        ></el-option>
    </el-select>
</template>

<script lang='ts'>
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { CustomDataSource } from "../customType";

@Component({
    name: "CustomSelect",
})
export default class CustomSelect extends Vue {
    @Prop({
        type: [String, Number, Array],
        default: () => "",
    })
    readonly value!: string | number | any[];

    @Prop({
        type: String,
        required: true,
    })
    readonly prop!: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    readonly disabled!: Boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    readonly multiple!: Boolean;

    @Prop({
        type: String,
        required: false,
        default: "",
    })
    readonly rootStyle!: string;

    @Prop({
        type: String,
        default: "",
    })
    readonly placeholder!: string;

    @Prop({
        type: Object as PropType<CustomDataSource>,
        required: true,
    })
    readonly dataSource!: CustomDataSource;

    private options: any[] = [];

    private val: any = "";

    @Watch("value")
    valChange() {
        this.val = this.value || "";
    }

    private changeVal(e: any) {
        this.$emit("input", e);
    }

    mounted() {
        this.initOptions();
    }

    @Watch("dataSource", {
        deep: true,
    })
    async initOptions() {
        console.log("init-ops", this.options, this.dataSource);
        if (!this.dataSource || !this.dataSource.value) {
            this.options = [];
            return;
        }
        if (this.dataSource.value instanceof Array) {
            this.options = this.dataSource.value;
            return;
        }
        if (this.dataSource.value instanceof Function) {
            this.options = await this.dataSource.value();
        }
    }
}
</script>
