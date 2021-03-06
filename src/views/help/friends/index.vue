<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="互助交友标题" prop="helpName">
        <el-input
          v-model="queryParams.helpName"
          placeholder="请输入互助交友标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片路径id" prop="imageId">
        <el-input
          v-model="queryParams.imageId"
          placeholder="请输入图片路径id"
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
          v-hasPermi="['help:friends:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['help:friends:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['help:friends:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['help:friends:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="friendsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="互助交友ID" align="center" prop="helpId" />
      <el-table-column label="互助交友标题" align="center" prop="helpName" />
      <el-table-column label="互助交友描述" align="center" prop="helpContent" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
      <el-table-column label="图片路径id" align="center" prop="imageId" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['help:friends:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['help:friends:remove']"
          >删除</el-button>
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

    <!-- 添加或修改互助交友对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="互助交友标题" prop="helpName">
          <el-input v-model="form.helpName" placeholder="请输入互助交友标题" />
        </el-form-item>
        <el-form-item label="互助交友描述">
          <editor v-model="form.helpContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="图片路径id" prop="imageId">
          <el-input v-model="form.imageId" placeholder="请输入图片路径id" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">失物图片信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddLostFoundDXImage">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteLostFoundDXImage">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="lostFoundDXImageList" :row-class-name="rowLostFoundDXImageIndex" @selection-change="handleLostFoundDXImageSelectionChange" ref="lostFoundDXImage">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="图片路径" prop="imagePath">
            <template slot-scope="scope">
              <el-input v-model="scope.row.imagePath" placeholder="请输入图片路径" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFriends, getFriends, delFriends, addFriends, updateFriends } from "@/api/help/friends";

export default {
  name: "Friends",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedLostFoundDXImage: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 互助交友表格数据
      friendsList: [],
      // 失物图片表格数据
      lostFoundDXImageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        helpName: null,
        helpContent: null,
        userId: null,
        phonenumber: null,
        imageId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询互助交友列表 */
    getList() {
      this.loading = true;
      listFriends(this.queryParams).then(response => {
        this.friendsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        helpId: null,
        helpName: null,
        helpContent: null,
        userId: null,
        phonenumber: null,
        imageId: null,
        status: "0",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.lostFoundDXImageList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.helpId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加互助交友";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const helpId = row.helpId || this.ids
      getFriends(helpId).then(response => {
        this.form = response.data;
        this.lostFoundDXImageList = response.data.lostFoundDXImageList;
        this.open = true;
        this.title = "修改互助交友";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.lostFoundDXImageList = this.lostFoundDXImageList;
          if (this.form.helpId != null) {
            updateFriends(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFriends(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const helpIds = row.helpId || this.ids;
      this.$modal.confirm('是否确认删除互助交友编号为"' + helpIds + '"的数据项？').then(function() {
        return delFriends(helpIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 失物图片序号 */
    rowLostFoundDXImageIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 失物图片添加按钮操作 */
    handleAddLostFoundDXImage() {
      let obj = {};
      obj.imagePath = "";
      this.lostFoundDXImageList.push(obj);
    },
    /** 失物图片删除按钮操作 */
    handleDeleteLostFoundDXImage() {
      if (this.checkedLostFoundDXImage.length == 0) {
        this.$modal.msgError("请先选择要删除的失物图片数据");
      } else {
        const lostFoundDXImageList = this.lostFoundDXImageList;
        const checkedLostFoundDXImage = this.checkedLostFoundDXImage;
        this.lostFoundDXImageList = lostFoundDXImageList.filter(function(item) {
          return checkedLostFoundDXImage.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleLostFoundDXImageSelectionChange(selection) {
      this.checkedLostFoundDXImage = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('help/friends/export', {
        ...this.queryParams
      }, `friends_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
