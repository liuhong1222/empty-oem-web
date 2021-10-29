<template>
  <el-dialog title="应急充值" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" @close='closeDialog'>
    <el-form :inline="true" :model="dataForm" label-width="100px">
      <el-form-item label="公司名称">
        {{customerName}}
      </el-form-item><br />
      <el-form-item label="万数账号">
        {{accountPhone}}
      </el-form-item><br />
      <el-form-item label="所涉金额(元)">
        <el-input v-model="messageMoney" class="moneyInput" ref="money" @change="saveMoney" type="number" placeholder="单行输入"></el-input> 元
        <div class="el-form-item__error" v-if="balanceVisible">
          {{moneyMessage}}
        </div>
      </el-form-item><br />
      <el-form-item label="预计归还时间">
        <el-date-picker v-model="chooseDate" type="date" @change="saveTime" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item><br />
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
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        messageMoney: "",
        visible: false,
        remarkText: "",
        remarkMessage: "",
        customerName: null,
        accountPhone: null,
        disabled: true,
        balanceVisible: false,
        moneyMessage: "请输入正确的金额",
        dataForm: {
          aid: 76
        },
        dataList: {
          customerName: null, //	客户名称
          accountPhone: null, //	万数账号（手机号）
          salesman: null, //	负责人ID
          salesmanName: null, //	负责人姓名
          accountId: null, //	客户ID
          emergencyMoney: null, //	所涉金额
          repaymentDate: null, //	预计归还时间
          mark: null //	下单备注信息
        },
        chooseDate: null
      };
    },
    created() {
      this.disabled = true;
    },
    methods: {
      init({ companyName, accountUsername, salesman, userName, accountId }) {
        this.visible = true;
        this.dataList.customerName = companyName;
        this.dataList.accountPhone = accountUsername;
        this.dataList.salesman = salesman;
        this.dataList.salesmanName = userName;
        this.dataList.accountId = accountId;

        this.customerName = companyName;
        this.accountPhone = accountUsername;
      },
      // 提交数据
      saveData() {
        this.disabled = true;
        this.$http({
          url: this.$http.adornUrl(`/biz/bizemergencyrechargeorder/save`),
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: this.$http.adornData(this.dataList, true, "form")
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                // this.disabled = false;
                this.visible = false;
                this.$emit("refreshDataList");
                this.messageMoney = "";
                this.remarkText = "";
                this.chooseDate = null;
                this.dataList.customerName = "";
                this.dataList.accountPhone = "";
                this.dataList.salesman = "";
                this.dataList.salesmanName = "";
                this.dataList.emergencyMoney = "";
                this.dataList.repaymentDate = "";
                this.dataList.mark = "";
              }
            });
          } else {
            // this.disabled = false;
            this.$message.error(data.msg);
          }
        });
      },
      saveMoney(e) {
        //	所涉金额
        let balance = this.$refs.money.value;
        if (balance === "") {
          this.disabled = true;
        } else if (balance < 0) {
          this.disabled = true;
          this.balanceVisible = true;
        } else {
          this.disabled = false;
          this.balanceVisible = false;
          this.dataList.emergencyMoney = balance;
        }
      },
      saveMark(e) {
        //	备注
        this.dataList.mark = this.$refs.mark.value;
      },
      saveTime(e) {
        //	预计归还时间
        this.dataList.repaymentDate = e;
      },
      closeDialog() {
        this.messageMoney = "";
        this.remarkText = "";
        this.chooseDate = null;
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
    }
  };

</script>

<style>
  .moneyInput {
    width: 330px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }

  .el-dialog-enter .el-dialog__body {
    padding: 30px 30px 30px 100px;
  }

  .submit-button {
    margin-left: 120px;
    margin-right: 50px;
  }
</style>