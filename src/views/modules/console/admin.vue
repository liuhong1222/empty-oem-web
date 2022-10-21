<template>
    <div class="main">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <h2>嗨！</h2>
                    <ul class="cf basicInfo">
                        <li v-for="(item,i) in basicInfoList" :key="i">
                            <p>{{item.title}}</p>
                            <input type="text" :value="item.data" readonly>
                            <button v-show="item.flag" @click="basicInfoBtn(i,item.data)">{{item.title === '邮箱' &&
                                item.data === '' || item.data === null ? '添加' : item.btnText}}</button>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="cf recharge-record-head">
                        <h2>代理商充值记录</h2>
                        <el-button class="view-recharge-record-btn" type="text" @click="showDetails()">查看详情</el-button>
                    </div>
                    <el-table :header-cell-style="getRowClass" :data="tableData" height="250" style="width: 100%" :highlight-current-row="false">
                        <el-table-column prop="companyName" label="代理商名称">
                        </el-table-column>
                        <el-table-column prop="category" label="充值产品">
                            <template slot-scope="scope">
                                <span>{{ categoryLabelMap[scope.row.category] || '' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="payTime" label="充值时间">
                        </el-table-column>
                        <el-table-column prop="money" label="充值金额（元）">
                        </el-table-column>
                        <el-table-column prop="number" label="充值条数（条）">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="test-statistic-header">
                        <div>
                            <span>代理商检测统计</span>
                            <span>当月</span>
                        </div>
                        <el-select style="width: 150px;" v-model="testStatisticCategory" size="small" placeholder="请选择产品">
                            <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <ul class="cf customerList">
                        <li v-for="(item,index) in testStatisticConfig" :key="index">
                            <p>{{ item.title }}</p>
                            <p>{{ adminInfo[item.field] }}</p>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="test-statistic-header">
                        <div>
                            <span>代理商消耗趋势</span>
                        </div>
                        <el-select style="width: 150px;" v-model="trendCategory" size="small" placeholder="请选择产品">
                            <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="trend-chart">
                        <e-chart style="height:260px; width: 100%;" :chartData="trendChartConfig" />
                    </div>
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
                <el-button :loading="emailAddLoading" type="primary" @click="addEmailBtn()">确 定</el-button>
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
                <el-button :loading="emailEditLoading" type="primary" @click="reEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 重新绑定手机号 -->
        <re-bind-phone v-if="reBindVisible" ref="reBindPhoneCon"></re-bind-phone>
        <!-- 修改密码 -->
        <update-password v-if="updatePwdVisible" ref="updatePwdCon"></update-password>
    </div>
</template>
<script>
    import EChart from '@/components/chart/index.vue'
    import reBindPhone from './re-bind-phone'
    import UpdatePassword from '../../main-navbar-update-password'
    import { isEmail, isMobile } from '@/utils/validate'
    import { categoryOptions, categoryLabelMap } from '@/const'
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
                categoryOptions,
                categoryLabelMap,
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
                basicInfoList: [  // 基本信息
                    { title: '我的待办', data: '', flag: false },
                    { title: '手机号', data: '', flag: true, btnText: '更改' },
                    { title: '邮箱', data: '', flag: true, btnText: '更改' }
                ],
                reemailrules: {
                    newemail: [
                        { required: true, message: '新邮箱不能为空', trigger: 'blur' },
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                },
                tableData: [],
                adminInfo: {}, // 管理员首页基本信息
                emailAddLoading: false,
                emailEditLoading: false,
                testStatisticConfig: [
                    { title: '代理商数量', field: 'agentNums' },
                    { title: '充值总金额（元）', field: 'rechargeSum' },
                    { title: '消耗总条数（条）', field: 'consume' },
                    { title: '充值总条数（条）', field: 'rechargeNumberSum' }
                ],
                testStatisticCategory: 0,
                trendCategory: 0,
                trendChartConfig: {
                    xData: [],
                    series: [],
                    otherOptions: {}
                },

            }
        },
        activated() {
            this.oemRegRecode(),
            this.getAdminDeskInfo(),
            this.updatePwd()
            this.getChartData()
        },
        components: {
            reBindPhone,
            UpdatePassword,
            EChart
        },
        methods: {
            getChartData() {
                this.trendChartConfig = {
                    xData: ['xx', 'zz'],
                    series: [{
                        name: '消耗总条数',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: [123,44]
                    }],
                    otherOptions: {
                        grid: {
                            bottom: 20,
                            right: 20,
                            top: 24,
                        }
                    }
                }
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
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
                    url: this.$http.adornUrl(`agent/desk/getAdminDeskInfo?token=${this.$cookie.get('token')}&category=${this.testStatisticCategory}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.basicInfoList[1].data = data.data.mobile
                        this.basicInfoList[2].data = data.data.email
                        this.basicInfoList[0].data = data.data.waitToDoNum || 0
                        this.adminInfo = data.data || {}
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 添加邮箱
            addEmailBtn() {
                this.$refs['addemailruleForm'].validate((valid) => {
                    if (valid) {
                        this.emailAddLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'mail': this.addemailform.email,
                            })
                        }).then(({ data }) => {
                            this.emailAddLoading = false
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
                        this.emailEditLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'mail': this.reemailform.newemail,
                            })
                        }).then(({ data }) => {
                            this.emailEditLoading = false
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
<style lang="scss" scoped>
.test-statistic-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    & > div:first-child {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > span:nth-child(1) {
            font-size: 20px;
            color: #333;
            font-weight: bold;
        }
        & > span:nth-child(2) {
            display: inline-block;
            width: 56px;
            height: 22px;
            line-height: 20px;
            border-radius: 11px;
            border: 1px solid #1890FF;
            color: #1890FF;
            font-size: 12px;
            text-align: center;
            margin-left: 8px;
        }
    }
}
</style>
<style lang="scss">
.recharge-record-head {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    .view-recharge-record-btn {
        position: absolute;
        right: 0px;
    }
}
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
        display: flex;
        font-size: 20px;
        color: #333;
        align-items: center;
        position: relative;
    }

    .grid-content h2 > span {
        display: inline-block;
        position: absolute;
        right: 0px;
        width: 56px;
        height: 22px;
        line-height: 20px;
        border-radius: 11px;
        border: 1px solid #1890FF;
        color: #1890FF;
        font-size: 12px;
        text-align: center;
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