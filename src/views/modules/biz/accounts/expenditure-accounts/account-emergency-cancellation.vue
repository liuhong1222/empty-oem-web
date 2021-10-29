<template>
  <el-dialog title="应急还款" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" @close='closeDialog'>
    <el-form :inline="true" :model="dataForm" label-width="100px">
      <el-form-item label="公司名称">
        {{companyName}}
      </el-form-item>
      <br />
      <el-form-item label="万数账号">
        {{accountUsername}}
      </el-form-item>
      <br />
      <el-form-item label="应急充值单号">
        <template>
          <el-table :data="emergencyDataList" :header-cell-class-name="tableheaderClassName" @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" fixed width="60">
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编号" header-align="center" align="center" width="180">
            </el-table-column>
            <el-table-column prop="actualMoney" label="应还金额" header-align="center" align="center" width="100">
            </el-table-column>
            <el-table-column prop="createTime" label="订单时间" header-align="center" align="center" width="140">
            </el-table-column>
            <el-table-column prop="planRepaymentDate" label="预计归还时间" header-align="center" align="center" width="140">
            </el-table-column>
            <el-table-column prop="dutyManName" header-align="center" align="center" label="负责人">
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <br />
      <el-form-item label="应还金额">
        {{money | currency}} 元
        <div class="el-form-item__error" ref="FormDiv" v-if="balanceVisible"> {{moneyMessage}} </div>
      </el-form-item>
      <br />
      <el-form-item label="账户余额">
        {{balance | currency}} 元
      </el-form-item>
      <br />

      <el-form-item label="备注">
        <el-input v-model="remarkText" ref="mark" @change="saveMark" :rows="3" :cols="53" maxlength="150" placeholder="请输入本次操作备注"
          type="textarea" clearable></el-input>
        <div class="el-form-item__error" ref="FormDiv"> {{remarkMessage}} </div>
        <span>{{remarkText.length}}/150</span>
      </el-form-item><br />
      <el-button type="primary" @click="saveData" :disabled="disabled" class="submit-button">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
  export default {
    data() {
      return {
        visible: false,
        title: "",
        remarkText: "",
        remarkMessage: "",
        accountUsername: null,
        companyName: null,
        balance: null,
        disabled: true,
        money: 0,
        moneyMessage: "超过余额，请修改",
        balanceVisible: false,
        dataForm: {
          remark: ""
        },
        dataList: {
          mark: null,
          emergOrderIds: null,
          mark: null,
          diposeAmount: null,
          accountId: null
        },
        emergOrderIds: [],
        emergencyDataList: []
      };
    },
    created() {
      this.disabled = true;
    },
    methods: {
      init({ accountId, companyName, accountUsername, balance }) {
        this.visible = true;
        this.companyName = companyName;
        this.accountUsername = accountUsername;
        this.balance = balance;
        this.dataList.accountId = accountId;
        this.$http({
          url: this.$http.adornUrl("/biz/emergencydisposeorder/init-add"),
          method: "get",
          params: this.$http.adornParams({ accountId: accountId })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.emergencyDataList = data.orders;
            // console.log(this.emergencyDataList)
          } else {
            this.dataList = [];
            this.dataForm.totalPage = 0;
          }
          this.dataListLoading = false;
        });
      },
      // 提交数据
      saveData() {
        this.disabled = true;
        this.$http({
          url: this.$http.adornUrl(`/biz/emergencydisposeorder/save`),
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
          },
          data: this.$http.adornData(this.dataList, true, "form")
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit("refreshDataList");
                this.messageMoney = "";
                this.orders = "";
                this.remarkText = "";
              }
            });
          } else {
            // this.disabled = false;
            this.$message.error(data.msg);
          }
        });
      },
      saveMark(e) {
        this.dataList.mark = this.$refs.mark.value;
      },
      closeDialog() {
        this.remarkText = "";
      },
      //table th
      tableheaderClassName({ row, rowIndex }) {
        return "table-head-th";
      },
      handleSelectionChange(e) {
        if (e) {
          let array = e;
          let actualMoney = 0;
          let emergOrderIds = [];
          array.forEach(element => {
            actualMoney += element.actualMoney;
            emergOrderIds.push(element.id);
          });
          this.dataList.emergOrderIds = emergOrderIds;
          this.dataList.diposeAmount = actualMoney;
          this.money = actualMoney;
          this.disabled = false;
        } else {
          return;
        }
      }
    },
    watch: {
      remarkText: function (val, oldValue) {
        if (val.length === 150) {
          this.remarkMessage = "备注最多输入150字哦";
        } else {
          this.remarkMessage = "";
        }
      }
    },
    filters: {
      currency: function (
        number,
        decimals = 3,
        dec_point,
        thousands_sep,
        roundtag
      ) {
        /*
          * 参数说明：
          * number：要格式化的数字
          * decimals：保留几位小数
          * dec_point：小数点符号
          * thousands_sep：千分位符号
          * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
          * */
        number = (number + "").replace(/[^0-9+-Ee.]/g, "");
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
          dec = typeof dec_point === "undefined" ? "." : dec_point,
          s = "",
          toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return (
              "" +
              parseFloat(
                Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(
                  prec * 2
                )
              ) /
              k
            );
          };
        s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
          s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || "").length < prec) {
          s[1] = s[1] || "";
          s[1] += new Array(prec - s[1].length + 1).join("0");
        }
        return s.join(dec);
      }
    }
  };

</script>

<style>
  .el-table {
    min-height: 300px;
  }

  .list {
    max-width: 700px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }

  .el-dialog-enter .el-dialog__body {
    padding: 30px 30px 30px 60px;
  }

  .submit-button {
    margin-left: 240px;
    margin-right: 50px;
  }

  .el-form-item__error {
    min-width: 200px;
  }
</style>