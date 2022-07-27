import TurboConfirmVue from './turbo-confirm.vue'

export const TurboConfirm = {
    install(vue:any, options = {}) {
        const TurboConfirmConstructor = vue.extend(TurboConfirmVue)
        vue.prototype.$turboConfirm = {
            async confirm(options:TurboConfirmOptions) {
                return new Promise((resolve, reject) => {
                    const currentDom = new TurboConfirmConstructor(options)
                    document.body.appendChild(currentDom.$mount().$el)
                    Object.assign(currentDom, options)
                    currentDom.resolve = resolve
                    currentDom.reject = reject
                })
            }
        }
    }
}

export interface TurboConfirmOptions {
    type?: 'warning'|'success'|'error'
    title: string
    content?: string
    showCancel?: boolean
    showConfirm?: boolean
    cancelText?: string
    confirmText?: string
}

export interface TurboConfirm {
    confirm (options: TurboConfirmOptions): Promise<boolean>
}

declare module 'vue/types/vue' {
    interface Vue {
    /** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
      $turboConfirm: TurboConfirm
    }
}
