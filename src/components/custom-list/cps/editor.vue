<template>
    <div class="editor-con">
        <vue-editor
            api-key="qzvpc953tr0u7lm5fpd7xd8p7mjpvc1fvpoa16z4gd393tsq"
            v-model="content"
            :init="conf"
            :disabled="disabled"
        ></vue-editor>

        <div style="display: none">
            <UploadVue ref="editorUpload"></UploadVue>
        </div>
    </div>
</template>

<script lang='ts'>
import Editor from '@tinymce/tinymce-vue'
import Vue, { PropType } from 'vue'
import UploadVue from './Upload.vue'
import { Prop, Watch, Component } from 'vue-property-decorator'

@Component({
    name: 'CustomEditor',
    components: {
        VueEditor: Editor,
        UploadVue
    }
})
export default class extends Vue {
    @Prop({
        type: String,
        default: () => ''
    })
    private value!: string;

    @Prop({
        type: String,
        default: () => ''
    })
    private placeholder!: string;

    @Prop({
        type: Boolean,
        default: false
    })
    readonly disabled!: Boolean;

    private conf: any = {
        language_url: '/tinymce/langs/zh-Hans.js',
        language: 'zh-Hans',
        plugins: 'lists link image table code help textcolor wordcount',
        height: 400,
        images_upload_handler: async(
            v: any,
            success: Function,
            failure: Function
        ) => {
            console.log('editor-uploader', v.blob())
            const res = await (this.$refs.editorUpload as UploadVue).upload({
                file: v.blob()
            })
            if (res) {
                console.log('上传成功', res)
                success(res)
            } else {
                failure(res)
            }
        }
    };

    private content: string = this.value;

    mounted() {}

    unmounted() {}

    @Watch('value')
    valueChange() {
        console.log('valueChange', this.value, '----------', this.content)
        // this.$emit("input", this.content);
        this.content = this.value
    }

    @Watch('content')
    contentChange() {
        console.log('contentChange', this.value)
        this.$emit('input', this.content)
    }

    imageUpload() {
        console.log('imageUpload', arguments)
    }
}
</script>

<style lang="scss">
.editor-con {
    display: inline-block;
    position: relative;
}
.tox-tinymce-aux {
    z-index: 99999 !important;
}
</style>
