<template>
    <div class="main quesAudit">
        <div class="topSearch">
            <h2>常见问题管理列表</h2>
            <el-form :inline="true" :model="quesDataForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="update()">添加问题</el-button>
                </el-form-item>
                <el-form-item label="状态" style="margin-left: -40px">
                    <el-select v-model="quesDataForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-left: -60px;">
                    <el-select v-model="quesDataForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" style="margin-left: -60px;" class="searchType">
                    <el-select v-model="quesDataForm.searchType" placeholder="请选择">
                        <el-option v-for="(item,index) in searchKeyArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="quesDataForm.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="quesDataForm.dateTime" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getQuesData(1)">查询</el-button>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="sortReload()">刷新排序</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="quesTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column prop="orderNum" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.orderNum" @change="orderNumChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="问题ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="question" label="标题" align="center" width="150" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center">
                </el-table-column>

                <el-table-column prop="auditStatus" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row.id)" :disabled="(scope.row.auditStatus).indexOf('待审核') != -1 ? true : false">编辑</el-button>
                        <el-button type="text" size="small" @click="upAddOff(scope.row)">{{scope.row.status=='上架' ?'下架'
                            :'上架' }}</el-button>
                        <el-button type="text" size="small" @click="delBtn(scope.row.id)">删除</el-button>
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
        <add-question-update v-if="addquestionUpdateVisible" ref="addquestionUpdateRef" @refreshNewsList="getQuesData"></add-question-update>
    </div>
</template>

<script>
    import addQuestionUpdate from './add-question-update-manage'
    export default {
        data() {
            return {
                addquestionUpdateVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                quesDataForm: {
                    status: '',
                    auditStatus: 0,  //默认显示待审核
                    dateTime: '',
                    searchType: '',
                    searchKey: ''
                },
                searchKeyArr: [
                    { label: '全部', value: "" },
                    { label: '标题', value: "question" },
                    { label: '内容', value: 'answer' }
                ],
                statusArr: [
                    { label: '全部', value: "" },
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                auditStatusArr: [
                    { label: '全部', value: "" },
                    { label: '待审核', value: 0 },
                    { label: '已审核', value: 1 },
                    { label: '驳回', value: 2 }
                ],
                quesTableData: []
            }
        },
        components: {
            addQuestionUpdate
        },
        created() {
            // 设置默认值
            if (this.quesDataForm.auditStatus == 0) {
                this.quesDataForm.auditStatus = '待审核'
            }
        },
        activated() {
            if (this.quesDataForm.auditStatus !== 0) {
                this.quesDataForm.auditStatus = 0
            }
            this.getQuesData()
        },

        methods: {
            getQuesData(cur) {
                let auditStatus = this.quesDataForm.auditStatus;
                auditStatus == '待审核' ? (auditStatus = 0) : (auditStatus = auditStatus);
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'queryType': this.quesDataForm.searchType,
                        'content': this.quesDataForm.searchKey,
                        'status': this.quesDataForm.status,
                        'auditState': auditStatus,
                        'startDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[0],
                        'endDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.quesTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {
                        this.quesTableData = []
                        this.totalPage = 0
                    }
                })
            },
            sortReload() {
                this.dataListLoading = true;
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/againOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 上架，下架
            upAddOff(row) {
                let status = row.status;
                let id = row.id
                if (status == '上架') {  //下架
                    // alert('下架')
                    this.upOffDelFun(1, id)
                } else if (status == '下架') {  //上架
                    // alert('上架')
                    this.upOffDelFun(0, id)
                }
            },
            // 排序
            orderNumChange(row) {
                // console.log(row.orderNum)
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/updateFaqOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'orderNum': row.orderNum,
                        'productFaqId': row.id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.getQuesData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            upOffDelFun(status, id) {
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/updateFaqOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'shelfStatus': status,
                        'productFaqId': id
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (status == 0) {
                            this.$message.success('上架成功')
                        } else if (status == 1) {
                            this.$message.success('下架成功')
                        }
                        this.getQuesData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 删除
            delBtn(id) {
                this.$confirm(`确定对此产品进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/productFaq/my/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'productFaqId': id
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message.success('删除成功')
                            this.getQuesData()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }).catch(() => { })

            },
            update(id) {
                this.addquestionUpdateVisible = true;
                this.$nextTick(() => {
                    this.$refs.addquestionUpdateRef.showInit(id)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getQuesData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getQuesData()
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

    .searchType .el-input {
        width: 55%;
        margin-left: -99px;
    }

    .searchType .el-select .el-input {
        width: 45%;
        margin-left: 0px;
    }
</style>