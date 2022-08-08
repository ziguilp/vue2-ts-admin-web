<template>
    <div>
        <el-input placeholder="请输入验证码" v-model="captcha">
            <template slot="append">
                <el-button
                    @click="sendCaptchaFn"
                    :disabled="sended && sendTimeout > 0"
                    >{{ btnStr }}</el-button
                >
            </template>
        </el-input>
    </div>
</template>

<script lang='ts'>
import { sendCaptcha } from "@/api/other";
import moment from "moment";
import Vue, { PropType } from "vue";
import { Prop, Watch, Component } from "vue-property-decorator";

@Component({
    name: "CustomCaptcha",
    components: {},
})
export default class extends Vue {
    @Prop({
        type: String,
        default: () => "",
    })
    username!: string;

    @Prop({
        type: String,
        default: () => "",
    })
    event!: string;

    @Prop({
        type: String,
        default: () => "",
    })
    size!: string;

    /**
     * 冷却时间s
     */
    private freezoneTime = 60;

    private captcha: string = "";

    private sended: boolean = false;

    get btnStr() {
        if (!this.sended) return "发送验证码";
        if (this.sendTimeout > 0) {
            return `重新发送${this.sendTimeout}s`;
        }
        return `重新发送`;
    }

    private sendTime: any = null;
    private sendTimeout: number = 0;

    private timer: any = null;

    @Watch("captcha")
    captchaChange() {
        this.$emit("input", this.captcha);
    }

    async sendCaptchaFn() {
        if (this.sended && this.timer) {
            return;
        }
        if (!this.username) {
            return this.$message.error(`用户名无效`);
        }

        const res = await sendCaptcha({
            username: this.username,
            event: this.event as any,
        });
        if (!res) return;

        try {
            this.sendTime = moment();
            this.sended = true;
            this.timer = setInterval(() => {
                this.sendTimeout =
                    this.freezoneTime - moment().diff(this.sendTime, "second");
                if (this.sendTimeout <= 0) {
                    clearInterval(this.timer);
                }
            }, 90);
        } catch (error) {
            console.error(error);
        }
    }
}
</script>