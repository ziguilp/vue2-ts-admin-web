<template>
    <div class="turbo-year-range">
        <el-date-picker v-model="rangeStart" :default-value="'2021-01-01'" type="year" placeholder="选择开始年" :picker-options="{disabledDate: disabledDateFn}">
        </el-date-picker>
        <span>{{ splitStr }}</span>
        <el-date-picker v-model="rangeEnd"  :default-value="max" type="year" placeholder="选择结束年" :picker-options="{disabledDate: disabledDateFn}">
        </el-date-picker>
    </div>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
export default Vue.extend({
    name: 'YearRangerPicker',
    props: {
        splitStr: {
            type: String,
            default: '~'
        },
        min: { type: Date },
        max: { type: Date }
    },
    data() {
        const dataObj: any = {
            rangeStart: '',
            rangeEnd: ''
        }
        return dataObj
    },
    watch: {
        rangeStart(v: Date) {
            if (v) {
                if (this.min && v.getFullYear() < (this.min as any).getFullYear()) {
                    return this.$alert(`最小年份不得小于${moment(this.min).format('YYYY')}`)
                }
                if (!this.rangeEnd) {
                    this.rangeEnd = v
                } else {
                    if (this.rangeEnd < v) {
                        this.rangeEnd = v
                    }
                }
                this.input()
            }
        },
        rangeEnd(v: Date) {
            if (v) {
                if (this.max && v.getFullYear() > (this.max as any).getFullYear()) {
                    return this.$alert(`最大年份不得大于${moment(this.max).format('YYYY')}`)
                }
                if (!this.rangeStart) {
                    this.rangeStart = v
                }
                if (this.rangeStart > v) {
                    this.rangeEnd = v
                    this.rangeStart = v
                }
                this.input()
            }
        }
    },
    created() {

    },
    methods: {
        input() {
            this.$emit('input', [this.rangeStart, this.rangeEnd])
        },
        disabledDateFn(e:Date) {
            if (this.min && (this.min as any).getFullYear() - e.getFullYear() > 0) {
                return true
            }
            if (this.max && (this.max as any).getFullYear() - e.getFullYear() < 0) {
                return true
            }
            return false
        }
    }
})
</script>

<style lang="scss" scoped>
.turbo-year-range {
    display: flex;
    align-items: center;
}
</style>
