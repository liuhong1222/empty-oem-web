<template>
  <el-dialog :destroy-on-close="true" title="查看套餐" :visible.sync="dialogVisible" width="60%">
    <table class="discribe-wrapper" border>
      <tbody>
        <tr class="discribe-row">
          <td class="discribe-col title">所属代理商编号</td>
          <td class="discribe-col">{{ detailInfo.agentId }}</td>
          <td class="discribe-col title">代理商名称</td>
          <td class="discribe-col">{{ detailInfo.agentName }}</td>
        </tr>
        <tr class="discribe-row">
          <td class="discribe-col title">充值套餐名称</td>
          <td class="discribe-col">{{ detailInfo.name }}</td>
          <td class="discribe-col title">充值套餐条数</td>
          <td class="discribe-col">{{ detailInfo.specifications }}</td>
        </tr>
        <tr class="discribe-row">
          <td class="discribe-col title">充值套餐价格</td>
          <td class="discribe-col">{{ detailInfo.price }}</td>
          <td class="discribe-col title">最低充值金额</td>
          <td class="discribe-col">{{ detailInfo.minPayAmount }}</td>
        </tr>
        <tr class="discribe-row">
          <td class="discribe-col title">创建时间</td>
          <td class="discribe-col">{{ detailInfo.createTime }}</td>
          <td class="discribe-col title">套餐说明</td>
          <td class="discribe-col">{{ detailInfo.remark }}</td>
        </tr>
      </tbody>
    </table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "MealDetailDialog",
  components: {},
  data() {
    return {
      dialogVisible: false,
      detailInfo: {},
    };
  },
  created() {},
  methods: {
    init(record) {
      this.dialogVisible = true;
      this.$http({
        url: this.$http.adornUrl(
          `agent/agentInfo/detail?token=${this.$cookie.get("token")}&agentId=${
            record.id
          }`
        ),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.detailInfo = data.data || {};
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>