
<template>
  <div class="myTable">
       <el-table :data="data"
                 @select="select"
                 @select-all="select"
                 @row-dblclick="rowDblclick"
                 :highlight-current-row="config.isHigh">
         <!-- 是否勾选 -->
          <el-table-column
            v-if="config.isSelection"
            type="selection"
            width="50"
            :align="config.align"
            :disabled="data.length<0">
          </el-table-column>
           <el-table-column
            type="index"
            label="序号"
            :align="config.align"
            v-if="config.isOrder"
            width="100">
          </el-table-column>
         <!-- 表格配置 -->
         <el-table-column v-for="(item,index) in config.colConfig" 
                          :fixed="item.fixed" 
                          :prop="item.field"
                          :width="item.width"
                          :sortable="item.isSort"
                          :resizable="item.isResize"
                          :show-overflow-tooltip="true"
                          :label="item.label"
                          :align="config.align"
                          >
                          <!-- 自定义表格内容 -->
                          <template slot-scope="scope">
                            <!-- 普通文本 -->
                            <span v-if="item.type === 'text'" :style="{'color':item.colorFun?item.colorFun(scope.row[item.field]):'#666'}">{{scope.row[item.field]}}</span>
                            <!-- 输入框 -->
                            <el-input v-else-if="item.type === 'input'" v-model="scope.row[item.field]" size="mini"></el-input>
                            <!-- 下拉菜单 -->
                            <el-select v-else-if="item.type === 'select'" v-model="scope.row[item.field]" clearable placeholder="请选择" size="mini">
                                <el-option
                                  v-for="_item in scope.row.selectData"
                                  :label="_item.label"
                                  :value="_item.value">
                                </el-option>
                              </el-select>
                            <!-- 未完待续 -->
                          </template>
          </el-table-column>
       </el-table>
       <!-- 分页 -->
        <div class="my-pagination">
            <el-pagination v-if="config.isPage" 
                           @size-change="handleSizeChange" 
                           @current-change="handleCurrentChange" 
                           :current-page="config.pageNo" 
                           :page-sizes="[20, 40, 60, 80]" 
                           :page-size="config.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="config.total">
            </el-pagination>
        </div>
        <!-- loading -->
        <!-- <load v-show="config.loadShow"></load> -->
  </div>
</template>


<script>
export default {
  props: ["config", "data"],
  data(){
    return{
     }
   },
  methods:{
    toolbarBack(data){//操作按钮回调
      this.emit(data.method,data.index);
    },
    handleSizeChange(val){//每页数量变化
      if(this.config.isLoading){
        this.config.loadShow = true;//加载
      }
      this.config.pageSize = val;
      this.$emit("sizeChange");
    },
    handleCurrentChange(val){//页码变化
      if(this.config.isLoading){
        this.config.loadShow = true;//加载
      }
      this.config.pageNo = val;
      this.$emit("pageChange");
    },
    select(val){//表格Checkbox勾选触发
        this.$emit('select',val)
    },
    rowDblclick(val){//表格单行双击
       this.$emit('rowDblclick',val);
    }
  }
};
</script>
<style lang="less">
 @colPading:8px 0;
 @theadColor:#666;
 @theadImage:#F6F6F6;
  .myTable{
    position: relative;
    .my-pagination{
      text-align: center;
      margin-top: 10px;
    }
    .el-table td{
      padding:@colPading;
    }
    .el-table thead {
        color: @theadColor;
        font-weight: 500;
        background: @theadImage;
    }
    .el-table th, .el-table tr {
      background-color: rgba(0,0,0,0);
   }
  }
</style>

