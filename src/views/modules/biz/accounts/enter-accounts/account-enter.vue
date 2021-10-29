<template>
  <el-dialog title="预付" :close-on-click-modal="false" :visible.sync="visible" class="el-dialog-enter" @close='closeDialog'>
    <el-form :inline="true" :model="dataForm" label-width="100px">
      <el-form-item label="公司名称">
        {{customerName}}
      </el-form-item><br />
      <el-form-item label="万数账号">
        {{accountPhone}}
      </el-form-item><br />
      <el-form-item label="所涉银行">
        <template slot-scope="scope">
          <el-select v-model="bank" @change="selectBank" placeholder="请选择">
            <el-option v-for="(value, key, index) in bankList" :key="index" :label="value" :value="key">
            </el-option>
          </el-select>
        </template>
      </el-form-item><br />
      <el-form-item label="所涉金额(元)">
        <el-input v-model="messageMoney" class="moneyInput" ref="money" @change="saveMoney" type="number" placeholder="单行输入"></el-input> 元
        <div class="el-form-item__error" v-if="balanceVisible">
          {{moneyMessage}}
        </div>
      </el-form-item><br />
      <el-form-item label="实付金额(元)">
        {{ messageMoney | currency }} 元
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
        messageMoney: "",
        visible: false,
        title: "",
        bankList: null,
        bank: "",
        remarkText: "",
        disabled: true,
        balanceVisible: false,
        moneyMessage: "请输入正确的金额",
        customerName: null,
        accountPhone: null,
        remarkMessage: "",
        dataForm: {
          aid: 76
        },
        dataList: {
          accountId: null,
          bankNo: null,
          preMoney: null,
          actualMoney: null,
          mark: null
        }
      };
    },
    created() {
      this.disabled = true
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
              this.bankList = data.data.banks;
            } else {
            }
          });
        }
      },
      // 提交数据
      saveData() {
        this.disabled = true;
        this.$http({
          url: this.$http.adornUrl(`/biz/bizprepayorder/save`),
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
                this.bank = "";
                this.dataList.actualMoney = "";
                this.dataList.bankNo = "";
                this.dataList.mark = "";
                this.dataList.preMoney = "";
              }
            });
          } else {
            // this.disabled = false;
            this.$message.error(data.msg);
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
        } else if (balance < 0) {
          this.disabled = true;
          this.balanceVisible = true;
        } else {
          this.disabled = false;
          this.balanceVisible = false;
          this.dataList.actualMoney = balance;
          this.dataList.preMoney = balance;
        }
      },
      saveMark(e) {
        this.dataList.mark = this.$refs.mark.value;
      },
      closeDialog() {
        this.messageMoney = "";
        this.remarkText = "";
        this.bank = "";
      }
    },
    filters: {
      currency: function (number, decimals = 3, dec_point, thousands_sep, roundtag) {
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