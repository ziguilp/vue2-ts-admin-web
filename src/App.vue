<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
    name: 'App'
})
export default class App extends Vue {
    get permission() {
        return this.$store.state.user
    }

    mounted() {
        console.log('appmounted', this.$route)
        UserModule.StartRefreshToken()
        UserModule.GetPermission({ refresh: true })
    }

    beforeDestroy() {
        console.log('销毁定时器')
        UserModule.StopRefreshToken()
    }
}
</script>
