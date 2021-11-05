<template>
    <div class="main">
        <div class="topSearch">
            <h2>代理商设置列表</h2>
            <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
                <el-form-item label="创建时间：">
                    <el-date-picker v-model="searchData.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理商名称：" style="margin-left:5px;">
                    <el-input v-model="searchData.agentName" placeholder="请输入代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号：" style="margin-left:5px;">
                    <el-input v-model="searchData.agentMobile" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="searchData.auditStatusSer" placeholder="请选择审核状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="使用中" value="1"></el-option>
                        <el-option label="已驳回" value="2"></el-option>
                        <el-option label="待设置" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDataList()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="dataList" style="width: 100%" :header-cell-style="getRowClass" height="750">
                <el-table-column type="index" header-align="center" align="center" width="50" fixed label="序号">
                </el-table-column>
                <el-table-column prop="companyName" label=" 代理商名称" width="100" align="center">
                </el-table-column>
                <el-table-column prop="agentId" label="代理商编号" width="100" align="center">
                </el-table-column>
                <el-table-column prop="agentMobile" label="手机号" width="100" align="center">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" align="center" width="150">
                </el-table-column>
                <el-table-column prop="logo_url" label="LOGO" align="center" width="150">
                </el-table-column>
                <el-table-column prop="icon_url" label="ICON" align="center" width="150">
                </el-table-column>
                <el-table-column prop="sign_url" label="代理商签字" align="center" width="150">
                </el-table-column>
                <el-table-column prop="seal_url" label="公章" align="center" width="150">
                </el-table-column>
                <el-table-column prop="sms_sign" label="短信签名" align="center">
                </el-table-column>
                <el-table-column prop="domain" label="代理商域名" align="center">
                </el-table-column>
                <el-table-column prop="beian" label="域名备案信息" id="infoHeight" align="center" width="150">
                    <template slot-scope="scope">
                        <div>{{scope.row.licence}}</div>
                        <div>{{scope.icp_record}}</div>
                        <div>{{scope.row.police_record}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="kefy" label="客服资料" align="center" width="150">
                    <template slot-scope="scope">
                        <div>QQ</div>
                        <div>客服热线</div>
                        <div>商务合作</div>
                    </template>
                    <!-- <template slot-scope="scope">
                        <div>QQ:{{scope.row.qq}}</div>
                        <div>客服热线:{{scope.row.hotline}}</div>
                        <div>商务合作:{{scope.row.biz_no}}</div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="zbInfo" label="支付宝资料" align="center" width="150">
                    <template slot-scope="scope">
                        <div>api id</div>
                        <div>支付调用地址</div>
                        <div>支付回调地址</div>
                        <div>支付宝公钥</div>
                        <div>应用私钥</div>
                    </template>
                    <!-- <template slot-scope="scope">
                        <div>api id:{{scope.row.aliAppid}}</div>
                        <div>支付调用地址:{{scope.row.alicall_url}}</div>
                        <div>支付回调地址:{{scope.row.alicallback_url}}</div>
                        <div>支付宝公钥:{{scope.row.alipublic_key}}</div>
                        <div>应用私钥:{{scope.row.aliprivate_key}}</div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="weiinfo" label="微信资料" align="center" width="150">
                    <template slot-scope="scope">
                        <div>mchid</div>
                        <div>支付调用地址</div>
                        <div>支付回调地址</div>
                        <div>api id</div>
                        <div>key</div>
                    </template>
                    <!-- <template slot-scope="scope">
                        <div>mchid:{{scope.row.wxMchid}}</div>
                        <div>支付调用地址:{{scope.row.wxcall_url}}</div>
                        <div>支付回调地址:{{scope.row.wxcallback_url}}</div>
                        <div>api id:{{scope.row.wxappid}}</div>
                        <div>key:{{scope.row.wxKey}}</div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="ht" label="合同信息" align="center" width="150">
                    <template slot-scope="scope">
                        <div>名称</div>
                        <div>地址</div>
                        <div>账户</div>
                        <div>开户行</div>
                        <div>邮编</div>
                        <div>电话</div>
                    </template>
                    <!-- <template slot-scope="scope">
                        <div>名称:{{scope.row.htcompany_name}}</div>
                        <div>地址:{{scope.row.htcompany_address}}</div>
                        <div>账户:{{scope.row.htaccount_no}}</div>
                        <div>开户行:{{scope.row.htbank_name}}</div>
                        <div>邮编:{{scope.row.htpostcode}}</div>
                        <div>电话:{{scope.row.htmobile}}</div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="" label="微信登录" align="center" width="150">
                    <template slot-scope="scope">
                        <div>APPID </div>
                        <div>APPSECRET</div>
                    </template>
                    <!-- <template slot-scope="scope">
                            <div>名称:{{scope.row.htcompany_name}}</div>
                            <div>地址:{{scope.row.htcompany_address}}</div>
                            <div>账户:{{scope.row.htaccount_no}}</div>
                            <div>开户行:{{scope.row.htbank_name}}</div>
                            <div>邮编:{{scope.row.htpostcode}}</div>
                            <div>电话:{{scope.row.htmobile}}</div>
                        </template> -->
                </el-table-column>
                <el-table-column prop='auditState' label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.auditState === 0" size="small" type="warning">待审核</el-tag>
                        <el-tag v-else-if="scope.row.auditState === 1" size="small" type="success">使用中</el-tag>
                         <el-tag v-else-if="scope.row.auditState === -1" size="small" type="danger">待设置</el-tag>
                        <el-tag v-else size="small" type="danger">已驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="seedialog(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="seetingDialog(scope.row.agentId)">修改</el-button>
                        <el-button type="text" size="small" @click="del(scope.row.agentId)">删除</el-button>
                        <el-button type="text" size="small" @click="auditDialog(scope.row)" :disabled="scope.row.auditState == 0 ? false: true">{{scope.row.auditState == 0 ? '审核': ''}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="agentPage">
                <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10,20,30,50]"
                    :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>

        </div>
        <!-- 修改 -->
        <agent-setting-dialog v-if="agentSettingDialogVisible" ref="agentSettingDialog" @refreshDataList="getDataList"></agent-setting-dialog>

        <!-- 查看 -->
        <agent-see-dialog v-if="agentSeeDialogVisible" ref="agentSeeDialog"></agent-see-dialog>

        <!-- 审核和驳回 -->
        <ok-audit-reject v-if="okAuditRejectVisible" ref="okAuditRejectRef" @auditRefreshDataList="getDataList"></ok-audit-reject>
    </div>
</template>

<script>
    import AgentSettingDialog from './agent-setting-dialog.vue'
    import agentSeeDialog from './agent-see-dialog.vue'
    import okAuditReject from './agent-ok-audit-reject.vue'
    export default {
        data() {
            return {
                searchData: {
                    dateTime: [],
                    agentName: "",
                    agentMobile: "",
                    custType: "",
                    custName: '',
                    mobile: "",
                    auditStatusSer: ""
                },
                dataList: [],
                agentSettingDialogVisible: false,
                agentSeeDialogVisible: false,
                okAuditRejectVisible: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        components: {
            AgentSettingDialog,
            agentSeeDialog,
            okAuditReject
        },
        activated() {
            this.getDataList();
        },
        methods: {
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl("agent/set/agentSetList"),
                    method: "get",
                    params: this.$http.adornParams({
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'agentName': this.searchData.agentName,
                        'agentMobile': this.searchData.agentMobile,
                        'auditState': this.searchData.auditStatusSer,
                        'startTimeStr': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[0],
                        'endTimeStr': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[1]

                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(data.data)
                        this.dataList = data.data.list;
                        this.totalPage = data.data.total;
                        // this.searchData.agentMobile = ""
                    } else {
                        this.dataList = [];
                        this.totaloage = 0;
                    }
                    this.dataListLoading = false;
                });
            },
            // 修改
            seetingDialog(e) {
                this.agentSettingDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.agentSettingDialog.init(e)
                })
            },
            // 查看
            seedialog(e) {
                this.agentSeeDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.agentSeeDialog.seeInit(e)
                })
            },
            // 审核
            auditDialog(e) {
                this.okAuditRejectVisible = true
                this.$nextTick(() => {
                    this.$refs.okAuditRejectRef.seeInit(e)
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
            // 点击删除
            del(id) {
                this.$confirm(`是否删除代理商序号为${id}的代理商以及相关信息？`, '删除代理商', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/set/delAgent?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'agentId': id
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => { })
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

    .el-table .cell {
        /* word-break:break-all; */
        white-space: pre-wrap;
    }

    .main .el-table .cell {
        line-height: 13px;
    }
    /* .cell div:nth-child(2) {
        width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    } */
</style>