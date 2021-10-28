<template>
    <div class="main">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <h2>嗨！{{ userName }}</h2>
                    <ul class="cf basicInfo">
                        <li v-for="(item,i) in basicInfoList" :key="i">
                            <p>{{item.title}}</p>
                            <input type="text" v-model="item.data" :value="item.data" readonly>
                            <button v-show="item.flag" @click="basicInfoBtn(i,item.data)">{{item.title === '邮箱' &&
                                item.data === '' || item.data === null ? '添加' : item.btnText}}</button>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="cf">
                        <h2>OEM充值记录</h2>
                        <el-button type="text" style="float:right" @click="showDetails()">查看详情</el-button>
                    </div>
                    <el-table :data="tableData" height="250" style="width: 100%" :highlight-current-row="false">
                        <el-table-column prop="companyName" label="代理商名称">
                        </el-table-column>
                        <el-table-column prop="payTime" label="充值时间">
                        </el-table-column>
                        <el-table-column prop="money" label="充值金额">
                        </el-table-column>
                        <el-table-column prop="number" label="充值条数">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <h2>OEM代理</h2>
                    <ul class="cf customerList">
                        <li v-for="(item,index) in oemAgent" :key="index">
                            <p>{{item.title}}</p>
                            <p>{{item.counts}}</p>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <!-- 添加邮箱 -->
        <el-dialog title="添加邮箱" :visible.sync="addEmailVisible">
            <el-form :model="addemailform" :rules="addemailrules" ref="addemailruleForm">
                <el-form-item label="新邮箱" prop="email">
                    <el-input v-model="addemailform.email" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 更改邮箱 -->
        <el-dialog title="重新绑定邮箱" :visible.sync="reEmailVisible">
            <el-form :model="reemailform" :rules="reemailrules" ref="reemailruleForm">
                <el-form-item label="原邮箱">
                    <el-input v-model="reemailform.oldemail" id="emailInput" readonly></el-input>
                </el-form-item>
                <el-form-item label="新邮箱" prop="newemail">
                    <el-input v-model="reemailform.newemail"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 重新绑定手机号 -->
        <re-bind-phone v-if="reBindVisible" ref="reBindPhoneCon"></re-bind-phone>
        <!-- 修改密码 -->
        <update-password v-if="updatePwdVisible" ref="updatePwdCon"></update-password>
    </div>
</template>
<script>
    import reBindPhone from './re-bind-phone'
    import UpdatePassword from '../../main-navbar-update-password'
    import { isEmail, isMobile } from '@/utils/validate'
    export default {
        data() {
            var validateEmail = (rule, value, callback) => {
                if (!isEmail(value)) {
                    callback(new Error('邮箱格式错误'))
                } else {
                    callback()
                }
            }
            return {
                addEmailVisible: false,
                reEmailVisible: false,
                reBindVisible: false,
                updatePwdVisible: false,
                addemailform: {
                    email: ''
                },
                addemailrules: {
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                },
                reemailform: {
                    oldemail: '',
                    newemail: ''
                },
                basicInfoList: [  //基本信息
                    { title: '我的待办', data: '', flag: false },
                    // { title: '职位', data: '产品专员', flag: false },
                    { title: '手机号', data: '', flag: true, btnText: '更改' },
                    { title: '邮箱', data: '', flag: true, btnText: '更改' }
                ],
                reemailrules: {
                    newemail: [
                        { required: true, message: '新邮箱不能为空', trigger: 'blur' },
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                },
                tableData: [], //oem充值记录
                oemAgent: [
                    { title: '代理商数量', counts: '' },
                    { title: '充值总金额（元）', counts: '' },
                    { title: '消耗总计（条）', counts: '' },
                    { title: '充值总条数（条）', counts: '' }
                ], //oem代理

            }
        },
        computed: {
            userName: {
                get() { return this.$store.state.user.name }
            }
        },
        activated() {
            this.oemRegRecode(),
            this.getAdminDeskInfo(),
            this.myAgent(),
            this.updatePwd()
        },
        components: {
            reBindPhone,
            UpdatePassword
        },
        methods: {

            basicInfoBtn(arrindex, con) {
                if (arrindex == 1) {  //概更改手机号
                    this.reBindVisible = true;
                    this.$nextTick(() => {
                        let mobile = this.basicInfoList[1].data
                        this.$refs.reBindPhoneCon.showInit(mobile)
                    })
                } else if (arrindex == 2) {
                    if (con == "" || con == null) {
                        console.log("添加弹出框");
                        this.addEmailVisible = true
                        this.$nextTick(() => {
                            this.$refs['addemailruleForm'].resetFields();
                        })
                    } else {
                        console.log("修改弹出框");
                        this.reemailform.oldemail = this.basicInfoList[2].data
                        this.reEmailVisible = true;
                        this.$nextTick(() => {
                            this.$refs['reemailruleForm'].resetFields();
                        })
                    }
                }
            },
            // 我的代办
            myAgent() {
                this.$http({
                    url: this.$http.adornUrl(`agent/stats/agentCanUpgrade/count?token=${this.$cookie.get('token')}`),
                    method: 'get',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.basicInfoList[0].data = data.data.countAgentCanUpgrade
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 修改密码
            updatePwd() {
                if (sessionStorage.getItem('isFirstLogin') && (sessionStorage.getItem('isFirstLogin')) == 'true') {  //没修改过
                    this.updatePwdVisible = true
                    this.$nextTick(() => {
                        this.$refs.updatePwdCon.init()
                    })
                    sessionStorage.removeItem('isFirstLogin')
                } else {
                    this.updatePwdVisible = false
                    sessionStorage.removeItem('isFirstLogin')
                }
            },
            // 管理员基本信息
            getAdminDeskInfo() {
                this.$http({
                    url: this.$http.adornUrl(`agent/desk/getAdminDeskInfo?token=${this.$cookie.get('token')}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.basicInfoList[1].data = data.data.mobile
                        this.basicInfoList[2].data = data.data.email
                        this.oemAgent[0].counts = data.data.agentCount
                        this.oemAgent[1].counts = data.data.rechargeSum
                        this.oemAgent[2].counts = data.data.consumSum
                        this.oemAgent[3].counts = data.data.rechargeNumberSum
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 添加邮箱
            addEmailBtn() {
                this.$refs['addemailruleForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'mail': this.addemailform.email,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.addEmailVisible = false
                                this.basicInfoList[2].data = this.addemailform.email
                                this.$message.success('成功!')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            // 修改邮箱
            reEmailBtn() {
                this.$refs['reemailruleForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'mail': this.reemailform.newemail,
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 0) {
                                this.reEmailVisible = false
                                this.basicInfoList[2].data = this.reemailform.newemail
                                this.$message.success('成功!')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            // 查看详情
            showDetails() {
                this.$router.push({ name: 'finance-agentrecharge' })
            },
            oemRegRecode() {
                this.$http({
                    url: this.$http.adornUrl(`agent/finance/agent/recharge/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': 1,
                        'pageSize': 5,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.tableData = data.data.list
                    } else {
                        this.tableData = []
                    }
                })
            }
        }
    }

</script>
<style lang="scss">
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #fff;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 340px;
        margin-bottom: 20px;
        padding: 10px 20px;
    }

    .grid-content h2 {
        display: inline-block;
        font-size: 20px;
        color: #333;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .basicInfo li {
        width: 48%;
        height: 100px;
        float: left;
        text-align: center
    }

    .basicInfo li input {
        width: 100%;
        border: none;
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: #666;
        text-align: center;
    }

    .basicInfo li:first-child input {
        font-size: 30px;
        color: #4680ff;
    }

    .basicInfo li button {
        width: 48px;
        height: 24px;
        border: solid 1px #999;
        background-color: #fff;
        color: #7b7b7b;
        font-size: 12px;
        cursor: pointer;
        margin-top: 15px;
    }

    .basicInfo li button:hover {
        border: none;
        background-color: #4680ff;
        color: #fff;
    }

    .el-table {
        min-height: 0px;
        font-size: 14px;
    }

    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 0
    }

    .el-table td {
        padding: 10px 0;
        text-align: center
    }

    .el-table th {
        color: #666;
        font-weight: 400;
        text-align: center
    }

    .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
</style>