<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h2>嗨！{{ userName }}</h2>
          <ul class="cf basic-mess">
            <li v-for="(item,index) in basicList" :key="index">
              <p>{{item.title}}</p>
              <input type="text" v-model="item.counts" :value="item.counts" readonly>
              <button v-show="item.flag" @click="basicBtn(index,item.counts)">{{item.title === '邮箱' && item.counts ===
                '' || item.counts === null ? '添加' : item.btnText}}</button>
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
          <ul class="customerList">
            <li v-for="(item,index) in customMy" :key="index">
              <p>{{item.title}}</p>
              <p>{{item.counts}}</p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12" style="position: relative;">
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
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h2>注册赠送</h2>
          <div class="giveCounts">
            <span>自动赠送</span>
            <el-switch v-model="giveSwitch" @change="checkSwitch"></el-switch>
            <span>（关闭后，系统将不会自动赠送5000条）</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12" v-if="myReject">
        <div class="grid-content bg-purple">
          <h2>我的待办</h2>
          <div style="margin:20px;line-height:35px;" class="cf">
            <span style="float:left">你的设置已被管理员驳回</span>
            <el-button type="primary" style="float:right;background-color:#4680ff;" @click="rejectRet()">重新设置</el-button>
          </div>
          <div style="margin:20px">
            <span>驳回原因：</span>
            <span style="line-height:25px" id="remarkCon">{{remarksCon}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 驳回弹出框 -->
    <el-dialog title="提示" :visible.sync="rejectDialogVisible" width="30%">
      <span>您的设置被管理员驳回，请联系管理员或重新设置并提交。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">稍后再说</el-button>
        <el-button type="primary" @click="rejectRet()">前往设置</el-button>
      </span>
    </el-dialog>

    <!-- 充值弹框-->
    <el-dialog title="充值" :visible.sync="chdataFormVisible" @close='closeDialog' :close-on-click-modal="false">
      <el-form :model="chdataForm" ref="chdataFormref" :rules="chdataFormrefRule" label-width="100px">
        <el-form-item label="充值单价">
          <el-input style="border:none" v-model="chdataForm.chPrice" placeholder="" readonly id="chprice"></el-input>
          <span>元/条</span>
        </el-form-item>
        <el-form-item label="充值金额" prop="chMoney">
          <!-- <el-input v-model.number="chdataForm.chMoney" placeholder="请输入整数，最低充值金额1万元……" @keyup.native="proving1"></el-input> -->
          <el-input v-model.number="chdataForm.chMoney" placeholder="请输入整数，最低充值金额1万元……"></el-input>
          <span>万元</span>
        </el-form-item>
        <el-form-item label="充值条数">
          <el-input v-model.number="chdataForm.chCounts" placeholder="请输入充值条数" ref="inputVal" readonly></el-input>
          <span>万条</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="chdataForm.remark" placeholder="请输入备注..."></el-input>
        </el-form-item>
      </el-form>
      <div id="qrcodeCon">
        <div id="qrcode">
        </div>
        <button>请打开支付宝扫描二维码</button>
      </div>
    </el-dialog>
    <!-- 预警值弹窗 -->
    <el-dialog title="预警值" :visible.sync="warnFormVisible">
      <el-form :model="warinform" :rules="warnRule" ref="warinform">
        <el-form-item label="当前预警值">
          <el-input v-model="warinform.curcounts" id="curCount" readonly></el-input>
          <span>万条</span>
        </el-form-item>
        <el-form-item label="修改预警值" prop="counts">
          <el-input v-model="warinform.counts" style="width:70%"></el-input>
          <span>万条</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="warnFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="warnFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改套餐 -->
    <el-dialog title="套餐修改" :visible.sync="editmealVisible" id="mealDialog" width="460px">
      <div>
        <div class="divInput" v-for="(item,i) in mealList" :key="i">
          <span class="label" style="width:90px;display:inline-block;text-align: right;margin-right: 5px">{{item.packageName}}：</span>
          <div class="mealinput">
            <input type="text" v-if="i == '3'" v-model="dat.mealMoney[i]" id="customValue" oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
            <input type="text" v-else v-model="dat.mealMoney[i]" oninput="value=value.replace(/[^\d]/g,'')">
          </div>
          <span>元</span>
          <div class="mealinput" style="width: 40px;">
            <input type="text" v-if="i == '3'" v-model="dat.count[i]" style="border:none;text-align: center;" readonly>
            <input type="text" v-else v-model="dat.count[i]" style="border:none;text-align: center" readonly>
          </div>
          <span class="label" v-if="i == '3'">条</span>
          <span class="label" v-else>万条</span>
        </div>
        <p style="margin-left: 40px">注意：
          <p style="margin-left: 80px;margin-top: -37px">1. 充值单价不得低于<span style="color:red">0.001</span>元/条；</p>
          <p style="margin-left: 80px;line-height:2px">2.套餐价格必须为正整数。</p>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editmealChange()">修改套餐</el-button>
      </span>
    </el-dialog>
    <!-- 复制链接 -->
    <el-dialog title="复制推广链接" :visible.sync="copyVisible" width="30%">
      <el-input v-model="copyinput" id="copyInput"></el-input>
      <el-button type="primary" id="copyBtn" v-clipboard:copy="copyinput" v-clipboard:success="onCopy"
        v-clipboard:error="onError">复制链接</el-button>
    </el-dialog>

    <!-- 添加邮箱 -->
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
    <!-- 更改邮箱 -->
    <el-dialog title="重新绑定邮箱" :visible.sync="reEmailVisible">
      <el-form :model="reemailform" :rules="reemailrules" ref="reemailruleForm">
        <el-form-item label="原邮箱">
          <el-input v-model="reemailform.oldemail" id="emailInput" readonly></el-input>
        </el-form-item>
        <el-form-item label="新邮箱" prop="newemail">
          <el-input v-model="reemailform.newemail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="reEmailBtn()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 重新绑定手机号 -->
    <re-bind-phone v-if="reBindVisible" ref="reBindPhoneCon" @refreshDataList="getAgentDeskInfo"></re-bind-phone>
    <!-- 修改密码 -->
    <update-password v-if="updatePwdVisible" ref="updatePwdCon"></update-password>
  </div>
</template>

<script>
  import reBindPhone from './re-bind-phone'
  import UpdatePassword from '../../main-navbar-update-password'
  import QRCode from 'qrcodejs2'
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
        remarksCon: '',
        giveSwitch: true,
        myReject: false,  //我的代办
        updatePwdVisible: false,
        rejectDialogVisible: false,
        copyinput: '',
        time: null,
        payUrl: '',
        orderNo: '',
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
          { title: '客户充值总计（元）', counts: '' },
          { title: '客户消费条数（条）', counts: '' },
          { title: '充值总条数（条）', counts: '' }
        ],
        basicList: [ //基本信息
          { title: '我的代理价（元/条）', counts: '', btnText: '', flag: false },
          { title: '我的余额（万条）', counts: '', btnText: '充值', flag: false },
          { title: '预警值（万条）', counts: '', btnText: '修改', flag: true },
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
          chPrice: '',
          chCounts: '',
          chMoney: '',
          remark: ''
        },
        chdataFormrefRule: {
          chMoney: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
            { type: 'number', message: '金额必须为正整数' }
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
      reBindPhone,
      UpdatePassword
    },
    watch: {
      'chdataForm.chMoney'() {
        let reg = /^[1-9]\d*$/;
        if (!reg.test(this.chdataForm.chMoney)) {
          let moneyType = (this.chdataForm.chMoney).toString()
          this.chdataForm.chMoney = moneyType.replace(/[^0-9]*/g, '').replace(/\b(0+)/gi, "")
          return true;
        }
        if (this.chdataForm.chMoney !== "" && this.chdataForm.chPrice !== "" && this.chdataForm.chMoney !== 0) {
          this.chdataForm.chCounts = Math.ceil((Number(this.chdataForm.chMoney) / (this.chdataForm.chPrice)) * 10000) / 10000
          // console.log('获取充值二维码')
          document.getElementById('qrcode').innerHTML = "";
          // let time = null
          // console.log(33333333)
          let that = this
          this.$http({
            url: this.$http.adornUrl(`agent/fund/recharge?token=${this.$cookie.get('token')}`),
            method: 'post',
            params: this.$http.adornParams({
              'price': this.chdataForm.chPrice,
              'number': this.chdataForm.chCounts,
              'money': this.chdataForm.chMoney,
              'remark': this.chdataForm.remark
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              document.getElementById('qrcode').innerHTML = "";
              this.getQrcode()
              this.payUrl = data.data.payUrl
              this.orderNo = data.data.orderNo
              clearInterval(this.time);

              this.time = setInterval(() => {
                this.$http({
                  url: this.$http.adornUrl(`agent/fund/findOrderStatus?token=${that.$cookie.get('token')}`),
                  method: 'post',
                  params: this.$http.adornParams({
                    'orderNo': this.orderNo,
                  })
                }).then(({ data }) => {
                  if (data && data.code === 0) {
                    if (data.data.orderStatus == "Success") {
                      this.$nextTick(() => {
                        this.$message.success('充值成功')
                        this.chdataFormVisible = false
                        this.closeDialog()
                        this.getAgentDeskInfo()
                      })
                    } else if (data.data.orderStatus == "Fail") {
                      this.closeDialog()
                      this.$message.error('充值失败，请重新充值!')
                    }
                  }
                })
              }, 10000);
            } else {
              document.getElementById('qrcode').innerHTML = "";
              this.$message.error(data.msg)
            }
          })
        } else {
          this.chdataForm.chCounts = ""
          document.getElementById('qrcode').innerHTML = '';
        }
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
        this.findAgentPackage(),
        this.rejectVisibie(),
        this.remarkDialog(),
        this.updatePwd()
    },
    // created: function () {
    //   // `this` 指向 vm 实例
    //   console.log(QRCode)

    // },
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
            let mobile = this.basicList[3].counts
            this.$refs.reBindPhoneCon.showInit(mobile)
          })
        } else if (arrindex == 4) {
          if (btnCount == "" || btnCount == null) {
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

      rejectVisibie() {
        if ((sessionStorage.getItem('isExamine')) && (sessionStorage.getItem('isExamine') == 'reject')) {
          this.myReject = false
        } else {
          this.myReject = true
        }
      },

      // 弹出框
      remarkDialog() {
        if ((sessionStorage.getItem('remarkDialog')) && (sessionStorage.getItem('remarkDialog') == 'remarkDialogTr')) {
          this.rejectDialogVisible = true
          sessionStorage.setItem('remarkDialog', '')
        } else {
          this.rejectDialogVisible = false
          sessionStorage.setItem('remarkDialog', '')
        }
      },
      // 修改密码
      updatePwd() {
        if (sessionStorage.getItem('isFirstLogin') && (sessionStorage.getItem('isFirstLogin')) == 'true') {  //没修改过
          this.updatePwdVisible = true
          this.$nextTick(() => {
            this.$refs.updatePwdCon.init()
          })
          sessionStorage.removeItem('isFirstLogin')
        } else {
          this.updatePwdVisible = false
          sessionStorage.removeItem('isFirstLogin')
        }
      },
      // 必须输入正整数
      // proving1() {
      //   // let moneyType = (this.chdataForm.chMoney).toString()
      //   // this.chdataForm.chMoney = moneyType.replace(/[^0-9]*/g, '').replace(/\b(0+)/gi, "")

      //   // this.chdataForm.chMoney = Number(moneyType.replace(/[^\.\d]/g, ''));
      //   // this.chdataForm.chMoney = Number(moneyType.replace('.', ''));
      //   // if (this.chdataForm.chMoney == 0) {
      //   //   this.chdataForm.chMoney = ""
      //   // }
      // },
      getQrcode() {
        this.$nextTick(() => {
          let qrcode = new QRCode('qrcode', {
            width: 160,
            height: 160, // 高度
          })
          qrcode.clear(); // 清除二维码
          qrcode.makeCode(this.payUrl);
        })
      },
      closeDialog() {
        document.getElementById('qrcode').innerHTML = "";
        this.chdataForm.chCounts = ""
        if (this.time) {
          clearInterval(this.time);
        }
        //  
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
                this.basicList[2].counts = (this.warinform.counts)
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
        this.dat.count = []
        this.dat.mealMoney = []
        this.dat.name = []
        for (let i = 0; i < this.mealList.length; i++) {
          this.dat.count.push(this.mealList[i].number);
          this.dat.mealMoney.push(this.mealList[i].money)
          this.dat.name.push(this.mealList[i].packageName)
        }
      },


      // 驳回,重新设置
      rejectRet() {
        this.rejectDialogVisible = false
        this.$router.push({ name: 'user-selfsetting' })
      },

      // 提交修改套餐

      // 查看详情
      showDetails() {
        this.$router.push({ name: 'finance-myrecharge' })
      },

      // 获取基本信息
      getAgentDeskInfo() {
        this.remarksCon = sessionStorage.getItem('remarkCon')
        this.$http({
          url: this.$http.adornUrl(`agent/desk/getAgentDeskInfo?token=${this.$cookie.get('token')}`),
          method: 'post',
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // 0不自动赠送，1自动赠送
            if (data.data.autoPresentCfg == 1) {
              this.giveSwitch = true
            } else if (data.data.autoPresentCfg == 0) {
              this.giveSwitch = false
            }
            this.copyinput = data.data.referralLink
            this.chdataForm.chPrice = data.data.price
            this.basicList[0].counts = data.data.price
            this.basicList[1].counts = data.data.emptyBalance
            this.basicList[2].counts = data.data.emptyWarnNumber
            this.basicList[3].counts = data.data.mobile
            this.basicList[4].counts = data.data.email
            this.customMy[0].counts = data.data.creUserCount
            this.customMy[1].counts = data.data.rechargeSum
            this.customMy[2].counts = data.data.consumSum
            this.customMy[3].counts = data.data.rechargeNumberSum
          } else {
            this.$message.error(data.msg)
          }
        })
      },

      //  控制赠送开关
      checkSwitch(val) {
        //0不自动赠送，1自动赠送
        this.$http({
          url: this.$http.adornUrl(`/agent/desk/updateAutoPresentCfg?token=${this.$cookie.get('token')}`),
          method: 'post',
          params: this.$http.adornParams({
            'autoPresentCfg': val == true ? 1 : 0,
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('成功');
          } else {
            this.$message.error('失败');
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

        //设置最小自定义充值
        var min = 0.001;
        var customVal = document.getElementById('customValue').value;
        if (customVal < min) {
          this.$message.error('自定义充值单价不得低于0.001元/条');
          return
        }
        //设置计算出的单价
        var packListCount = this.dat.count;//条数
        var packListMoney = this.dat.mealMoney //钱
        for (var i = 0; i < 3; i++) {
          // console.log((packListMoney[i] / packListCount[i]))
          if ((packListMoney[i] / packListCount[i]) < 10) {
            if (i == 0) {
              this.$message.error('套餐A的充值单价不得低于0.001元/条');
            } else if (i == 1) {
              this.$message.error('套餐B的充值单价不得低于0.001元/条');
            } else if (i == 2) {
              this.$message.error('套餐C的充值单价不得低于0.001元/条');
            }

            return;
          }
        }

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
            this.list = []
            this.$message.error(data.msg);
          }
        })
      }
    }
  }

</script>

<style lang="scss">
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
    width: 95%;
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
    text-align: center;
    word-break: break-all;
    word-wrap: break-word;
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

  #qrcode {
    padding: 10px
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

  .giveCounts {
    margin-top: 20px;
    margin-left: 60px
  }

  .giveCounts span {
    font-size: 16px;
    margin: 10px;
  }
</style>