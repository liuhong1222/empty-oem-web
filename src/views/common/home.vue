<!-- <template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h2>嗨！{{ userName }}</h2>
          <ul class="cf basic-mess">
            <li v-for="(item,index) in basicList" :key="index">
              <p>{{item.title}}</p>
              <input type="text" v-model="item.counts" :value="item.counts" readonly>
              <button v-show="item.flag" @click="basicBtn(index,item.counts)">{{item.title === '邮箱' && item.counts === '' ? '添加' : item.btnText}}</button>
            </li>
            <li>
              <button class="copyLink" @click="copyLink">复制推广链接</button>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div>
            <h2>充值记录</h2>
            <el-button type="text" style="float:right" @click="showDetails()">查看详情</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" :highlight-current-row="true">
            <el-table-column prop="payTime" label="申请时间">
            </el-table-column>
            <el-table-column prop="money" label="充值金额">
            </el-table-column>
            <el-table-column prop="number" label="充值条数">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h2>我的客户</h2>
          <ul class="cf customerList">
            <li v-for="(item,index) in customMy" :key="index">
              <p>{{item.title}}</p>
              <p>{{item.counts}}</p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div>
            <h2>充值套餐</h2>
            <el-button type="text" style="float:right" @click="editMeal">修改</el-button>
          </div>
          <ul class="cf mealPackage">
            <li v-for="(item,index) in mealList" :key="index">
              <p><span>{{item.packageName}}</span><span class="line"></span></p>
              <span class="moneyMeal">{{item.money}}元</span>
              <span v-if="index == '3'">/{{item.number}}条</span>
              <span class="label" v-else>/{{item.number}}万条</span>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
 
    <el-dialog title="充值" :visible.sync="chdataFormVisible">
      <el-form :model="chdataForm" ref="chdataFormref" :rules="chdataFormrefRule" label-width="100px">
        <el-form-item label="充值单价">
          <el-input style="border:none" v-model="chdataForm.chPrice" placeholder="" readonly id="chprice"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="chMoney">
          <el-input v-model.number="chdataForm.chMoney" placeholder="充值金额"></el-input>
          <span>元</span>
        </el-form-item>
        <el-form-item label="充值条数">
          <el-input v-model.number="chdataForm.chCounts" placeholder="请输入充值条数" ref="inputVal" readonly></el-input>
          <span>条</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="chdataForm.remark" placeholder="请输入备注..."></el-input>
        </el-form-item>
      </el-form>
      <div id="qrcodeCon">
        <div id="qrcode">二维码位置</div>
        <button>请打开支付宝扫描二维码</button>
      </div>
    </el-dialog>
 

    <el-dialog title="预警值" :visible.sync="warnFormVisible">
      <el-form :model="warinform" :rules="warnRule" ref="warinform">
        <el-form-item label="当前预警值">
          <el-input v-model="warinform.curcounts" id="curCount" readonly></el-input>
        </el-form-item>
        <el-form-item label="修改预警值" prop="counts">
          <el-input v-model="warinform.counts"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="warnFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="warnFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  
    <el-dialog title="套餐修改" :visible.sync="editmealVisible" id="mealDialog">
      <div>
        <div class="divInput" v-for="(item,i) in mealList" :key="i">
          <span class="label" style="width:50px;display:inline-block">{{item.packageName}}</span>
          <div class="mealinput">
            <input type="text" v-model="dat.mealMoney[i]">
          </div>
          <span>元</span>
          <div class="mealinput">
            <input type="text" v-model="dat.count[i]">
          </div>
          <span class="label" v-if="i == '3'">条</span>
          <span class="label" v-else>万条</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editmealChange()">修改套餐</el-button>
      </span>
    </el-dialog>
  

    <el-dialog title="复制推广链接" :visible.sync="copyVisible" width="30%">
      <el-input v-model="copyinput" id="copyInput"></el-input>
      <el-button type="primary" id="copyBtn" v-clipboard:copy="copyinput" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</el-button>
    </el-dialog>

   
    <el-dialog title="添加邮箱" :visible.sync="addEmailVisible">
      <el-form :model="addemailform" :rules="addemailrules" ref="addemailruleForm">
        <el-form-item label="新邮箱" prop="email">
          <el-input v-model="addemailform.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEmailBtn()">确 定</el-button>
      </div>
    </el-dialog>
  

    <el-dialog title="重新绑定邮箱" :visible.sync="reEmailVisible">
      <el-form :model="reemailform" :rules="reemailrules" ref="reemailruleForm">
        <el-form-item label="原邮箱">
          <el-input v-model="reemailform.oldemail" id="emailInput" readonly></el-input>
        </el-form-item>
        <el-form-item label="新邮箱" prop="newemail">
          <el-input v-model="reemailform.newemail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reEmailBtn()">确 定</el-button>
      </div>
    </el-dialog>

    <re-bind-phone v-if="reBindVisible" ref="reBindPhoneCon"></re-bind-phone>
  </div>
</template> -->

<!-- <script>
  import reBindPhone from './re-bind-phone'
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data() {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误!'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      return {
        copyinput: '地址地址地址地址地址地址',
        dat: {
          count: [],
          mealMoney: [],
          name: []
        },
        packageId: [],
        list: [],
        tableData: [], //充值记录
        customMy: [  //我的客户
          { title: '客户数量', counts: '' },
          { title: '客户充值总计', counts: '' },
          { title: '客户消费条数', counts: '' }
        ],
        basicList: [ //基本信息
          { title: '我的代理价（元/条）', counts: '', btnText: '', flag: false },
          { title: '我的余额（条）', counts: '', btnText: '充值', flag: true },
          { title: '预警值（条）', counts: '', btnText: '修改', flag: true },
          { title: '手机号', counts: '', btnText: '更改', flag: true },
          { title: '邮箱', counts: '', btnText: '更改', flag: true }
        ],
        mealList: [], //套餐
        addemailform: {
          email: ''
        },
        reemailform: {
          oldemail: '',
          newemail: ''
        },
        addemailrules: {
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
        },
        reemailrules: {
          newemail: [
            { required: true, message: '新邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
        },
        reBindVisible: false,
        copyVisible: false,
        addEmailVisible: false,
        reEmailVisible: false,
        chdataFormVisible: false,
        warnFormVisible: false,
        editmealVisible: false,
        chdataForm: {
          chPrice: '0.2',
          chCounts: '',
          chMoney: '',
          remark: ''
        },
        chdataFormrefRule: {
          chMoney: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字' }
          ],
          chCounts: [
            { required: true, message: '请输入充值金额，自动计算条数', trigger: 'blur' },
            { type: 'number', message: '条数必须为数字' }
          ],
        },
        warinform: { counts: '', curcounts: '' },
        warnRule: {
          counts: [
            { required: true, message: '请输入修改的预警值', trigger: 'blur' }
          ],
        }
      }
    },
    components: {
      reBindPhone
    },
    watch: {
      chdataForm: {
        handler: function (val, oldval) {
          // let searchMoney = this.$refs.inputMoney.value;
          if (this.chdataForm.chMoney !== "" && this.chdataForm.chPrice !== "") {
            this.chdataForm.chCounts = Number(this.chdataForm.chMoney) / (this.chdataForm.chPrice);
          } else {
            this.chdataForm.chCounts = ""
          }

          // 获取验证码
        },
        deep: true
      }
    },
    computed: {
      userName: {
        get() { return this.$store.state.user.name }
      }
    },
    activated() {
      this.getAgentDeskInfo(),
        this.myRechargeList(),
        this.findAgentPackage()
    },
    methods: {
      basicBtn(arrindex, btnCount) {
        // console.log(arrindex)
        if (arrindex == 1) { //余额充值
          this.chdataFormVisible = true;
          this.$nextTick(() => {
            this.$refs['chdataFormref'].resetFields();
          })
        } else if (arrindex == 2) {  //预警值修改
          this.warinform.curcounts = this.basicList[2].counts
          this.warnFormVisible = true;
          this.$nextTick(() => {
            this.$refs['warinform'].resetFields();
          })
        } else if (arrindex == 3) {  //修改手机号
          this.reBindVisible = true;
          this.$nextTick(() => {
            this.$refs.reBindPhoneCon.showInit()
          })
        } else if (arrindex == 4) {
          if (btnCount == "") {
            // console.log("添加弹出框");
            this.addEmailVisible = true
            this.$nextTick(() => {
              this.$refs['addemailruleForm'].resetFields();
            })
          } else {
            this.reemailform.oldemail = this.basicList[4].counts
            this.reEmailVisible = true;
            this.$nextTick(() => {
              this.$refs['reemailruleForm'].resetFields();
            })
          }
        }
      },

      copyLink() {
        this.copyVisible = true;
      },
      onCopy: function (e) {
        this.$message({
          message: '恭喜你，复制成功',
          type: 'success'
        });
        this.copyVisible = false;
      },
      onError: function (e) {
        this.$message.error('复制失败了哦！');
      },
      // 预警值提交
      warnFormSubmit() {
        this.$refs['warinform'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`agent/desk/updateWarnNumber?token=${this.$cookie.get('token')}`),
              method: 'post',
              params: this.$http.adornParams({
                'warnNumber': this.warinform.counts,
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.warnFormVisible = false
                this.basicList[2].counts = (this.warinform.counts) / 10000
                this.$message.success('预警值修改成功!')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 添加邮箱
      addEmailBtn() {
        this.$refs['addemailruleForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
              method: 'post',
              params: this.$http.adornParams({
                'mail': this.addemailform.email,
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.addEmailVisible = false
                this.basicList[4].counts = this.addemailform.email
                this.$message.success('成功!')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 修改邮箱
      reEmailBtn() {
        this.$refs['reemailruleForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`agent/desk/updateMail?token=${this.$cookie.get('token')}`),
              method: 'post',
              params: this.$http.adornParams({
                'mail': this.reemailform.newemail,
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.reEmailVisible = false
                this.basicList[4].counts = this.reemailform.newemail
                this.$message.success('成功!')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 修改套餐
      editMeal() {
        this.editmealVisible = true;
        for (let i = 0; i < this.mealList.length; i++) {
          this.dat.count.push(this.mealList[i].number);
          this.dat.mealMoney.push(this.mealList[i].money)
          this.dat.name.push(this.mealList[i].packageName)
        }
      },
      // 提交修改套餐

      // 查看详情
      showDetails() {
        this.$router.push({ name: 'finance-myrecharge' })
      },

      // 获取基本信息
      getAgentDeskInfo() {
        this.$http({
          url: this.$http.adornUrl(`agent/desk/getAgentDeskInfo?token=${this.$cookie.get('token')}`),
          method: 'post',
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.basicList[0].counts = data.data.price
            this.basicList[1].counts = data.data.emptyBalance
            this.basicList[2].counts = data.data.emptyWarnNumber
            this.basicList[3].counts = data.data.mobile
            this.basicList[4].counts = data.data.email
            this.customMy[0].counts = data.data.creUserCount
            this.customMy[1].counts = data.data.rechargeSum
            this.customMy[2].counts = data.data.consumSum
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 充值记录
      myRechargeList() {
        this.$http({
          url: this.$http.adornUrl(`agent/finance/my/recharge/list?token=${this.$cookie.get('token')}`),
          method: 'get',
          params: this.$http.adornParams({
            'currentPage': 1,
            'pageSize': 5,
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.tableData = data.data.list
          } else {
            this.tableData = []
          }
        })
      },
      // 充值套餐
      findAgentPackage() {
        this.$http({
          url: this.$http.adornUrl(`agent/desk/findAgentPackage?token=${this.$cookie.get('token')}`),
          method: 'post',
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.mealList = data.data
            for (let i = 0; i < data.data.length; i++) {
              this.packageId.push(data.data[i].id)
            }
          } else {
            this.mealList = []
          }
        })
      },
      // 提交修改
      editmealChange() {
        for (let i = 0; i < this.dat.count.length; i++) {
          let activeSubjectsObject = {};
          for (let j = 0; j < this.dat.mealMoney.length; j++) {
            for (let m = 0; m < this.dat.name.length; m++) {
              for (let k = 0; k < this.packageId.length; k++) {
                if (i == j && j == k && i == k && i == m && j == m && k == m) {
                  activeSubjectsObject.id = Number(this.packageId[i]);
                  activeSubjectsObject.number = Number(this.dat.count[j]);
                  activeSubjectsObject.money = Number(this.dat.mealMoney[k]);
                  activeSubjectsObject.packageName = this.dat.name[k];
                  this.list.push(activeSubjectsObject);
                }
              }
            }
          }
        }
        this.$http({
          url: this.$http.adornUrl(`agent/desk/updateAgentPackage?token=${this.$cookie.get('token')}`),
          method: 'post',
          // data: this.$http.adornData(this.list)
          data: this.$http.adornData({
            'list': this.list,
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('套餐修改完成');
            this.editmealVisible = false;
            this.findAgentPackage();
            this.dat.count = [];
            this.dat.mealMoney = [];
            this.packageId = [];
            this.list = []
          } else {
            this.$message.error(data.msg);
          }
        })

      }

    }
  }

</script> -->

<!-- <style lang="scss">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #fff;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 340px;
    margin-bottom: 20px;
    padding: 10px 20px;
  }

  .grid-content h2 {
    display: inline-block;
    font-size: 20px;
    color: #333;
  }

  .el-table {
    min-height: 0px;
    font-size: 14px;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 0
  }

  .el-table td {
    padding: 10px 0;
    text-align: center
  }

  .el-table th {
    color: #666;
    font-weight: 400;
    text-align: center
  }

  .el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
  }

  .mealPackage li {
    width: 33%;
    float: left;
    text-align: center;
    >.moneyMeal {
      font-size: 24px;
      font-weight: 700;
      color: #666;
    }
    >p span {
      display: block;
    }
    .line {
      width: 20px;
      height: 3px;
      background-color: #4680ff;
      border-radius: 1px;
      margin: 5px auto 15px;
    }
  }

  .mealPackage li:nth-child(2) .line {
    background-color: #fd862e;
  }

  .mealPackage li:nth-child(3) .line {
    background-color: #08d8d8;
  }

  .mealPackage li:last-child {
    width: 48%;
    position: absolute;
    bottom: 0;
    right: 12px;
    text-align: left;
    padding-left: 20px;
    border-top: solid 1px #e5e5e5;
    >p {
      display: inline-block;
      .line {
        height: 0
      }
    }
    span.moneyMeal {
      font-size: 14px;
      color: #4680ff;
    }
  }

  .basic-mess {
    margin-left: -42px
  }

  .basic-mess li {
    float: left;
    width: 33%;
    margin-bottom: 10px;
    text-align: center
  }

  .basic-mess li:nth-child(3) input {
    color: #fd862e;
  }

  .basic-mess li:nth-child(4) input,
  .basic-mess li:nth-child(5) input {
    color: #666;
    font-size: 18px;
  }

  .basic-mess input {
    width: 100%;
    border: none;
    text-align: center;
    display: block;
    font-size: 24px;
    color: #4680ff;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .basic-mess button {
    outline: none;
    background-color: #fff;
    width: 48px;
    height: 24px;
    border: solid 1px #999999;
    color: #7b7b7b;
    font-size: 12px;
  }

  .basic-mess button.copyLink {
    width: 110px;
    height: 36px;
    border: none;
    margin-top: 50px;
    background-color: #4680ff;
    border-radius: 2px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }
  /* 二维码 */

  #qrcodeCon {
    width: 184px;
    height: 215px;
    border: solid 1px #e5e5e5;
    margin: 0 auto;
    position: relative;
    >button {
      width: 100%;
      height: 32px;
      background-color: #4680ff;
      border: none;
      color: #fff;
      position: absolute;
      bottom: 0
    }
  }

  .el-dialog__footer {
    padding: 10px 48px 20px;
  }

  #mealDialog .el-dialog {
    width: 32%;
  }

  .divInput {
    margin: 10px 42px 25px;
  }

  .mealinput {
    width: 110px;
    display: inline-block;
  }

  .mealinput input {
    width: 100%;
    height: 32px;
    text-indent: 0.5em;
  }

  #copyBtn {
    margin-left: -12px;
    height: 40px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #copyInput {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .basic-mess li button:hover {
    background-color: #4680FF;
    color: #fff;
    border-color: #4680FF;
    cursor: pointer
  }
</style> -->