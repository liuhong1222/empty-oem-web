<template>
    <div class="main quesAudit">
        <div class="topSearch">
            <h2>常见问题管理列表</h2>
            <el-form :inline="true" :model="quesDataForm" label-width="100px">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="update()">添加问题</el-button>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-select v-model="quesDataForm.proName" placeholder="请选择产品名称">
                        <el-option v-for="(item, index) in proArr" :label="item.name" :key="index"
                            :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="quesDataForm.status" placeholder="请选择状态">
                        <el-option v-for="item in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="quesDataForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="item in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" class="searchType">
                    <el-select v-model="quesDataForm.searchType" placeholder="请选择">
                        <el-option v-for="item in searchKeyArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
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
                <el-table-column prop="sort" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" @change="orderNumChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="问题ID" align="center" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.id + '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center" width="150" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center">
                </el-table-column>
                <el-table-column prop="applyState" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row.id)" :disabled="((scope.row.applyState || '').indexOf('待审核') != -1 || (scope.row.applyState === '已删除')) ? true : false">编辑</el-button>
                        <el-button type="text" size="small" :disabled="scope.row.applyState === '已删除'" @click="upAddOff(scope.row)">{{ scope.row.state == '上架' ? '下架'
                            :'上架' }}</el-button>
                        <el-button type="text" size="small" :disabled="scope.row.applyState === '已删除'" @click="delBtn(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 添加/编辑问题 -->
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
                totalPage: 0,
                quesDataForm: {
                    status: '',
                    auditStatus: '',  //默认显示待审核
                    dateTime: '',
                    searchType: '',
                    searchKey: '',
                    proName: ''
                },
                searchKeyArr: [
                    { label: '全部', value: "" },
                    { label: '标题', value: "question" },
                    { label: '内容', value: 'answer' }
                ],
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
                proArr: [],
                quesTableData: [],
                agentId: '',
            }
        },
        components: {
            addQuestionUpdate
        },
        activated() {
            this.getQuesData(1);
            this.getAllPro();
            this.agentId = this.$json.parse(sessionStorage.getItem('agentInfo') || '{}').id
        },

        methods: {
            getQuesData(cur) {
                this.dataListLoading = true;
                this.pageIndex = cur || this.pageIndex
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'productId': this.quesDataForm.proName,
                        'currentPage': this.pageIndex,
                        'pageSize': this.pageSize,
                        'queryType': this.quesDataForm.searchType,
                        'content': this.quesDataForm.searchKey,
                        'status': this.quesDataForm.status,
                        'auditState': this.quesDataForm.auditStatus,
                        'startDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[0],
                        'endDate': '' || this.quesDataForm.dateTime == null ? '' : this.quesDataForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    this.dataListLoading = false;
                    if (data && data.code === 0) {
                        this.quesTableData = data.data.list
                        this.totalPage = data.data.total
                    } else {
                        this.quesTableData = []
                        this.totalPage = 0
                    }
                })
            },
            getAllPro() {
                this.$http({
                    url: this.$http.adornUrl(`agent/product/listProductsOfAgent?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
                    method: 'post',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.proArr = data.data || []
                        this.proArr.unshift({ id: '', name: "全部" })
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
                        this.getQuesData(1);
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 上架，下架
            upAddOff(row) {
                let status = row.state;
                let id = row.id
                if (status == '上架') {
                    this.upOffDelFun(0, id)
                } else {
                    this.upOffDelFun(1, id)
                }
            },
            // 排序
            orderNumChange(row) {
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/my/updateFaqOrder?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'orderNum': row.sort,
                        'productFaqId': row.id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.getQuesData(1)
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            upOffDelFun(status, id) {
                this.$http({
                    url: this.$http.adornUrl(`agent/productFaq/all/updateStatus?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'state': status,
                        'faqId': id + ''
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (status == 0) {
                            this.$message.success('下架成功')
                        } else {
                            this.$message.success('上架成功')
                        }
                        this.getQuesData()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 删除
            delBtn(id) {
                this.$confirm(`确定对此常见问题进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`agent/productFaq/my/delete?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'productFaqId': id + ''
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