<template>
    <el-card class="mobile skubind">
        <div class="text-title" slot="header">书籍SKU编码绑定</div>
        <el-form
            class="u-m-t-20"
            ref="bindform"
            :model="form"
            label-width="80px"
        >
            <el-form-item label="库位">
                <el-input
                    v-model="form.located"
                    ref="locInput"
                    @change="locatedInput"
                ></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
                <el-input
                    v-model="form.isbn"
                    ref="isbnInput"
                    @change="submit"
                ></el-input>
            </el-form-item>
            <el-form-item label="SKUNO">
                <el-input
                    v-model="form.skuNo"
                    ref="isbnSkuno"
                    @change="submit"
                ></el-input>
            </el-form-item>
            <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                type="primary"
                class="submit u-flex-1"
                @click="submit"
                >提交</el-button
            >
        </el-form>
    </el-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
    CustomListColumnType,
    CustomListConf,
} from "@/components/custom-list/customType";
import { bindSku } from "@/api/sku";
import { printLocated } from "@/api/other";
import { IpageDataDto } from "@/api/types";
import { ElInput } from "element-ui/types/input";
import { getSkuNo, isIsbn } from "@/utils/util";

@Component({
    name: "CateList",
    components: {},
})
export default class extends Vue {
    private form: any = {
        isbn: "",
        skuNo: "",
        located: "",
    };

    private fullscreenLoading: boolean = false;

    private locatedInput() {
        (this.$refs.isbnInput as ElInput).focus();
    }

    private async submit() {
        try {
            console.log("turboAudioTip", this.$turboAudioTip);
            this.$turboAudioTip.error();
        } catch (error) {
            console.error(error);
        }
        let { isbn, skuNo, located } = this.form;
        if (!isIsbn(isbn)) {
            this.$turboAudioTip.error();
            return this.$message({
                message: "ISBN无效",
                type: "error",
            });
        }

        if (!getSkuNo(skuNo)) {
            return (this.$refs.isbnSkuno as ElInput).focus();
        }

        this.fullscreenLoading = true;

        const res = await bindSku({
            isbn,
            skuNo: getSkuNo(skuNo),
            located,
        }).catch((e) => {
            this.$turboAudioTip.error();
            this.fullscreenLoading = false;
        });

        if (res) {
            this.form.isbn = "";
            this.form.skuNo = "";
            this.fullscreenLoading = false;
            this.$turboAudioTip.success();
            return (this.$refs.isbnInput as ElInput).focus();
        }
    }
}
</script>

<style lang="scss" scoped>
.submit {
    width: 100%;
}
</style>