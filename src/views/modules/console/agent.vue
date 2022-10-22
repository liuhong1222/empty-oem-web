<template>
    <div class="main">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height: 590px;">
                    <h2>嗨！</h2>
                    <div class="contact-info-wrapper">
                        <ul>
                            <li>
                                <span :title="deskInfo.email">手机号：{{ deskInfo.mobile }}</span>
                                <button class="edit-btn edit-contact-btn" @click="handleOneCardClick('mobile')">
                                    更改手机号
                                </button>
                            </li>
                            <li>
                                <span :title="deskInfo.email">邮箱：{{ deskInfo.email }}</span>
                                <button class="edit-btn edit-contact-btn" @click="handleOneCardClick('email')">
                                    更改邮箱
                                </button>
                            </li>
                        </ul>
                        <div>
                            <button class="edit-btn copyLink" @click="copyLink">复制推广链接</button>
                        </div>
                    </div>
                    <!-- <ul class="product-info-wrapper">
                        <li v-for="(item, index) in productInfoList" :key="index">
                            <span class="number-box">{{ deskInfo[item.field] || '0' }}</span>
                            <span class="title-box">{{ item.title }}</span>
                            <button v-if="item.btnText" class="edit-btn" @click="handleOneCardClick(item.field)">{{ item.btnText }}</button>
                        </li>
                    </ul> -->
                    <el-table
                        :data="productTableData"
                        size="mini"
                        class="console-agent-info-table"
                        :max-height="350"
                        style="width: 100%;margin-top: 12px;font-size: 12px;"
                        :header-cell-style="getRowClass"
                    >
                        <el-table-column min-width="76" align="left" prop="name" label="产品名称"></el-table-column>
                        <el-table-column min-width="70" prop="price" label="单价(元/条)" align="left">
                            <template slot-scope="{ row }">
                                <div class="overflow-show-dot" :title="row.price">{{ row.price }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="70" prop="balance" label="余额(万条)" align="left">
                            <template slot-scope="{ row }">
                                <div class="overflow-show-dot" :title="row.balance">{{ row.balance }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="80" prop="warningsNumber" label="预警值(万条)" align="left">
                            <template slot-scope="{ row }">
                                <div class="overflow-show-dot" :title="row.warningsNumber">{{ row.warningsNumber }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="160" prop="operate" label="操作" align="left">
                            <template slot-scope="{ row }">
                                <div>
                                    <button class="edit-btn" style="width: 50px;" @click="handleOneCardClick(row.balanceKey)">充值</button>
                                    <button class="edit-btn copyLink" style="margin-left: 4px;width: 80px;height: 30px;margin-bottom: 0px;" @click="handleOneCardClick(row.warningsNumberKey)">修改预警值</button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height: 390px;">
                    <div>
                        <h2>充值记录</h2>
                        <el-button type="text" style="float:right" @click="showDetails()">查看详情</el-button>
                    </div>
                    <el-table :max-height="300" :header-cell-style="getRowClass" :data="rechargeRecordData" style="width: 100%" :highlight-current-row="true">
                        <el-table-column prop="categary" label="充值产品">
                            <template slot-scope="{ row }">
                                <span>{{ categoryLabelMap[row.category] || '' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="payTime" label="充值时间">
                        </el-table-column>
                        <el-table-column prop="money" label="充值金额">
                        </el-table-column>
                        <el-table-column prop="number" label="充值条数">
                        </el-table-column>
                    </el-table>
                </div>
                <div style="height: 180px;min-height: 180px;" class="grid-content bg-purple">
                    <h2>注册赠送</h2>
                    <div class="giveCounts">
                        <span>自动赠送</span>
                        <el-switch v-model="giveSwitch" @change="checkSwitch"></el-switch>
                        <span>（关闭后，系统将不会自动赠送5000条）</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="test-statistic-header">
                        <div>
                            <span>客户检测统计</span>
                            <span>当月</span>
                        </div>
                        <el-select @change="getAgentDeskInfo" style="width: 150px;" v-model="testStatisticCategory" size="small" placeholder="请选择产品">
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
                            <p>{{ deskInfo[item.field] }}</p>
                        </li>
                    </ul>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="test-statistic-header">
                        <div>
                            <span>客户消耗趋势</span>
                        </div>
                    </div>
                    <div class="trend-chart">
                        <e-chart style="height:260px; width: 100%;" :chartData="trendChartConfig" />
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 添加邮箱弹窗 -->
        <el-dialog title="添加邮箱" :visible.sync="addEmailVisible">
            <el-form :model="addemailform" :rules="addemailrules" ref="addemailruleForm">
                <el-form-item label="新邮箱" prop="email">
                <el-input v-model="addemailform.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="addEmailLoading" @click="addEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 更改邮箱弹窗 -->
        <el-dialog title="重新绑定邮箱" :visible.sync="reEmailVisible">
            <el-form :model="reemailform" :rules="reemailrules" ref="reemailruleForm">
                <el-form-item label="原邮箱">
                <el-input v-model="reemailform.oldemail" id="emailInput" readonly></el-input>
                </el-form-item>
                <el-form-item label="新邮箱" prop="newemail">
                <el-input v-model="reemailform.newemail"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" :loading="editEmailLoading" @click="reEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 复制链接弹窗 -->
        <el-dialog title="复制推广链接" :visible.sync="copyVisible" width="520px">
            <el-input v-model="copyinput" style="width: 80%;" id="copyInput"></el-input>
            <el-button type="primary" id="copyBtn" v-clipboard:copy="copyinput" v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制链接</el-button>
        </el-dialog>
        
        <!-- 驳回弹出框 -->
        <el-dialog title="提示" :visible.sync="rejectDialogVisible" width="30%">
            <span>您的设置被管理员驳回，请联系管理员或重新设置并提交。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectDialogVisible = false">稍后再说</el-button>
                <el-button type="primary" @click="rejectRet()">前往设置</el-button>
            </span>
        </el-dialog>

        <!-- 预警值弹窗 -->
        <el-dialog :title="warnEditType + '检测预警值'" width="520px" :visible.sync="warnFormVisible">
            <el-form :model="warnForm" :rules="warnRule" ref="warnForm">
                <el-form-item label-width="100px" label="当前预警值">
                    <el-input v-model="warnForm.curcounts" style="width: 84%; margin-right: 8px;" id="curCount" disabled></el-input>
                    <span>万条</span>
                </el-form-item>
                <el-form-item label-width="100px" label="修改预警值" prop="counts">
                    <el-input v-model="warnForm.counts" style="width: 84%; margin-right: 8px;"></el-input>
                    <span>万条</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="warnFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="editWarnNumberLoading" @click="warnFormSubmit()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 重新绑定手机号弹框 -->
        <re-bind-phone v-if="reBindVisible" ref="reBindPhoneCon" @refreshDataList="getAgentDeskInfo"></re-bind-phone>
        
        <!-- 修改密码弹框 -->
        <update-password v-if="updatePwdVisible" ref="updatePwdCon"></update-password>

        <!-- 充值弹框 -->
        <agent-recharge-dia ref="agentRechargeDiaRef" @refresh="getAgentDeskInfo" />
    </div>
</template>

<script>
import EChart from '@/components/chart/index.vue'
import reBindPhone from './re-bind-phone'
import UpdatePassword from '../../main-navbar-update-password'
import AgentRechargeDia from './agent-recharge-dia.vue'
import { isEmail } from '@/utils/validate'
import { categoryOptions, categoryLabelMap } from '@/const'

export default {
    name: 'AgentDesk',
    components: {
        reBindPhone,
        UpdatePassword,
        AgentRechargeDia,
        EChart
    },
    data() {
        const validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                callback(new Error('邮箱格式错误'))
            } else {
                callback()
            }
        }
        const validateWarnCounts = (rule, value, callback) => {
            let reg = /^-?[0-9]\d*$/
            let number = +value
            if (!value && value !== 0) {
                callback(new Error('请输入修改的预警值'))
            } else if (number === 0) {
                callback(new Error('预警值不能为0'))
            } else if (!reg.test(number)) {
                callback(new Error('预警值为正整数'))
            } else {
                callback()
            }
        }
        return {
            categoryOptions,
            categoryLabelMap,
            productInfoList: [
                { title: '空号代理价（元/条）', field: 'price', btnText: '' },
                { title: '实时代理价（元/条）', field: 'realPrice', btnText: '' },
                { title: '国际代理价（元/条）', field: 'internationalPrice', btnText: '' },
                { title: '空号余额（万条）', field: 'emptyBalance', btnText: '充值' },
                { title: '实时余额（万条）', field: 'realtimeBalance', btnText: '充值' },
                { title: '国际余额（万条）', field: 'internationalBalance', btnText: '充值' },
                { title: '空号预警值（万条）', field: 'warningsNumber', btnText: '修改' },
                { title: '实时预警值（万条）', field: 'realWarningsNumber', btnText: '修改' },
                { title: '国际预警值（万条）', field: 'internationalWarningsNumber', btnText: '修改' },
            ],
            agentInfo: {},
            deskInfo: {},
            rechargeRecordData: [],
            giveSwitch: false,
            remarksCon: '',

            // 复制链接弹窗
            copyVisible: false,
            copyinput: '',

            // 驳回弹框（我的待办）
            rejectDialogVisible: false,

            // 绑定手机号弹框
            reBindVisible: false,

            // 修改密码弹框
            updatePwdVisible: false,

            // 添加邮箱弹窗
            addEmailVisible: false,
            addemailform: {
                email: ''
            },
            addemailrules: {
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
            },

            // 修改邮箱弹窗
            reEmailVisible: false,
            reemailform: {
                oldemail: '',
                newemail: ''
            },
            reemailrules: {
                newemail: [
                    { required: true, message: '新邮箱不能为空', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
            },

            // 预警值弹窗
            warnFormVisible: false,
            warnEditType: '空号',
            warnForm: { counts: '', curcounts: '' },
            warnRule: {
                counts: [
                    { required: true, validator: validateWarnCounts, trigger: 'change' }
                ],
            },
            addEmailLoading: false,
            editEmailLoading: false,
            editWarnNumberLoading: false,
            testStatisticConfig: [
                { title: '客户数量', field: 'custNums' },
                { title: '客户充值总计（元）', field: 'custRechargeSum' },
                { title: '客户消费条数（条）', field: 'consume' },
                { title: '充值总条数（条）', field: 'custRechargeNumberSum' }
            ],
            testStatisticCategory: 0,
            trendChartConfig: {
                xData: [],
                series: [],
                otherOptions: {}
            },
            productTableData: [],
        };
    },
    activated() {
        this.getAgentDeskInfo()
        this.myRechargeList()
        this.updatePwd()
    },
    methods: {
        dealChartData() {
            let dayCount = this.$moment().daysInMonth()
            let dateDataMap = (this.deskInfo.consumeTrend || []).reduce((pre, curr) => {
                return {
                    ...pre,
                    [curr.dayInt]: curr.totalConsume
                }
            }, {})
            let currentMonth = this.$moment().format('YYYY-MM')
            let xData = []
            let yData = []
            for (let index = 0; index < dayCount; index++) {
                let dateStr = this.$moment(currentMonth + '-' + (index + 1)).format('YYYYMMDD')
                xData.push(dateStr)
                yData.push(dateDataMap[dateStr] || 0)
            }
            this.trendChartConfig = {
                xData,
                series: [{
                    name: '消耗总条数',
                    type: 'line',
                    label: {
                        normal: {
                            show: false,
                            position: 'top'
                        }
                    },
                    data: yData
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
        // 获取基本信息
        getAgentDeskInfo() {
            this.remarksCon = sessionStorage.getItem('remarkCon')
            this.$http({
            url: this.$http.adornUrl(`agent/desk/getAgentDeskInfo?token=${this.$cookie.get('token')}&category=${this.testStatisticCategory}`),
            method: 'post',
            }).then(({ data }) => {
            if (data && data.code === 0) {
                const { agentInfo, domain } = (data.data || {})
                // 0不自动赠送，1自动赠送
                this.giveSwitch = (agentInfo && agentInfo.registerGift) ? true : false
                sessionStorage.setItem('agentInfo', this.$json.stringify(agentInfo || '{}'))
                this.copyinput = domain ? 'http://' + domain : ''
                this.deskInfo = {...(data.data || {}), ...(agentInfo || {})}
                this.agentInfo = agentInfo || {}
                this.dealProductTableData(this.deskInfo)
                this.dealChartData()
            } else {
                this.$message.error(data.msg)
            }
            })
        },
        dealProductTableData(data) {
            this.productTableData = [
                { name: '空号检测', balance: data.emptyBalance, price: data.price, warningsNumber: data.warningsNumber, warningsNumberKey: 'warningsNumber', balanceKey: 'emptyBalance' },
                { name: '实时检测', balance: data.realtimeBalance, price: data.realPrice, warningsNumber: data.realWarningsNumber, warningsNumberKey: 'realWarningsNumber', balanceKey: 'realtimeBalance' },
                { name: '国际检测', balance: data.internationalBalance, price: data.internationalPrice, warningsNumber: data.internationalWarningsNumber, warningsNumberKey: 'internationalWarningsNumber', balanceKey: 'internationalBalance' },
                { name: '定向通用检测', balance: data.directCommonBalance, price: data.directCommonPrice, warningsNumber: data.directCommonWarningsNumber, warningsNumberKey: 'directCommonWarningsNumber', balanceKey: 'directCommonBalance' },
                { name: 'line定向检测', balance: data.lineDirectBalance, price: data.lineDirectPrice, warningsNumber: data.lineDirectWarningsNumber, warningsNumberKey: 'lineDirectWarningsNumber', balanceKey: 'lineDirectBalance' },
            ]
        },
        // 充值记录
        myRechargeList() {
            this.$http({
                url: this.$http.adornUrl(`agent/finance/agent/recharge/list?token=${this.$cookie.get('token')}`),
                method: 'get',
                params: this.$http.adornParams({
                    'currentPage': 1,
                    'pageSize': 5,
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.rechargeRecordData = data.data.list || []
                } else {
                    this.rechargeRecordData = []
                }
            })
        },
        //  控制赠送开关
        checkSwitch(val) {
            // 0 不自动赠送，1 自动赠送
            this.$http({
                url: this.$http.adornUrl(`/agent/desk/updateAutoPresentCfg?token=${this.$cookie.get('token')}`),
                method: 'post',
                params: this.$http.adornParams({
                    'autoPresentCfg': val == true ? 1 : 0,
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success(data.msg);
                } else {
                    this.$message.error(data.msg || '操作失败');
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
        handleOneCardClick(type) {
            switch (type) {
                case 'emptyBalance':
                case 'realtimeBalance':
                case 'directCommonBalance':
                case 'lineDirectBalance':
                case 'internationalBalance': { // 余额充值
                    if (type === 'realtimeBalance' && !this.agentInfo.realPrice) { // 代理实时单价 为 0 或未获取实时产品的代理权
                        this.$message.warning('暂无实时检测代理权限')
                        return false
                    }
                    if (type === 'internationalBalance' && !this.agentInfo.internationalPrice) {
                        this.$message.warning('暂无国际检测代理权限')
                        return false
                    }
                    if (type === 'directCommonBalance' && !this.agentInfo.directCommonPrice) {
                        this.$message.warning('暂无定向通用检测代理权限')
                        return false
                    }
                    if (type === 'lineDirectBalance' && !this.agentInfo.lineDirectPrice) {
                        this.$message.warning('暂无line定向检测代理权限')
                        return false
                    }
                    this.$refs['agentRechargeDiaRef'].init(type.replace('Balance', ''), this.agentInfo)
                    break;
                }
                case 'warningsNumber':
                case 'realWarningsNumber':
                case 'directCommonWarningsNumber':
                case 'lineDirectWarningsNumber':
                case 'internationalWarningsNumber': { // 预警值修改
                    if (type === 'realWarningsNumber' && !this.agentInfo.realPrice) { // 代理实时单价 为 0 或未获取实时产品的代理权
                        this.$message.warning('暂无实时检测代理权限')
                        return false
                    }
                    if (type === 'internationalWarningsNumber' && !this.agentInfo.internationalPrice) {
                        this.$message.warning('暂无国际检测代理权限')
                        return false
                    }
                    let editTypeMap = {
                        'warningsNumber': '空号',
                        'realWarningsNumber': '实时',
                        'internationalWarningsNumber': '国际',
                        'directCommonWarningsNumber': '定向通用',
                        'lineDirectWarningsNumber': 'line定向',
                    }
                    this.warnEditType = editTypeMap[type]
                    this.warnForm.curcounts = this.deskInfo[type]
                    this.warnFormVisible = true;
                    this.$nextTick(() => {
                        this.$refs['warnForm'].resetFields();
                    })
                    break;
                }
                case 'mobile': { // 修改手机号
                    this.reBindVisible = true;
                    this.$nextTick(() => {
                        this.$refs.reBindPhoneCon.showInit(this.deskInfo.mobile)
                    })
                    break;
                }
                case 'email': { // 修改邮箱
                    if (!this.deskInfo.email) { // 新增邮箱
                        this.addEmailVisible = true
                        this.$nextTick(() => {
                            this.$refs['addemailruleForm'].resetFields();
                        })
                    } else { // 修改邮箱
                        this.reemailform.oldemail = this.deskInfo.email
                        this.reEmailVisible = true;
                        this.$nextTick(() => {
                            this.$refs['reemailruleForm'].resetFields();
                        })
                    }
                    break;
                }
                default:
                    break;
            }
        },
        // 驳回,重新设置(我的待办)
        rejectRet() {
            this.rejectDialogVisible = false
            this.$router.push({ name: 'user-selfsetting' })
        },
        // 查看充值记录详情
        showDetails() {
            this.$router.push({ name: 'finance-myrecharge' })
        },
        // 查看充值记录详情
        viewMeals() {
            this.$router.push({ name: 'user-meal' })
        },

        /********** 复制推广链接弹框 **********/
        copyLink() {
            this.copyVisible = true;
        },
        onCopy: function (e) {
            this.$message({
            message: '恭喜你，复制成功',
            type: 'success'
            });
            this.copyVisible = false;
        },
        onError: function (e) {
            this.$message.error('复制失败了哦！');
        },
        /********** 添加邮箱弹框 **********/
        addEmailBtn() {
            this.$refs['addemailruleForm'].validate((valid) => {
                if (valid) {
                    this.addEmailLoading = true
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'mail': this.addemailform.email,
                        })
                    }).then(({ data }) => {
                        this.addEmailLoading = false
                        if (data && data.code === 0) {
                            this.addEmailVisible = false
                            this.getAgentDeskInfo()
                            this.$message.success('成功!')
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },

        /********** 修改邮箱弹框 **********/
        reEmailBtn() {
            this.$refs['reemailruleForm'].validate((valid) => {
                if (valid) {
                    this.editEmailLoading = true
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'mail': this.reemailform.newemail,
                        })
                    }).then(({ data }) => {
                        this.editEmailLoading = false
                        if (data && data.code === 0) {
                            this.reEmailVisible = false
                            this.getAgentDeskInfo()
                            this.$message.success('成功!')
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },

        /********** 预警值提交弹框 **********/
        warnFormSubmit() {
            this.$refs['warnForm'].validate((valid) => {
                if (valid) {
                    this.editWarnNumberLoading = true
                    let category = 0
                    if (this.warnEditType === '空号') {
                        category = 0
                    } else if (this.warnEditType === '实时') {
                        category = 1
                    } else if (this.warnEditType === '国际') {
                        category = 2
                    } else if (this.warnEditType === '定向通用') {
                        category = 4
                    } else {
                        category = 5
                    }
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/updateWarnNumber?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            warnNumber: +this.warnForm.counts,
                            category
                        })
                    }).then(({ data }) => {
                        this.editWarnNumberLoading = false
                        if (data && data.code === 0) {
                            this.warnFormVisible = false
                            this.getAgentDeskInfo()
                            this.$message.success('预警值修改成功!')
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.overflow-show-dot {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
}
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
.product-info-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px;
    > li {
        width: 30%;
        padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #DCDFE6;
    }
    > li:nth-child(3n) {
        border-color: transparent;
    }
    > li:nth-child(7), > li:nth-child(8), > li:nth-child(9) {
        padding-bottom: 0px;
    }
    .number-box {
        font-size: 36px;
        font-weight: 500;
        color: #000000;
        display: inline-block;
        word-break: break-all;
    }
    .title-box {
        font-size: 12px;
        color: #717D8F;
        margin: 4px 0px 8px;
    }
}
.contact-info-wrapper {
    display: flex;
    > ul {
        width: 60%;
        padding: 0px;
        > li {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        > li > span {
            display: inline-block;
            width: 60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    > div {
        padding-top: 20px;
    }
}
.meal-empty {
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 12px;
    color: #666;
}
.btns-wrapper {
    display: flex;
    // align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    height: 118px;
}
    .statistic-data {
        height: 40px;
        line-height: 40px;
        margin-bottom: 20px;
    }
    
  .basic-mess {
    margin-left: -42px
  }

  .basic-mess li {
    float: left;
    width: 33%;
    margin-bottom: 10px;
    // text-align: center;
    word-break: break-all;
    word-wrap: break-word;
    padding-left: 12px;
     > p {
         color: #717D8F;
        font-size: 12px;
     }
  }

  .basic-mess li:nth-child(7) .statistic-data,
  .basic-mess li:nth-child(8) .statistic-data {
    font-size: 18px;
  }

  .basic-mess .statistic-data {
    width: 100%;
    border: none;
    // text-align: center;
    display: block;
    font-size: 24px;
    color: #000;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .edit-btn {
    outline: none;
    background-color: #FF5B68;
    width: 60px;
    height: 30px;
    border: solid 1px #FF5B68;
    color: #fff;
    font-size: 12px;
    border-radius: 2px;
    cursor: pointer;
  }
  .product-edit-btn {
    outline: none;
    background-color: #FF5B68;
    width: 40px;
    height: 24px;
    border: solid 1px #FF5B68;
    color: #fff;
    font-size: 12px;
    border-radius: 2px;
    cursor: pointer;
  }

  .edit-btn.copyLink {
    width: 108px;
    height: 40px;
    border: none;
    margin-bottom: 20px;
    background-color: #409EFF;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
  }
  .edit-btn.edit-contact-btn {
    border-color: #DCDFE6;
    width: 80px;
    height: 30px;
    background: #fff;
    color: #000;
    cursor: pointer;
  }
</style>
<style lang="scss">
.console-agent-info-table {
    &.el-table th>.cell {
        color: #3E8EF7;
    }
    .el-table__body td {
        border-bottom: 1px solid #eee;
    }
    .el-table__body .el-table__row:last-child {
        td {
            border-bottom: 0;
        }
    }
    &.el-table--mini th {
        padding: 14px 0;
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
    display: inline-block;
    font-size: 20px;
    color: #333;
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

  .mealPackage li {
    width: 33%;
    float: left;
    text-align: center;

    >.moneyMeal {
      font-size: 24px;
      font-weight: 700;
      color: #666;
      display: block;
    }

    >p span {
      display: block;
    }

    .line {
      width: 20px;
      height: 3px;
      background-color: #4680ff;
      border-radius: 1px;
      margin: 5px auto 15px;
    }
  }

  .mealPackage li:nth-child(2) .line {
    background-color: #fd862e;
  }

  .mealPackage li:nth-child(3) .line {
    background-color: #08d8d8;
  }

  .mealPackage li:nth-child(4) {
    width: 95%;
    position: absolute;
    bottom: 6px;
    right: 12px;
    text-align: left;
    padding-left: 20px;
    border-top: solid 1px #e5e5e5;

    >p {
      display: inline-block;

      .line {
        height: 0
      }
    }

    >.moneyMeal {
        display: inline-block;
    }

    span.moneyMeal {
      font-size: 14px;
      color: #4680ff;
    }
  }


  /* 二维码 */

  #qrcodeCon {
    width: 184px;
    height: 215px;
    border: solid 1px #e5e5e5;
    margin: 0 auto;
    position: relative;

    >button {
      width: 100%;
      height: 32px;
      background-color: #4680ff;
      border: none;
      color: #fff;
      position: absolute;
      bottom: 0
    }
  }

  #qrcode {
    padding: 10px
  }

  .el-dialog__footer {
    padding: 10px 48px 20px;
  }

  #mealDialog .el-dialog {
    width: 32%;
  }

  .divInput {
    margin: 10px 42px 25px;
  }

  .mealinput {
    width: 110px;
    display: inline-block;
  }

  .mealinput input {
    width: 100%;
    height: 32px;
    text-indent: 0.5em;
  }

  #copyBtn {
    margin-left: -12px;
    height: 40px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #copyInput {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .basic-mess li button:hover {
    background-color: #4680FF;
    color: #fff;
    border-color: #4680FF;
    cursor: pointer
  }

  .giveCounts {
    margin-top: 20px;
    margin-left: 20px
  }

  .giveCounts span {
    font-size: 16px;
    margin: 10px;
  }
</style>