<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品线管理列表</h2>
            <el-form :inline="true" :model="proLineForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="update()">添加产品线</el-button>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="proLineForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态" style="margin-left: -35px">
                    <el-select v-model="proLineForm.status" placeholder="请选择状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -35px">
                    <el-select v-model="proLineForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="item in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getProLineData(1)">查询</el-button>
                    <el-button type="primary" @click="proLinesortReload()">刷新排序</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proLineTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass"
                row-key="id">
                <el-table-column prop="sort" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" @change="orderNumChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="产品线ID" align="center" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.id + '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="icon图片" align="center" width="110">
                </el-table-column>
                <el-table-column prop="name" label="产品线名称" align="center">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.state == 1 ? '上架' : '下架' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" label="修改时间" align="center">
                </el-table-column>
                <el-table-column prop="applyState" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row)" :disabled="[1, 2].includes(scope.row.applyState) ? true : false">编辑</el-button>
                        <el-button type="text" size="small" @click="onOrOff(scope.row)">{{scope.row.state == 1
                            ? '下架' : '上架' }}</el-button>
                        <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 添加/编辑产品线 -->
        <add-proline-update v-if="addProlineUpdateVisible" ref="addProlineUpdateRef" @refreshNewsList="getProLineData"></add-proline-update>
    </div>
</template>
<script>
    import addProlineUpdate from './add-proline-update-manage'
    // import Sortable from 'sortablejs'
    export default {
        data() {
            return {
                addProlineUpdateVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                proLineForm: {
                    status: '',
                    auditStatus: '',
                    dateTime: []
                },
                statusArr: [
                    { label: '全部', value: '' },
                    { label: '上架', value: '1' },
                    { label: '下架', value: '0' }
                ],
                auditStatusArr: [
                    { label: '全部', value: '' },
                    { label: '创建待审核', value: 1 },
                    { label: '修改待审核', value: 2 },
                    { label: '已审核', value: 3 },
                    { label: '已驳回', value: 4 },
                    { label: '已删除', value: 5 }
                ],
                proLineTableData: []
            }
        },
        components: {
            addProlineUpdate
        },
        activated() {
            this.getProLineData()
        },
        methods: {
            // 排序
            orderNumChange(row) {
                this.$http({
                    url: this.$http.adornUrl(`agent/line/updateOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'orderNum': row.order_num,
                        'id': row.id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.getProLineData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            getProLineData(cur) {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/line/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'state': this.proLineForm.status,
                        'applyState': this.proLineForm.auditStatus,
                        'startTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[0],
                        'endTime': '' || this.proLineForm.dateTime == null ? '' : this.proLineForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.proLineTableData = data.data.list
                        this.totalPage = data.data.total
                        // this.rowDrop()
                    } else {
                        this.proLineTableData = []
                        this.totalPage = 0
                    }
                })
            },
            update(id) {
                this.addProlineUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addProlineUpdateRef.showInit(id)
                })
            },
            // 上架或者下架
            onOrOff(row) {
                let shelf_status = row.shelf_status;
                let id = row.id
                this.onOff(shelf_status == 1 ? 0 : 1, id)
            },
            onOff(shelf_status, id) {
                this.$http({
                    url: this.$http.adornUrl(`agent/line/updateStatus?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'status': shelf_status,
                        'id': id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (shelf_status == 0) {
                            this.$message.success('上架成功')
                        } else if (shelf_status == 1) {
                            this.$message.success('下架成功')
                        } else if (shelf_status == 2) {
                            this.$message.success('删除成功')
                        }
                        this.getProLineData()

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            del(id) {
                this.$confirm(`确定对此产品线进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onOff(2, id)
                }).catch(() => { })
            },
            proLinesortReload() {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/line/reorder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        this.getProLineData();
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getProLineData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getProLineData()
            },
            getRowClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex == 0) {
                    return 'background-color: #f8f8f8;color:#666;'
                } else {
                    return ''
                }
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