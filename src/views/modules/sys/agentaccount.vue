<template>
    <div class="mod-user">
        <el-form :inline="true" :model="accountData" @keyup.enter.native="agentSysUserList(1)">
            <el-form-item label="手机号：">
                <el-input v-model="accountData.phone" style="width: 180px;" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="agentSysUserList(1)">查询</el-button>
                <!-- <el-button type="primary" @click="agentExport()" :disabled="disabled">导出</el-button> -->
                <el-button type="primary" @click="addUpdateAgent()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table border :data="accountTableData" style="width: 100%">
            <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
            </el-table-column>
            <el-table-column prop="username" label=" 用户名称" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="代理商名称" align="center">
            </el-table-column>
            <el-table-column prop="nickname" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="手机号码"  align="center">
            </el-table-column>
            <el-table-column prop="email" label="邮箱"  align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addUpdateAgent(scope.row)" v-if="scope.row.flag == '0'" disabled>修改</el-button>
                    <el-button type="text" size="small" @click="addUpdateAgent(scope.row)" v-else>修改</el-button>
                    <el-button type="text" size="small" @click="delAcc(scope.row)" v-if="scope.row.flag == '0'" disabled>删除</el-button>
                    <el-button type="text" size="small" @click="delAcc(scope.row)" v-else>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 新增，修改代理商管理 -->
        <add-agent-update v-if="accountVisible" ref="accountCon" @refreshDataList="agentSysUserList"></add-agent-update>
    </div>
</template>

<script>
    import addAgentUpdate from './acc-add-agent-update'
    export default {
        data() {
            return {
                accountVisible: false,
                disabled: false,
                accountData: {
                    phone: ''
                },
                accountTableData: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                isAdmin: false,
            }
        },
        components: {
            addAgentUpdate
        },
        activated() {
            this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
            this.agentSysUserList(1)
        },
        methods: {
            // 代理商账号列表
            agentSysUserList(curr) {
                this.pageIndex = curr || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`sys/user/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        phone: this.accountData.phone,
                        roleId: this.isAdmin ? 1 : 2,
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        const { list, total } = (data.data || {})
                        this.accountTableData = list || []
                        this.totalPage = total || 0
                        if (list && list.length == 0) {
                            this.disabled = true
                        } else {
                            this.disabled = false
                        }
                    } else {
                        this.accountTableData = []
                        this.totalPage = 0
                    }
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.agentSysUserList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.agentSysUserList()
            },
            // 新增，修改
            addUpdateAgent(row) {
                this.accountVisible = true
                this.$nextTick(() => {
                    this.$refs.accountCon.updateInit(row || {})
                })
            },
            // 删除
            delAcc(row) {
                this.$confirm(`是否删除用户${row.username}？删除后此用户将无法登录系统。`, '删除账号', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/agentSysUser/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'id': row.id + ''
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.agentSysUserList(1)
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => { })
            },
            // 导出
            agentExport() {
                window.open(this.$http.adornUrl(`agent/agentSysUser/list/export?token=${this.$cookie.get('token')}&phone=${this.accountData.phone}`))
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