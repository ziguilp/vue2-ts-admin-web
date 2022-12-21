<template>
    <div class="turbo-form text-left">
        <el-dialog :loading="false" :title="readonly ? '角色' : (form && form.id ? '修改' : '新增')"
            :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
            <div>
                <el-form class="mainform" ref="mainform" :rules="formRules" :inline="false" :model="form"
                    label-width="120px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="" :readonly="readonly"></el-input>
                    </el-form-item>

                    <el-form-item label="说明" prop="explain">
                        <el-input v-model="form.explain" placeholder="" :readonly="readonly"></el-input>
                    </el-form-item>

                    <el-form-item label="权限">
                        <el-tree
                            ref="tree"
                            :data="authRights"
                            show-checkbox
                            node-key="key"
                            :default-expanded-keys="[]"
                            :props="treeProps">
                        </el-tree>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="readonly" @click="dialogVisible = false">关 闭</el-button>
                <el-button v-if="!readonly" @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!readonly" type="primary" @click="handleSave()">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input, Message, Tree } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { createRole, updateRole } from '@/api/role'

@Component({
    name: 'roleEdit'
})
export default class extends Vue {
    private loading = false
    private dialogVisible = false
    private readonly = false
    private form: any = {
        rights: []
    }

    get authRights() {
        return UserModule.permissionList
    }

    get treeProps() {
        return {
            label: (data:any, node:any) => {
                return data.name
            }
        }
    }

    private datePickerOptions = {
        disabledDate(time: Date) {
            return time.getTime() < Date.now() - 8.64e7
        }
    }

    private formRules = {
        name: [
            {
               required: true, message: '请填写角色名称', trigger: 'blur'
            }
        ],
        explain: [
            {
               required: true, message: '请填写角色说明', trigger: 'blur'
            }
        ]
    }

    public async init({ form = {}, readonly = true }: any = {}) {
        this.loading = true
        await UserModule.GetPermission({ refresh: true })
        this.readonly = readonly
        this.dialogVisible = true
        if (form) {
            this.form = form
            if (form.rights) {
                this.setCheckedKeys(form.rights)
            }
        } else {
            this.form = {
                rights: []
            }
            this.setCheckedKeys([])
        }
        this.loading = false
    }

    public handleClose() {
        this.dialogVisible = false
    }

    private handleSave() {
        (this.$refs.mainform as ElForm).validate(async(valid: boolean) => {
            console.log(this.$refs.mainform)

            if (valid) {
                this.loading = true
                if (this.form.id) {
                    const res = await updateRole({
                        ...this.form,
                        rights: this.getCheckedKeys()
                    })
                    this.loading = false
                    if (res) {
                        this.handleClose()
                    }
                } else {
                    const res = await createRole({
                        ...this.form,
                        rights: this.getCheckedKeys()
                    })
                    this.loading = false
                    if (res) {
                        this.handleClose()
                    }
                }
                this.$emit('refresh')
            } else {
                console.log('error submit!!')
                return false
            }
        })
    }

    private getCheckedKeys() {
        return (this.$refs.tree as Tree).getCheckedNodes(false, true).map((e:any) => e.key) || []
    }

    private setCheckedKeys(keys:string[]) {
        if (!this.$refs.tree) {
            setTimeout(() => {
                this.setCheckedKeys(keys)
            }, 100)
            return
        }

        const parentKeys:string[] = this.authRights.map((e) => e.key)
        const ckeys = keys.filter(k => parentKeys.indexOf(k) == -1);
        (this.$refs.tree as Tree).setCheckedKeys(ckeys)
        console.log({
            keys,
            parentKeys,
            ckeys
        })
    }
}
</script>
