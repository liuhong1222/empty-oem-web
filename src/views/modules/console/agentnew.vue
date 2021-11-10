<template>
    <div class="main">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <h2>嗨！{{ userName }}</h2>
                    <ul class="cf basic-mess">
                        <li v-for="(item, index) in basicList" :key="index">
                            <p>{{item.title}}</p>
                            <input type="text" v-model="item.counts" :value="item.counts" readonly>
                            <button v-show="item.flag" @click="handleOneCardClick(index, item)">
                                {{ item.title === '邮箱' && (deskInfo[item.field] === '' || !deskInfo[item.field]) ? '添加' : item.btnText }}
                            </button>
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
                    <el-table :data="rechargeRecordData" style="width: 100%" :highlight-current-row="true">
                        <el-table-column prop="categary" label="充值产品">
                        </el-table-column>
                        <el-table-column prop="payTime" label="充值时间">
                        </el-table-column>
                        <el-table-column prop="money" label="充值金额">
                        </el-table-column>
                        <el-table-column prop="number" label="充值条数">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <!-- 复制链接弹窗 -->
        <el-dialog title="复制推广链接" :visible.sync="copyVisible" width="30%">
        <el-input v-model="copyinput" id="copyInput"></el-input>
        <el-button type="primary" id="copyBtn" v-clipboard:copy="copyinput" v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制链接</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'AgentDesk',

    data() {
        return {
            basicList: [ // 基本信息
                { title: '空号代理价（元/条）', field: 'emptyPrice', btnText: '', flag: false },
                { title: '空号余额（万条）', field: 'emptyMoney', btnText: '充值', flag: true },
                { title: '空号预警值（万条）', field: 'emptyCount', btnText: '修改', flag: true },
                { title: '实时代理价（元/条）', field: 'realPrice', btnText: '', flag: false },
                { title: '实时余额（万条）', field: 'realMoney', btnText: '充值', flag: true },
                { title: '实时预警值（万条）', field: 'realCount', btnText: '修改', flag: true },
                { title: '手机号', field: 'phone', btnText: '更改', flag: true },
                { title: '邮箱', field: 'email', btnText: '更改', flag: true }
            ],
            deskInfo: {},
            rechargeRecordData: [],

            // 复制链接弹窗
            copyVisible: false,
        };
    },
    activated() {
        this.getAgentDeskInfo()
        this.myRechargeList()
    },
    methods: {
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
                sessionStorage.setItem('agentInfo', this.$json.stringify(data.data.agentInfo || '{}'))
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
        handleOneCardClick(index, record) {
            switch (index) {
                case 4:
                case 1: { // 余额充值
                    break;
                }
                case 5:
                case 2: { // 预警值修改
                    break;
                }
                case 6: { // 修改手机号
                    break;
                }
                case 7: { // 修改邮箱
                    break;
                }
                default:
                    break;
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
    },
};
</script>

<style lang="scss" scoped>

</style>
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