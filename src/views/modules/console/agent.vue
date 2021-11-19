<template>
    <div class="main">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height: 490px;">
                    <h2>嗨！{{ agentInfo.userName }}</h2>
                    <ul class="cf basic-mess">
                        <li v-for="(item, index) in basicList" :style="item.liStyles || {}" :key="index">
                            <p v-if="!['邮箱', '手机号'].includes(item.title)">{{item.title}}</p>
                            <div class="statistic-data" :style="item.isFontSmall ? { fontSize: '14px' } : {}">{{deskInfo[item.field]}}</div>
                            <button class="edit-btn" :style="item.styles || {}" v-show="item.flag" @click="handleOneCardClick(index, item)">
                                {{ item.title === '邮箱' && (deskInfo[item.field] === '' || !deskInfo[item.field]) ? '添加邮箱' : item.btnText }}
                            </button>
                        </li>
                        <li class="btns-wrapper">
                            <button class="edit-btn copyLink" @click="copyLink">复制推广链接</button>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height: 490px;">
                    <div>
                        <h2>充值记录</h2>
                        <el-button type="text" style="float:right" @click="showDetails()">查看详情</el-button>
                    </div>
                    <el-table :header-cell-style="getRowClass" :data="rechargeRecordData" style="width: 100%" :highlight-current-row="true">
                        <el-table-column prop="categary" label="充值产品">
                            <template slot-scope="{ row }">
                                <span>{{ row.category === 0 ? '空号检测' : '实时检测' }}</span>
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
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                <h2>空号检测统计</h2>
                <ul class="customerList">
                    <li v-for="(item, index) in emptyCustomList" :key="index">
                    <p>{{ item.title }}</p>
                    <p>{{ deskInfo[item.field] }}</p>
                    </li>
                </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                <h2>实时检测统计</h2>
                <ul class="customerList">
                    <li v-for="(item, index) in realCustomList" :key="index">
                    <p>{{ item.title }}</p>
                    <p>{{ deskInfo[item.field] }}</p>
                    </li>
                </ul>
                </div>
            </el-col>
            <el-col :span="12" style="position: relative;">
                <div class="grid-content bg-purple">
                    <div>
                        <h2>充值套餐</h2>
                        <el-button type="text" style="float:right" @click="viewMeals()">查看详情</el-button>
                    </div>
                    <div v-if="mealList.length === 0" class="meal-empty">暂无套餐</div>
                    <ul v-else class="cf mealPackage">
                        <li v-for="(item,index) in mealList" :key="index">
                            <p><span>{{item.name}}</span><span class="line"></span></p>
                            <span class="moneyMeal">{{item.price}}元</span>
                            <span class="label">/{{item.specifications}}条</span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <h2>注册赠送</h2>
                    <div class="giveCounts">
                        <span>自动赠送</span>
                        <el-switch v-model="giveSwitch" @change="checkSwitch"></el-switch>
                        <span>（关闭后，系统将不会自动赠送5000条）</span>
                    </div>
                </div>
            </el-col>
            <!-- <el-col :span="12" v-if="myReject">
                <div class="grid-content bg-purple">
                    <h2>我的待办</h2>
                    <div style="margin:20px;line-height:35px;" class="cf">
                        <span style="float:left">你的设置已被管理员驳回</span>
                        <el-button type="primary" style="float:right;background-color:#4680ff;" @click="rejectRet()">重新设置</el-button>
                    </div>
                    <div style="margin:20px">
                        <span>驳回原因：</span>
                        <span style="line-height:25px" id="remarkCon">{{remarksCon}}</span>
                    </div>
                </div>
            </el-col> -->
        </el-row>

        <!-- 添加邮箱弹窗 -->
        <el-dialog title="添加邮箱" :visible.sync="addEmailVisible">
            <el-form :model="addemailform" :rules="addemailrules" ref="addemailruleForm">
                <el-form-item label="新邮箱" prop="email">
                <el-input v-model="addemailform.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addEmailBtn()">确 定</el-button>
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
                <el-button type="primary" @click="reEmailBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 复制链接弹窗 -->
        <el-dialog title="复制推广链接" :visible.sync="copyVisible" width="520px">
            <el-input v-model="copyinput" style="width: 80%;" id="copyInput"></el-input>
            <el-button type="primary" id="copyBtn" v-clipboard:copy="copyinput" v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制链接</el-button>
        </el-dialog>

        <!-- 修改套餐弹窗 -->
        <el-dialog title="套餐修改" :visible.sync="editmealVisible" id="mealDialog" width="460px">
            <div>
                <div class="divInput" v-for="(item,i) in mealList" :key="i">
                <span class="label" style="width:90px;display:inline-block;text-align: right;margin-right: 5px">{{item.packageName}}：</span>
                <div class="mealinput">
                    <input type="text" v-if="i == '3'" v-model="dat.mealMoney[i]" id="customValue" oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
                    <input type="text" v-else v-model="dat.mealMoney[i]" oninput="value=value.replace(/[^\d]/g,'')">
                </div>
                <span>元</span>
                <div class="mealinput" style="width: 40px;">
                    <input type="text" v-if="i == '3'" v-model="dat.count[i]" style="border:none;text-align: center;" readonly>
                    <input type="text" v-else v-model="dat.count[i]" style="border:none;text-align: center" readonly>
                </div>
                <span class="label" v-if="i == '3'">条</span>
                <span class="label" v-else>万条</span>
                </div>
                <p style="margin-left: 40px">
                    注意：
                    <p style="margin-left: 80px;margin-top: -37px">1. 充值单价不得低于<span style="color:red">0.001</span>元/条；</p>
                    <p style="margin-left: 80px;line-height:2px">2.套餐价格必须为正整数。</p>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editmealChange()">修改套餐</el-button>
            </span>
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
        <el-dialog :title="warnEditType + '预警值'" width="520px" :visible.sync="warnFormVisible">
            <el-form :model="warinform" :rules="warnRule" ref="warinform">
                <el-form-item label-width="100px" label="当前预警值">
                    <el-input v-model="warinform.curcounts" style="width: 84%; margin-right: 8px;" id="curCount" disabled></el-input>
                    <span>万条</span>
                </el-form-item>
                <el-form-item label-width="100px" label="修改预警值" prop="counts">
                    <el-input v-model="warinform.counts" style="width: 84%; margin-right: 8px;"></el-input>
                    <span>万条</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="warnFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="warnFormSubmit()">确 定</el-button>
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
import reBindPhone from './re-bind-phone'
import UpdatePassword from '../../main-navbar-update-password'
import AgentRechargeDia from './agent-recharge-dia.vue'
import { isEmail } from '@/utils/validate'

export default {
    name: 'AgentDesk',
    components: {
        reBindPhone,
        UpdatePassword,
        AgentRechargeDia
    },
    data() {
        const validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                callback(new Error('邮箱格式错误'))
            } else {
                callback()
            }
        }
        return {
            basicList: [ // 基本信息
                { title: '空号代理价（元/条）', field: 'price', btnText: '', flag: false },
                { title: '空号余额（万条）', field: 'emptyBalance', btnText: '充值', flag: true },
                { title: '空号预警值（万条）', field: 'warningsNumber', btnText: '修改', flag: true },
                { title: '实时代理价（元/条）', field: 'realPrice', btnText: '', flag: false },
                { title: '实时余额（万条）', field: 'realtimeBalance', btnText: '充值', flag: true },
                { title: '实时预警值（万条）', field: 'realWarningsNumber', btnText: '修改', flag: true },
                { title: '手机号', field: 'mobile', liStyles: { height: '118px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }, styles: { borderColor: '#409EFF', width: '80px', height: '28px', background: '#409EFF' }, btnText: '更改手机号', flag: true, isFontSmall: true },
                { title: '邮箱', field: 'email', liStyles: { height: '118px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }, styles: { borderColor: '#409EFF', width: '80px', height: '28px', background: '#409EFF' }, btnText: '更改邮箱', flag: true, isFontSmall: true }
            ],
            emptyCustomList: [
                { title: '客户数量', field: 'custNums' },
                { title: '客户充值总计（元）', field: 'custRechargeSum' },
                { title: '客户消费条数（条）', field: 'emptyConsume' },
                { title: '充值总条数（条）', field: 'custRechargeNumberSum' }
            ],
            realCustomList: [
                { title: '客户数量', field: 'custNums' },
                { title: '客户充值总计（元）', field: 'custRealtimeRechargeSum' },
                { title: '客户消费条数（条）', field: 'realTimeConsume' },
                { title: '充值总条数（条）', field: 'custRealtimeRechargeNumberSum' }
            ],
            agentInfo: {},
            deskInfo: {},
            rechargeRecordData: [],
            mealList: [], //套餐
            giveSwitch: false,
            myReject: false,
            remarksCon: '',

            // 复制链接弹窗
            copyVisible: false,
            copyinput: '',

            // 修改套餐弹框
            packageId: [],
            editmealVisible: false,
            dat: {
                count: [],
                mealMoney: [],
                name: []
            },
            list: [],

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
            warinform: { counts: '', curcounts: '' },
            warnRule: {
                counts: [
                    { required: true, message: '请输入修改的预警值', trigger: 'blur' }
                ],
            },
        };
    },
    computed: {
        userName: {
            get() { return this.$store.state.user.username }
        }
    },
    activated() {
        this.getAgentDeskInfo()
        this.myRechargeList()
        this.findAgentPackage()
        // this.rejectVisibie()
        // this.remarkDialog()
        this.updatePwd()
    },
    methods: {
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
            url: this.$http.adornUrl(`agent/desk/getAgentDeskInfo?token=${this.$cookie.get('token')}`),
            method: 'post',
            }).then(({ data }) => {
            if (data && data.code === 0) {
                const { autoPresentCfg, agentInfo, domain } = (data.data || {})
                // 0不自动赠送，1自动赠送
                this.giveSwitch = autoPresentCfg ? true : false
                sessionStorage.setItem('agentInfo', this.$json.stringify(agentInfo || '{}'))
                this.copyinput = domain
                this.deskInfo = {...(data.data || {}), ...(agentInfo || {})}
                this.agentInfo = agentInfo || {}
            } else {
                this.$message.error(data.msg)
            }
            })
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
        // 充值套餐
        findAgentPackage() {
            this.$http({
                url: this.$http.adornUrl(`agent/goods/getPageList?token=${this.$cookie.get('token')}`),
                method: 'post',
                data: {
                    currentPage: 1,
                    pageSize: 4,
                }
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.mealList = data.data.list || []
                } else {
                    this.mealList = []
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
        // 弹出框
        remarkDialog() {
            if ((sessionStorage.getItem('remarkDialog')) && (sessionStorage.getItem('remarkDialog') == 'remarkDialogTr')) {
                this.rejectDialogVisible = true
                sessionStorage.setItem('remarkDialog', '')
            } else {
                this.rejectDialogVisible = false
                sessionStorage.setItem('remarkDialog', '')
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
        rejectVisibie() {
            if ((sessionStorage.getItem('isExamine')) && (sessionStorage.getItem('isExamine') == 'reject')) {
                this.myReject = false
            } else {
                this.myReject = true
            }
        },
        handleOneCardClick(index, record) {
            switch (index) {
                case 4:
                case 1: { // 余额充值
                    if (index === 4 && !this.agentInfo.realPrice) { // 代理实时单价 为 0 或未获取实时产品的代理权
                        this.$message.warning('暂无实时检测代理权限')
                        return false
                    }
                    this.$refs['agentRechargeDiaRef'].init(index === 1 ? 'empty' : 'real', this.agentInfo)
                    break;
                }
                case 5:
                case 2: { // 预警值修改
                    if (index === 5 && !this.agentInfo.realPrice) { // 代理实时单价 为 0 或未获取实时产品的代理权
                        this.$message.warning('暂无实时检测代理权限')
                        return false
                    }
                    this.warnEditType = index === 2 ? '空号' : '实时'
                    this.warinform.curcounts = this.deskInfo[record.field]
                    this.warnFormVisible = true;
                    this.$nextTick(() => {
                        this.$refs['warinform'].resetFields();
                    })
                    break;
                }
                case 6: { // 修改手机号
                    this.reBindVisible = true;
                    this.$nextTick(() => {
                        this.$refs.reBindPhoneCon.showInit(this.deskInfo.mobile)
                    })
                    break;
                }
                case 7: { // 修改邮箱
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
        // 修改套餐
        editMeal() {
            this.editmealVisible = true;
            this.dat.count = []
            this.dat.mealMoney = []
            this.dat.name = []
            for (let i = 0; i < this.mealList.length; i++) {
                this.dat.count.push(this.mealList[i].number);
                this.dat.mealMoney.push(this.mealList[i].money)
                this.dat.name.push(this.mealList[i].packageName)
            }
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

        /********** 修改套餐弹框 **********/
        editmealChange() {
            //设置最小自定义充值
            let min = 0.001;
            let customVal = document.getElementById('customValue').value;
            if (customVal < min) {
                this.$message.error('自定义充值单价不得低于0.001元/条');
                return false
            }
            //设置计算出的单价
            let packListCount = this.dat.count;//条数
            let packListMoney = this.dat.mealMoney //钱
            for (let i = 0; i < 3; i++) {
            if ((packListMoney[i] / packListCount[i]) < 10) {
                if (i == 0) {
                this.$message.error('套餐A的充值单价不得低于0.001元/条');
                } else if (i == 1) {
                this.$message.error('套餐B的充值单价不得低于0.001元/条');
                } else if (i == 2) {
                this.$message.error('套餐C的充值单价不得低于0.001元/条');
                }

                return;
            }
            }

            for (let i = 0; i < this.dat.count.length; i++) {
                let activeSubjectsObject = {};
                for (let j = 0; j < this.dat.mealMoney.length; j++) {
                    for (let m = 0; m < this.dat.name.length; m++) {
                        for (let k = 0; k < this.packageId.length; k++) {
                            if (i == j && j == k && i == k && i == m && j == m && k == m) {
                                activeSubjectsObject.id = Number(this.packageId[i]);
                                activeSubjectsObject.number = Number(this.dat.count[j]);
                                activeSubjectsObject.money = Number(this.dat.mealMoney[k]);
                                activeSubjectsObject.packageName = this.dat.name[k];
                                this.list.push(activeSubjectsObject);
                            }
                        }
                    }
                }
            }
            this.$http({
                url: this.$http.adornUrl(`agent/desk/updateAgentPackage?token=${this.$cookie.get('token')}`),
                method: 'post',
                data: this.$http.adornData({
                    'list': this.list,
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success('套餐修改完成');
                    this.editmealVisible = false;
                    this.findAgentPackage();
                    this.dat.count = [];
                    this.dat.mealMoney = [];
                    this.packageId = [];
                    this.list = []
                } else {
                    this.list = []
                    this.$message.error(data.msg);
                }
            })
        },

        /********** 添加邮箱弹框 **********/
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
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'mail': this.reemailform.newemail,
                        })
                    }).then(({ data }) => {
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
            this.$refs['warinform'].validate((valid) => {
                if (valid) {
                    let field = this.warnEditType === '空号' ? 'warnNumber' : 'realtimeWarnNumber'
                    let apiPath = this.warnEditType === '空号' ? 'updateWarnNumber' : 'updateRealtimeWarnNumber'
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/${apiPath}?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            [field]: this.warinform.counts,
                        })
                    }).then(({ data }) => {
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
    align-items: center;
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

    .basic-mess li button:hover {
        background-color: #FF5B68;
        color: #fff;
        border-color: #FF5B68;
        cursor: pointer;
    }
  .edit-btn {
    outline: none;
    background-color: #FF5B68;
    width: 60px;
    height: 32px;
    border: solid 1px #FF5B68;
    color: #fff;
    font-size: 12px;
    border-radius: 2px;
  }

  .basic-mess li .edit-btn.copyLink {
    width: 108px;
    height: 32px;
    border: none;
    margin-bottom: 20px;
    background-color: #409EFF;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
  }

</style>
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