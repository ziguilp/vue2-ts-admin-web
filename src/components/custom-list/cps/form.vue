<template>
    <el-form
        ref="mainform"
        :inline="inline"
        :rules="rules"
        :model="form"
        label-width="80px"
    >
        <el-form-item
            v-for="(vo, i) in columns"
            :label="vo.label || vo.prop"
            :prop="vo.prop"
            :key="`custom-el-form-item-${vo.prop}-${i}`"
            :style="
                vo.type === 'textarea' ||
                vo.type === 'image' ||
                vo.type === 'images'
                    ? 'width: 100%;'
                    : inline
                    ? 'width:auto'
                    : ''
            "
        >
            <!-- δΈζιζ© -->
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

            <!-- δΈδΌ  -->
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

            <!-- θΎε₯ζ‘ -->
            <el-input
                v-else-if="vo.type === 'text'"
                v-model="form[vo.prop]"
                :placeholder="vo.placeholder"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
                :clearable="true"
            ></el-input>

            <!-- ζ°η»θΎε₯ζ‘ -->
            <InputArray
                v-else-if="vo.type === 'text-array'"
                v-model="form[vo.prop]"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
            ></InputArray>

            <!-- εΉ΄ -->
            <el-date-picker
                v-else-if="vo.type === 'year'"
                v-model="form[vo.prop]"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
                type="year"
                :placeholder="vo.placeholder"
            >
            </el-date-picker>

            <!-- εΉ΄εΊι΄ -->
            <YearRangerPicker
                v-else-if="vo.type === 'year-ranger'"
                v-model="form[vo.prop]"
                style="width: 300px"
                :disabled="vo.readonly || readonly"
                :placeholder="vo.placeholder"
            >
            </YearRangerPicker>

            <!-- ζ₯ζ -->
            <el-date-picker
                v-else-if="vo.type === 'date'"
                v-model="form[vo.prop]"
                type="date"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
            >
            </el-date-picker>

            <!-- ζ₯ζεΊι΄ -->
            <el-date-picker
                v-else-if="vo.type === 'date-ranger'"
                v-model="form[vo.prop]"
                type="daterange"
                range-separator="~"
                start-placeholder="εΌε§ζ₯ζ"
                end-placeholder="η»ζζ₯ζ"
                style="width: 300px"
                :disabled="vo.readonly || readonly"
            >
            </el-date-picker>

            <!-- ζ₯ζζΆι΄ -->
            <el-date-picker
                v-else-if="vo.type === 'datetime'"
                v-model="form[vo.prop]"
                type="datetime"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
            >
            </el-date-picker>

            <!-- ζ₯ζζΆι΄εΊι΄ -->
            <el-date-picker
                v-else-if="vo.type === 'datetime-ranger'"
                v-model="form[vo.prop]"
                type="datetimerange"
                start-placeholder="εΌε§ζΆι΄"
                end-placeholder="η»ζζΆι΄"
                style="width: 400px"
                :disabled="vo.readonly || readonly"
            >
            </el-date-picker>

            <!-- ε―η  -->
            <el-input
                v-else-if="vo.type === 'password'"
                type="password"
                v-model="form[vo.prop]"
                :style="customStyle"
                :disabled="vo.readonly || readonly"
                show-password
            ></el-input>

            <!-- ζ°ε­ -->
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

            <!-- ιΏζζ¬ -->
            <el-input
                v-else-if="vo.type === 'textarea'"
                type="textarea"
                v-model="form[vo.prop]"
                :style="vo.width ? `width: ${vo.width}` : ``"
                :disabled="vo.readonly || readonly"
                :placeholder="vo.placeholder"
            >
            </el-input>

            <!-- ε―ζζ¬ -->
            <custom-editor
                v-else-if="vo.type === 'rich-text'"
                v-model="form[vo.prop]"
                :disabled="vo.readonly || readonly"
                :placeholder="vo.placeholder"
            >
            </custom-editor>

            <!-- ιͺθ―η  -->
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

        <slot> </slot>
    </el-form>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { CustomDataSource, CustomListColumnType, CustomListColumn, CustomListConf } from '../customType'

import CustomSelect from './select.vue'
import CustomEditor from './editor.vue'
import CustomCheckbox from './checkbox.vue'
import { Form as ElForm, Input, Message } from 'element-ui'
import Upload from '@/components/custom-list/cps/Upload.vue'
import InputArray from '@/components/custom-list/cps/InputArray.vue'
import YearRangerPicker from '@/components/custom-list/cps/YearRangerPicker.vue'
import Captcha from './captcha.vue'

@Component({
    name: 'CustomForm',
    components: {
        CustomSelect,
        InputArray,
        Upload,
        YearRangerPicker,
        CustomCheckbox,
        CustomEditor,
        Captcha
    }
})
export default class CustomForm extends Vue {
    @Prop({
        type: Boolean,
        default: true
    })
    readonly inline!: Boolean;

    @Prop({
        type: Boolean,
        default: false
    })
    readonly readonly!: Boolean;

    @Prop({
        type: Object,
        default: () => {}
    })
    readonly rules!: any;

    @Prop({
        type: Array,
        required: true,
        default: () => []
    })
    readonly columns!: CustomListColumn[];

    private form: any = {};

    get customStyle() {
        return this.inline ? 'width: 200px;' : ''
    }

    public getFormValue() {
        return this.form
    }

    public init(form = undefined) {
        this.form = form || {}
    }

    public async validate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            (this.$refs.mainform as ElForm).validate(async(valid: boolean) => {
                if (valid) resolve(true)
                reject(valid)
            })
        })
    }
}
</script>

<style>
</style>
