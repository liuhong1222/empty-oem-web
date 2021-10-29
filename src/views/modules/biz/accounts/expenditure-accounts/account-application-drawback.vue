<template>
  <el-dialog
    title="退款申请"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="el-dialog-enter"
    @close='closeDialog' 
    >
    <el-form :inline="true" :model="dataForm" label-width="100px" class="emergMoney" >
      <el-form-item label="客户名称">
					{{companyName}}
      </el-form-item><br />
      <el-form-item label="万数账号">
				{{accountUsername}}
      </el-form-item><br />
      <el-form-item label="应急充值未归还金额" >
				{{emergMoney}} 元
      </el-form-item><br />
      <el-form-item label="测试赠送金额">
				{{giveMoney  }} 元
      </el-form-item><br />
      <el-form-item label="当前余额">
				{{balance}} 元
      </el-form-item><br />
      <el-form-item label="退款金额">
        <el-input 
          v-model="messageMoney" 
          class="moneyInput" 
          ref="money" 
          @change="saveMoney" 
          type="number"  
          placeholder="单行输入"
        ></el-input> 元
        <div>可退金额 <= 当前余额 - 应急充值未归还金额 - 测试赠送的金额</div>
        <div class="el-form-item__error" v-if="balanceVisible">
          {{moneyMessage}} 
        </div>
      </el-form-item><br />
      <el-form-item label="备注">
		    <el-input 
          v-model="remarkText" 
          ref="mark" 
          @change="saveMark" 
          :rows="3"  
          :cols="53" 
          maxlength="150" 
          placeholder="请输入本次操作备注" 
          type="textarea" 
          clearable
        ></el-input>
        <div class="el-form-item__error" ref="FormDiv" > {{remarkMessage}} </div> 
        <span>{{remarkText.length}}/150</span>
      </el-form-item><br />
    <el-button type="primary" @click="saveData"  :disabled="disabled" class="submit-button">提交</el-button>
    <el-button  @click="visible = false">取消</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
export default {
  data() {
    return {
      messageMoney: "",
      orders: null,
      visible: false,
      remarkText: "",
      remarkMessage: "",
      companyName: null,
      accountUsername: null,
      balanceVisible: false,
      moneyMessage: "请输入正确的退款金额",
      balance: null,
      disabled: true,
      dataForm: {
        accountId: null
      },
      dataList: {
        accountId: null,
        incomeOrderNo: null,
        refundMoney: null,
        mark: null
      },
      emergMoney: null,
      giveMoney: null
    };
  },
  created() {
    this.disabled = true
  },
  methods: {
    init({accountId}) {
      this.visible = true;
      this.dataList.accountId = accountId;
      this.dataForm.accountId = accountId || 0;
      /*
      * 请求接口 获取万数账号,公司名称
      */
      if (this.dataForm.accountId) {
        this.$http({
          url: this.$http.adornUrl(`/biz/refundorder/init-add`),
          method: "get",
          params: this.$http.adornParams(this.dataForm)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.companyName = data.account.companyName;
            this.accountUsername = data.account.accountUsername;
            this.balance = data.account.balance;
            this.emergMoney = data.emergMoney   
            this.giveMoney = data.giveMoney

          } else {
          }
        });
      }
    },
    // 提交数据
    saveData() {
      this.disabled = true;
      this.$http({
        url: this.$http.adornUrl(`/biz/refundorder/save`),
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
              this.disabled = false;
              this.visible = false;
              this.$emit("refreshDataList");
              this.messageMoney = "";
              this.orders = "";
              this.remarkText = "";
              this.dataList.mark = "";
              this.dataList.incomeOrderNo = "";
              this.dataList.refundMoney = "";
              this.moneyMessage = "";
            }
          });
        } else {
          this.disabled = false;
          this.$message.error(data.msg);
          // this.moneyMessage = "";
        }
      });
    },
    selectBank(e) {
      this.dataList.bankNo = e;
    },
    saveMoney(e) {
      let balance = this.$refs.money.value;
      if (balance === "") {
        this.disabled = true;
      } else if (balance > this.balance || balance < 0) {
        this.disabled = true;
        this.balanceVisible = true;
      } else {
        this.disabled = false;
        this.balanceVisible = false;
        this.dataList.refundMoney = balance;
      }
    },
    saveMark(e) {
      this.dataList.mark = this.$refs.mark.value;
    },
    getIncomeOrderNo(e) {
      let value = this.$refs.orders.value;
      this.dataList.incomeOrderNo = value;
    },
    closeDialog() {
      this.messageMoney = "";
      this.orders = "";
      this.remarkText = "";
      this.disabled = false;
    }
  },
  watch: {
    remarkText: function(val, oldValue) {
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
.emergMoney .el-form-item__label{
  width: 180px !important;
}
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
  margin-left: 240px;
  margin-right: 50px;
}
</style>
