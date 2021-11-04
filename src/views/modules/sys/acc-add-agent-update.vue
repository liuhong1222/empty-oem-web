<template>
    <el-dialog :title="!accountdataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='closeDialog'>
        <el-form :model="accountdataForm" :rules="accdatarules" ref="accountdataFormref" label-width="150px" class="demo-ruleForm"
            :label-position="labelPosition">
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="accountdataForm.username" placeholder="请输入用户名" :disabled="accountdataForm.id"></el-input>
            </el-form-item>
            <el-form-item label="代理商：" prop="agent">
                <el-select style="width: 100%" class="filter-item" v-model="accountdataForm.agent" placeholder="请选择代理商">
                    <el-option v-for="item in agentList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名：" prop="nickname">
                <el-input v-model="accountdataForm.nickname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="accountdataForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="accountdataForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="accountdataForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="accDataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import md5 from 'js-md5';
    import { isEmail, isMobile } from '@/utils/validate'
    export default {
        data() {
            return {
                visible: false,
                readonly: false,
                labelPosition: 'right',
                accountdataForm: {
                    id: 0,
                    // agentNumber: '',
                    name: '',
                    mobile: '',
                    email: '',
                    password: ''
                },
                agentList: []
            }
        },
        computed: {
            accdatarules() {
                let validateMobile = (rule, value, callback) => {
                    if (!isMobile(value)) {
                        callback(new Error('手机号格式错误'))
                    } else {
                        callback()
                    }
                }
                let validateEmail = (rule, value, callback) => {
                    if (!isEmail(value)) {
                        callback(new Error('邮箱格式错误'))
                    } else {
                        callback()
                    }
                }
                return {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    agent: [
                        { required: true, message: '请选择代理商', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    password: [
                        { required: !this.accountdataForm.id, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            updateInit(paramArr) {
                // console.log(paramArr)
                this.visible = true
                this.readonly = false
                if (paramArr !== "") {
                    // console.log(paramArr)
                    this.readonly = true
                    this.accountdataForm.id = paramArr[0] || 0
                    // this.accountdataForm.agentNumber = paramArr[0]
                    this.accountdataForm.name = paramArr[1]
                    this.accountdataForm.mobile = paramArr[2]
                    this.accountdataForm.email = paramArr[3]
                }
            },
            accDataFormSubmit() {
                this.$refs['accountdataFormref'].validate((valid) => {
                    if (valid) {
                        // console.log('验证通过')
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentSysUser/${!this.accountdataForm.id ? 'save' : 'update'}?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'userId': this.accountdataForm.id || undefined,
                                'realName': this.accountdataForm.name,
                                'mobile': this.accountdataForm.mobile,
                                'email': this.accountdataForm.email,
                                'password': (this.accountdataForm.password) ? md5(this.accountdataForm.password) : this.accountdataForm.password
                            })
                        }).then(({ data }) => {
                            console.log(data)
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            closeDialog() {
                this.accountdataForm.id = ""
                // this.accountdataForm.agentNumber = ""
                this.accountdataForm.name = ""
                this.accountdataForm.mobile = ""
                this.accountdataForm.password = ""
                this.accountdataForm.email = ""
            }
        }
    }

</script>

<style lang="scss">

</style>