<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="商品价格" prop="goodsPrice">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.goodsPrice"-->
      <!--          placeholder="请输入商品价格"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" clearable placeholder="请选择分类">
          <el-option
            v-for="item in goodsCategoryList"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="手机号码" prop="phonenumber">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.phonenumber"-->
      <!--          placeholder="请输入手机号码"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="商品路径" prop="goodsPath">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.goodsPath"-->
      <!--          placeholder="请输入商品路径"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="商品浏览量" prop="goodsCount">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.goodsCount"-->
      <!--          placeholder="请输入商品浏览量"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--    <el-row :gutter="10" class="mb8">-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          plain-->
    <!--          icon="el-icon-plus"-->
    <!--          size="mini"-->
    <!--          @click="handleAdd"-->
    <!--          v-hasPermi="['goods:secondhandGoods:add']"-->
    <!--        >新增</el-button>-->
    <!--      </el-col>-->
    <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    <!--    </el-row>-->

    <el-table v-loading="loading" :data="secondhandGoodsList" @selection-change="handleSelectionChange">


      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品ID">
              <span>{{ props.row.goodsId }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.goodsName }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.goodsPrice }}</span>
            </el-form-item>
            <el-form-item label="用户ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="手机号码">
              <span>{{ props.row.phonenumber }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ categoryChange(props.row.categoryId) }}</span>
            </el-form-item>
            <el-form-item label="商品状态">
              <span>{{ statusChange(props.row.status) }}</span>
            </el-form-item>
            <el-form-item label="商品浏览量">
              <span>{{ props.row.goodsCount }}</span>
            </el-form-item>
            <el-form-item label="商品新旧程度">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsContent }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>


      <el-table-column label="商品ID" align="center" prop="goodsId"/>
      <el-table-column label="商品名称" align="center" prop="goodsName"/>
      <!--      <el-table-column label="商品描述" align="center" prop="goodsContent"/>-->
      <el-table-column label="商品价格" align="center" prop="goodsPrice"/>
      <el-table-column label="分类" align="center">
        <template slot-scope="props">
          <div>{{ categoryChange(props.row.categoryId) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="userId"/>
      <!--      <el-table-column label="手机号码" align="center" prop="phonenumber"/>-->
      <!--      <el-table-column label="商品路径" align="center" prop="goodsPath"/>-->
      <!--      <el-table-column label="商品浏览量" align="center" prop="goodsCount"/>-->
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="'0'"
            :inactive-value="'1'"
            @change="changeSwitch(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['goods:secondhandGoods:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['goods:secondhandGoods:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改二手商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsContent">
          <editor v-model="form.goodsContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input v-model="form.goodsPrice" placeholder="请输入商品价格"/>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" clearable placeholder="请选择分类">
            <el-option
              v-for="item in goodsCategoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.imageList" class="upload-cover" label="商品图片" prop="icon" ref="uploadmenuLogo">
          <!--          <el-dialog>-->
          <!--            <img :src="" alt="">-->
          <!--            {{ form.imageList[0] }}-->
          <el-image
            v-for="(item,index) in  form.imageList"
            :key="'formImageList'+index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="form.imageList"
          >
          </el-image>
          <!--          </el-dialog>-->
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码"/>
        </el-form-item>
        <!--        <el-form-item label="商品路径" prop="goodsPath">-->
        <!--          <el-input v-model="form.goodsPath" placeholder="请输入商品路径"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="商品浏览量" prop="goodsCount">
          <el-input v-model="form.goodsCount" placeholder="请输入商品浏览量"/>
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="form.status" clearable placeholder="请选择商品状态">
            <el-option
              v-for="item in sysNormalDisableDict"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品新旧程度" prop="remark">
          <el-select v-model="form.remark" clearable placeholder="请选择商品新旧程度">
            <el-option
              v-for="item in goodItemState"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
          <!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSecondhandGoods,
  getSecondhandGoods,
  delSecondhandGoods,
  addSecondhandGoods,
  updateSecondhandGoods
} from '@/api/goods/secondhandGoods'
import { listGoodsCategory } from '@/api/goods/goodsCategory'

export default {
  name: 'SecondhandGoods',
  data() {
    return {
      // 系统状态字典
      sysNormalDisableDict: [],
      // 商品新旧程度字典
      goodItemState: [],
      // 类别列表
      goodsCategoryList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 二手商品表格数据
      secondhandGoodsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName: null,
        goodsContent: null,
        goodsPrice: null,
        categoryId: null,
        userId: null,
        phonenumber: null,
        goodsPath: null,
        goodsCount: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goodsContent: [
          { required: true, message: '商品描述不能为空', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '用户ID不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '商品状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    listGoodsCategory().then(res => {
      this.goodsCategoryList = res.rows
    })

    this.getDicts('sys_normal_disable').then(res => {
      this.sysNormalDisableDict = res.data
    })
    this.getDicts('good_item_state').then(res => {
      this.goodItemState = res.data
    })
  },
  methods: {
    // 开关
    changeSwitch(row) {
      updateSecondhandGoods(row).then(response => {
        this.$modal.msgSuccess('切换成功')
        this.open = false
        this.getList()
      })
    },
    // 分类转换
    categoryChange(val) {
      return this.goodsCategoryList.filter(x => x.categoryId === val)[0].categoryName
    },
    // 商品状态转换
    statusChange(val) {
      return this.sysNormalDisableDict.filter(x => x.dictValue === val)[0].dictLabel
    },
    /** 查询二手商品列表 */
    getList() {
      this.loading = true
      listSecondhandGoods(this.queryParams).then(response => {
        this.secondhandGoodsList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        goodsId: null,
        goodsName: null,
        goodsContent: null,
        goodsPrice: null,
        categoryId: null,
        userId: null,
        phonenumber: null,
        goodsPath: null,
        goodsCount: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        imageList: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加二手商品'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const goodsId = row.goodsId || this.ids
      getSecondhandGoods(goodsId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改二手商品'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.goodsId != null) {
            updateSecondhandGoods(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSecondhandGoods(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const goodsIds = row.goodsId || this.ids
      this.$modal.confirm('是否确认删除二手商品编号为"' + goodsIds + '"的数据项？').then(function() {
        return delSecondhandGoods(goodsIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('goods/secondhandGoods/export', {
        ...this.queryParams
      }, `secondhandGoods_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
  margin-left: 10%;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
