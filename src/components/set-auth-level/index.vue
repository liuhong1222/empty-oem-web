<template>
    <el-dialog :title="'设置用户认证等级'" width="520px" :visible.sync="authLevelVisible">
        <el-form :model="authLevelform" :rules="authLevelRule" ref="authLevelform">
            <el-form-item label-width="130px" label="用户认证等级：" prop="authLevel">
                <el-select style="width: 100%;" v-model="authLevelform.authLevel" placeholder="请选择用户认证等级">
                    <el-option v-for="item in authLevelList" :label="item.label" :key="item.value" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <ul class="auth-level-tip">
                <li>等级说明：</li>
                <li>* 一：不用认证就可直接检测</li>
                <li>* 二：付费前不用认证，用户付费7天后提醒认证，用户可以跳过认证，提交检测，如果不认证每次提醒</li>
                <li>* 三：注册就需要认证，不认证不允许检测</li>
            </ul>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="authLevelVisible = false">取 消</el-button>
            <el-button type="primary" @click="authLevelFormSubmit()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'SetAuthLevel',
    data() {
        return {
            authLevelList: [],
            authLevelVisible: false,
            authLevelform: {
                authLevel: undefined
            },
            authLevelRule: {
                authLevel: [
                    { required: true, message: '请选择用户认证等级', trigger: 'blur' },
                ],
            },
            baseData: {},
            isAdmin: false,
        };
    },
    methods: {
        init(record) {
            let defalutAuthLevelList = [
                { label: '等级一', value: 1 },
                { label: '等级二', value: 2 },
                { label: '等级三', value: 3 },
            ];
            this.baseData = record
            this.authLevelVisible = true;
            this.$nextTick(() => {
                this.$refs['authLevelform'].resetFields();
            })
            // msjRoleName 1：管理员 2：代理商
            this.isAdmin = Boolean(sessionStorage.getItem("msjRoleName") === "1")
            if (this.isAdmin) {
                this.authLevelList = defalutAuthLevelList
            } else {
                defalutAuthLevelList.shift()
                this.authLevelList = defalutAuthLevelList
            }
        },
        authLevelFormSubmit() {
            this.$refs['authLevelform'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`agent/desk/setAuthenLevel?token=${this.$cookie.get('token')}`),
                        method: 'post',
                        params: this.$http.adornParams({
                            'authenLevel': this.authLevelform.authLevel,
                            'agentId': this.isAdmin ? this.baseData.id + '' : undefined,
                            'custId': this.isAdmin ? undefined : this.baseData.customerId + '',
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.authLevelVisible = false
                            this.$emit('refresh')
                            this.$message.success('设置成功!')
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.auth-level-tip {
    padding-left: 12px;
    font-size: 12px;
    > li {
        padding-left: 10px
    }
    > li:first-child {
        padding-left: 0px;
    }
}
</style>