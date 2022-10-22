<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>

<style>
  .el-table {
    /* min-height: 600px; */
  }

  .el-table,
  .el-button {
    font-size: 12px;
  }
</style>
<style lang="scss">
.tow-row-col {
  > div {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    > span:first-child {
      display: inline-block;
      // width: 70px;
      margin-right: 8px;
      font-size: 12px;
      transform: scale(0.83);
      color: rgb(161, 161, 161);
    }
  }
}
</style>