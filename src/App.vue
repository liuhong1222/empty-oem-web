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