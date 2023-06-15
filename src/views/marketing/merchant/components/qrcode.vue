<template>
    <el-drawer
        v-loading="loading"
        :title="title"
        :visible.sync="show"
        :direction="'rtl'"
    >
        <div class="qrcode-body">
            <el-image :src="url"></el-image>
            <div class="text">该二维码有效期10分钟</div>
            <div class="text">可用于管理员和业务员绑定</div>
        </div>
    </el-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import QRCode from "qrcode";
import { getMerchantInfo } from "@/api/merchant";
@Component({
    name: "Qrcode",
    components: {},
})
export default class extends Vue {
    @Prop({
        type: String,
        default: () => "",
    })
    title: string = "";

    private show: boolean = false;
    private loading: boolean = false;

    private url: string = "";

    public async init(mid: number) {
        this.show = true;
        this.loading = true;
        const merchant = await getMerchantInfo(mid);
        // @ts-ignore
        this.draw(merchant.qrcode_url);
    }

    private async draw(text: string) {
        QRCode.toDataURL(text)
            .then((url) => {
                console.log(url);
                this.url = url;
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
</script>

<style lang="scss" scoped>
.qrcode-body {
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .text {
        margin-top: 10px;
    }
}
</style>