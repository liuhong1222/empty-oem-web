<template>
    <div class="main">
        <div class="topSearch">
            <h2>产品审核列表</h2>
            <el-form :inline="true" :model="proForm" label-width="100px">
                <el-form-item label="状态" style="margin-left: -60px">
                    <el-select v-model="proForm.status" placeholder="请选择状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="proForm.auditStatus" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in auditStatusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择日期：">
                    <el-date-picker v-model="proForm.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:6px">
                    <el-button type="primary" @click="getProData(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="proTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
                <el-table-column type="index" header-align="center" align="center" width="70" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="产品ID" align="center" width="110">
                </el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center" width="110">
                </el-table-column>
                <el-table-column prop="productLineName" label="产品线名称" align="center">
                </el-table-column>
                <el-table-column prop="product_name" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="shelf_status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.shelf_status==0 ? '上架':'下架' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="jump_mode" label="跳转方式" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.jump_mode==1 ? '内部编辑':'外部地址' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" align="center">
                </el-table-column>
                <el-table-column prop="order_num" label="排序" align="center">
                </el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="165" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="proAuditBtn(scope.row.id,'audit')" :disabled="scope.row.audit_status ==
                        0 ?false: true">审核</el-button>
                        <el-button type="text" size="small" @click="proAuditBtn(scope.row.id,'see')" :disabled="scope.row.audit_status !==
                        0 ?false: true">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <!-- 产品线审核 -->
        <pro-audit v-if="proAuditVisible" ref="proAuditRef" @refreshNewsList="getProData"></pro-audit>
    </div>
</template>

<script>
    import proAudit from './pro-audit-opera'
    export default {
        data() {
            return {
                proAuditVisible: false,
                dataListLoading: false,
                pageIndex: 1,
                pageSize: 10,
                totalPage: 100,
                proForm: {
                    auditStatus: 0,  //默认显示待审核
                    dateTime: '',
                    status: ''
                },
                statusArr: [
                    { label: '全部', value: -1 },
                    { label: '上架', value: 0 },
                    { label: '下架', value: 1 }
                ],
                auditStatusArr: [
                    { label: '全部', value: -1 },
                    { label: '待审核', value: 0 },
                    { label: '已审核', value: 1 },
                    { label: '驳回', value: 2 }
                ],
                proTableData: []
            }
        },
        components: {
            proAudit
        },
        activated() {
            if (this.proForm.auditStatus !== 0) {
                this.proForm.auditStatus = 0
            }
            this.getProData()
        },
        created() {
            // 设置默认值
            if (this.proForm.auditStatus == 0) {
                this.proForm.auditStatus = '待审核'
            }
        },
        methods: {
            getProData(cur) {
                this.dataListLoading = true;
                let auditStatus = this.proForm.auditStatus;
                auditStatus == '待审核' ? (auditStatus = 0) : auditStatus;
                this.$http({
                    url: this.$http.adornUrl(`agent/product/list?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'currentPage': cur || this.pageIndex,
                        'pageSize': this.pageSize,
                        'auditStatus': auditStatus,
                        'shelfStatus': this.proForm.status,
                        'startTime': '' || this.proForm.dateTime == null ? '' : this.proForm.dateTime[0],
                        'endTime': '' || this.proForm.dateTime == null ? '' : this.proForm.dateTime[1]
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataListLoading = false;
                        if (cur == 1) {
                            this.pageIndex = 1
                        }
                        this.proTableData = data.data.list
                        this.totalPage = data.data.total

                    } else {

                        this.proTableData = []
                        this.totalPage = 0
                    }
                })
            },
            proAuditBtn(id,stu) {
                this.proAuditVisible = true;
                this.$nextTick(() => {
                    this.$refs.proAuditRef.showInit(id,stu)
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getProData()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getProData()
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