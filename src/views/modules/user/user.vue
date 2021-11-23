<template>
    <div class="main">
        <div class="topSearch">
            <h2>客户列表</h2>
            <el-form :inline="true" :model="searchData">
                <el-form-item label="注册时间：">
                    <el-date-picker
                        v-model="searchData.dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions0"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号：" style="margin-left:25px;">
                    <el-input v-model="searchData.mobile" style="width: 180px;" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" style="margin-left:25px;">
                    <el-input v-model="searchData.email" style="width: 180px;" placeholder="请输入邮箱" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户类型：">
                    <el-select v-model="searchData.custType" style="width: 200px;" placeholder="请选择客户类型">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="个人" value="0"></el-option>
                        <el-option label="企业" value="1"></el-option>
                        <el-option label="其他" value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值状态：">
                    <el-select v-model="searchData.rechargeState" style="width: 200px;" placeholder="请选择充值状态">
                        <el-option label="全部" value="4"></el-option>
                        <el-option label="已充值" value="1"></el-option>
                        <el-option label="未充值" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称：">
                    <el-input v-model="searchData.custName" style="width: 180px;" placeholder="请输入客户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="代理商：" v-if="disableAgent">
                    <el-input v-model="searchData.agentName" style="width: 180px;" placeholder="请输入代理商名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="注册IP：">
                    <el-input v-model="searchData.registerIp" style="width: 180px;" placeholder="请输入注册IP" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getCustomList(1)">查询</el-button>
                    <el-button type="primary" @click="exportUser()" :disabled="disabled">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="agentTable">
            <el-table
                :data="userTableData"
                style="width: 100%"
                v-loading="dataListLoading"
                :header-cell-style="getRowClass"
            >
                <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="80"
                    fixed
                    label="序号"
                ></el-table-column>
                <el-table-column prop="phone" width="150" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="customerType" label="客户类型" width="120" align="center"></el-table-column>
                <el-table-column prop="name" label="客户名称" width="150" align="center"></el-table-column>
                <el-table-column
                    prop="companyName"
                    label="代理商名称"
                    align="center"
                    width="150"
                    v-if="disableAgentName"
                ></el-table-column>
                <el-table-column prop="createTime" label="注册时间" width="150" align="center"></el-table-column>
                <el-table-column prop="emptyRechargeMoney" width="150" label="空号充值总计（元）" align="center"></el-table-column>
                <el-table-column prop="emptyRechargeNum" width="150" label="空号充值总条数" align="center"></el-table-column>
                <el-table-column prop="emptyCount" width="150" label="空号剩余条数" align="center"></el-table-column>
                <el-table-column prop="realtimeRechargeMoney" width="150" label="实时充值总计（元）" align="center"></el-table-column>
                <el-table-column prop="realtimeRechargeNum" width="150" label="实时充值总条数" align="center"></el-table-column>
                <el-table-column prop="realtimeCount" width="150" label="实时剩余条数" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button @click="perPriseSee(scope.row)" type="text" size="small">查看</el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="rechargedataBtn(scope.row)"
                            :disabled="regDisabled"
                            style="margin-right: 10px;"
                        >充值</el-button>
                        <el-dropdown @command="(key) => handleClickDropdown(key, scope.row)">
                            <el-button type="text" size="small">···</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="!scope.row.canRefundFlag || refundDisabled" command="refund">退款</el-dropdown-item>
                                <el-dropdown-item :disabled="transferDisabled" command="transferAgent">转代理商</el-dropdown-item>
                                <el-dropdown-item :disabled="!scope.row.canPresent || regDisabled" command="give">注册赠送</el-dropdown-item>
                                <el-dropdown-item command="viewRechargeRecord">查看历史充值记录</el-dropdown-item>
                                <el-dropdown-item command="interface">{{scope.row.apiState === 0 ? '开启接口' : '关闭接口'}}</el-dropdown-item>
                                <el-dropdown-item :disabled="isAdmin || scope.row.authenticationLimitLevel != 3 || agentInfo.authenticationLimitLevel != 3" command="authLevel">设置用户认证等级</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="agentPage">
            <el-pagination
                :key="pageIndex"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10,20,30,50]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>

        <!-- 个人，企业修改 -->
        <!-- <per-edit-enterise v-if="updateVisible" ref="updatecon" @refreshDataList="getCustomList"></per-edit-enterise> -->
        <!-- 个人，企业查看 -->
        <per-see-enterprise v-if="seeVisible" ref="seecon"></per-see-enterprise>
        <!-- 个人，企业充值 -->
        <per-recharge-prise v-if="chargeVisible" ref="rechargecon" @refreshDataList="getCustomList"></per-recharge-prise>
        <!-- 个人，企业退款 -->
        <customer-refund-dia ref="customerRefundDiaRef" @refresh="getCustomList" />
        <!-- 转代理商 -->
        <transfer-or-agent
            v-if="transferAgentVisible"
            ref="transferAgentcon"
            @refreshDataList="getCustomList"
        ></transfer-or-agent>
        <!--设置用户认证等级 对话框 -->
        <set-auth-level ref="setAuthLevelRef" @refresh="getCustomList" />
    </div>
</template>
<script>
// import perEditEnterise from './user-per-edit-enterise'
import perSeeEnterprise from "./user-per-see-enterprise";
import perRechargePrise from "./user-per-recharge-prise";
import transferOrAgent from "./user-transfer-agent";
import CustomerRefundDia from './customer-refund-dia.vue';
import SetAuthLevel from '@/components/set-auth-level/index.vue'
import axios from 'axios';
import qs from "qs";
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
      arr: [], // 保存点击的id和区分个人和企业的id
      searchData: {
        dateTime: [],
        mobile: '',
        custType: '',
        custName: '',
        agentName: '',
        registerIp: '',
        rechargeState: ''
      },
      userTableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
      },
      agentList: [],
      isAdmin: false,
      agentInfo: {},
    };
  },
  components: {
    // perEditEnterise,
    perSeeEnterprise,
    perRechargePrise,
    // perRefundPrise,
    transferOrAgent,
    CustomerRefundDia,
    SetAuthLevel,
  },
  activated() {
    if (sessionStorage.getItem("msjRoleName") == "1") {
      if (!this.searchData.dateTime) {
        this.searchData.dateTime = [];
        var date = new Date();
        var dateSeven = new Date(new Date() - 7 * 24 * 3600 * 1000);
        this.searchData.dateTime[0] = this.formatDate(dateSeven);
        this.searchData.dateTime[1] = this.formatDate(date);
      }
    }
    this.isAdmin = sessionStorage.getItem("msjRoleName") == "1"
    if (sessionStorage.getItem("msjRoleName") == "2") {
      // 代理商
      this.disableAgent = false;
      this.disableAgentName = false;
      this.regDisabled = false;
      this.refundDisabled = false;
      this.transferDisabled = true;
      this.agentInfo = this.$json.parse(sessionStorage.getItem('agentInfo') || '{}')
    }
    if (sessionStorage.getItem("msjRoleName") == "1") {
      // 管理员
      this.regDisabled = true;
      this.refundDisabled = true;
      this.transferDisabled = false;
    }
    this.getCustomList(1);
  },
  methods: {
    formatDate(date) {
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background-color: #f8f8f8;color:#666;";
      } else {
        return "";
      }
    },
    // 获取客户列表
    getCustomList(currPage) {
      this.pageIndex = currPage || this.pageIndex
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`agent/cust/custList`),
        method: "post",
        data: {
          token: this.$cookie.get("token"),
          currentPage: this.pageIndex,
          pageSize: this.pageSize,
          name: this.searchData.custName,
          customerType: this.searchData.custType,
          phone: this.searchData.mobile,
          startTimeStr:
            "" || this.searchData.dateTime == null
              ? ""
              : this.searchData.dateTime[0],
          endTimeStr:
            "" || this.searchData.dateTime == null
              ? ""
              : this.searchData.dateTime[1],
          ip: this.searchData.registerIp,
          email: this.searchData.email,
          haveRecharged: this.searchData.rechargeState,
          // agentList: this.agentList,
          agentName: this.searchData.agentName
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.userTableData = data.data.list || []
          this.totalPage = data.data.total || 0
          if (this.userTableData.length == 0) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        } else {
          this.userTableData = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    getAgenListByName() {
      this.$http({
        url: this.$http.adornUrl(`agent/agentInfo/findAgentListByName?token=${this.$cookie.get("token")}`),
        method: "post",
        params: this.$http.adornParams({
          name: this.searchData.agentName
        }),
      }).then(({ data }) => {
        if (data.code == "0") {
          this.agentList = (data.data || []).map(ele => ele + '')
        } else {
          this.agentList = []
        }
      });
    },
    // 注册赠送
    canPresentBtn(userId) {
      this.$http({
        url: this.$http.adornUrl(
          `agent/cust/presentNum?token=${this.$cookie.get("token")}&custId=${userId}`
        ),
        method: "post",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data.code == "0") {
          this.$message.success(data.msg);
          this.getCustomList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 开启关闭接口
    setApiState(record) {
      this.$http({
        url: this.$http.adornUrl(
          `agent/cust/setApiState?token=${this.$cookie.get("token")}`
        ),
        method: "post",
        params: this.$http.adornParams({
          custId: record.customerId + '',
          state: record.apiState ? 0 : 1,
        }),
      }).then(({ data }) => {
        if (data.code == "0") {
          this.$message.success('操作成功');
          this.getCustomList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getCustomList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getCustomList();
    },
    // 查看个人、企业
    perPriseSee(row) {
      this.seeVisible = true;
      this.$nextTick(() => {
        this.$refs.seecon.init(row);
      });
    },
    // 充值个人，企业
    rechargedataBtn(row) {
      this.chargeVisible = true;
      this.$nextTick(() => {
        this.$refs.rechargecon.rechargeInit(row);
      });
    },
    // 导出
    exportUser() {
      let params = {
        token: this.$cookie.get("token"),
        currentPage: this.pageIndex,
        pageSize: this.pageSize,
        name: this.searchData.custName,
        customerType: this.searchData.custType,
        phone: this.searchData.mobile,
        startTimeStr:
          "" || this.searchData.dateTime == null
            ? ""
            : this.searchData.dateTime[0],
        endTimeStr:
          "" || this.searchData.dateTime == null
            ? ""
            : this.searchData.dateTime[1],
        ip: this.searchData.registerIp,
        email: this.searchData.email,
        haveRecharged: this.searchData.rechargeState,
        agentName: this.searchData.agentName
      }
      // axios({
      //   method: 'POST',
      //   url: this.$http.adornUrl(`agent/cust/custListExport?token=${this.$cookie.get("token")}`),
      //   data: params,
      //   responseType: 'blob'
      // }).then(res => {
      //   if (!res) {
      //     return false
      //   }
      //   const link = document.createElement('a');  // 创建元素
      //   let blob = new Blob([res], { type: 'text/csv,charset=UTF-8'});
      //   link.style.display = 'none';
      //   link.href = URL.createObjectURL(blob);   // 创建下载的链接
      //   link.setAttribute('download', '客户列表.txt');  // 给下载后的文件命名
      //   document.body.appendChild(link);
      //   link.click();  // 点击下载
      //   document.body.removeChild(link);  //  下载完成移除元素
      //   window.URL.revokeObjectURL(link.href);  // 释放掉blob对象
      // }).catch(err => {});

      window.open(
        this.$http.adornUrl(
          `agent/cust/custListExport?${qs.stringify(params)}
          `)
      );
    },
    handleClickDropdown(key, record) {
      switch (key) {
        case "refund": {
          // 退款
          this.$refs.customerRefundDiaRef.init(record);
          break;
        }
        case "transferAgent": {
          // 转代理商
          this.transferAgentVisible = true;
          this.$nextTick(() => {
            this.$refs.transferAgentcon.transferAgentInit(record);
          });
          break;
        }
        case "give": {
          // 注册赠送
          this.canPresentBtn(record.customerId);
          break;
        }
        case "viewRechargeRecord": {
          // 查看历史充值记录=
          this.$router.push({ name: 'finance-userrecharge', params: {...record} })
          break;
        }
        case "interface": {
          // 开启关闭接口
          this.setApiState(record)
          break;
        }
        case 'authLevel': {
          this.$refs.setAuthLevelRef.init(record)
          break;
        }
        default:
          break;
      }
    },
  },
};
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