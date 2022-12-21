<template>
    <div class="custom-upload">
        <el-upload
            action=""
            :disabled="disabled"
            :show-file-list="false"
            :accept="accept"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            :http-request="upload"
        >
            <div :class="`upload-show ${disabled ? 'disabled' : ''}`">
                <slot v-bind:uploaded="uploaded">
                    <ul class="file-list">
                        <template v-for="(vo, i) in uploaded">
                            <li
                                class="file-list-item"
                                v-if="IsImage"
                                :key="`c-upload-item-${i}-${vo.url}`"
                            >
                                <el-progress
                                    class="file-list-item-progress"
                                    :width="79"
                                    v-if="vo.uploading"
                                    type="circle"
                                    :percentage="vo.progress.percent"
                                ></el-progress>
                                <div class="file-list-item-wrap" v-else>
                                    <div
                                        class="file-list-item-file-mask"
                                        @click.stop="onDelete(i)"
                                        v-if="max > 1"
                                    >
                                        <i class="el-icon-delete tool-icon"></i>
                                    </div>
                                    <el-image
                                        class="file-list-item-file"
                                        :src="vo.url"
                                        fit="cover"
                                        :preview-src-list="
                                            uploaded.map((e) => e.url)
                                        "
                                    ></el-image>
                                </div>
                            </li>
                            <li
                                class="file-list-item"
                                v-else
                                :key="`c-upload-item-${i}-${vo.url}`"
                            >
                                {{ vo.url }}
                            </li>
                        </template>
                        <li
                            class="file-list-item"
                            v-if="max > uploaded.length && uploadingNum === 0"
                        >
                            <i class="upload-icon el-icon-plus"></i>
                        </li>
                    </ul>
                </slot>
            </div>
        </el-upload>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { qiniuUpload } from '@/api/upload'
import { Component, Prop, Watch } from 'vue-property-decorator'

interface UploadProgres {
    loaded: number
    percent: number
    size: number
}

interface UploadedFile {
    uid: string
    url: string
    file?: File
    uploading: boolean
    progress: UploadProgres
}

@Component({
    name: 'customUpload'
})
export default class extends Vue {
    @Prop({
        type: Boolean,
        default: true
    })
    private showFileList!: boolean;

    @Prop({
        type: Number,
        default: 1
    })
    readonly max!: number;

    @Prop({
        type: Boolean,
        default: false
    })
    readonly disabled!: Boolean;

    @Prop({
        type: [String, Array],
        default: () => []
    })
    private value: string | string[] = '';

    @Prop({
        type: String,
        default: 'image/png, image/jpeg'
    })
    private accept!: string;

    get finalVal() {
        return this.max === 1
            ? this.uploaded.length >= 1
                ? this.uploaded[0].url
                : 0
            : this.uploaded.map((e) => e.url)
    }

    get IsImage() {
        return /image/.test(this.accept)
    }

    get uploadingNum() {
        return this.uploaded.filter((e) => e.uploading).length
    }

    get modelVal() {
        return this.value
    }

    @Watch('modelVal', {
        deep: true
    })
    changeModelVal() {
        setTimeout(() => {
            let images: string[] =
                this.value instanceof Array ? this.value : []
            if (typeof this.value === 'string') {
                images = [this.value]
            }
            console.log('init-images', images)
            this.uploaded = images.map((uri: string) => {
                return {
                    uid: uri,
                    url: uri,
                    uploading: false,
                    progress: {
                        loaded: 0,
                        percent: 100,
                        size: 0
                    }
                } as UploadedFile
            })
        })
    }

    private uploaded: UploadedFile[] = [];

    public updateUploadItem(e: UploadedFile) {
        const i = this.uploaded.findIndex((item) => item.uid === e.uid)
        if (i > -1) {
            this.uploaded[i] = e
        } else {
            if (this.max === 1) {
                this.uploaded = [e]
            } else {
                this.uploaded.push(e)
            }
        }
    }

    private onDelete(i: number) {
        this.uploaded.splice(i, 1)
        this.$emit('input', this.finalVal)
    }

    private onSuccess(e: any) {
        console.log('onSuccess', e)
    }

    private beforeUpload(e: any) {
        console.log('beforeUpload', e)
    }

    public async upload(e: any) {
        console.log('upload', e)
        if (this.uploaded.findIndex((item) => item.uid === e.uid) > -1) return
        const uploadingItem: UploadedFile = {
            uid: e.uid,
            url: '',
            file: e.file,
            uploading: true,
            progress: {
                loaded: 0,
                percent: 0,
                size: e.file.size
            }
        }
        this.updateUploadItem(uploadingItem)
        const qn = new qiniuUpload()
        const res = await qn
            .upload(e.file, (p: any) => {
                console.log('upload-gp', p)
                uploadingItem.progress = {
                    ...p.total,
                    percent: parseInt(p.total.percent)
                }
                this.updateUploadItem(uploadingItem)
            })
            .catch((e) => {
                console.error(e)
                this.$message.error(e.message)
            })
            .finally(() => {
                uploadingItem.uploading = false
                this.updateUploadItem(uploadingItem)
            })
        console.log('===上传结果===', res)
        if (res) {
            uploadingItem.url = res
            this.updateUploadItem(uploadingItem)
            this.$emit('input', this.finalVal)
        }
        return res
    }
}
</script>

<style lang="scss" scoped>
.upload {
    &-show {
        position: relative;
        &.disabled {
            cursor: not-allowed;
        }
        .file-list {
            display: grid;
            grid-auto-columns: 80px;
            grid-auto-rows: 80px;
            grid-row-gap: 10px;
            grid-column-gap: 10px;
            padding-inline-start: 10px;
            &-item {
                list-style: none;
                height: 80px;
                width: 80px;
                border: 1px dotted #dedede;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                &-progress {
                    width: 100%;
                    height: 100%;
                }
                .upload-icon {
                    font-size: 30px;
                    height: 30px;
                    width: 30px;
                    color: #dedede;
                }
                &-wrap {
                    display: flex;
                    position: relative;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    &:hover {
                        .file-list-item-file-mask {
                            display: flex;
                        }
                    }
                }
                &-file {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    img {
                        height: 100%;
                        width: 100%;
                    }
                    &-mask {
                        position: absolute;
                        z-index: 1;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        display: none;
                        justify-content: center;
                        align-items: center;
                        .tool-icon {
                            font-size: 30px;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    &-progress {
        position: absolute;
        width: 100%;
        height: 20%;
        content: "";
        bottom: 0;
        background-color: #1890ff75;
        transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.5s;
    }
}
</style>
