/*
 * @Author        : turbo 664120459@qq.com
 * @Date          : 2023-05-23 16:13:04
 * @LastEditors   : turbo 664120459@qq.com
 * @LastEditTime  : 2023-06-11 21:14:20
 * @FilePath      : /nls-admin/src/utils/request.ts
 * @Description   : 
 * 
 * Copyright (c) 2023 by turbo 664120459@qq.com, All Rights Reserved. 
 */
import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getToken } from './cookies'
import router from '@/router'

const service = axios.create({
    baseURL: '/api/',
    timeout: 5000
})

let loginConfirm = false

// Request interceptors
service.interceptors.request.use(
    (config: any) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        try {
            if (config.showLoading) {
                config.loading = Loading.service({
                    lock: true,
                    text: config.showLoading === true ? 'Loading' : config.showLoading,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            }
        } catch (error) {
            console.error(error)
        }
        console.log('[REQ]', config)
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

// Response interceptors
service.interceptors.response.use(
    (response) => {
        console.log('【RESPONSE】', response)
        try {
            const { config: { loading } }: any = response
            if (loading) {
                loading.close()
            }
            if (response.data instanceof Blob) {
                const filename = response.headers["content-disposition"];
                const blob = new Blob([response.data]);
                var downloadElement = document.createElement("a");
                var href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                downloadElement.download = decodeURIComponent(filename.split("filename=")[1]);
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
            }
        } catch (error) {

        }
        return response.data
    },
    (error) => {
        console.log('[RESP-ERR]', error.response, error.response.status, router.currentRoute)
        try {
            const { config: { loading } }: any = error
            if (loading) {
                loading.close()
            }
        } catch (error) {

        }
        if ((error.response.status == 401) && router.currentRoute.name != 'login') {
            console.log('需要登录', error.response.status)
            if (loginConfirm) return
            loginConfirm = true

            return MessageBox.confirm(
                '登录已过期，需要重新登录',
                '退出',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                UserModule.ResetToken()
                // location.reload() // To prevent bugs from vue-router
                return router.push({
                    path: '/login'
                })
            }).finally(() => {
                loginConfirm = false
            })
        }
        if (typeof error.response.data.message !== 'undefined') {
            if (error.response.data.message instanceof Array) {
                Message.error(error.response.data.message.join('、'))
            } else {
                Message.error(error.response.data.message)
            }
        } else {
            Message.error(error.response.data.error || error)
        }

        return Promise.reject(error.response.data || error.response.data.error || error)
    }
)

export default service
