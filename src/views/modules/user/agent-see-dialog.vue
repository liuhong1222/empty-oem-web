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
                        const { agentSetInfo } = (data.data || {})
                        this.agentSettingInfo = agentSetInfo || {}
                        this.$refs.detailRef.init(this.agentSettingInfo)
                    }
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
</style>