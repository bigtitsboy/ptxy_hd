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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['goods:shopGoods:add']"
        >新增
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopGoodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="商品ID" align="center" prop="goodsId"/>
      <el-table-column label="商品名称" align="center" prop="goodsName"/>
      <!--      <el-table-column label="商品描述" align="center" prop="goodsContent"/>-->
      <el-table-column label="商品价格" align="center" prop="goodsPrice"/>
      <el-table-column label="商品数量" align="center" prop="goodsNumber"/>
      <el-table-column label="分类" align="center">
        <template slot-scope="props">
          <div>{{ categoryChange(props.row.categoryId) }}</div>
        </template>
      </el-table-column>
      <!--      <el-table-column label="用户ID" align="center" prop="userId"/>-->
      <!--      <el-table-column label="手机号码" align="center" prop="phonenumber"/>-->
      <!--      <el-table-column label="商品浏览量" align="center" prop="goodsCount"/>-->
      <!--      <el-table-column label="商品状态" align="center" prop="status"/>-->
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['goods:shopGoods:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['goods:shopGoods:remove']"
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

    <!-- 添加或修改店铺商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
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
        <el-form-item label="商品数量" prop="goodsNumber">
          <el-input v-model="form.goodsNumber" placeholder="请输入商品数量"/>
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


        <el-form-item class="upload-cover" label="商品图片" prop="icon" ref="uploadmenuLogo">
          <el-upload
            class="avatar-uploader"
            accept="image/png, image/jpg, image/jpeg"
            :action="settings.uploadUrl"
            :on-remove="handleRemove"
            :file-list="form.imageList"
            :on-success="handlePicSuccess('logo')"
            :before-upload="beforePicUpload"
            :headers="headers"
            :limit="2"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

          <!--          <el-upload-->
          <!--            class="avatar-uploader"-->
          <!--            accept="image/png, image/jpg, image/jpeg"-->
          <!--            :action="settings.uploadUrl"-->
          <!--            :headers="headers"-->
          <!--            :limit="2"-->
          <!--            :on-success="handlePicSuccess('logo')"-->
          <!--            :before-upload="beforePicUpload"-->
          <!--          >-->
          <!--            <i class="el-icon-plus"></i>-->
          <!--          </el-upload>-->

          <!--          <div class="tip">-->
          <!--            <div>1. 只支持png，jpg，jpeg三种格式的图片;</div>-->
          <!--            <div>2. 建议上传1:1的图片，图片大小不超过1M。</div>-->
          <!--          </div>-->
        </el-form-item>

        <el-form-item label="商品售量" prop="goodsCount">
          <el-input v-model="form.goodsCount" placeholder="请输入商品售量"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
  listShopGoods,
  getShopGoods,
  delShopGoods,
  addShopGoods,
  updateShopGoods,
  listGoodsCategory
} from '@/api/goods/shopGoods'
import { getToken } from '@/utils/auth'

export default {
  name: 'ShopGoods',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 类别列表
      goodsCategoryList: [],
      // 上传请求头
      headers: null,
      menuLogoUrl: undefined,
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
      // 店铺商品表格数据
      shopGoodsList: [],
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
        goodsNumber: null,
        categoryId: null,
        userId: null,
        phonenumber: null,
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
        goodsNumber: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ]
        // icon: [
        //   { required: true, message: '图片不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.reset()
    this.getList()
    this.headers = { Authorization: 'Bearer ' + getToken() }
    listGoodsCategory().then(res => {
      this.goodsCategoryList = res.rows
    })
  },
  methods: {
    handleRemove(file, fileList) {
      if (fileList.length === 0) {
        this.form.imageList = []
      } else {
        this.form.imageList = []
        console.log(fileList)
        fileList.forEach(x => {
          this.form.imageList.push({ url: x.url })
        })
      }
    },
    handlePictureCardPreview(file) {
      this.menuLogoUrl = file.url
      this.dialogVisible = true
    },
    // 分类转换
    categoryChange(val) {
      return this.goodsCategoryList.filter(x => x.categoryId === val)[0].categoryName
    },
    // 图片上传成功
    handlePicSuccess(type) {
      return (res, file) => {
        if (type === 'logo') {
          console.log(file)
          this.menuLogoUrl = URL.createObjectURL(file.raw)
          this.$refs['uploadmenuLogo'].clearValidate()
          this.form.imageList.push({ url: file.response.url })
        }
      }
    },
    // 图片上传之前
    beforePicUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    /** 查询店铺商品列表 */
    getList() {
      this.loading = true
      listShopGoods(this.queryParams).then(response => {
        this.shopGoodsList = response.rows
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
        imageList: [],
        goodsId: null,
        goodsName: null,
        goodsContent: null,
        goodsPrice: null,
        goodsNumber: null,
        categoryId: null,
        userId: null,
        phonenumber: null,
        goodsCount: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.title = '添加店铺商品'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const goodsId = row.goodsId || this.ids
      getShopGoods(goodsId).then(response => {
        console.log(response)
        this.form = { ...response.data }
        this.form.imageList = []
        if (response.data.imageList.length !== 0) {
          response.data.imageList.forEach((x) => {
            this.form.imageList.push({ url: x })
          })
        }
        this.open = true
        this.title = '修改店铺商品'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.goodsId != null) {
            this.form.imageList = this.form.imageList.map((x) => {
              return x.url
            })
            updateShopGoods(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.imageList = this.form.imageList.map((x) => {
              return x.url
            })
            addShopGoods(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除店铺商品编号为"' + goodsIds + '"的数据项？').then(function() {
        return delShopGoods(goodsIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('goods/shopGoods/export', {
        ...this.queryParams
      }, `shopGoods_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
