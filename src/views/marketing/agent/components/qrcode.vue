<!--
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-06-15 08:33:51
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-15 08:41:22
 * @FilePath      : /nls-admin/src/views/marketing/agent/components/qrcode.vue
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
-->
<template>
    <el-drawer
        v-loading="loading"
        :title="title"
        :visible.sync="show"
        :direction="'rtl'"
    >
        <div class="qrcode-body">
            <el-image :src="url"></el-image>
            <div class="text">该二维码可用于店主和店员绑定</div>
        </div>
    </el-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import QRCode from "qrcode";
import { getMerchantInfo } from "@/api/merchant";
import { AgentInfo } from "@/api/agent";
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

    public async init(agent: AgentInfo) {
        this.show = true;
        this.loading = true;
        const url = `https://nls.tsingc.com/act/mchag?e=${agent.agent_code}`;
        // @ts-ignore
        this.draw(url);
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