<template>
    <el-dialog title="发布消息" :close-on-click-modal="false" :visible.sync="releaseVisible" class="el-dialog-enter" width="640px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="消息标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="消息类别" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择消息类别">
                    <el-option label="系统消息" value="1"></el-option>
                    <el-option label="更新通知" value="4"></el-option>
                    <el-option label="活动通知" value="2"></el-option>
                    <el-option label="故障通知" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送对象" prop="object">
                <el-radio-group v-model="ruleForm.object">
                    <el-radio @click.native.prevent="clickitem(0)" :label="0">所有客户</el-radio>
                    <el-radio @click.native.prevent="clickitem(1)" :label="1">选择客户</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="消息内容" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" :rows="20"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交发布申请</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 选择客户弹窗 -->
        <!-- v-on:childByValue  子给父传值 -->
        <select-user v-if="selectUserVisible" ref="selectUserRef" v-on:childByValue="childByValue" v-bind:param="messageList"></select-user>
    </el-dialog>
</template>
<script>
    import selectUser from '../../sys/mess-select-user'
    export default {
        data() {
            return {
                releaseVisible: false,
                selectUserVisible: false,
                childValues: "",
                messageList: [],
                ruleForm: {
                    name: '',
                    type: '',
                    object: '',
                    desc: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入消息标题', trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请选择消息类别', trigger: 'change' }
                    ],
                    object: [
                        { required: true, message: '请选择发送对象', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请填写消息内容', trigger: 'blur' }
                    ]
                }
            }
        },
        components: {
            selectUser
        },
        methods: {
            releaseShowInit() {
                this.releaseVisible = true
                this.$nextTick(() => {
                    this.$refs['ruleForm'].resetFields();
                })
            },
            clickitem(e) {
                if (e == 1) {
                    e === this.ruleForm.object ? this.ruleForm.object = e : this.ruleForm.object = e

                    this.selectUserVisible = true
                    this.$nextTick(() => {
                        this.$refs.selectUserRef.showInit()
                    })
                }
                if (e == 0) {
                    e === this.ruleForm.object ? this.ruleForm.object = '' : this.ruleForm.object = e
                    this.childValues = ""
                }
            },

            childByValue(childValue) {
                this.childValues = childValue
                this.messageList = childValue
            },
            submitForm(formName) {
                console.log(this.childValues)  //选定的手机号
                console.log(this.ruleForm.object)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.childValues == "" && this.ruleForm.object == 2) {
                            this.$message.warning('选择的客户为空，请选择客户或者选择所有客户！')
                            return
                        }
                        this.$confirm('确认要发布吗？')
                            .then(_ => {
                                this.message()
                            })
                            .catch(_ => { })
                    }
                });
            },
            message() {

                this.$http({
                    url: this.$http.adornUrl(`agent/message/addMessage?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({
                        'type': this.ruleForm.type,
                        'selectType': this.ruleForm.object,
                        'userIdList': JSON.stringify(this.childValues),
                        'title': this.ruleForm.name,
                        'message': this.ruleForm.desc
                    })
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.$message.success('消息已提交审核!')
                        this.messageList = []
                        this.childValues = []
                        this.$nextTick(() => {
                            this.$refs['ruleForm'].resetFields();
                            this.releaseVisible = false
                            this.$emit('releaseRefreshDataList')
                        })
                        // 清空选定的用户
                    } else {
                        this.$message.error(data.msg)
                        this.messageList = []
                        this.childValues = []
                        this.$nextTick(() => {
                            this.$refs['ruleForm'].resetFields();
                        })

                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>