<template>
  <el-dialog
    title="测试赠送"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="el-dialog-enter"
    @close='closeDialog' 
    >
    <el-form :inline="true" :model="dataForm" label-width="100px" >
      <el-form-item label="公司名称">
					{{customerName}}
      </el-form-item><br />
      <el-form-item label="万数账号">
				{{accountPhone}}
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
      visible: false,
      title: "",
      remarkText: "",
      remarkMessage: "",
      customerName: null,
      disabled: true,
      balanceVisible: false,
      moneyMessage: "请输入正确的金额",
      accountPhone: null,
      dataForm: {
        aid: 76
      },
      dataList: {
        accountId: null,
        amount: null,
        mark: null
      }
    };
  },
  created() {
    this.disabled = true;
  },
  methods: {
    init(id, text) {
      let accountId = id;
      this.title = text;
      this.visible = true;
      this.dataList.accountId = id;
      this.dataForm.aid = id || 0;
      /*
      * 请求接口 获取万数账号,公司名称
      */
      if (this.dataForm.aid) {
        this.$http({
          url: this.$http.adornUrl(`/biz/bizprepayorder/info`),
          method: "get",
          params: this.$http.adornParams(this.dataForm)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.customerName = data.data.customerName;
            this.accountPhone = data.data.accountPhone;
          } else {
          }
        });
      }
    },
    // 提交数据
    saveData() {
      this.disabled = true;
      this.$http({
        url: this.$http.adornUrl(`biz/bizfreeorder/save`),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        method: "post",
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
              this.dataList.amount = "";
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
      let balance = this.$refs.money.value;
      if (balance === "") {
        this.disabled = true;
      } else if (balance < 0) {
        this.disabled = true;
        this.balanceVisible = true;
      } else if (balance > 1000) {
        this.disabled = true;
        this.balanceVisible = true;
      } else {
        this.disabled = false;
        this.balanceVisible = false;
        this.dataList.amount = balance;
      }
      // this.dataList.amount = this.$refs.money.value;
    },
    saveMark(e) {
      this.dataList.mark = this.$refs.mark.value;
    },
    closeDialog() {
      this.messageMoney = "";
      this.remarkText = "";
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
