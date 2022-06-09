<template>
    <el-dialog title="充值" :visible.sync="chargeVisible" width="600px">
        <el-form :model="rechargeDataForm" :rules="rechargerules" ref="rechargeRef" label-width="150px" :label-position="labelPosition">
            <el-form-item label="手机号：" prop="userName">
                <el-input v-model="rechargeDataForm.userName" placeholder="手机号" id="mobile" readonly></el-input>
            </el-form-item>
            <el-form-item label="产品名称：" prop="category">
                <el-radio-group v-model="rechargeDataForm.category">
                    <el-radio :label="0">空号检测</el-radio>
                    <el-radio :label="1">实时检测</el-radio>
                    <el-radio :label="2">国际检测</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="套餐选择：" prop="packageList">
                <el-select style="width: 100%;" v-model="rechargeDataForm.packageList" placeholder="请选择套餐" @change="selectT">
                    <el-option :value="item.id + ''" :label="item.name" v-for="(item,index) in rechargeArr" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价：" prop="price">
                <el-input-number v-model="rechargeDataForm.price" :disabled="readPrice" :min="0"></el-input-number>
                <span>元/条</span>
            </el-form-item>
            <el-form-item label="充值金额：" prop="rechargeMoney">
                <el-input-number v-model="rechargeDataForm.rechargeMoney" :disabled="readMoney" :min="0"></el-input-number>
                <span>元</span>
            </el-form-item>
            <el-form-item label="充值条数：" prop="rechargeCounts">
                <el-input-number v-model="rechargeDataForm.rechargeCounts" :disabled="readCounts" :min="0"></el-input-number>
                <span>条</span>
            </el-form-item>
            <el-form-item label="客户余额：" prop="myCounts">
                <el-input style="width: 90%; margin-right: 8px;" v-model="rechargeDataForm.myCounts" placeholder="客户余额" id="myCounts" disabled></el-input>
                <span>条</span>
            </el-form-item>
            <el-form-item label="充值方式：" prop="rechargeMethod">
                <el-select style="width: 100%;" v-model="rechargeDataForm.rechargeMethod" placeholder="请选择充值方式">
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
            <el-button type="primary" @click="rechargeDataSubmit" :loading="submitLoading">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            const validateContainDot = (rule, value, callback) => {
                if (value && (value + '').indexOf('.') !== -1) {
                    callback(new Error('不可为小数'))
                } else if (!value && value !== 0) {
                    callback('请输入充值金额，自动算出条数')
                } else {
                    callback()
                }
            }
            return {
                readPrice: true,
                readCounts: true,
                readMoney: true,
                chargeVisible: false,
                disabled: false,
                submitLoading: false,
                labelPosition: 'right',
                rechargeArr: [],
                mealType: 0, // 0 普通套餐 1 自定义套餐
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
                    category: 0
                },
                rechargerules: {
                    userName: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ],
                    category: [
                        { required: true, message: '请选择充值产品', trigger: 'blur' },
                    ],
                    packageList: [
                        { required: true, message: '请选择套餐', trigger: 'blur' },
                    ],
                    price: [
                        { required: true, message: '请输入单价', trigger: 'blur' },
                    ],
                    rechargeCounts: [
                        { required: true, message: '请输入充值金额，自动算出条数', trigger: 'change' },
                        { validator: validateContainDot, trigger: 'change' }
                    ],
                    rechargeMoney: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' },
                        { type: 'number', message: '金额必须为数字' }
                    ],
                    myCounts: [
                        { required: true, message: '请输客户余额', trigger: 'blur' },
                    ],
                    rechargeMethod: [
                        { required: true, message: '请选择充值方式', trigger: 'blur' },
                    ]
                },
                isAdmin: false,
            }
        },
        watch: {
            'rechargeDataForm.rechargeMoney'() {
                if (this.mealType == 1) {   // mealType 为 1 才进行监控自动计算
                    if (this.rechargeDataForm.rechargeMoney && this.rechargeDataForm.price) {
                        this.rechargeDataForm.rechargeCounts = Math.ceil(Number(this.rechargeDataForm.rechargeMoney) / (this.rechargeDataForm.price));
                    } else {
                        this.rechargeDataForm.rechargeCounts = undefined
                    }
                }
            },
            'rechargeDataForm.price'() {
                if (this.mealType == 1) {   // mealType 为 1 才进行监控自动计算
                    if (this.rechargeDataForm.rechargeMoney && this.rechargeDataForm.price) {
                        this.rechargeDataForm.rechargeCounts = Math.ceil(Number(this.rechargeDataForm.rechargeMoney) / (this.rechargeDataForm.price));
                    } else {
                        this.rechargeDataForm.rechargeCounts = undefined
                    }
                }
            },
            'rechargeDataForm.category' () {
                this.rechargeDataForm.packageList = undefined
                this.rechargeDataForm.price = undefined
                this.rechargeDataForm.rechargeCounts = undefined
                this.rechargeDataForm.rechargeMoney = undefined
                this.packagePro()
            }
        },
        methods: {
            packagePro() {
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/getPackageInfo?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({
                        // 'agentId': this.isAdmin ? 
                        'custId': this.rechargeDataForm.creUserId,
                        'category': this.rechargeDataForm.category
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        const { goodsList, emptyBalance, realtimeBalance } = data.data || {}
                        this.rechargeArr = goodsList || []
                        // todoNew 调整 category 的判断
                        this.rechargeDataForm = {
                            ...this.rechargeDataForm,
                            myCounts: this.rechargeDataForm.category === 0 ? emptyBalance : realtimeBalance
                        }
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            rechargeInit(record) {
                // msjRoleName 1：管理员 2：代理商
                this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
                this.chargeVisible = true
                this.submitLoading = false
                this.$nextTick(() => {
                    this.$refs['rechargeRef'].resetFields()
                    this.rechargeDataForm = {
                        creUserId: record.customerId + '',
                        userName: record.phone,
                        category: 0
                    }
                    this.packagePro()
                })
                // this.rechargeDataForm = {
                //     creUserId: record.customerId,
                //     userName: record.name,
                //     category: 0
                // }
                // this.packagePro()
                if (record.customerType === '企业') {
                    this.priseurl = this.$http.adornUrl(`agent/agentInfo/license/upload?token=${this.$cookie.get('token')}`)
                }
            },
            // 点击套餐出信息
            selectT() {
                this.$http({
                    url: this.$http.adornUrl(`agent/goods/info/${this.rechargeDataForm.packageList}?token=${this.$cookie.get('token')}`),
                    method: 'get',
                    params: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        if (data.data.type == 1) {
                            this.readPrice = false;
                            this.readCounts = false;
                            this.readMoney = false;
                            this.rechargeDataForm.price = data.data.unitPrice
                            this.rechargeDataForm.rechargeCounts = undefined
                            this.rechargeDataForm.rechargeMoney = undefined
                            this.mealType = 1
                        } else {
                            this.readPrice = true;
                            this.readCounts = true;
                            this.readMoney = true;
                            this.rechargeDataForm.price = data.data.unitPrice
                            this.rechargeDataForm.rechargeCounts = data.data.specifications
                            this.rechargeDataForm.rechargeMoney = data.data.price
                            this.mealType = 0
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
                this.submitLoading = true
                this.$http({
                    url: this.$http.adornUrl(`agent/cust/recharge`),
                    method: 'post',
                    data: {
                        token: this.$cookie.get('token'),
                        'goodsId': this.rechargeDataForm.packageList,
                        'category': this.rechargeDataForm.category,
                        'custId': this.rechargeDataForm.creUserId,
                        'price': this.rechargeDataForm.price,
                        'number': this.rechargeDataForm.rechargeCounts,
                        'amount': this.rechargeDataForm.rechargeMoney,
                        'payType': this.rechargeDataForm.rechargeMethod,
                        'remark': this.rechargeDataForm.rechargeDesc
                    }
                }).then(({ data }) => {
                    this.submitLoading = false
                    if (data && data.code === 0) {
                        this.chargeVisible = false
                        this.$emit('refreshDataList')
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500
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