<template>
  <el-dialog
    title="额度扣除"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="el-dialog-enter"
    @close='closeDialog'
    >
    <el-form :inline="true" label-width="100px">
      <el-form-item label="客户名称">
        {{customerName}}
      </el-form-item><br />
      <el-form-item label="万数账号">
        {{accountPhone}}
      </el-form-item><br />
      <el-form-item label="当前余额">
        {{balance}}
      </el-form-item><br />
      <el-form-item label="所涉金额(元)">
        <el-input 
          v-model="messageMoney" 
          class="moneyInput" 
          ref="money" 
          @change="saveMoney" 
          type="number"  
          placeholder="单行输入"
        ></el-input> 元
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
    <el-button type="primary" @click="saveData" :disabled="disabled" class="submit-button">提交</el-button>
    <el-button  @click="visible = false">取消</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
import qs from "qs";
export default {
  data() {
    return {
      visible: false,
      title: "",
      customerName: "",
      accountPhone: "",
      balance: "",
      moneyMessage: "请输入正确的金额",
      disabled: true,
      balanceVisible: false,
      messageMoney: "",
      accountId: null,
      dataList: {
        accountId: null,
        amount: null,
        mark: null,
      },
      remarkText: "",
      remarkMessage: ""
    };
  },
  created() {
    this.disabled = true;
  },
  methods: {
    init({ accountId, accountUsername, companyName, balance, }) {
      this.visible = true;
      this.dataList.accountId = accountId;
      this.balance = balance;
      this.customerName = companyName;
      this.accountPhone = accountUsername;
    },
    // 提交数据
    saveData() {
      this.disabled = true;
      this.$http({
        url: this.$http.adornUrl(`biz/bizdeductorder/save`),
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
              this.orders = "";
              this.remarkText = "";
            }
          });
        } else {
          // this.disabled = false;
          this.$message.error(data.msg);
          this.messageMoney = "";
          this.remarkText = "";
        }
      });
    },
    closeDialog() {
      this.checkAll = "";
      this.remarkText = "";
      this.messageMoney = "";
      this.moneyMessage = "";
    },
    saveMark(e) {
      this.dataList.mark = this.$refs.mark.value;
    },
    saveMoney(e) {
      let balance = this.$refs.money.value;
      if (balance === "") {
        this.disabled = true;
      } else if (balance< 0) {
        this.disabled = true;
        this.balanceVisible = true;
      } else {
        this.disabled = false;
        this.balanceVisible = false;
        this.dataList.amount = balance;
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
  margin-left: 240px;
  margin-right: 50px;
}
</style>
