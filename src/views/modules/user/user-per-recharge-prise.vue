<template>
    <el-dialog title="充值" :visible.sync="chargeVisible" width="600px">
        <el-form :model="rechargeDataForm" :rules="rechargerules" ref="rechargeRef" label-width="150px" :label-position="labelPosition">
            <el-form-item label="手机号：" prop="userName">
                <el-input v-model="rechargeDataForm.userName" placeholder="手机号" id="mobile" readonly></el-input>
            </el-form-item>
            <el-form-item label="套餐选择：" prop="packageList">
                <el-select v-model="rechargeDataForm.packageList" placeholder="请选择套餐" @change="selectT()">
                    <el-option :value="item.id" :label="item.package_name" v-for="(item,index) in rechargeArr" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input v-model="rechargeDataForm.price" placeholder="单价" :readonly="readPrice"></el-input>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="充值金额：" prop="rechargeMoney">
                <el-input v-model.number="rechargeDataForm.rechargeMoney" placeholder="输入金额，计算出条数" :readonly="readMoney"></el-input>
                <span>元</span>
            </el-form-item>
            <el-form-item label="充值条数：" prop="rechargeCounts">
                <el-input v-model="rechargeDataForm.rechargeCounts" placeholder="充值条数" :readonly="readCounts"></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="我的余额：" prop="myCounts">
                <el-input v-model="rechargeDataForm.myCounts" placeholder="我的余额" id="myCounts" readonly></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="充值方式：" prop="rechargeMethod">
                <el-select v-model="rechargeDataForm.rechargeMethod" placeholder="请选择充值方式">
                    <el-option label="对公转账" value="0"></el-option>
                    <el-option label="赠送" value="3"></el-option>
                    <el-option label="对公支付宝转账" value="4"></el-option>
                    <el-option label="对私支付宝" value="5"></el-option>
                    <el-option label="对私微信" value="6"></el-option>
                    <el-option label="对私转账" value="7"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="rechargeDesc">
                <el-input type="textarea" v-model="rechargeDataForm.rechargeDesc" placeholder="备注"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="chargeVisible = false">取 消</el-button>
            <el-button type="primary" @click="rechargeDataSubmit" :disabled="disabled">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                readPrice: true,
                readCounts: true,
                readMoney: true,
                chargeVisible: false,
                disabled: false,
                labelPosition: 'right',
                rechargeArr: [],
                number: 0,
                rechargeDataForm: {
                    creUserId: '',
                    userName: '',
                    packageList: '',
                    price: '',
                    rechargeCounts: '',
                    rechargeMoney: '',
                    myCounts: '',
                    rechargeMethod: '',
                    rechargeDesc: '',
                },
                rechargerules: {
                    userName: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ],
                    packageList: [
                        { required: true, message: '请选择套餐', trigger: 'blur' },
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' },
                    ],
                    rechargeCounts: [
                        { required: true, message: '请输入充值金额，自动算出条数', trigger: 'blur' },
                    ],
                    rechargeMoney: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' },
                        { type: 'number', message: '金额必须为数字' }
                    ],
                    myCounts: [
                        { required: true, message: '请输我的余额', trigger: 'blur' },
                    ],
                    rechargeMethod: [
                        { required: true, message: '请选择充值方式', trigger: 'blur' },
                    ]
                }
            }
        },
        watch: {
            'rechargeDataForm.rechargeMoney'() {

                if (this.number == 1) {   //number为1才进行监控自动计算

                    if (this.rechargeDataForm.rechargeMoney !== "" && this.rechargeDataForm.price !== "") {
                        this.rechargeDataForm.rechargeCounts = Math.ceil(Number(this.rechargeDataForm.rechargeMoney) / (this.rechargeDataForm.price));
                    } else {
                        this.rechargeDataForm.rechargeCounts = ""
                    }
                }
            }
        },
        methods: {
            packagePro() {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/getPackageInfo?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        'creUserId': this.rechargeDataForm.creUserId,
                        'custName': this.rechargeDataForm.userName
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.rechargeArr = data.data
                        this.rechargeDataForm.userName = data.custName
                        this.rechargeDataForm.myCounts = data.amount

                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            rechargeInit(arr) {
                // console.log(arr[0])  //id
                // console.log(arr[1])  //个人 （0，null） 还是企业（1）
                // console.log(arr[2])  //creUserId
                this.rechargeDataForm.creUserId = arr[2]
                this.rechargeDataForm.userName = arr[3]
                // console.log(arr[3]) 
                if (arr[1] == 0 || arr[1] == null) {  //个人
                    this.chargeVisible = true
                    this.packagePro()
                    this.$nextTick(() => {
                        this.$refs['rechargeRef'].resetFields()
                    })
                } else { //企业
                    this.chargeVisible = true
                    this.priseurl = this.$http.adornUrl(`agent/agentInfo/license/upload?token=${this.$cookie.get('token')}`)
                    this.packagePro()
                    this.$nextTick(() => {
                        this.$refs['rechargeRef'].resetFields()
                    })
                }
            },
            // 点击套餐出信息
            selectT() {
                // console.log(this.rechargeDataForm.packageList)
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/getPackageInfoById?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'id': this.rechargeDataForm.packageList
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        // console.log(this.rechargeDataForm.packageList)
                        if (data.data.number == 1) {
                            this.readPrice = false;
                            this.readCounts = false;
                            this.readMoney = false;
                            this.rechargeDataForm.price = data.data.price
                            this.rechargeDataForm.rechargeCounts = ""
                            this.rechargeDataForm.rechargeMoney = ""
                            this.number = 1
                        } else {
                            this.readPrice = true;
                            this.readCounts = true;
                            this.readMoney = true;
                            this.rechargeDataForm.price = data.data.price
                            this.rechargeDataForm.rechargeCounts = data.data.number
                            this.rechargeDataForm.rechargeMoney = data.data.money
                            this.number = 0
                        }
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },

            // 提价充值
            rechargeDataSubmit() {
                this.$refs['rechargeRef'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认要充值吗？')
                            .then(_ => {
                                this.regSubmit()
                            })
                            .catch(_ => { })
                    }
                })
            },
            regSubmit() {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/recharge?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'agentPackageId': this.rechargeDataForm.packageList,
                        'creUserId': this.rechargeDataForm.creUserId,
                        'number': this.rechargeDataForm.rechargeCounts,
                        'amount': this.rechargeDataForm.rechargeMoney,
                        'payType': this.rechargeDataForm.rechargeMethod,
                        'remark': this.rechargeDataForm.rechargeDesc
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.disabled = true
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.chargeVisible = false
                                this.disabled = false
                                this.rechargeDataForm.rechargeDesc = ""
                                this.$emit('refreshDataList')
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
        }
    }

</script>
<style>
    #mobile,
    #myCounts {
        border: none
    }
</style>