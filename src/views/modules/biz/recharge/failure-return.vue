<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select clearable style="width: 130px" class="filter-item" v-model="select" placeholder="全部" @change="chooseSelect">
          <el-option v-for="item in allList" :key="item.message" :label="item.message" :value="item.message" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input style="width:230px" v-model="inputDisabledValue" :placeholder="allListMessage"  @change="inputDisabledValueFn" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <!-- <el-button v-if="isAuth('biz:customer:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('biz:customer:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      @filter-change="filterChange"
      :header-cell-class-name="tableheaderClassName"
       :row-style="rowClass"
      @sort-change="changeData"
      style="width: 100%;height:100%">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        fixed
        width="60">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        fixed
        label="序号">
      </el-table-column>
      <el-table-column
        prop="customerName"
        width="180"
        fixed
        header-align="center"
        align="center"
        label="公司名称">
      </el-table-column> 
      <el-table-column
         prop="orderNo"
         header-align="center"
         align="center"
         width="160"
         label="订单编号">
      </el-table-column>
      <el-table-column
         prop="accountPhone"
         header-align="center"
         align="center"
         width="160"
         label="万数账号">
      </el-table-column>
      <el-table-column
         prop="reMoney"
         header-align="center"
         align="center"
         width="100"
         sortable
         label="返还金额">
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        header-align="center"
        align="center"
        width="100"
        :formatter="formAuditStatus"
        label="审核状态">
      </el-table-column>
      <el-table-column
        prop="auditUserName"
        header-align="center"
        align="center"
        width="100"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="140"
        sortable
        label="申请时间">
      </el-table-column>
      <el-table-column
         prop="auditDate"
         header-align="center"
         align="center"
         width="140"
         sortable
         label="审核时间">
      </el-table-column>
      <el-table-column
         prop="dataStatus"
         header-align="center"
         align="center"
         :formatter="formDataStatus"
         width="100"
         label="客户状态">
      </el-table-column>
      <el-table-column
         prop="mark"
         header-align="center"
         align="center"
         width="150"
         label="申请备注">
      </el-table-column> 
      <el-table-column
         prop="auditMark"
         header-align="center"
         align="center"
         width="140"
         label="审核备注">
      </el-table-column>            
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.auditStatus == 1">
            <el-button @click="failureReturnRecall(scope.row)">撤回</el-button>

          </div>
          <!-- <el-button v-if="isAuth('biz:customer:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.accountId)">修改</el-button> -->
        </template>
      </el-table-column> 
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="dataForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="dataForm.size"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  <!-- 撤回 -->
  <recharge-recall v-if="accountEmergencyVisible" ref="accountEmergency" @refreshDataList="getDataList"></recharge-recall>

  </div>

</template>

<script>
import RechargeRecall from "./recharge-recall";

export default {
  data() {
    return {
      dataForm: {
        page: 1,
        size: 10,
        username: undefined, //负责人姓名
        companyName: undefined, //公司名称
        accountPhone: undefined
      },
      pageIndex: 1,
      dataList: [],
      allList: [
        { value: "allQuery", message: "全部" },
        { value: "id", message: "ID" },
        { value: "dutyManName", message: "负责人" },
        { value: "dutyMan", message: "公司名称" },
        { value: "orderNo", message: "订单编号" },
        { value: "accountPhone", message: "万数账号" }
      ],
      totalPage: undefined,
      dataListLoading: false,
      dataListSelections: [],
      accountEmergencyVisible: false,
      inputDisabledValue: "",
      paramsOneName: "",
      allListMessage: "全部",
      select: "全部"
    };
  },
  components: {
    RechargeRecall
  },
  activated() {
    this.getDataList();
  },
  methods: {
    rowClass(row, index) {
      // if(row.row.accountId === 13996){
      //   return { "color": "red" }
      // }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      
      this.$http({
        url: this.$http.adornUrl("/biz/bizfailreorder/list"),
        method: "get",
        params: this.$http.adornParams(this.dataForm)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.dataForm.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    //
    chooseSelect(message) {
      let text = message;
      let textA = this.$data.allList;
      textA.forEach(element => {
        let { message, value } = element;
        if (message == text) {
          this.dataForm = {
            page: 1,
            size: 10
          };
          this.paramsOneName = value;
        }
      });
      this.inputDisabledValue = "";
      this.dataForm = {
        page: 1,
        size: 10
      };
      return (this.allListMessage = text);
    },
    //获取input里的值
    inputDisabledValueFn(e) {
      if (this.paramsOneName === "") {
        this.paramsOneName = "allQuery";
        this.dataForm.allQuery = this.inputDisabledValue;
      } else if (this.paramsOneName === "allQuery") {
        //全部
        this.dataForm.allQuery = this.inputDisabledValue;
      } else if (this.paramsOneName === "companyName") {
        //公司名称
        this.dataForm.companyName = this.inputDisabledValue;
      } else if (this.paramsOneName === "accountPhone") {
        //万数账号
        this.dataForm.accountPhone = this.inputDisabledValue;
      } else if (this.paramsOneName === "orderNo") {
        //订单编号
        this.dataForm.orderNo = this.inputDisabledValue;
      } else if (this.paramsOneName === "dutyMan") {
        //负责人
        this.dataForm.dutyMan = this.inputDisabledValue;
      } else if (this.paramsOneName === "id") {
        //id
        this.dataForm.id = this.inputDisabledValue;
      }
    },
    //查询
    handleFilter() {
      if (this.inputDisabledValue) {
        this.dataForm.size = 10;
        this.dataForm.page = 1;
        this.getDataList();
      } else {
        this.dataForm.allQuery = null;
        this.dataForm.size = 10;
        this.dataForm.page = 1;
        this.getDataList();
      }
    },
    filterChange(e) {
      // console.log(e);
    },
    // 每页数
    sizeChangeHandle(val) {
      this.dataForm.size = val;
      this.dataForm.page = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.dataForm.page = val;
      this.getDataList();
    },
    //changeData
    changeData({ order, prop }) {
      if (order === "descending") {
        this.dataForm.ascFlg = false;
        this.dataForm.orderCol = prop;
        this.getDataList();
      } else if (order === "ascending") {
        this.dataForm.ascFlg = true;
        this.dataForm.orderCol = prop;
        this.getDataList();
      } else {
        this.dataForm.ascFlg = null;
        this.dataForm.orderCol = null;
        this.getDataList();
      }
    },
    //审核状态
    formAuditStatus(row, column) {
      switch (row.auditStatus) {
        case 1:
          return "待审核";
          break;

        case 2:
          return "已通过";
          break;

        case 3:
          return "已驳回";
          break;

        case 4:
          return "已支付";
          break;
        default:
          return "";
      }
    },
    //客户状态
    formDataStatus(row, column) {
      switch (row.dataStatus) {
        case 1:
          return "意向";
          break;

        case 2:
          return "合作";
          break;

        case 3:
          return "沉默";
          break;
      }
    },
    // 撤回
    failureReturnRecall(e) {
      this.accountEmergencyVisible = true;
      this.$nextTick(() => {
        this.$refs.accountEmergency.init(e, "failureReturn");
      });
    },
    // 新增 / 修改
    // addOrUpdateHandle (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },
    // 删除
    // deleteHandle (id) {
    //   var ids = id ? [id] : this.dataListSelections.map(item => {
    //     return item.id
    //   })
    //   this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //       this.$http({
    //           url: this.$http.adornUrl('/biz/customer/delete'),
    //           method: 'post',
    //           data: this.$http.adornData(ids, false)
    //         }).then(({data}) => {
    //           if (data && data.code === 0) {
    //           this.$message({
    //             message: '操作成功',
    //             type: 'success',
    //             duration: 1500,
    //             onClose: () => {
    //             this.getDataList()
    //         }
    //         })
    //         } else {
    //           this.$message.error(data.msg)
    //         }
    //       })
    //   }).catch(() => {})
    // },
    //table th
    tableheaderClassName({ row, rowIndex }) {
      return "table-head-th";
    }
  }
};
</script>


<style scoped>
h4 {
  display: inline-block;
}
span {
  padding: 0 15px;
}
.account-selecet {
  width: 100px;
}
</style>

