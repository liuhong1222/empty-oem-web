<template>
    <div class="main">
        <div class="topSearch">
            <h2>OEM列表</h2>
            <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="searchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商名称：" style="margin-left:25px;">
                    <el-input v-model="searchData.agentName" placeholder="代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="searchData.mobile" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="代理商状态：">
                    <el-select v-model="searchData.status" placeholder="代理商状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已禁用" value="0"></el-option>
                        <el-option label="使用中" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDataList()">查询</el-button>
                    <el-button type="primary" @click="exporTable" :disabled="disabled">导出</el-button>
                    <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addUpdateAgent()">新增代理商</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="agentTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
                </el-table-column>
                <el-table-column prop="mchId" label=" 商户编号" width="80" align="center">
                </el-table-column>
                <el-table-column prop="companyName" label=" 代理商名称" width="165" align="center">
                </el-table-column>
                <el-table-column prop="statusName" label=" 代理商状态" width="90" align="center">
                </el-table-column>
                <el-table-column prop="shortName" label=" 公司简称" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150" align="center">
                </el-table-column>
                <el-table-column prop="canUpgradeName" label="能否升级" width="80" align="center">
                </el-table-column>
                <el-table-column prop="levelName" label="代理等级" width="120" align="center">
                </el-table-column>
                <el-table-column prop="totalRechargeMoney" label="充值总计（元）" width="120" align="center">
                </el-table-column>
                <el-table-column prop="totalRechargeNumber" label="充值总条数" width="120" align="center">
                </el-table-column>
                <el-table-column prop="emptyBalance" label="剩余条数" width="120" align="center">
                </el-table-column>
                <el-table-column prop="emptyWarnNumber" label="预警条数" width="120" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="联系电话" width="120" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="chdataBtn(scope.row.agentId,scope.row.companyName,scope.row.price)">充值</el-button>
                        <el-button style="margin-right: 10px;"  @click="seeClick(scope.row.agentId)" type="text" size="small">查看</el-button>
                        <el-dropdown @command="(key) => handleClickDropdown(key, scope.row)">
                            <el-button type="text" size="small">···</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">修改</el-dropdown-item>
                                <el-dropdown-item command="refund">退款</el-dropdown-item>
                                <el-dropdown-item command="usable">{{scope.row.status == 0 ? '启用' : '禁用'}}</el-dropdown-item>
                                <el-dropdown-item command="auth">{{scope.row.isOpen == 0 ? '开启认证' : '关闭认证'}}</el-dropdown-item>
                                <el-dropdown-item command="download">号码魔方</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 充值弹窗 -->
        <el-dialog title="充值" :visible.sync="chdataFormVisible">
            <el-form :model="chdataForm" ref="chdataFormref" :rules="chdataFormrefRule" label-width="100px">
                <el-form-item label="充值账号">
                    <el-input style="border:none" v-model="chdataForm.accnumber" placeholder="" readonly id="chprice"></el-input>
                </el-form-item>
                <el-form-item label="充值单价" prop="chPrice">
                    <el-input v-model.number="chdataForm.chPrice" placeholder="输入充值单价，自动计算条数"></el-input>
                    <span>元/条</span>
                </el-form-item>
                <el-form-item label="充值金额" prop="chMoney">
                    <el-input v-model.number="chdataForm.chMoney" placeholder="输入充值金额，自动计算条数"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="充值条数" prop="chCounts">
                    <el-input v-model.number="chdataForm.chCounts" placeholder="请输入充值条数" readonly></el-input>
                    <span>条</span>
                </el-form-item>
                <el-form-item label="入账类型" prop="type">
                    <el-select v-model="chdataForm.type" placeholder="入账类型">
                        <el-option label="支付宝" value="1"></el-option>
                        <el-option label="对公转账" value="5"></el-option>
                        <!-- <el-option label="赠送" value="6"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="chdataForm.remark" placeholder="请输入备注..."></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="chdataFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="chsubmit" :disabled="disabledcz">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 禁用，启用 -->
        <el-dialog :title="disableTitlt" :visible.sync="disableVisible" width="30%" @close="closeDialogjq">
            <p v-show="jinShow" class="hideCON">您将禁用账号{{account}}，禁用后该账户将不可登录该系统</p>
            <p v-show="qiShow" class="hideCON">您将启用账号{{account}}，启用后该账户将恢复正常使用。</p>
            <!-- <p v-show="jinShow">您将禁用账号<input type="text" value="*****" style="border:none; color:#3E8EF7;min-width:50px" v-model="account">，禁用后该账户将不可登录该系统</p>
            <p v-show="qiShow">您将启用账号<input type="text" value="*****" style="border:none;min-width:50px" v-model="account">，启用后该账户将恢复正常使用。</p> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="disableVisible = false">取 消</el-button>
                <el-button type="primary" @click="ddd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改,新增 -->
        <add-or-update v-if="addSeeUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!--查看 对话框 -->
        <see-dia-data v-if="agentseeVisible" ref="agentseecon"></see-dia-data>
    </div>
</template>
<script>
    import AddOrUpdate from './agent-add-or-update'
    import seeDiaData from './agent-see-dia-data'
    export default {
        data() {
            return {
                account: '',
                cdAgentId: '',
                jinorQiId: '',
                disabled: false,
                disabledcz: false,
                agentseeVisible: false,
                jinShow: false,
                qiShow: false,
                disableTitlt: "",
                disableVisible: false,
                addSeeUpdateVisible: false,
                searchData: {
                    dateTime: [],
                    agentName: "",
                    status: "",
                    mobile: ""
                },
                formInline: {
                    user: '',
                    region: ''
                },
                agentTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                chdataFormVisible: false,
                chdataForm: {
                    accnumber: '',
                    chPrice: '',
                    chCounts: '',
                    type: '',
                    chMoney: '',
                    remark: ''
                },
                chdataFormrefRule: {
                    chPrice: [
                        { required: true, message: '请输入单价', trigger: 'blur' },
                        { type: 'number', message: '金额必须为数字' }
                    ],
                    chMoney: [
                        { required: true, message: '请输入金额', trigger: 'blur' },
                        { type: 'number', message: '金额必须为数字' }
                    ],
                    chCounts: [
                        { required: true, message: '请输入条数', trigger: 'blur' },
                        { type: 'number', message: '条数必须为数字' }
                    ],
                    type: [
                        { required: true, message: '请选择入账类型', trigger: 'blur' }
                    ],

                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        watch: {
            'chdataForm.chMoney'() {
                if (this.chdataForm.chMoney !== "" && this.chdataForm.chPrice !== "") {
                    this.chdataForm.chCounts = Math.ceil(Number(this.chdataForm.chMoney) / (this.chdataForm.chPrice));
                } else {
                    this.chdataForm.chCounts = ""
                }
            }
        },
        components: {
            AddOrUpdate,
            seeDiaData
        },
        activated() {
            this.getDataList()
        },
        methods: {

            // 获取代理商列表
            getDataList() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'companyName': this.searchData.agentName,
                        'status': this.searchData.status,
                        'mobile': this.searchData.mobile,
                        'startTime': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[0],
                        'endTime': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentTableData = data.data.list
                        this.totalPage = data.data.total
                        if (data.data.list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.agentTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },

            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getDataList()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            closeDialogjq() {
                this.jinShow = false
                this.qiShow = false
            },
            // 导出 
            exporTable() {
                let startTime;
                let endTime;
                if (this.searchData.dateTime == null) {
                    startTime = ""
                    endTime = ""
                } else {
                    if (this.searchData.dateTime.length == 0) {
                        startTime = ""
                        endTime = ""
                    } else {
                        startTime = this.searchData.dateTime[0]
                        endTime = this.searchData.dateTime[1]
                    }
                }

                window.open(this.$http.adornUrl(`agent/agentInfo/list/export?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&companyName=${this.searchData.agentName}&status=${this.searchData.status}&mobile=${this.searchData.mobile}&startTime=${startTime}&endTime=${endTime}`))
            },
            addUpdateAgent(id) {
                this.addSeeUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.showInit(id)
                })
            },
            seeClick(id) {
                this.agentseeVisible = true
                this.$nextTick(() => {
                    this.$refs.agentseecon.showInit(id)
                })
            },
            chdataBtn(agentId, companyName, price) {
                this.chdataFormVisible = true
                this.cdAgentId = agentId
                this.chdataForm.accnumber = companyName
                this.chdataForm.chPrice = price
                this.$nextTick(() => {
                    this.$refs['chdataFormref'].resetFields();
                })
            },
            // 禁用启用
            disableAndEnabled(v) {
                this.account = v.companyName
                this.jinorQiId = v.agentId
                if (v.status == 1) {
                    this.disableTitlt = '禁用'
                    this.jinShow = true
                    // 分别调用确定提交按钮
                } else if (v.status == 0) {
                    this.disableTitlt = '启用'
                    this.qiShow = true
                    // 分别调用确定提交按钮
                }
                this.disableVisible = true
            },

            ddd() {
                if (this.disableTitlt == "禁用") {
                    this.$http({
                        url: this.$http.adornUrl(`agent/agentInfo/pause?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'agentId': this.jinorQiId
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.disableVisible = false
                            this.jinShow = false
                            this.qiShow = false
                            this.getDataList()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                } else if (this.disableTitlt == '启用') {
                    this.$http({
                        url: this.$http.adornUrl(`agent/agentInfo/resume?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'agentId': this.jinorQiId
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.disableVisible = false
                            this.qiShow = false
                            this.jinShow = false
                            this.getDataList()
                        } else {
                            this.$message.error(data.msg)
                        }

                    })
                }
            },
            // 提交充值
            chsubmit() {
                this.$refs['chdataFormref'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认要充值吗？')
                            .then(_ => {
                                this.regAgentSubmit()
                            })
                            .catch(_ => { })
                    }
                })
            },
            regAgentSubmit() {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/recharge?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentId': this.cdAgentId,
                        'price': this.chdataForm.chPrice,
                        'number': this.chdataForm.chCounts,
                        'money': this.chdataForm.chMoney,
                        'payType': this.chdataForm.type,
                    })
                }).then(({ data }) => {
                    // console.log(data)
                    if (data && data.code === 0) {
                        this.disabledcz = true
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.chdataFormVisible = false
                                this.disabledcz = false
                                this.chdataForm.remark = ""// 清空备注
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 退款
            handleRefund(record) {
                console.log('退款', record)
            },
            // 开启关闭认证
            handleAuth(record) {
                console.log('开启关闭认证', record)
            },
            // 下载号码魔方
            handleDownloadApp(record) {
                console.log('号码魔方', record)
            },
            handleClickDropdown(key, record) {
                switch(key) {
                    case 'edit': {
                        this.addUpdateAgent(record.agentId)
                        break;
                    }
                    case 'refund': {
                        this.handleRefund(record)
                        break;
                    }
                    case 'usable': {
                        this.disableAndEnabled(record)
                        break;
                    }
                    case 'auth': {
                        this.handleAuth(record)
                        break;
                    }
                    case 'download': {
                        this.handleDownloadApp(record)
                        break;
                    }
                    default:
                        break
                }
            }
        }
    }

</script>
<style lang="scss">
    .topSearch {
        width: 100%;
        padding: 10px 23px 20px;
        background-color: #ffffff;
        margin-bottom: 24px;
        box-shadow: 0px 7px 9px 0px rgba(153, 153, 153, 0.05);
    }
</style>