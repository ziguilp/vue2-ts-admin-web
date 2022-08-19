<template>
    <el-skeleton v-if="loading" />
    <div class="cms-main" v-else>
        <div class="cms-header">
            {{ data.title }}
        </div>
        <div class="cms-content" v-html="data.content"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CmsContent, getCmsDetailByAlias, getCmsDetailById } from "@/api/cms";

@Component({
    name: "CmsPreview",
    components: {},
})
export default class extends Vue {
    private data!: CmsContent;

    private loading: boolean = true;

    mounted() {
        this.getContent();
    }

    activated() {
        console.log("activated", this.$route.query);
    }

    get alias() {
        return this.$route.params.alias;
    }

    async getContent() {
        try {
            this.loading = true;
            if (this.alias) {
                this.data = await getCmsDetailByAlias(this.alias as any);
                console.log("data", this.data);
                document.title = this.data.title;
            } else {
                this.$message(`error`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
.cms {
    &-main {
        padding: 15px;
        margin: auto;
        @media screen and (min-width: 770px) {
            width: 740px;
        }
    }
    &-header {
        line-height: 1.5;
        font-size: 24px;
        color: #333;
        font-weight: 600;
        text-align: center;
    }
    &-content {
        line-height: 1.5;
        margin-top: 20px;
        font-weight: #4d4d4d;
    }
}
</style>