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
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -35px">
                    <el-select v-model="proLineForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getProLineData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proLineTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass"
                row-key="id">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">

                </el-table-column>
                <el-table-column prop="id" label="产品线ID" align="center" width="110">

                </el-table-column>
                <el-table-column prop="product_type_name" label="产品线名称" align="center">
                    <!-- <template slot-scope="scope">
                                <el-input v-model="scope.row.product_type_name" @change="change(scope.row.id)"></el-input>
                            </template> -->
                </el-table-column>
                <el-table-column prop="shelf_status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.shelf_status==0 ? '上架' : '下架' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" label="修改时间" align="center">
                </el-table-column>
                <el-table-column prop="order_num" label="排序" align="center">
                </el-table-column>
                <el-table-column prop="audit_status" label="审核状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.audit_status==0 ? '待审核' : (scope.row.audit_status==1) ? '审核通过' : '审核驳回' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row)" :disabled="scope.row.audit_status==0 ? true : false">编辑</el-button>
                        <el-button type="text" size="small" @click="onOrOff(scope.row)">{{scope.row.shelf_status==0
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
                totalPage: 100,
                proLineForm: {
                    status: '',
                    auditStatus: '',
                    dateTime: []
                },
                statusArr: [
                    { label: '全部', value: -1 },
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                auditStatusArr: [
                    { label: '全部', value: -1 },
                    { label: '创建待审核', value: 0 },
                    { label: '已审核', value: 1 },
                    { label: '创建驳回', value: 2 },
                    { label: '修改待审核', value: 3 },
                    { label: '修改驳回', value: 4 }
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
            // change(id){
            //     console.log(id)
            // },
            //行拖拽
            // rowDrop() {
            //     const tbody = document.querySelector('.el-table__body-wrapper tbody')
            //     const _this = this
            //     Sortable.create(tbody, {
            //         onEnd({ newIndex, oldIndex }) {
            //             const currRow = _this.proLineTableData.splice(oldIndex, 1)[0]
            //             _this.proLineTableData.splice(newIndex, 0, currRow)
            //             console.log(newIndex, oldIndex)
            //         }
            //     })
            // },
            getProLineData(cur) {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/line/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'shelfStatus': this.proLineForm.status,
                        'auditStatus': this.proLineForm.auditStatus,
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
                if (shelf_status == 0) {  //下架
                    // alert('下架')
                    this.onOff(1, id)
                } else if (shelf_status == 1) {  //上架
                    // alert('上架')
                    this.onOff(0, id)
                }
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
                this.$confirm(`确定对此产品进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onOff(2, id)
                }).catch(() => { })
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