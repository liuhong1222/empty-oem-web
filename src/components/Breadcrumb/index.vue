<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <template v-for="(item, index) in levelList">
      <el-breadcrumb-item :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect" || index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect || item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>


<script>
  export default {
    data() {
      return {
        levelList: null
      }
    },
    created() {
      this.getBreadcrumb()
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        // console.log(this.$route)
        if (this.$route.name === 'home') {
          // 如果是首页只显示首页并且不能点击
          let matched = this.$route.matched.filter(item => item.name)
          const first = matched[0]
          if (first && first.name !== 'main') {
            matched = [{ path: '/home', meta: { title: '工作台' } }].concat(matched)
          }
          matched.splice(0, 1)
          this.levelList = matched
        }

        else {
          //显示首页(可点击) 和 当前页
          let matched = this.$route.matched.filter(item => item.name)
          const first = matched[0]
          if (first && first.name !== 'main') {
            matched = [{ path: '/home', meta: { title: '工作台' } }].concat(matched)
          }
          // matched.splice(1,1)
          matched.splice(0, 2)
          this.levelList = matched

        }
      }
    }
  };

</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb {
    float: left;
    width: 230px;
    height: 50px;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
  }

  .no-redirect {
    color: #8a979e;
    cursor: text;
  }

  .el-breadcrumb__inner a:hover,
  .el-breadcrumb__inner.is-link:hover {
    color: #0f1c4e;
  }
</style>