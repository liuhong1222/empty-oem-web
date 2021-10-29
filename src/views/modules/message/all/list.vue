<template>
    <div class="main">
        <div class="topSearch">
            <h2>代理商消息列表</h2>
            <el-form :inline="true" :model="AgInfoSearchData">
                <el-form-item label="选择状态：">
                    <el-select v-model="AgInfoSearchData.status" placeholder="代理商状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已审核" value="1"></el-option>
                        <el-option label="发布待审核" value="0"></el-option>
                        <el-option label="修改待审核" value="2"></el-option>
                        <el-option label="已删除" value="-1"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="代理商名称：" style="margin-left:-15px;">
                    <el-input v-model="AgInfoSearchData.agentName" placeholder="代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="messageList(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="infoTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center">
                </el-table-column>
                <el-table-column prop="title" label="消息标题" align="center">
                </el-table-column>
                <el-table-column prop="typeName" label="消息类型" align="center">
                </el-table-column>
                <el-table-column prop="commitTime" label="提交发布时间" align="center">
                </el-table-column>
                <el-table-column prop="auditTime" label="审核时间" align="center">
                </el-table-column>
                <el-table-column prop="auditStateName" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="auditRemark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="auditOrSeeMess(scope.row.id,'see')">查看</el-button>
                        <el-button type="text" size="small" @click="delInfoList(scope.row.id,scope.row.agentName)"
                            :disabled="scope.row.auditState ==-1 ?true: false">删除</el-button>
                        <el-button type="text" size="small" @click="auditOrSeeMess(scope.row.id,'audit')" :disabled="scope.row.auditState == 0 ? false : (scope.row.auditState == 2) ? false : true">审核</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10,20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 查看，审核 -->
        <see-message-audit v-if="seeMessageAuditVisible" ref="seeMessageAuditRef" @auditRefreshDataList="messageList"></see-message-audit>
    </div>
</template>
<script>
    import seeMessageAudit from './info-see-message-audit'
    export default {
        data() {
            return {
                dataListLoading: false,
                seeMessageAuditVisible: false,
                AgInfoSearchData: {
                    agentName: '',
                    status: '',
                },
                infoTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0
            }
        },
        components: {
            seeMessageAudit
        },
        activated() {
            this.messageList()
        },
        methods: {
            messageList(cur) {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/message/all/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'agentName': this.AgInfoSearchData.agentName,
                        'auditState': this.AgInfoSearchData.status
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.infoTableData = data.data.list
                        this.totalPage = data.data.total
                    } else {
                        this.infoTableData = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.messageList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.messageList()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            auditOrSeeMess(id, type) {
                this.seeMessageAuditVisible = true
                this.$nextTick(() => {
                    this.$refs.seeMessageAuditRef.showInit(id, type)
                })
            },
            delInfoList(id, name) {
                this.$confirm(`是否删除${name}以及相关信息？`, '删除消息列表', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/message/all/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'agentMessageId': id
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.messageList()
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
        background-color: #fff;
        margin-bottom: 24px;
        box-shadow: 0px 7px 9px 0px rgba(153, 153, 153, 0.05);
    }
</style>