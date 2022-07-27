<template>
    <el-dialog
        class="turbo-confirm"
        :visible.sync="dialogVisible"
        width="500px"
        :show-close="false"
        :before-close="beforeClose">
        <div class="turbo-confirm-body">
            <i class="confirm-icon el-icon-warning-outline" v-if="type==='warning'" style="color: #E6A23C;"></i>
            <i class="confirm-icon el-icon-circle-close" v-if="type==='error'" style="color: #F56C6C;"></i>
            <i class="confirm-icon el-icon-circle-check" v-if="type==='success'" style="color: #67C23A;"></i>
            <h3 class="confirm-title">{{title}}</h3>
            <p class="confirm-content">{{content}}</p>
        </div>
        <span slot="footer" class="turbo-confirm-footer">
            <el-button v-if="showCancel" @click="close">取 消</el-button>
            <el-button v-if="showConfirm" type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>

export default {
    name: 'turbo-confirm-component',
    props: {
        type: String,
        title: String,
        content: String,
        showCancel: {
            type: Boolean,
            default: true
        },
        showConfirm: {
            type: Boolean,
            default: true
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        confirmText: {
            type: String,
            default: '确定'
        }
    },
    data() {
        return {
            dialogVisible: true
        }
    },
    methods: {
        show() {
            this.dialogVisible = true
        },
        close() {
            if (this.reject) {
                this.reject(false)
            }
            this.dialogVisible = false
        },
        confirm() {
            if (this.resolve) {
                this.resolve(true)
            }
            this.close()
            this.$emit('confirm', true)
        },
        beforeClose() {
            this.close()
            this.$emit('cancel', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.turbo-confirm{
    &-body{
        display: flex;
        flex-direction: column;
        align-items: center;
        .confirm{
            &-icon{
                font-size: 80px;
            }
            &-title{
                font-size: 24px;
                color: #333;
            }
            &-content{
                font-size: 14px;
                color: #999;
            }
        }
    }
    &-footer{
        display: flex;
        justify-content: center;
        .el-button{
            &+.el-button{
                margin-left: 20px;
            }
        }
    }
}
</style>
