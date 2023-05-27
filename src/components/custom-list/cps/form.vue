<template>
    <el-form
        :class="
            inline ? 'turbo-form turbo-form-row' : 'turbo-form turbo-form-col'
        "
        ref="mainform"
        :rules="rules"
        :model="form"
    >
        <template v-for="(vo, i) in columns">
            <el-form-item
                :label="vo.label || vo.prop"
                :prop="vo.prop"
                :key="`custom-el-form-item-${vo.prop}-${i}`"
                v-if="!vo.editableWhen || vo.editableWhen(form)"
                :style="
                    vo.style
                        ? vo.style
                        : vo.type === 'textarea' ||
                          vo.type === 'image' ||
                          vo.type === 'images'
                        ? 'width: 100%;'
                        : inline
                        ? 'width:auto'
                        : ''
                "
            >
                <!-- 下拉选择 -->
                <CustomSelect
                    v-if="vo.type === 'select'"
                    v-model="form[vo.prop]"
                    :prop="vo.prop"
                    :dataSource="vo.dataSource"
                    :placeholder="vo.placeholder"
                    :style="customStyle"
                    :multiple="vo.multiple"
                    :disabled="vo.readonly || readonly"
                >
                </CustomSelect>

                <!-- radio -->
                <el-radio-group
                    v-if="vo.type === 'radio'"
                    v-model="form[vo.prop]"
                    :dataSource="vo.dataSource"
                    :placeholder="vo.placeholder"
                    :style="vo.style || customType || ''"
                    :disabled="vo.readonly || readonly"
                >
                    <el-radio
                        v-for="(opt, i) in vo.dataSource.value"
                        :key="`custom-form-radio-${vo.prop}-${
                            opt[vo.dataSource.key || 'id']
                        }`"
                        :label="opt[vo.dataSource.key || 'id']"
                        >{{ opt[vo.dataSource.labelKey || "label"] }}</el-radio
                    >
                </el-radio-group>

                <!-- checkbox -->
                <el-checkbox-group
                    v-if="vo.type === 'checkbox'"
                    v-model="form[vo.prop]"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                >
                    <CustomCheckbox
                        v-for="(opt, i) in vo.dataSource.value"
                        :key="`custom-form-checkbox-${vo.prop}-${
                            opt[vo.dataSource.key || 'id']
                        }`"
                        :label="opt[vo.dataSource.key || 'id']"
                        >{{
                            opt[vo.dataSource.labelKey || "label"]
                        }}</CustomCheckbox
                    >
                </el-checkbox-group>

                <!-- 上传 -->
                <upload
                    v-else-if="vo.type === 'image' || vo.type == 'images'"
                    v-model="form[vo.prop]"
                    :max="vo.max"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                ></upload>

                <!-- <div>
          <el-image
            class="avatar-con-img"
            fit="cover"
            :style="`height: ${vo.height|| '60px'}; width: ${vo.height|| '60px'}`"
            v-if="form[vo.prop]"
            :src="form[vo.prop]"
            :disabled='readonly'
          />
          <i v-else class="el-icon-plus uploader-icon wider"></i>
        </div> -->

                <!-- 输入框 -->
                <el-input
                    v-else-if="vo.type === 'text'"
                    v-model="form[vo.prop]"
                    :placeholder="vo.placeholder"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                    :clearable="true"
                ></el-input>

                <!-- 数组输入框 -->
                <InputArray
                    v-else-if="vo.type === 'text-array'"
                    v-model="form[vo.prop]"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                ></InputArray>

                <!-- 年 -->
                <el-date-picker
                    v-else-if="vo.type === 'year'"
                    v-model="form[vo.prop]"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                    type="year"
                    :placeholder="vo.placeholder"
                >
                </el-date-picker>

                <!-- 年区间 -->
                <YearRangerPicker
                    v-else-if="vo.type === 'year-ranger'"
                    v-model="form[vo.prop]"
                    style="width: 300px"
                    :disabled="vo.readonly || readonly"
                    :placeholder="vo.placeholder"
                >
                </YearRangerPicker>

                <!-- 日期 -->
                <el-date-picker
                    v-else-if="vo.type === 'date'"
                    v-model="form[vo.prop]"
                    type="date"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                >
                </el-date-picker>

                <!-- 日期区间 -->
                <el-date-picker
                    v-else-if="vo.type === 'date-ranger'"
                    v-model="form[vo.prop]"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 300px"
                    :disabled="vo.readonly || readonly"
                >
                </el-date-picker>

                <!-- 日期时间 -->
                <el-date-picker
                    v-else-if="vo.type === 'datetime'"
                    v-model="form[vo.prop]"
                    type="datetime"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                >
                </el-date-picker>

                <!-- 日期时间区间 -->
                <el-date-picker
                    v-else-if="vo.type === 'datetime-ranger'"
                    v-model="form[vo.prop]"
                    type="datetimerange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    style="width: 400px"
                    :disabled="vo.readonly || readonly"
                >
                </el-date-picker>

                <!-- 密码 -->
                <el-input
                    v-else-if="vo.type === 'password'"
                    type="password"
                    v-model="form[vo.prop]"
                    :style="customStyle"
                    :disabled="vo.readonly || readonly"
                    show-password
                ></el-input>

                <!-- 数字 -->
                <el-input-number
                    v-else-if="vo.type === 'number_input'"
                    v-model="form[vo.prop]"
                    :style="customStyle"
                    :precision="vo.precision"
                    :disabled="vo.readonly || readonly"
                    :placeholder="vo.placeholder"
                    :min="vo.min"
                    :max="vo.max"
                >
                </el-input-number>

                <!-- 长文本 -->
                <el-input
                    v-else-if="vo.type === 'textarea'"
                    type="textarea"
                    v-model="form[vo.prop]"
                    :style="vo.width ? `width: ${vo.width}` : ``"
                    :disabled="vo.readonly || readonly"
                    :placeholder="vo.placeholder"
                >
                </el-input>

                <!-- 富文本 -->
                <custom-editor
                    v-else-if="vo.type === 'rich-text'"
                    v-model="form[vo.prop]"
                    :disabled="vo.readonly || readonly"
                    :placeholder="vo.placeholder"
                >
                </custom-editor>

                <!-- 验证码 -->
                <Captcha
                    v-else-if="vo.type === 'captcha'"
                    :username="vo.prop"
                    :event="vo.captchaEvent"
                    v-model="form[vo.prop]"
                    :disabled="vo.readonly || readonly"
                    :placeholder="vo.placeholder"
                >
                </Captcha>
            </el-form-item>
        </template>

        <slot> </slot>
    </el-form>
</template>

<script lang='ts'>
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import {
    CustomDataSource,
    CustomListColumnType,
    CustomListColumn,
    CustomListConf,
} from "../customType";

import CustomSelect from "./select.vue";
import CustomEditor from "./editor.vue";
import CustomCheckbox from "./checkbox.vue";
import { Form as ElForm, Input, Message } from "element-ui";
import Upload from "@/components/custom-list/cps/Upload.vue";
import InputArray from "@/components/custom-list/cps/InputArray.vue";
import YearRangerPicker from "@/components/custom-list/cps/YearRangerPicker.vue";
import Captcha from "./captcha.vue";

@Component({
    name: "CustomForm",
    components: {
        CustomSelect,
        InputArray,
        Upload,
        YearRangerPicker,
        CustomCheckbox,
        CustomEditor,
        Captcha,
    },
})
export default class CustomForm extends Vue {
    @Prop({
        type: Boolean,
        default: false,
    })
    readonly inline!: Boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    readonly readonly!: Boolean;

    @Prop({
        type: Object,
        default: () => {},
    })
    readonly rules!: any;

    @Prop({
        type: Array,
        required: true,
        default: () => [],
    })
    readonly columns!: CustomListColumn[];

    private form: any = {};

    get customStyle() {
        return this.inline ? "width: 200px;" : "";
    }

    public getFormValue() {
        const keys = Object.keys(this.form);
        const res = this.columns.reduce((p, c) => {
            if (
                keys.indexOf(c.prop) > -1 &&
                (!c.editableWhen || c.editableWhen(this, this.form))
            ) {
                p[c.prop] = this.form[c.prop];
            }
            return p;
        }, {} as any);
        console.log({ form: this.form, res });
        return res;
    }

    public init(form = undefined) {
        this.form = form || {};
    }

    public async validate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            (this.$refs.mainform as ElForm).validate(async (valid: boolean) => {
                if (valid) resolve(true);
                reject(valid);
            });
        });
    }
}
</script>

<style lang="scss">
.turbo-form {
    &-col {
        .el-form-item {
            display: flex;
            flex-direction: column;
            &__label {
                text-align: left;
            }
        }
    }
    &-row {
        .el-form-item {
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
    }
}
</style>
