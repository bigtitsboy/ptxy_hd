<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单状态" prop="visible">
        <el-input
          v-model="queryParams.visible"
          placeholder="请输入菜单状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父菜单ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父菜单ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['controller:appMenu:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="appMenuList"
      row-key="menuId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" prop="menuName"/>
      <el-table-column label="父菜单ID" align="center" prop="parentId"/>
      <!--      <el-table-column label="显示顺序" align="center" prop="orderNum"/>-->
      <!--      <el-table-column label="路由地址" align="center" prop="path"/>-->
      <!--      <el-table-column label="组件路径" align="center" prop="component"/>-->
      <!--      <el-table-column label="路由参数" align="center" prop="query"/>-->
      <!--      <el-table-column label="是否为外链" align="center" prop="isFrame"/>-->
      <!--      <el-table-column label="是否缓存" align="center" prop="isCache"/>-->
      <!--      <el-table-column label="菜单类型" align="center" prop="menuType"/>-->
      <el-table-column label="菜单状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.children===undefined"
            v-model="scope.row.visible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="'0'"
            :inactive-value="'1'"
            @change="changeSwitch(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!--      <el-table-column label="菜单状态" align="center" prop="status"/>-->
      <!--      <el-table-column label="菜单图标" align="center" prop="icon"/>-->
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['controller:appMenu:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['controller:appMenu:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['controller:appMenu:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改移动端菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item class="upload-cover" label="菜单图标" prop="icon" ref="uploadmenuLogo">
          <el-upload
            class="avatar-uploader"
            accept="image/png, image/jpg, image/jpeg"
            :action="settings.uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handlePicSuccess('logo')"
            :before-upload="beforePicUpload"
          >
            <!--            :data="{folderName:'operateSetup',subFolderName:'menuInfo'}"-->
            <img
              v-if="menuLogoUrl"
              :src="menuLogoUrl"
              class="avatar"
              @error="menuLogoUrl=setErrorImg()"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <div class="tip">
            <div>1. 只支持png，jpg，jpeg三种格式的图片;</div>
            <div>2. 建议上传1:1的图片，图片大小不超过1M。</div>
          </div>
        </el-form-item>
        <!--        <el-form-item label="父菜单ID" prop="parentId">-->
        <!--          <treeselect v-model="form.parentId" :options="appMenuOptions" :normalizer="normalizer"-->
        <!--                      placeholder="请选择父菜单ID"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="显示顺序" prop="orderNum">-->
        <!--          <el-input v-model="form.orderNum" placeholder="请输入显示顺序"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="路由地址" prop="path">-->
        <!--          <el-input v-model="form.path" placeholder="请输入路由地址"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件路径"/>
        </el-form-item>
        <!--        <el-form-item label="路由参数" prop="query">-->
        <!--          <el-input v-model="form.query" placeholder="请输入路由参数"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="菜单状态" prop="visible">
          <el-select v-model="form.visible" placeholder="请选择菜单状态">
            <el-option
              v-for="item in sysNormalDisableDict"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
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
import { listAppMenu, getAppMenu, delAppMenu, addAppMenu, updateAppMenu } from '@/api/controller/appMenu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getToken } from "@/utils/auth";
export default {
  name: 'AppMenu',
  components: {
    Treeselect
  },
  data() {
    return {
      // 上传请求头
      headers: null,
      menuLogoUrl: undefined,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 移动端菜单表格数据
      appMenuList: [],
      // 移动端菜单树选项
      appMenuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 系统状态字典
      sysNormalDisableDict: [],
      // 查询参数
      queryParams: {
        menuName: null,
        parentId: null,
        orderNum: null,
        path: null,
        component: null,
        query: null,
        isFrame: null,
        isCache: null,
        menuType: null,
        visible: null,
        status: null,
        icon: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(res => {
      this.sysNormalDisableDict = res.data
    })
    this.headers= { Authorization: "Bearer " + getToken() }
  },
  methods: {
    // 开关
    changeSwitch(row) {
      updateAppMenu(row).then(response => {
        this.$modal.msgSuccess('切换成功')
        this.open = false
        this.getList()
      })
    },
    /** 查询移动端菜单列表 */
    getList() {
      this.loading = true
      listAppMenu(this.queryParams).then(response => {
        this.appMenuList = this.handleTree(response.data, 'menuId', 'parentId')
        this.loading = false
      })
    },
    /** 转换移动端菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    /** 查询移动端菜单下拉树结构 */
    getTreeselect() {
      listAppMenu().then(response => {
        this.appMenuOptions = []
        const data = { menuId: 0, menuName: '顶级节点', children: [] }
        data.children = this.handleTree(response.data, 'menuId', 'parentId')
        this.appMenuOptions.push(data)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.menuLogoUrl = undefined
      this.form = {
        menuId: null,
        menuName: null,
        parentId: null,
        orderNum: null,
        path: null,
        component: null,
        query: null,
        isFrame: null,
        isCache: null,
        menuType: null,
        visible: null,
        status: '0',
        icon: null,
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
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId
      } else {
        this.form.parentId = 0
      }
      this.open = true
      this.title = '添加移动端菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parentId = row.menuId
      }
      getAppMenu(row.menuId).then(response => {
        this.form = response.data
        this.menuLogoUrl = response.data.icon
        this.open = true
        this.title = '修改移动端菜单'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.menuId != null) {
            updateAppMenu(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addAppMenu(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除移动端菜单编号为"' + row.menuId + '"的数据项？').then(function() {
        return delAppMenu(row.menuId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    // 图片上传成功
    handlePicSuccess(type) {
      return (res, file) => {
        if (type === 'logo') {
          this.menuLogoUrl = URL.createObjectURL(file.raw)
          this.$refs['uploadmenuLogo'].clearValidate()
          this.form.icon = res.url
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
    }
  }
}
</script>
