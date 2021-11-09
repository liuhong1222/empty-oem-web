<template>
    <el-dialog title="选择客户" :visible.sync="dialogTableVisible" width="50%" :before-close="clseoeoe" :modal="false">
        <div style="text-align: center">
            <el-transfer style="text-align: left; display: inline-block" v-model="value4" filterable :titles="['全部', '已选中']" :button-texts="['删除', '选中']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }" @change="handleChange" :data="list">
                <span slot-scope="{ option }">{{ option.label }}</span>
                <el-button class="transfer-footer" slot="right-footer" size="small" type="primary" @click="trueSave" style="margin:3px 75px 0">保存</el-button>
                <!-- <el-button class="transfer-footer" slot="right-footer" size="small">取消</el-button> -->
            </el-transfer>

            <!-- <span>{{param}}</span> -->
        </div>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                disable: true,
                dialogTableVisible: false,
                list: [],
                value4: [], // 选定的用户
                isClick: false,
                // 保存选中的用户
                trueSaveList: []
            };
        },
        props: ['param'],  //子接收父传过来的值
        methods: {
            showInit() {
                this.dialogTableVisible = true
                this.isClick = false
                this.list = this.generateData()
                this.value4 = this.param
                // this.findUserIdMobile()
            },
            handleChange(value, direction, movedKeys) {
                this.value4 = value
            },
            trueSave() {
                // if (this.value4.length == 0) {
                //     this.$message.warning('请先选择用户!');
                //     return
                // }
                this.isClick = true
                this.dialogTableVisible = false
                this.trueSaveList = this.value4
                this.$emit('childByValue', this.trueSaveList)  //子给父传值
            },
            // 获取数据
            generateData() {
                const dataList = [];
                this.$http({
                    url: this.$http.adornUrl(`agent/message/findUserIdMobileByMobile?token=${this.$cookie.get('token')}`),
                    method: 'post',
                    params: this.$http.adornParams({})
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        for (let i = 0; i < data.data.length; i++) {
                            dataList.push({
                                key: data.data[i].id,
                                label: data.data[i].name,
                            });
                        }

                    }
                })
                return dataList;
            },
            clseoeoe(done) {  //关闭弹窗
                if (this.value4.length == 0) {
                    this.$confirm('确认不选择指定用户？')
                        .then(_ => {
                            done();
                        })
                        .catch(_ => { });
                } else {
                    if (!(this.isClick)) {
                        this.$confirm('确认不保存修改么？')
                            .then(_ => {
                                done();
                                this.value4 = this.trueSaveList   //点击确定后的数据
                                console.log(this.value4)
                                // this.value4 = []  //清空右面数据
                                this.list = []  //清空数据
                            })
                            .catch(_ => { });
                    }
                }


            }
        },
    };

</script>
<style>

</style>