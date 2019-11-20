<template>
    <div class="main">
        <div class="topSearch">
            <h2>企业认证管理</h2>
            <el-form :inline="true" :model="searchobj" @keyup.enter.native="getCustomList()">
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
                <el-form-item label="手机号：" style="margin-left:25px;">
                    <el-input v-model="searchobj.mobile" placeholder="手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="searchobj.companyName" placeholder="公司名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="searchobj.status" placeholder="审核状态">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="已驳回" value="2"></el-option>
                        <el-option label="已认证" value="3"></el-option>
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
                <el-table-column prop="user_phone" align="left" label="手机号"></el-table-column>
                <el-table-column prop="name" align="left" label="公司名称"></el-table-column>
                <el-table-column prop="address" align="left" label="地址"></el-table-column>
                <el-table-column prop="authStatus" align="left" label="审核状态"></el-table-column>
                <el-table-column prop="comment" align="left" label="备注"></el-table-column>
                <el-table-column prop="authStatusVal" align="left" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.authStatusVal == 1" @click="modelshow(scope.row)" type="text">审核</el-button>
                        <el-button v-else @click="modelshow(scope.row)" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchobj['currentPage']" :page-size.sync="searchobj['pageSize']" :page-sizes="[10, 20, 30, 40]" layout="total, prev, pager, next, sizes, jumper" :total="totalNumber" background></el-pagination>
        </div>
        <el-dialog width="800px" :title="rowobj['authStatusVal'] == 1 ? '审核': '查看'" :visible.sync="dialogRowVisible">
            <el-form :model="rowobj" :rules="dialogRules" ref="dialogForm">
                <el-form-item label="营业执照：" label-width="180px">
                    <viewer :options="{'navbar': false}" :images="['http://172.16.20.33:8081/' + rowobj.picture_url]">
                        <img height="100" :src="'http://172.16.20.33:8081/' + rowobj.picture_url" style="cursor: pointer">
                    </viewer>
                </el-form-item>
                <el-form-item label="公司名称:" prop="name" label-width="180px">
                    <el-input v-model="rowobj.name" ></el-input>
                </el-form-item>
                <el-form-item label="营业执照号:" prop="regnum" label-width="180px">
                    <el-input v-model="rowobj.regnum" ></el-input>
                </el-form-item>
                <el-form-item label="公司地址:" prop="address" label-width="180px">
                    <el-input v-model="rowobj.address" ></el-input>
                </el-form-item>
                <el-form-item label="法人名字:" prop="person" label-width="180px">
                    <el-input v-model="rowobj.person" ></el-input>
                </el-form-item>
                <el-form-item label="证件期限:" prop="effectDate" label-width="180px" style="display: inline-block;">
                    <el-date-picker v-model="rowobj.effectDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 200px"></el-date-picker>
                </el-form-item>
                <el-form-item class="format-date" label="至" prop="expireDate" label-width="30px" style="display: inline-block;">
                    <div class="long-date" v-if="rowobj.expireDate == '2099-12-31'" @click="$refs.expireDate.focus()">长期</div>
                    <el-date-picker v-model="rowobj.expireDate" :picker-options="expireOptions" type="date" value-format="yyyy-MM-dd" ref="expireDate" placeholder="结束日期" style="width: 200px"></el-date-picker>
                </el-form-item>
                <el-form-item label="经营范围:" prop="business" label-width="180px">
                    <el-input v-model="rowobj.business" :rows="5" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="comment" label-width="180px">
                    <el-input v-model="rowobj.comment" :rows="5" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" v-if="rowobj['authStatusVal'] == 1" class="dialog-footer">
                <el-button @click="dialogRowVisible = false">取 消</el-button>
                <el-button type="primary" @click="ToexamineButt({ status: 2 })">驳回</el-button>
                <el-button type="primary" @click="ToexamineButt({ status: 3 })">通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import urlobj from '@/utils/imgUrl'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
export default {
  data () {
    return {
      searchobj: {
        pageSize: 10,
        currentPage: 1,
        mobile: '',
        companyName: '',
        status: '',
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
      imgBaseUrl: urlobj['imgUrl'],
      dialogRules: {
        name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        regnum: [
            { required: true, message: '请输入营业执照号', trigger: 'blur' }
        ],
        address: [
            { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        person: [
            { required: true, message: '请输入法人名字', trigger: 'blur' }
        ],
        effectDate: [
            { required: true, message: '请选择证件开始时间', trigger: 'change' }
        ],
        expireDate: [
            { required: true, message: '请选择证件到期时间', trigger: 'change' }
        ],
        business: [
            { required: true, message: '请输入经营范围', trigger: 'blur' }
        ],
        comment: [
            { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      },
      expireOptions: {
        shortcuts: [{
          text: '长期',
          onClick (picker) {
            picker.$emit('pick', new Date('2099/12/31'))
          }
        }]
      }
    }
  },
  activated () {
    let date = new Date()
    this.searchobj.dateTime[0] = this.formatDate(date)
    this.searchobj.dateTime[1] = this.formatDate(date)
    this.getPageByMobile()
  },
  created () {
    let date = new Date()
    this.searchobj.dateTime[0] = this.formatDate(date)
    this.searchobj.dateTime[1] = this.formatDate(date)
  },
  methods: {
    modelshow (rowobj = {}) {
      this.rowobj = { ...rowobj }
      this.dialogRowVisible = true
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
      let { dateTime, ...paramsobj } = this.searchobj || {}
      paramsobj['startTime'] = dateTime[0]
      paramsobj['endTime'] = dateTime[1]
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
    ToexamineButt (paramboj) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.ToexamineAjax(paramboj)
        }
      })
    },
    ToexamineAjax (paramboj) {
      let { cre_user_id, ...tempobj } = this.rowobj || {}
      let mergeboj = { ...paramboj, ...tempobj, userId: cre_user_id }
      this.$http({
        url: this.$http.adornUrl(`/agent/auth/updateCompanyStatus?token=${this.$cookie.get('token')}`),
        method: 'post',
        params: this.$http.adornParams({ ...mergeboj })
      }).then(({ data = {} }) => {
        if (data.code === 0) {
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
    Viewer
  }
}
</script>
<style lang="scss" scoped>
    .format-date /deep/ .el-form-item__label::before{
        content: "";
        display: none
    }
    .long-date{
        left: 30px;
        top: 2px;
        width: 120px;
        position: absolute;
        height: 36px;
        line-height: 36px;
        z-index: 10;
        background-color: #fff;
        pointer-events: none;
    }
</style>