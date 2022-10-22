<template>
    <div class="main">
        <div class="topSearch">
            <h2>代理商列表</h2>
            <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList(1)">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="searchData.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="searchData.mobile" style="width: 180px;" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="代理商状态：">
                    <el-select v-model="searchData.status" style="width: 220px;" placeholder="请选择代理商状态">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="锁定" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="官网类型：">
                    <el-select @change="handleOfficialWebChange" v-model="searchData.officialWeb" style="width: 220px;" placeholder="请选择官网类型">
                        <el-option v-for="item in officialWebType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="代理商：">
                    <el-select v-model="searchData.agentName" style="width: 220px;" placeholder="请选择代理商">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="(item, index) in agentList" :label="item.companyName" :key="index" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDataList(1)">查询</el-button>
                    <el-button type="primary" @click="exporTable" :disabled="disabled">导出</el-button>
                    <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addUpdateAgent()">新增代理商</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="agentTableData" :border="true" :row-style="dealRowClass" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column fixed type="expand">
                    <template slot-scope="props">
                        <ul class="table-expand-col">
                            <li class="table-expand-item" :key="item.field" v-for="item in tableExpandCols">
                                <div class="table-expand-label">{{ item.label }}</div>
                                <div class="table-expand-value">{{ item.render ? item.render(props.row[item.field]) : props.row[item.field] }}</div>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
                </el-table-column>
                <el-table-column prop="officialWeb" label="官网类型" width="100" align="center">
                    <template slot-scope="{ row }">
                        <span :style="{ color: row.officialWeb === 1 ? 'rgba(62, 142, 247, 1)' : 'rgba(113, 64, 255, 1)', fontWeight: '600' }">{{ officialWebTypeMap[row.officialWeb] || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="代理商名称" width="150" align="center">
                </el-table-column>
                <el-table-column prop="state" label="状态" width="90" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ stateMap[row.state] || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150" align="center">
                </el-table-column>
                <el-table-column prop="linkmanPhone" label="联系电话" width="120" align="center">
                </el-table-column>
                <el-table-column label="空号检测" min-width="200" prop="empty" align="center">
                    <template slot-scope="{ row }">
                        <div class="tow-row-col">
                            <div>
                                <span>充值总计(元)</span>
                                <span>{{ row.emptyRechargeMoney || 0 }}</span>
                            </div>
                            <div>
                                <span>剩余条数</span>
                                <span>{{ row.emptyBalance || 0 }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实时检测" min-width="200" prop="realTime" align="center">
                    <template slot-scope="{ row }">
                        <div class="tow-row-col">
                            <div>
                                <span>充值总计(元)</span>
                                <span>{{ row.realTimeRechargeMoney || 0 }}</span>
                            </div>
                            <div>
                                <span>剩余条数</span>
                                <span>{{ row.realTimeBalance || 0 }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="国际检测" min-width="200" prop="international" align="center">
                    <template slot-scope="{ row }">
                        <div class="tow-row-col">
                            <div>
                                <span>充值总计(元)</span>
                                <span>{{ row.internationalRechargeMoney || 0 }}</span>
                            </div>
                            <div>
                                <span>剩余条数</span>
                                <span>{{ row.internationalBalance || 0 }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="定向通用检测" min-width="200" prop="directCommon" align="center">
                    <template slot-scope="{ row }">
                        <div class="tow-row-col">
                            <div>
                                <span>充值总计(元)</span>
                                <span>{{ row.directCommonRechargeMoney || 0 }}</span>
                            </div>
                            <div>
                                <span>剩余条数</span>
                                <span>{{ row.directCommonBalance || 0 }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="line定向检测" min-width="200" prop="lineDirect" align="center">
                    <template slot-scope="{ row }">
                        <div class="tow-row-col">
                            <div>
                                <span>充值总计(元)</span>
                                <span>{{ row.lineDirectRechargeMoney || 0 }}</span>
                            </div>
                            <div>
                                <span>剩余条数</span>
                                <span>{{ row.lineDirectBalance || 0 }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="chdataBtn(scope.row)">充值</el-button>
                        <el-button style="margin-right: 10px;"  @click="seeClick(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-dropdown @command="(key) => handleClickDropdown(key, scope.row)">
                            <el-button type="text" size="small">···</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">修改</el-dropdown-item>
                                <el-dropdown-item command="refund">退款</el-dropdown-item>
                                <el-dropdown-item command="usable">{{scope.row.state == 0 ? '启用' : '禁用'}}</el-dropdown-item>
                                <el-dropdown-item command="download">号码魔方</el-dropdown-item>
                                <el-dropdown-item command="authLevel">设置用户认证等级</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination :key="pageIndex" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 充值弹窗 -->
        <el-dialog title="充值" :visible.sync="chdataFormVisible" width="520px">
            <el-form :model="chdataForm" ref="chdataFormref" :rules="chdataFormrefRule" label-width="100px">
                <el-form-item label="充值账号：" prop="name">
                    <el-input v-model="chdataForm.name" placeholder="请输入充值账号" disabled></el-input>
                </el-form-item>
                <el-form-item label="产品名称：" prop="category">
                    <el-select v-model="chdataForm.category" placeholder="请选择产品名称">
                        <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值单价：" prop="price">
                    <el-input-number v-model="chdataForm.price" disabled :min="0"></el-input-number>
                    <span class="margin-left-8">元/条</span>
                </el-form-item>
                <el-form-item label="充值金额：" prop="paymentAmount">
                    <el-input-number v-model="chdataForm.paymentAmount" :min="0"></el-input-number>
                    <span class="margin-left-8">元</span>
                </el-form-item>
                <el-form-item label="充值条数：" prop="rechargeNumber">
                    <el-input-number v-model="chdataForm.rechargeNumber" disabled :min="0"></el-input-number>
                    <span class="margin-left-8">条</span>
                </el-form-item>
                <el-form-item label="入账类型：" prop="payType">
                    <el-select style="width: 100%;" v-model="chdataForm.payType" placeholder="请选择入账类型">
                        <el-option v-for="item in rechargeWayOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" v-model="chdataForm.remark" :row="3" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="chdataFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="rechargeSubmit" :loading="rechargeSubmitLoading">确 定</el-button>
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
                <el-button type="primary" :loading="stopAccountLoading" @click="forbidden">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改,新增 -->
        <add-or-update v-if="addSeeUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!--查看 对话框 -->
        <see-dia-data v-if="agentseeVisible" ref="agentseecon"></see-dia-data>
        <!--退款 对话框 -->
        <agent-refund ref="agentRefundRef" @refreshDataList="getDataList"></agent-refund>
        <!--号码魔方上传 对话框 -->
        <agent-upload-package ref="agentUploadPackageRef" @refreshDataList="getDataList" />
        <!--设置用户认证等级 对话框 -->
        <set-auth-level ref="setAuthLevelRef" @refresh="getDataList" />
    </div>
</template>
<script>
    import AddOrUpdate from './agent-add-or-update'
    import SeeDiaData from './agent-see-dia-data'
    import AgentRefund from './agent-refund.vue'
    import AgentUploadPackage from './agent-upload-package.vue'
    import SetAuthLevel from '@/components/set-auth-level/index.vue'
    import { categoryOptions } from '@/const'
    export default {
        data() {
            var validateMoney = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入充值金额'))
                } else if (('' + value).includes('.')) {
                    callback(new Error('充值金额不包含小数'))
                } else {
                    callback()
                }
            }
            return {
                categoryOptions,
                tableExpandCols: [
                    { label: '公司简称', field: 'companyShortName' },
                    { label: '空号检测等级', field: 'agentLevel' },
                    { label: '空号检测充值总条数', field: 'emptyRechargeNumber', render: (val) => (val || '0') },
                    { label: '空号检测预警条数', field: 'warningsNumber', render: (val) => (val || '0') },
                    { label: '实时检测等级', field: 'realLevel' },
                    { label: '实时检测充值总条数', field: 'realTimeRechargeNumber', render: (val) => (val || '0') },
                    { label: '实时检测预警条数', field: 'realWarningsNumber', render: (val) => (val || '0') },
                    { label: '国际检测等级', field: 'internationalLevel' },
                    { label: '国际检测充值总条数', field: 'internationalRechargeNumber', render: (val) => (val || '0') },
                    { label: '国际检测预警条数', field: 'internationalWarningsNumber', render: (val) => (val || '0') },
                    { label: '定向通用检测等级', field: 'directCommonLevel' },
                    { label: '定向通用检测充值总条数', field: 'directCommonRechargeNumber', render: (val) => (val || '0') },
                    { label: '定向通用检测预警条数', field: 'directCommonWarningsNumber', render: (val) => (val || '0') },
                    { label: 'line定向检测等级', field: 'lineDirectLevel' },
                    { label: 'line定向检测充值总条数', field: 'lineDirectRechargeNumber', render: (val) => (val || '0') },
                    { label: 'line定向检测预警条数', field: 'lineDirectWarningsNumber', render: (val) => (val || '0') },
                ],
                account: '',
                cdAgentId: '',
                jinorQiId: '',
                disabled: false,
                agentseeVisible: false,
                jinShow: false,
                qiShow: false,
                disableTitlt: "",
                disableVisible: false,
                addSeeUpdateVisible: false,
                searchData: {
                    dateTime: [],
                    agentName: "-1",
                    status: "-1",
                    mobile: "",
                    officialWeb: 0,
                },
                agentTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                chdataFormVisible: false,
                chdataForm: {},
                chdataFormrefRule: {
                    name: [
                        { required: true, message: '请输入充值账号', trigger: 'blur' },
                    ],
                    category: [
                        { required: true, message: '请选择产品类型', trigger: 'blur' },
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'change' },
                    ],
                    rechargeNumber: [
                        { required: true, message: '请输入充值条数', trigger: 'change' },
                    ],
                    paymentAmount: [
                        { required: true, validator: validateMoney, trigger: 'change' },
                    ],
                    payType: [
                        { required: true, message: '请选择入账类型', trigger: 'change' }
                    ],

                },
                rechargeWayOptions: [
                    { label: '对公转账', value: 0 },
                    { label: '支付宝扫码付', value: 1 },
                    { label: '注册赠送', value: 2 },
                    { label: '赠送', value: 3 },
                    { label: '对公支付宝转账', value: 4 },
                    { label: '对私支付宝', value: 5 },
                    { label: '对私微信', value: 6 },
                    { label: '对私转账', value: 7 },
                ],
                rechargeSubmitLoading: false,
                stopAccountLoading: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                stateMap: {
                    '0': '禁用',
                    '1': '启用',
                    '2': '锁定'
                },
                officialWebType: [
                    { value: 0, label: '全部' },
                    { value: 1, label: '迅龙' },
                    { value: 2, label: '步正云' },
                ],
                officialWebTypeMap: {
                    '1': '迅龙',
                    '2': '步正云',
                },
                agentList: [],
                agentListMap: {},
            }
        },
        watch: {
            'chdataForm.category'() {
                const { category } = this.chdataForm;
                let priceFieldMap = {
                    '0': 'emptyPrice',
                    '1': 'realPrice',
                    '2': 'internationalPrice',
                    '4': 'directCommonPrice',
                    '5': 'lineDirectPrice',
                }
                this.chdataForm.price = this.chdataForm[priceFieldMap[category]] || 0
            },
            'chdataForm.price'() {
                this.computedRechargeNumber()
            },
            'chdataForm.paymentAmount'() {
                this.computedRechargeNumber()
            }
        },
        components: {
            AddOrUpdate,
            SeeDiaData,
            AgentRefund,
            AgentUploadPackage,
            SetAuthLevel
        },
        activated() {
            this.getDataList(1)
            this.getAgentList(this.searchData.officialWeb || undefined)
        },
        methods: {
            handleOfficialWebChange(val) {
                this.searchData.agentName = '-1'
                this.getAgentList(val || undefined)
            },
            getAgentList(officialWeb) {
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/listAgent?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        officialWeb
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentList = data.data || []
                        this.agentListMap = this.agentList.reduce((pre, curr) => {
                            return { ...pre, [curr.id + '']: curr.companyName }
                        }, {})
                    } else {
                        this.agentList = []
                        this.agentListMap = {}
                    }
                })
            },
            computedRechargeNumber() {
                const { price, paymentAmount } = this.chdataForm
                this.chdataForm.rechargeNumber = price ? Math.ceil((paymentAmount || 0) / price) : 0
            },
            dealRowClass({ row }) {
                if (row.officialWeb === 1) {
                    return 'background: #EAF3FE;'
                }
                if (row.officialWeb === 2) {
                    return 'background: #F1ECFF;'
                }
            },

            // 获取代理商列表
            getDataList(curr) {
                this.pageIndex = curr || this.pageIndex
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/agentInfo/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'officialWeb': this.searchData.officialWeb || undefined,
                        'companyName': this.agentListMap[this.searchData.agentName],
                        'state': this.searchData.status === '-1' ? undefined : this.searchData.status,
                        'linkmanPhone': this.searchData.mobile,
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

                window.open(this.$http.adornUrl(`agent/agentInfo/list/export?officialWeb=${this.searchData.officialWeb || ''}&token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&companyName=${this.agentListMap[this.searchData.agentName] || ''}&status=${this.searchData.status}&mobile=${this.searchData.mobile}&startTime=${startTime}&endTime=${endTime}`))
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
                    this.$refs.agentseecon.showInit(id + '')
                })
            },
            chdataBtn(record) {
                const { id, level, companyName, price, realPrice, linkmanPhone, internationalPrice, directCommonPrice, lineDirectPrice } = record;
                this.chdataFormVisible = true
                this.$nextTick(() => {
                    this.$refs['chdataFormref'].resetFields()
                    this.chdataForm = {
                        agentId: id + '',
                        agentLevel: level,
                        name: companyName,
                        phone: linkmanPhone,
                        emptyPrice: price,
                        internationalPrice,
                        realPrice,
                        directCommonPrice,
                        lineDirectPrice,
                        category: 0,
                        price
                    }
                })
            },
            // 禁用启用
            disableAndEnabled(record) {
                this.account = record.companyName
                this.jinorQiId = record.id + ''
                if (record.state === 1) {
                    this.disableTitlt = '禁用'
                    this.jinShow = true
                    this.qiShow = false
                }
                if (record.state === 0) {
                    this.disableTitlt = '启用'
                    this.jinShow = false
                    this.qiShow = true
                }
                this.disableVisible = true
                this.stopAccountLoading = false
            },

            forbidden() {
                if (this.disableTitlt == "禁用") {
                    this.stopAccountLoading = true
                    this.$http({
                        url: this.$http.adornUrl(`agent/agentInfo/pause?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: {
                            'agentId': this.jinorQiId
                        }
                    }).then(({ data }) => {
                        this.stopAccountLoading = false
                        if (data && data.code === 0) {
                            this.disableVisible = false
                            this.$message.success('操作成功')
                            this.getDataList()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
                if (this.disableTitlt == '启用') {
                    this.stopAccountLoading = true
                    this.$http({
                        url: this.$http.adornUrl(`agent/agentInfo/resume?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'agentId': this.jinorQiId
                        })
                    }).then(({ data }) => {
                        this.stopAccountLoading = false
                        if (data && data.code === 0) {
                            this.$message.success('操作成功')
                            this.disableVisible = false
                            this.getDataList()
                        } else {
                            this.$message.error(data.msg)
                        }

                    })
                }
            },
            // 提交充值
            rechargeSubmit() {
                this.$refs['chdataFormref'].validate((valid) => {
                    if (valid) {
                        this.rechargeSubmitLoading = true
                        this.$http({
                            url: this.$http.adornUrl(`agent/agentInfo/recharge?token=${this.$cookie.get('token')}`),
                            method: 'post',
                            params: this.$http.adornParams({
                                'agentId': this.chdataForm.agentId,
                                'agentLevel': this.chdataForm.agentLevel,
                                'name': this.chdataForm.name,
                                'phone': this.chdataForm.phone,
                                'price': this.chdataForm.price,
                                'rechargeNumber': this.chdataForm.rechargeNumber,
                                'paymentAmount': this.chdataForm.paymentAmount,
                                'payType': this.chdataForm.payType,
                                'category': this.chdataForm.category,
                                'remark': this.chdataForm.remark
                            })
                        }).then(({ data }) => {
                            this.rechargeSubmitLoading = false
                            if (data && data.code === 0) {
                                this.chdataFormVisible = false
                                this.getDataList()
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
            },
            handleClickDropdown(key, record) {
                switch(key) {
                    case 'edit': {
                        this.addUpdateAgent(record.id + '')
                        break;
                    }
                    case 'refund': {
                        this.$refs.agentRefundRef.init(record)
                        break;
                    }
                    case 'usable': {
                        this.disableAndEnabled(record)
                        break;
                    }
                    case 'authLevel': {
                        this.$refs.setAuthLevelRef.init(record)
                        break;
                    }
                    case 'download': {
                        this.$refs.agentUploadPackageRef.init(record)
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
<style scoped>
    .table-expand-col {
        padding: 0px 0px 0px 80px;
    }
    .table-expand-item {
        display: flex;
        align-items: center;
        height: 32px;
    }
    .table-expand-label {
        width: 160px;
        text-align: right;
        color: #99a9bf;
    }
    .table-expand-value {
        margin-left: 20px;
    }
</style>