<template>
    <div class="main">
        <div class="topSearch">
            <h2>认证审核管理</h2>
            <el-form :inline="true" :model="searchobj">
                <el-form-item label="提交时间：">
                    <el-date-picker
                        v-model="searchobj.dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="searchobj.phone" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input v-model="searchobj.companyName" placeholder="客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="searchobj.state" placeholder="审核状态">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="已驳回" value="1"></el-option>
                        <el-option label="已认证" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table :data="tableData" v-loading="tableloading" :header-cell-style="getRowClass" style="width: 100%">
                <el-table-column type="index" header-align="center" align="center" width="80" label="序号" ></el-table-column>
                <el-table-column prop="createTime" align="left" label="提交时间"></el-table-column>
                <el-table-column prop="phone" align="left" label="手机号"></el-table-column>
                <el-table-column prop="companyName" align="left" label="客户名称">
                  <template slot-scope="{ row }">
                    <span>{{ row.customerType === 0 ? row.idCardName : row.companyName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="companyAddress" align="left" label="地址">
                  <template slot-scope="{ row }">
                    <span>{{ row.customerType === 0 ? row.idCardAddress : row.companyAddress }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="state" align="left" label="审核状态">
                  <template slot-scope="scope">
                    <span>{{ stateMap[scope.row.state] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" align="left" label="备注"></el-table-column>
                <el-table-column prop="authStatusVal" align="left" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state == 0" @click="modelshow(scope.row)" type="text">审核</el-button>
                        <el-button v-else @click="modelshow(scope.row)" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" ref="pages" @size-change="handleSizeChange" @current-change="handleCurrentChange" :key="searchobj['currentPage']" :current-page="searchobj['currentPage']" :page-size.sync="searchobj['pageSize']" :page-sizes="[10, 20, 30, 40]" :total="totalNumber"></el-pagination>
        </div>
        <el-dialog width="800px" :title="rowobj['state'] == 0 ? '审核': '查看'" :visible.sync="dialogRowVisible">
            <el-form :model="rowobj" :rules="dialogRules" ref="dialogForm" class="auth-view-form">
                <!-- customerType 客户类型（1：企业，0：个人，9：其他） -->
                <template v-if="rowobj.customerType === 0">
                  <el-form-item label="身份证照片正面地址：" label-width="180px">
                      <img v-if="rowobj.idCardFrontPath" style="width: 300px;" :src="$imgPreStr + rowobj.idCardFrontPath" />
                  </el-form-item>
                  <el-form-item label="身份证照片反面地址：" label-width="180px">
                      <img v-if="rowobj.idCardBackPath" style="width: 300px;" :src="$imgPreStr + rowobj.idCardBackPath" />
                  </el-form-item>
                  <el-form-item label="身份证名称:" prop="idCardName" label-width="180px">
                      <el-input readonly v-model="rowobj.idCardName" ></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号:" prop="idCardNumber" label-width="180px">
                      <el-input readonly v-model="rowobj.idCardNumber" ></el-input>
                  </el-form-item>
                  <el-form-item label="详细地址:" prop="idCardAddress" label-width="180px">
                      <el-input readonly v-model="rowobj.idCardAddress" ></el-input>
                  </el-form-item>
                  <el-form-item label="身份证有效期开始时间" prop="idCardExpireStartTime" label-width="180px">
                      <el-input readonly v-model="rowobj.idCardExpireStartTime" ></el-input>
                  </el-form-item>
                  <el-form-item label="身份证有效期结束时间:" prop="idCardExpireEndTime" label-width="180px">
                      <el-input readonly v-model="rowobj.idCardExpireEndTime" ></el-input>
                  </el-form-item>
                  <el-form-item label="联系邮箱:" prop="email" label-width="180px">
                      <el-input readonly v-model="rowobj.email" ></el-input>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item label="营业执照：" label-width="180px">
                      <img v-if="rowobj.businessLicensePath" style="width: 300px;" :src="$imgPreStr + rowobj.businessLicensePath" />
                  </el-form-item>
                  <el-form-item label="公司名称:" prop="companyName" label-width="180px">
                      <el-input readonly v-model="rowobj.companyName" ></el-input>
                  </el-form-item>
                  <el-form-item label="公司地址:" prop="companyAddress" label-width="180px">
                      <el-input readonly v-model="rowobj.companyAddress" ></el-input>
                  </el-form-item>
                  <el-form-item label="营业执照号:" prop="businessLicenseNumber" label-width="180px">
                      <el-input readonly v-model="rowobj.businessLicenseNumber" ></el-input>
                  </el-form-item>
                  <el-form-item label="企业法人:" prop="legalPerson" label-width="180px">
                      <el-input readonly v-model="rowobj.legalPerson" ></el-input>
                  </el-form-item>
                  <el-form-item label="营业执照有效期开始时间:" prop="businessLicenseExpireStartTime" label-width="180px">
                      <el-input readonly v-model="rowobj.businessLicenseExpireStartTime" ></el-input>
                  </el-form-item>
                  <el-form-item label="营业执照有效期结束时间:" prop="businessLicenseExpireEndTime" label-width="180px">
                      <el-input readonly v-model="rowobj.businessLicenseExpireEndTime" ></el-input>
                  </el-form-item>
                  <el-form-item label="经营范围:" prop="businessScope" label-width="180px">
                      <el-input readonly v-model="rowobj.businessScope" :rows="5" type="textarea"></el-input>
                  </el-form-item>
                </template>
                <el-form-item label="备注:" prop="remark" label-width="180px">
                    <el-input readonly v-model="rowobj.remark" :rows="5" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" v-if="rowobj['state'] == 0" class="dialog-footer">
                <el-button @click="dialogRowVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="passLoading" :loading="rejectLoading" @click="handleAudit(1)">驳回</el-button>
                <el-button type="primary" :disabled="rejectLoading" :loading="passLoading" @click="handleAudit(9)">通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
export default {
  data () {
    return {
      searchobj: {
        pageSize: 10,
        currentPage: 1,
        phone: '',
        companyName: '',
        state: '',
        dateTime: []
      },
      tableData: [],
      totalNumber: 0,
      tableloading: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      rowobj: {},
      dialogRowVisible: false,
      dialogRules: {
      },
      stateMap: {
        '0': '待审核',
        '9': '已认证',
        '1': '已驳回',
      },
      passLoading: false,
      rejectLoading: false,
    }
  },
  activated () {
    this.searchobj = {
      ...this.searchobj,
      dateTime: [this.formatDate(new Date()), this.formatDate(new Date())]
    }
    this.handleSearch()
  },
  methods: {
    modelshow (rowobj = {}) {
      this.passLoading = false
      this.rejectLoading = false
      this.getDetailData(rowobj)
    },
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #f8f8f8;color:#666;'
      } else {
        return ''
      }
    },
    formatDate (date) {
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    handleSizeChange (value) {
      this.searchobj.pageSize = value
      setTimeout(() => { this.getPageByMobile() }, 150)
    },
    handleCurrentChange (value) {
      this.searchobj.currentPage = value
      setTimeout(() => { this.getPageByMobile() }, 150)
    },
    handleSearch () {
      this.searchobj.currentPage = 1
      this.getPageByMobile()
    },
    getPageByMobile () {
      this.tableloading = true
      let { dateTime, state, ...paramsobj } = this.searchobj || {}
      paramsobj['startTime'] = dateTime ? dateTime[0] : undefined
      paramsobj['endTime'] = dateTime ? dateTime[1] : undefined
      paramsobj['state'] = state === '-1' ? undefined : state
      this.$http({
        url: this.$http.adornUrl(`/agent/auth/companyAuthList?token=${this.$cookie.get('token')}`),
        method: 'post',
        params: this.$http.adornParams({ ...paramsobj })
      }).then(({ data = {} }) => {
        if (data.code === 0) {
          let { list, total } = data.data || {}
          this.tableData = list || []
          this.totalNumber = total || 0
        } else {
          this.tableData = []
          this.totalNumber = 0
        }
        this.tableloading = false
      }).catch(() => {
        this.tableData = []
        this.totalNumber = 0
        this.tableloading = false
      })
    },
    getDetailData (record) {
      this.$http({
        url: this.$http.adornUrl(`agent/auth/getCustomerExtById?token=${this.$cookie.get('token')}`),
        method: 'post',
        params: this.$http.adornParams({
          id: record.id + ''
        })
      }).then(({ data = {} }) => {
        if (data.code === 0) {
          this.rowobj = {...record, ...(data.data || {})}
          this.dialogRowVisible = true
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message.error('接口请求失败')
      })
    },
    handleAudit (state) {
      this.passLoading = state === 9 ? true : false
      this.rejectLoading = state === 1 ? true : false
      this.$http({
        url: this.$http.adornUrl(`agent/auth/auditCustExt?token=${this.$cookie.get('token')}`),
        method: 'post',
        params: this.$http.adornParams({
          id: this.rowobj.id + '',
          customerId: this.rowobj.customerId + '',
          state: state
        })
      }).then(({ data = {} }) => {
        this.passLoading = false
        this.rejectLoading = false
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.getPageByMobile()
          this.dialogRowVisible = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message.error('接口请求失败')
      })
    }
  },
  components: {
    // Viewer
  }
}
</script>
<style lang="scss" scoped>
    /deep/ .auth-view-form {
      .el-textarea__inner:focus, .el-textarea__inner:hover,
      .el-input__inner:focus, .el-input__inner:hover {
        border-color: #dcdfe6;
      }
    }
</style>