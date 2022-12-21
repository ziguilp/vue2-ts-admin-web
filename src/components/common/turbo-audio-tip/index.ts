import TurboAudioTipVue from './turbo-audio-tip.vue'

export const TurboAudioTip = {
    install(vue: any, options = {}) {
        // const initDom = () => {
        //     const TurboAudioTipConstructor = vue.extend(TurboAudioTipVue)

        //     console.log('currentDom.$mount().$el', currentDom.$mount().$el)
        // }
        try {
            const TurboAudioTipConstructor = vue.extend(TurboAudioTipVue)

            vue.prototype.$turboAudioTip = {
                success(src = 'https://h5-static.woody.tsingc.com/audio/operate_success.mp3') {
                    const currentDom = new TurboAudioTipConstructor({ ...options })
                    currentDom.play(src)
                    document.body.appendChild(currentDom.$mount().$el)
                    return true
                },
                failed(src = 'https://h5-static.woody.tsingc.com/audio/operate_failed.mp3') {
                    const currentDom = new TurboAudioTipConstructor({ ...options })
                    currentDom.play(src)
                    document.body.appendChild(currentDom.$mount().$el)
                    return true
                },
                error(src = 'https://h5-static.woody.tsingc.com/audio/error.mp3') {
                    const currentDom = new TurboAudioTipConstructor({ ...options })
                    currentDom.play(src)
                    document.body.appendChild(currentDom.$mount().$el)
                    return true
                }
            }
        } catch (error) {

        }
    }
}

export interface TurboAudioTipProp {
    success(src?: string): boolean
    failed(src?: string): boolean
    error(src?: string): boolean
}

declare module 'vue/types/vue' {
    interface Vue {
        /** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
        $turboAudioTip: TurboAudioTipProp
    }
}
