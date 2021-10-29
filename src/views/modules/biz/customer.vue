<template>
  <div class="mod-user">
    <div v-if="this.screening === true">
      <h4>筛选条件:</h4>
      <div style="display: inline-block;">
        <!-- <el-tag
          style=" margin-left: 10px;"
          v-for="item in joinStatusList"
          key="joinStatusList"
          type="success"
          >
          {{item}} 
        </el-tag> -->
        <ul style="list-style:none;float:left;background:#e68f8f;padding:8px;margin-right:20px;border-radius:4px;color:#fff;">
          <li style="float:left;margin-left:5px;" v-for="(item, index) in joinStatusList" :key="index"> {{item}}</li>
        </ul>
        <p style="background:#f11c5f;color:#fff;display:inline-block;padding:8px;cursor: pointer;  border-radius:3px;" @click="deleteChoose">清空筛选</p>
      </div>
    </div>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select clearable style="width: 130px" class="filter-item" v-model="select" placeholder="公司名称" @change="chooseSelect">
          <el-option v-for="item in allList" :key="item.message" :label="item.message" :value="item.message">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input style="width:230px" v-model="inputDisabledValue" :placeholder="allListMessage" @change="inputDisabledValueFn" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <!-- <el-button v-if="isAuth('biz:customer:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('biz:customer:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" v-loading="dataListLoading" @filter-change="filterChange" :header-cell-class-name="tableheaderClassName"
      @sort-change="changeData" style="width: 100%;height:100%">
      <el-table-column type="selection" header-align="center" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" header-align="center" align="center" width="80" fixed label="序号">
      </el-table-column>
      <el-table-column prop="companyName" header-align="center" align="center" width="250" label="公司名称">
      </el-table-column>
      <el-table-column prop="statusDesc" header-align="center" align="center" label="客户状态" width="150" :filters=" [{text: '意向', value: 1}, {text: '合作', value:2}, {text: '丢弃' ,value:3}, {text: '到期' ,value: 4}, {text:'潜在',value:5}, {text:'注销' ,value:6}]"
        :filter-method="filterTag" :column-key="'keyValue'">
      </el-table-column>
      <el-table-column prop="contacts" header-align="center" align="center" label="联系人">
      </el-table-column>
      <el-table-column prop="contactWay" header-align="center" align="center" width="130" label="联系方式">
      </el-table-column>
      <!-- <el-table-column
         prop="contractStatus"
         header-align="center"
         align="center"
         label="合同状态">
              <template slot-scope="scope">
                      <el-text v-if="scope.row.contractStatus === 0" type="text" size="small" >无</el-text>
                      <el-text v-else-if="scope.row.contractStatus === 1" type="text" size="small" >有</el-text>
                      <el-text v-else size="small"></el-text>
               </template>
      </el-table-column> -->
      <el-table-column prop="wsAccounts" header-align="center" align="center" width="100" label="万数账号数">
      </el-table-column>
      <el-table-column prop="wsProducts" header-align="center" align="center" width="100" label="万数产品数">
      </el-table-column>
      <el-table-column prop="wsRecharges" header-align="center" align="center" width="120" sortable label="累计充值">
      </el-table-column>
      <el-table-column prop="wsConsumes" header-align="center" align="center" width="120" sortable label="累计消耗">
      </el-table-column>
      <el-table-column prop="clewSalesman" header-align="center" align="center" width="80" label="负责人">
      </el-table-column>
      <el-table-column prop="pinSalesman" header-align="center" align="center" width="80" label="销售人">
      </el-table-column>
      <el-table-column prop="serviceSalesman" header-align="center" align="center" width="80" label="运维人">
      </el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center" width="140" label="创建时间">
      </el-table-column>
      <el-table-column prop="mark" width="100" header-align="center" align="center" label="备注">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('biz:customer:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('biz:customer:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>  -->
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="dataForm.page" :page-sizes="[10, 20, 50, 100]"
      :page-size="dataForm.size" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
  </div>

</template>

<script>
  import AddOrUpdate from "./customer-edit";
  export default {
    data() {
      return {
        dataForm: {
          page: 1,
          size: 10,
          status: undefined, //客户状态
          customerId: undefined, //客户id
          companyName: undefined, //公司名
          linkMan: undefined, //联系人
          linkPhone: undefined, //联系方式
        },
        pageIndex: 1,
        dataList: [],
        totalPage: undefined,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        joinStatusOptions: [{ value: 1, message: '意向' }, { value: 2, message: '合作' }, { value: 3, message: '丢弃' }, { value: 4, message: '到期' }, { value: 5, message: '潜在' }, { value: 6, message: '注销' }],
        joinStatusList: [],
        statusValue: [],
        allList: [{ value: 'customerId', message: '客户ID' }, { value: 'salesman', message: '负责人ID' }, { value: 'companyName', message: '公司名称' }, { value: 'linkMan', message: '联系人' }, { value: 'linkPhone', message: '联系方式' }],
        screening: false,
        inputDisabledValue: '',
        paramsOneName: '',
        allListMessage: '公司名称',
        select: '公司名称',
        joinStatus: undefined,
        keyValue: undefined,//表格多选
      };
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;

        this.$http({
          url: this.$http.adornUrl("/biz/customer/list"),
          method: "get",
          params: this.$http.adornParams(this.dataForm)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
          } else {
            this.dataList = [];
            this.dataForm.totalPage = 0;
          }
          this.dataListLoading = false;
        });
      },
      //
      chooseSelect(message) {
        let text = message
        let textA = this.$data.allList

        textA.forEach(element => {
          let { message, value } = element
          if (message == text) {
            this.dataForm = {
              page: 1,
              size: 10,
            }
            this.paramsOneName = value
          }
        });
        this.dataForm = {
          page: 1,
          size: 10,
        }
        this.inputDisabledValue = ''
        return this.allListMessage = text
      },
      deleteChoose() {
        this.joinStatusList = []
        this.screening = false
        this.$router.go(0)
      },
      //获取input里的值
      inputDisabledValueFn(e) {
        if (this.paramsOneName === '') {
          this.paramsOneName = 'companyName'
          this.dataForm.companyName = this.inputDisabledValue
        } else if (this.paramsOneName === 'customerId') {
          //客户id
          this.dataForm.customerId = this.inputDisabledValue
        } else if (this.paramsOneName === 'salesman') {
          //销售人id
          this.dataForm.salesman = this.inputDisabledValue
        } else if (this.paramsOneName === 'companyName') {
          //公司名
          this.dataForm.companyName = this.inputDisabledValue
        } else if (this.paramsOneName === 'linkMan') {
          //联系人
          this.dataForm.linkMan = this.inputDisabledValue
        } else if (this.paramsOneName === 'linkPhone') {
          //联系方式
          this.dataForm.linkPhone = this.inputDisabledValue
        }
      },
      //查询
      handleFilter() {
        if (this.statusList) {
          this.statusValue = this.statusList
          this.dataForm.status = this.statusValue.toString()
          this.page = 1;
          this.getDataList();
        } else {
          this.getDataList();
        }
      },
      // 每页数
      sizeChangeHandle(val) {
        this.dataForm.size = val;
        this.dataForm.page = 1;
        this.getDataList();
      },
      // 当前页
      currentChangeHandle(val) {
        this.dataForm.page = val;
        this.getDataList();
      },
      //filterChange
      filterChange(e) {
        this.joinStatusList = []
        this.statusValue = []
        let keyValueList = e.keyValue
        if (!keyValueList[0]) {
          this.screening = false
        }
        keyValueList.forEach(element => {
          this.screening = true
          this.statusValue.push(element)
          if (element === 1) {
            this.joinStatusList.push('意向')
          } else if (element === 2) {
            this.joinStatusList.push('合作')
          } else if (element === 3) {
            this.joinStatusList.push('丢弃')
          } else if (element === 4) {
            this.joinStatusList.push('到期')
          } else if (element === 5) {
            this.joinStatusList.push('潜在')
          } else if (element === 6) {
            this.joinStatusList.push('注销')
          }
        });
        this.joinStatusList = [...new Set(this.joinStatusList)]
        this.statusValue = [...new Set(this.statusValue)]
        this.statusList = this.statusValue
        this.dataForm.status = this.statusValue.toString()
        this.getDataList()
      },
      //changeData
      changeData() {
        // console.log('changeData');
      },
      //表格筛选
      filterTag(value, row) {
        return row.joinStatus === value;
      },
      // 新增 / 修改
      // addOrUpdateHandle (id) {
      //   this.addOrUpdateVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addOrUpdate.init(id)
      //   })
      // },
      // 删除
      // deleteHandle (id) {
      //   var ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   })
      //   this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //       this.$http({
      //           url: this.$http.adornUrl('/biz/customer/delete'),
      //           method: 'post',
      //           data: this.$http.adornData(ids, false)
      //         }).then(({data}) => {
      //           if (data && data.code === 0) {
      //           this.$message({
      //             message: '操作成功',
      //             type: 'success',
      //             duration: 1500,
      //             onClose: () => {
      //             this.getDataList()
      //         }
      //         })
      //         } else {
      //           this.$message.error(data.msg)
      //         }
      //       })
      //   }).catch(() => {})
      // },
      //table th 
      tableheaderClassName({ row, rowIndex }) {
        return "table-head-th";
      },
    }
  };

</script>


<style scoped>
  h4 {
    display: inline-block;
  }

  span {
    padding: 0 15px;
  }
</style>