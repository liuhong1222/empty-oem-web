<template>
    <div>
        <el-dialog title="添加/编辑" :close-on-click-modal="false" :visible.sync="visible" width="550px" :before-close="closeNewsSeeDialod">
            <el-form :model="quesAUDataForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="所属产品：">
                    <el-input v-model="quesAUDataForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="quesAUDataForm.status" placeholder="请选择审核状态">
                        <el-option v-for="(item,index) in statusArr" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input-number v-model="quesAUDataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="问题标题：">
                    <el-input v-model="quesAUDataForm.title"></el-input>
                </el-form-item>
                <el-form-item label="回答内容：">
                    <el-input type="textarea" v-model="quesAUDataForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                quesAUDataForm: {
                    proName: '',
                    status: '',
                    orderNum: '',
                    title: '',
                    content: ''
                },
                statusArr: [
                    { label: '上架', value: 1 },
                    { label: '下架', value: 2 }
                ]
            }
        },
        methods: {
            showInit() {
                this.visible = true;
            },
            closeNewsSeeDialod() {
                this.visible = false;
            }
        }
    }

</script>

<style>


</style>