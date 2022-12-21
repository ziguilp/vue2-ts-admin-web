import moment from 'moment'
import * as qiniu from 'qiniu-js'
import request from '@/utils/request'
import axios from 'axios'
import settings from '@/settings'
import aliOss from 'ali-oss'

export class qiniuUpload {
    private token = '';

    private alisOssToken: any = null;

    private domain = '';

    private platform: 'aliyun' | 'qiniu';

    constructor(platform: 'aliyun' | 'qiniu' = 'aliyun') {
        this.platform = platform
    }

    /**
     * 获取token
     * @returns string
     */
    async getToken() {
        if (this.platform === 'qiniu') {
            return await this.getQiniuOssToken()
        }
        return await this.getAliOssToken()
    }

    /**
     * 获取七牛的token
     * @returns
     */
    async getQiniuOssToken() {
        if (!this.token) {
            const { token, domain } = ((await request.get('/common/qiniu/uploadToken')).data)
            this.token = token
            this.domain = domain
            console.log(this.token, this.domain)
        }
        return this.token
    }

    /**
     * 获取阿里云OSS的token
     * @returns
     */
    async getAliOssToken() {
        if (!this.alisOssToken) {
            const { SecurityToken, AccessKeyId, AccessKeySecret, Expiration, bucket, region, domain } = ((await request.get('/common/alioss/uploadToken')).data)
            this.alisOssToken = {
                SecurityToken, AccessKeyId, AccessKeySecret, Expiration, bucket, region
            }
            this.domain = domain
            console.log(this.token, this.domain)
        }
        return this.alisOssToken
    }

    async upload(file: File, progressFn?: Function): Promise<string> {
        if (this.platform === 'qiniu') {
            return await this.uploadQiniu(file, progressFn)
        }

        return await this.uploadAliOss(file, progressFn)
    }

    /**
     * 上传
     * @param {string}} filePath
     */
    async uploadQiniu(file: File, progressFn?: Function): Promise<string> {
        return new Promise(async(resolve, reject) => {
            const fileExt = file.name.replace(/.*?\.(.*?)$/, '$1')
            const fileNameForQn = `${settings.uploadDir}/` + moment().format('YYYYMMDD') + '/' + moment().format('YYYYMMDDHHmmss') + Math.ceil(Math.random() * 100000) + `.${fileExt}`

            const observable = qiniu.upload(file, fileNameForQn, await this.getToken(), {

            }, {
                useCdnDomain: true,
                region: qiniu.region.z2
            })

            observable.subscribe({
                next: (e: any) => {
                    console.log('==uploading==', e)
                    progressFn && progressFn(e)
                },
                error: (err: any) => {
                    console.error(err)
                    reject(err)
                },
                complete: (res: any) => {
                    console.log('==uploadcomplete==', res)
                    if (res && res.key) {
                        resolve(`${this.domain}/` + res.key)
                    } else {
                        reject(res)
                    }
                }
            })
        })
    }

    /**
     * 阿里云上传
     */
    async uploadAliOss(file: File, progressFn?: Function): Promise<string> {
        const token = await this.getToken()
        const client = new aliOss({
            // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
            region: token.region,
            // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
            accessKeyId: token.AccessKeyId,
            accessKeySecret: token.AccessKeySecret,
            // 从STS服务获取的安全令牌（SecurityToken）。
            stsToken: token.SecurityToken,
            refreshSTSToken: async() => {
                // 向您搭建的STS服务获取临时访问凭证。
                return await this.getAliOssToken()
            },
            // 刷新临时访问凭证的时间间隔，单位为毫秒。
            refreshSTSTokenInterval: 120000,
            // 填写Bucket名称。
            bucket: token.bucket
        })

        const fileExt = file.name.replace(/.*?\.(.*?)$/, '$1')
        const fileNameForQn = `${settings.uploadDir}/` + moment().format('YYYYMMDD') + '/' + moment().format('YYYYMMDDHHmmss') + Math.ceil(Math.random() * 100000) + `.${fileExt}`

        const r1 = await client.put(fileNameForQn, file)

        console.log(r1)

        return r1.url
    }
}
