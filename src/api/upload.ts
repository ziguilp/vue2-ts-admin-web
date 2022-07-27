import moment from 'moment'
import * as qiniu from 'qiniu-js'
import request from '@/utils/request'
import axios from 'axios';
import settings from '@/settings';

export class qiniuUpload {
    private token = '';

    private domain = 'https://img.qn.woody.tsingc.com';

    /**
     * 获取token
     * @returns string
     */
    async getToken() {
        if (!this.token) {
            const { token, domain } = ((await request.get('/common/qiniu/uploadToken')).data)
            this.token = token
            this.domain = domain
            console.log(this.token, this.domain)
        }
        return this.token
    }

    /**
     * 上传
     * @param {string}} filePath
     */
    async upload(file:File, progressFn?: Function):Promise<string> {
        return new Promise(async(resolve, reject) => {
            const fileExt = file.name.replace(/.*?\.(.*?)$/, '$1')
            const fileNameForQn = `${settings.uploadDir}/` + moment().format('YYYYMMDD') + '/' + moment().format('YYYYMMDDHHmmss') + Math.ceil(Math.random() * 100000) + `.${fileExt}`

            const observable = qiniu.upload(file, fileNameForQn, await this.getToken(), {

            }, {
                useCdnDomain: true,
                region: qiniu.region.z2
            })

            observable.subscribe({
                next: (e:any) => {
                    console.log('==uploading==', e)
                    progressFn && progressFn(e)
                },
                error: (err:any) => {
                    console.error(err)
                    reject(err)
                },
                complete: (res:any) => {
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
}
