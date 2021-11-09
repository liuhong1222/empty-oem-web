<template>
    <div class="main">
        <div class="filter-wrapper">
            <h2 style="display:inline-block">代理商等级管理</h2>
            <el-button type="primary" @click="addUpdateLevel()">新增</el-button>
        </div>
        <div class="userTable">
            <el-table :data="oemTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
                </el-table-column>
                <el-table-column prop="level" label=" 代理商等级" align="center">
                </el-table-column>
                <el-table-column prop="price" label=单价（元/条） align="center">
                </el-table-column>
                <el-table-column prop="warningsNumber" label="预警条数 " align="center">
                </el-table-column>
                <el-table-column prop="minPaymentAmount" label=" 最小充值金额（元） " align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addUpdateLevel(scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增修改代理商等级 -->
        <add-grade-update v-if="gradeVisible" ref="gradeCon" @refreshDataList="levelList"></add-grade-update>
    </div>
</template>

<script>
    import AddGradeUpdate from './level-add-grade-update'
    export default {
        data() {
            return {
                gradeVisible: false,
                oemTableData: [],
                dataListLoading: false,
            }
        },
        components: {
            AddGradeUpdate
        },
        activated() {
            this.levelList()
        },
        methods: {
            levelList() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/level/list?token=${this.$cookie.get('token')}`),
                    method: 'get',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.oemTableData = data.data || []
                    } else {
                        this.oemTableData = []
                    }
                    this.dataListLoading = false
                })
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
            },
            // 点击修改 ，新增
            addUpdateLevel(record) {
                this.gradeVisible = true
                this.$nextTick(() => {
                    this.$refs.gradeCon.levelInit(record || {})
                })
            },
            // 点击删除
            del(record) {
                this.$confirm(`是否删除【${record.level}】以及相关信息？`, '删除代理商等级', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/level/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'id': record.id + ''
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.levelList()
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => {})
            }
        }
    }

</script>
<style lang="scss" scoped>
    .main {
        width: 100%;
        padding: 10px 23px 20px;
        background-color: #ffffff;
        margin-bottom: 24px;
        box-shadow: 0px 7px 9px 0px rgba(153, 153, 153, 0.05);
    }
    .filter-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>