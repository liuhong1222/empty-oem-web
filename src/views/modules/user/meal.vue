<template>
    <div class="main">
        <div class="topSearch">
            <h2>套餐管理</h2>
            <el-form :inline="true" :model="searchData">
                <el-form-item label="代理商：">
                    <el-select v-model="searchData.agentId" placeholder="代理商">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option v-for="item in agentList" :label="item.companyName" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-select v-model="searchData.category" placeholder="产品名称">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="空号检测" value="0"></el-option>
                        <el-option label="实时检测" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch()">查询</el-button>
                    <el-button type="primary" @click="handleAdd()">添加套餐</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="dataListLoading"
            >
                <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="80"
                    label="序号"
                ></el-table-column>
                <el-table-column prop="agentName" label="代理商名称" align="center"></el-table-column>
                <el-table-column prop="category" label="产品名称" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.category ? '实时检测' : '空号检测' }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="充值套餐名称" align="center"></el-table-column>
                <el-table-column prop="specifications" label="充值套餐条数" align="center"></el-table-column>
                <el-table-column prop="price" label="充值套餐价格" align="center"></el-table-column>
                <el-table-column prop="minPayAmount" label="最低充值金额" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="remark" label="套餐说明" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleOperate('view', scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="handleOperate('edit', scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="handleOperate('delete', scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10,20,30,50]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>
        <meal-detail-dialog ref="mealDetailDialogRef" />
        <meal-add-or-update @refresh="handleSearch" ref="mealAddOrUpdateRef" />
    </div>
</template>
<script>
import MealDetailDialog from './meal-detail-dialog.vue'
import MealAddOrUpdate from './meal-add-or-update.vue'
export default {
  data () {
    return {
      searchData: {
        category: undefined,
        agentId: undefined,
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      agentList: [],
      dataListLoading: false
    }
  },
  components: { MealDetailDialog, MealAddOrUpdate },
  created () {
    // this.getTableData()
  },
  methods: {
    getTableData () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/userManage/goods?token=${this.$cookie.get('token')}`),
        method: 'get',
        params: this.$http.adornParams({
          currentPage: this.pageIndex,
          pageSize: this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.list
          this.totalPage = data.data.total
        } else {
          this.tableData = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    handleSearch() {
      this.pageIndex = 1
      this.getTableData()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getTableData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getTableData()
    },
    handleOperate(type, record) {
        switch (type) {
            case 'view': {
                this.$refs.mealDetailDialogRef.init(record);
                break;
            }
            case 'edit': {
                this.$refs.mealAddOrUpdateRef.init(record);
                break;
            }
            case 'delete': {
                this.$confirm(`是否删除${record.name || ''}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteMeal(record)
                }).catch(() => { })
                break;
            }
            default:
                break;
        }
    },
    deleteMeal (record) {
      this.$http({
        url: this.$http.adornUrl(`/userManage/goods?token=${this.$cookie.get('token')}`),
        method: 'get',
        params: this.$http.adornParams({
          id: record.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.handleSearch()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleAdd() {
        this.$refs.mealAddOrUpdateRef.init({});
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