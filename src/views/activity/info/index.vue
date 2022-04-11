<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动标题" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入活动标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="用户ID" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入用户ID"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="图片路径id" prop="imageId">-->
<!--        <el-input-->
<!--          v-model="queryParams.imageId"-->
<!--          placeholder="请输入图片路径id"-->
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['activity:info:add']"
        >新增
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['activity:info:edit']"-->
<!--        >修改-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['activity:info:remove']"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['activity:info:export']"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="活动ID" align="center" prop="activityId"/>
      <el-table-column label="活动标题" align="center" prop="activityName"/>
<!--      <el-table-column label="活动描述" align="center" prop="activityContent"/>-->
      <el-table-column label="用户ID" align="center" prop="userId"/>
<!--      <el-table-column label="图片路径id" align="center" prop="imageId"/>-->
<!--      <el-table-column label="状态" align="center" prop="status"/>-->
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['activity:info:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['activity:info:remove']"
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

    <!-- 添加或修改活动信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动标题"/>
        </el-form-item>
        <el-form-item label="活动描述" prop="activityContent">
          <editor v-model="form.activityContent" :min-height="192"/>
        </el-form-item>
        <!--        <el-form-item label="用户ID" prop="userId">-->
        <!--          <el-input v-model="form.userId" placeholder="请输入用户ID" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="图片路径id" prop="imageId">-->
        <!--          <el-input v-model="form.imageId" placeholder="请输入图片路径id" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="删除标志" prop="delFlag">-->
        <!--          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />-->
        <!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-divider content-position="center">活动图片信息</el-divider>
        <el-form-item class="upload-cover" label="商品图片" prop="activityInfoImageList" ref="uploadmenuLogo">
          <el-upload
            class="avatar-uploader"
            accept="image/png, image/jpg, image/jpeg"
            :action="settings.uploadUrl"
            :on-remove="handleRemove"
            :file-list="form.activityInfoImageList"
            :on-success="handlePicSuccess('logo')"
            :before-upload="beforePicUpload"
            :headers="headers"
            :limit="2"
            list-type="picture"
          >
            <el-button size="small" type="primary" v-show="activityInfoImageList.length<1">点击上传</el-button>
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

        <!--        <el-row :gutter="10" class="mb8">-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddActivityInfoImage">添加</el-button>-->
        <!--          </el-col>-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteActivityInfoImage">删除</el-button>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-table :data="activityInfoImageList" :row-class-name="rowActivityInfoImageIndex" @selection-change="handleActivityInfoImageSelectionChange" ref="activityInfoImage">-->
        <!--          <el-table-column type="selection" width="50" align="center" />-->
        <!--          <el-table-column label="序号" align="center" prop="index" width="50"/>-->
        <!--          <el-table-column label="图片路径" prop="imagePath">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-input v-model="scope.row.imagePath" placeholder="请输入图片路径" />-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/activity/info'
import { getToken } from '@/utils/auth'

export default {
  name: 'Info',
  data() {
    return {
      // 上传请求头
      headers: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedActivityInfoImage: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 活动信息表格数据
      infoList: [],
      // 活动图片表格数据
      activityInfoImageList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityName: null,
        activityContent: null,
        userId: null,
        imageId: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        activityName: [
          { required: true, message: '活动标题不能为空', trigger: 'blur' }
        ],
        activityContent: [
          { required: true, message: '活动描述不能为空', trigger: 'blur' }
        ]
        // userId: [
        //   { required: true, message: "用户ID不能为空", trigger: "blur" }
        // ],
      }
    }
  },
  created() {
    this.getList()
    this.headers = { Authorization: 'Bearer ' + getToken() }
  },
  methods: {
    handleRemove(file, fileList) {
      if (fileList.length === 0) {
        this.activityInfoImageList = []
      } else {
        this.activityInfoImageList = []
        fileList.forEach(x => {
          this.activityInfoImageList.push({ imagePath: x.url })
        })
      }
    },
    // 图片上传成功
    handlePicSuccess(type) {
      return (res, file) => {
        if (type === 'logo') {
          console.log(file)
          this.menuLogoUrl = URL.createObjectURL(file.raw)
          this.$refs['uploadmenuLogo'].clearValidate()
          this.activityInfoImageList.push({ imagePath: file.response.url })
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
    /** 查询活动信息列表 */
    getList() {
      this.loading = true
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows
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
        activityId: null,
        activityName: null,
        activityContent: null,
        userId: null,
        imageId: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        activityInfoImageList: []
      }
      this.activityInfoImageList = []
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
      this.ids = selection.map(item => item.activityId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加活动信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const activityId = row.activityId || this.ids
      getInfo(activityId).then(response => {
        this.form = response.data
        this.activityInfoImageList = []
        response.data.activityInfoImageList.forEach(x => {
          x.url = x.imagePath
          this.activityInfoImageList.push(x)
        })
        this.form.activityInfoImageList = this.activityInfoImageList
        this.open = true
        this.title = '修改活动信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.activityInfoImageList = this.activityInfoImageList
          if (this.form.activityId != null) {
            updateInfo(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addInfo(this.form).then(response => {
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
      const activityIds = row.activityId || this.ids
      this.$modal.confirm('是否确认删除活动信息编号为"' + activityIds + '"的数据项？').then(function() {
        return delInfo(activityIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 活动图片序号 */
    rowActivityInfoImageIndex({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    /** 活动图片添加按钮操作 */
    handleAddActivityInfoImage() {
      let obj = {}
      obj.imagePath = ''
      this.activityInfoImageList.push(obj)
    },
    /** 活动图片删除按钮操作 */
    handleDeleteActivityInfoImage() {
      if (this.checkedActivityInfoImage.length == 0) {
        this.$modal.msgError('请先选择要删除的活动图片数据')
      } else {
        const activityInfoImageList = this.activityInfoImageList
        const checkedActivityInfoImage = this.checkedActivityInfoImage
        this.activityInfoImageList = activityInfoImageList.filter(function(item) {
          return checkedActivityInfoImage.indexOf(item.index) == -1
        })
      }
    },
    /** 复选框选中数据 */
    handleActivityInfoImageSelectionChange(selection) {
      this.checkedActivityInfoImage = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('activity/info/export', {
        ...this.queryParams
      }, `info_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
