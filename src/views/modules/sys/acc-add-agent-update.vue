<template>
    <el-dialog :title="!isEdit ? '新增账号' : '修改账号'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="accountdataForm" :rules="accdatarules" ref="accountdataFormref" label-width="150px" class="demo-ruleForm"
            :label-position="labelPosition">
            <!-- <el-form-item label="用户名：" prop="username">
                <el-input v-model="accountdataForm.username" placeholder="请输入用户名" :disabled="isEdit"></el-input>
            </el-form-item> -->
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="accountdataForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="代理商：" v-if="isAdmin" prop="agentId">
                <el-select style="width: 100%" class="filter-item" v-model="accountdataForm.agentId" placeholder="请选择代理商">
                    <el-option v-for="(item, index) in agentList" :key="index" :label="item.companyName" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名：" prop="nickname">
                <el-input v-model="accountdataForm.nickname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
                <el-radio-group v-model="accountdataForm.gender">
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="1">男</el-radio>
                </el-radio-group>
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
            <el-button type="primary" :loading="submitLoading" @click="accDataFormSubmit()">确定</el-button>
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
                isEdit: false,
                labelPosition: 'right',
                accountdataForm: {
                    username: '',
                    agentId: '',
                    nickname: '',
                    phone: '',
                    email: '',
                    gender: 1,
                    password: ''
                },
                agentList: [],
                submitLoading: false,
                isAdmin: false,
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
                    agentId: [
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
                        { required: !this.isEdit, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            updateInit(record) {
                this.visible = true
                this.submitLoading = false
                this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
                this.isAdmin && this.getAgentList()
                this.isEdit = record.username ? true : false
                this.$nextTick(() => {
                    this.$refs['accountdataFormref'].resetFields()
                    if (record.username) {
                        const { username, agentId, nickname, phone, email, id, gender } = record
                        this.accountdataForm = {
                            username,
                            agentId: agentId + '',
                            nickname,
                            phone,
                            email,
                            id: id + '',
                            gender
                        }
                    }
                })
            },
            getAgentList() {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentList = data.data || []
                    } else {
                        this.agentList = []
                    }
                })
            },
            accDataFormSubmit() {
                this.$refs['accountdataFormref'].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$http({
                            url: this.$http.adornUrl(`sys/user/${!this.isEdit ? 'save' : 'update'}`),
                            method: 'post',
                            data: {
                                token: this.$cookie.get('token'),
                                roleId: 2,
                                agentId: this.isAdmin ? this.accountdataForm.agentId : this.$json.parse(sessionStorage.getItem('agentInfo') || '{}').id + '',
                                gender: this.accountdataForm.gender,
                                'id': this.isEdit ? this.accountdataForm.id : undefined,
                                'username': this.accountdataForm.phone,
                                'nickname': this.accountdataForm.nickname,
                                'phone': this.accountdataForm.phone,
                                'email': this.accountdataForm.email,
                                'password': (this.accountdataForm.password) ? md5(this.accountdataForm.password) : this.accountdataForm.password
                            }
                        }).then(({ data }) => {
                            this.submitLoading = false;
                            if (data && data.code === 0) {
                                this.visible = false
                                this.$emit('refreshDataList', 1)
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            }
        }
    }

</script>

<style lang="scss">

</style>