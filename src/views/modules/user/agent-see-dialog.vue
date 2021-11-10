<template>
    <div class="mainAess">
        <el-dialog title="查看代理商" :visible.sync="dialogVisible" width="1000px">
            <agent-setting-detail ref="detailRef" />
        </el-dialog>
    </div>
</template>

<script>
    import AgentSettingDetail from '@/components/agent-setting-detail/index.vue'
    export default {
        components: {
            AgentSettingDetail
        },
        data() {
            return {
                dialogVisible: false,
                agentSettingInfo: {},
            }
        },
        methods: {
            init(record) {
                this.dialogVisible = true
                this.$http({
                    url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}&agentId=${record.agentId}`),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.agentSettingInfo = data.data || {}
                        this.$refs.detailRef.init(this.agentSettingInfo)
                    }
                })
            },
            // seeInit({ agentId }) {
            //     // console.log('查看弹出层')
            //     this.dialogVisible = true
            //     this.agentId = agentId;

            //     this.logoImageUrl = ""
            //     this.iconImageUrl = ""
            //     this.dqImageUrl = ""
            //     this.gzImageUrl = ""
            //     // 获取基本信息
            //     this.$http({
            //         url: this.$http.adornUrl(`agent/set/findBasicInfo?token=${this.$cookie.get('token')}&agentId=${this.agentId}`),
            //         method: 'post',
            //     }).then(({ data }) => {
            //         if (data && data.code === 0) {
            //             // this.basicdataForm.agentNumber = data.data[0].agentId
            //             this.basicdataForm.businNumber = data.data[0].agent_no
            //             this.basicdataForm.agentName = data.data[0].company_name
            //             this.basicdataForm.dxName = data.data[0].sms_sign
            //             this.basicdataForm.domaintName = data.data[0].name
            //             this.logoImageUrl = imgUrl.imgUrl + data.data[0].logo_url
            //             this.iconImageUrl = imgUrl.imgUrl + data.data[0].icon_url
            //             this.dqImageUrl = imgUrl.imgUrl + data.data[0].sign_url
            //             this.gzImageUrl = imgUrl.imgUrl + data.data[0].seal_url
            //         }
            //     })
            // },
        }
    }

</script>

<style lang="scss" scoped>
</style>