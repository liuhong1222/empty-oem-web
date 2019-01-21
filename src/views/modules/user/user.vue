<template>
  <div class="main">
    <div class="topSearch">
      <h2>客户列表</h2>
      <el-form :inline="true" :model="searchData" @keyup.enter.native="getCustomList()">
        <el-form-item label="创建时间：">
          <el-date-picker v-model="searchData.dateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号：" style="margin-left:25px;">
          <el-input v-model="searchData.mobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户类型：">
          <el-select v-model="searchData.custType" placeholder="客户类型">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="个人" value="0"></el-option>
            <el-option label="企业" value="1"></el-option>
            <el-option label="其他" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称：" style="margin-left:0px;">
          <el-input v-model="searchData.custName" placeholder="客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="代理商名称：" v-if="disableAgent">
          <el-input v-model="searchData.agentName" placeholder="代理商名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCustomList()">查询</el-button>
          <el-button type="primary" @click="exportUser()" :disabled="disabled">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="agentTable">
      <el-table :data="userTableData" style="width: 100%" v-loading="dataListLoading" :header-cell-style="getRowClass">
        <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
        </el-table-column>
        <!-- <el-table-column prop="creUserId" label=" 客户编号" width="80" align="center">
        </el-table-column> -->
        <el-table-column prop="user_phone" label="手机号码" align="center">
        </el-table-column>
        <el-table-column prop="userType" label="客户类型" align="center">
        </el-table-column>
        <el-table-column prop="custName" label=" 客户名称" align="center">
        </el-table-column>
        <el-table-column prop="company_name" label="代理商名称" align="center" v-if="disableAgentName">
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" align="center">
        </el-table-column>
        <el-table-column prop="money" label="充值总计（元）" align="center">
        </el-table-column>
        <el-table-column prop="number" label="充值总条数" align="center">
        </el-table-column>
        <el-table-column prop="account" label="剩余条数" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button @click="perPriseSee(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="rechargedataBtn(scope.row)" :disabled="regDisabled">充值</el-button>
            <el-button type="text" size="small" @click="refundBtn(scope.row)" :disabled="refundDisabled">退款</el-button>
            <el-button type="text" size="small" @click="transferAgent(scope.row)" :disabled="transferDisabled">转代理商</el-button>
            <el-button type="text" size="small" v-if="scope.row.canPresent == 'false'" disabled>注册赠送</el-button>
            <el-button type="text" size="small" @click="canPresentBtn(scope.row.creUserId)" v-else>注册赠送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="agentPage">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
        :page-sizes="[10,20,30,50]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <!-- 个人，企业修改 -->
    <!-- <per-edit-enterise v-if="updateVisible" ref="updatecon" @refreshDataList="getCustomList"></per-edit-enterise> -->
    <!-- 个人，企业查看 -->
    <per-see-enterprise v-if="seeVisible" ref="seecon"></per-see-enterprise>
    <!-- 个人，企业充值 -->
    <per-recharge-prise v-if="chargeVisible" ref="rechargecon" @refreshDataList="getCustomList"></per-recharge-prise>
    <!-- 个人，企业退款 -->
    <per-refund-prise v-if="refundVisible" ref="refundcon" @refreshDataList="getCustomList"></per-refund-prise>
    <!-- 转代理商 -->
    <transfer-or-agent v-if="transferAgentVisible" ref="transferAgentcon" @refreshDataList="getCustomList"></transfer-or-agent>
  </div>
</template>
<script>
  // import perEditEnterise from './user-per-edit-enterise'
  import perSeeEnterprise from './user-per-see-enterprise'
  import perRechargePrise from './user-per-recharge-prise'
  import perRefundPrise from './user-per-refund-prise'
  import transferOrAgent from './user-transfer-agent'
  export default {
    data() {
      return {
        disabled: false,
        seeVisible: false,
        updateVisible: false,
        chargeVisible: false,
        refundVisible: false,
        dataListLoading: false,
        disableAgent: true,
        disableAgentName: true,
        transferAgentVisible: false,
        regDisabled: false,
        refundDisabled: false,
        transferDisabled: false,
        arr: [],  //保存点击的id和区分个人和企业的id
        searchData: {
          dateTime: [],
          mobile: '',
          custType: '',
          custName: '',
          agentName: ''
          // creUserId: "",
          // user_phone: "",
          // user_type: '',
          // company_name: "",
          // create_time: "",
          // money: "",
          // number: "",
          // account: ""
        },
        userTableData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    components: {
      // perEditEnterise,
      perSeeEnterprise,
      perRechargePrise,
      perRefundPrise,
      transferOrAgent
    },
    activated() {
      if (sessionStorage.getItem('msjRoleName') == '1') {
        if (!this.searchData.dateTime) {
          this.searchData.dateTime = [];
          var date = new Date()
          var dateSeven = new Date(new Date() - (7 * 24 * 3600 * 1000))
          this.searchData.dateTime[0] = this.formatDate(dateSeven)
          this.searchData.dateTime[1] = this.formatDate(date)
        }
      }

      this.getCustomList()
    },
    created() {
      if (sessionStorage.getItem('msjRoleName') == '1') {
        var date = new Date()
        var dateSeven = new Date(new Date() - (7 * 24 * 3600 * 1000))
        this.searchData.dateTime[0] = this.formatDate(dateSeven)
        this.searchData.dateTime[1] = this.formatDate(date)
      }

    },
    methods: {
      formatDate(date) {
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
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background-color: #f8f8f8;color:#666;'
        } else {
          return ''
        }
      },
      // 获取客户列表
      getCustomList() {
        if (sessionStorage.getItem('msjRoleName') == '2') { //代理商
          this.disableAgent = false
          this.disableAgentName = false
          this.regDisabled = false;
          this.refundDisabled = false;
          this.transferDisabled = true
        } else if (sessionStorage.getItem('msjRoleName') == '1') {  //管理员
          this.regDisabled = true;
          this.refundDisabled = true;
          this.transferDisabled = false
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`agent/cust/custList?token=${this.$cookie.get('token')}`),
          method: 'get',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize,
            'agentName': this.searchData.agentName,
            'custName': this.searchData.custName,
            'custType': this.searchData.custType,
            'mobile': this.searchData.mobile,
            'startTimeStr': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[0],
            'endTimeStr': '' || this.searchData.dateTime == null ? '' : this.searchData.dateTime[1]
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)
            this.userTableData = data.data.list
            this.totalPage = data.data.total
            if (data.data.list.length == 0) {
              this.disabled = true
            } else {
              this.disabled = false
            }
          } else {
            this.userTableData = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 注册赠送
      canPresentBtn(userId) {
        this.$http({
          url: this.$http.adornUrl(`agent/cust/presentNum?token=${this.$cookie.get('token')}`),
          method: 'post',
          params: this.$http.adornParams({
            'userId': userId
          })
        }).then(({ data }) => {
          if (data.code == "0") {
            this.$message.success(data.msg);
            this.getCustomList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getCustomList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getCustomList()
      },
      // 修改个人、企业
      // perEnterEditBtn(row) {
      //   let arr = this.arr; //传id和当前修改的是企业还是个人
      //   this.updateVisible = true
      //   // console.log(id,type)
      //   this.arr[0] = row.id
      //   this.arr[1] = row.user_type
      //   this.arr[2] = row.creUserId
      //   this.$nextTick(() => {
      //     this.$refs.updatecon.updateInit(arr)
      //   })
      // },
      // 查看个人、企业
      perPriseSee(row) {
        let arr = this.arr; //传id和当前修改的是企业还是个人
        this.seeVisible = true
        // console.log(row.id)
        // console.log(row.user_type)
        this.arr[0] = row.id
        this.arr[1] = row.user_type
        this.arr[2] = row.creUserId
        this.$nextTick(() => {
          this.$refs.seecon.seeInit(arr)
        })
      },
      // 充值个人，企业
      rechargedataBtn(row) {
        let arr = this.arr; //传id和当前修改的是企业还是个人
        this.chargeVisible = true
        this.arr[0] = row.id
        this.arr[1] = row.user_type
        this.arr[2] = row.creUserId
        this.arr[3] = row.user_phone
        this.$nextTick(() => {
          this.$refs.rechargecon.rechargeInit(arr)
        })
      },
      // 退款 个人，企业
      refundBtn(row) {
        let arr = this.arr; //传id和当前修改的是企业还是个人
        this.refundVisible = true
        this.arr[0] = row.id
        this.arr[1] = row.user_type
        this.arr[2] = row.creUserId
        this.arr[3] = row.user_phone
        this.$nextTick(() => {
          this.$refs.refundcon.refundInit(arr)
        })
      },
      // 转代理商
      transferAgent(row) {
        this.transferAgentVisible = true;
        this.$nextTick(() => {
          this.$refs.transferAgentcon.transferAgentInit(row)
        })
      },
      // 导出
      exportUser() {
        let startTime;
        let endTime;
        if (this.searchData.dateTime == null) {
          startTime = ""
          endTime = ""
        } else {
          if (this.searchData.dateTime.length == 0) {
            startTime = ""
            endTime = ""
          } else {
            startTime = this.searchData.dateTime[0]
            endTime = this.searchData.dateTime[1]
          }
        }

        window.open(this.$http.adornUrl(`agent/cust/custListExport?token=${this.$cookie.get('token')}&currentPage=${this.pageIndex}&pageSize=${this.pageSize}&custType=${this.searchData.custType}&custName=${this.searchData.custName}&agentName=${this.searchData.agentName}&mobile=${this.searchData.mobile}&startTimeStr=${startTime}&endTimeStr=${endTime}`))
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