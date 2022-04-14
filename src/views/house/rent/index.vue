<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租房名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入租房名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租房价格" prop="housePrice">
        <el-input
          v-model="queryParams.housePrice"
          placeholder="请输入租房价格"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出租方式" prop="rentWay">
        <el-input
          v-model="queryParams.rentWay"
          placeholder="请输入出租方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租房地址" prop="houseAddress">
        <el-input
          v-model="queryParams.houseAddress"
          placeholder="请输入租房地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租房面积" prop="houseArea">
        <el-input
          v-model="queryParams.houseArea"
          placeholder="请输入租房面积"
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
      <el-form-item label="租房户型id" prop="typeId">
        <el-input
          v-model="queryParams.typeId"
          placeholder="请输入租房户型id"
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
          v-hasPermi="['house:rent:add']"
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
          v-hasPermi="['house:rent:edit']"
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
          v-hasPermi="['house:rent:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['house:rent:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="租房ID" align="center" prop="houseId" />
      <el-table-column label="小区名称" align="center" prop="goodsName" />
      <el-table-column label="租房描述" align="center" prop="houseContent" />
      <el-table-column label="租房价格" align="center" prop="housePrice" />
      <el-table-column label="出租方式" align="center" prop="rentWay" />
      <el-table-column label="户型" align="center" prop="houseAddress" />
      <el-table-column label="租房面积" align="center" prop="houseArea" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
      <el-table-column label="租房户型id" align="center" prop="typeId" />
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
            v-hasPermi="['house:rent:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['house:rent:remove']"
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

    <!-- 添加或修改租房对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租房名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入租房名称" />
        </el-form-item>
        <el-form-item label="租房描述">
          <editor v-model="form.houseContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="租房价格" prop="housePrice">
          <el-input v-model="form.housePrice" placeholder="请输入租房价格" />
        </el-form-item>
        <el-form-item label="出租方式" prop="rentWay">
          <el-input v-model="form.rentWay" placeholder="请输入出租方式" />
        </el-form-item>
        <el-form-item label="户型" prop="houseAddress">
          <el-input v-model="form.houseAddress" placeholder="请输入租房地址" />
        </el-form-item>
        <el-form-item label="租房面积" prop="houseArea">
          <el-input v-model="form.houseArea" placeholder="请输入租房面积" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="租房户型id" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入租房户型id" />
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
        <el-divider content-position="center">租房图片信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddRentHouseImage">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteRentHouseImage">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="rentHouseImageList" :row-class-name="rowRentHouseImageIndex" @selection-change="handleRentHouseImageSelectionChange" ref="rentHouseImage">
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
import { listRent, getRent, delRent, addRent, updateRent } from "@/api/house/rent";

export default {
  name: "Rent",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedRentHouseImage: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 租房表格数据
      rentList: [],
      // 租房图片表格数据
      rentHouseImageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName: null,
        houseContent: null,
        housePrice: null,
        rentWay: null,
        houseAddress: null,
        houseArea: null,
        userId: null,
        phonenumber: null,
        typeId: null,
        imageId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsName: [
          { required: true, message: "租房名称不能为空", trigger: "blur" }
        ],
        houseContent: [
          { required: true, message: "租房描述不能为空", trigger: "blur" }
        ],
        housePrice: [
          { required: true, message: "租房价格不能为空", trigger: "blur" }
        ],
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
    /** 查询租房列表 */
    getList() {
      this.loading = true;
      listRent(this.queryParams).then(response => {
        this.rentList = response.rows;
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
        houseId: null,
        goodsName: null,
        houseContent: null,
        housePrice: null,
        rentWay: null,
        houseAddress: null,
        houseArea: null,
        userId: null,
        phonenumber: null,
        typeId: null,
        imageId: null,
        status: "0",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.rentHouseImageList = [];
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
      this.ids = selection.map(item => item.houseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加租房";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const houseId = row.houseId || this.ids
      getRent(houseId).then(response => {
        this.form = response.data;
        this.rentHouseImageList = response.data.rentHouseImageList;
        this.open = true;
        this.title = "修改租房";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.rentHouseImageList = this.rentHouseImageList;
          if (this.form.houseId != null) {
            updateRent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRent(this.form).then(response => {
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
      const houseIds = row.houseId || this.ids;
      this.$modal.confirm('是否确认删除租房编号为"' + houseIds + '"的数据项？').then(function() {
        return delRent(houseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 租房图片序号 */
    rowRentHouseImageIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 租房图片添加按钮操作 */
    handleAddRentHouseImage() {
      let obj = {};
      obj.imagePath = "";
      this.rentHouseImageList.push(obj);
    },
    /** 租房图片删除按钮操作 */
    handleDeleteRentHouseImage() {
      if (this.checkedRentHouseImage.length == 0) {
        this.$modal.msgError("请先选择要删除的租房图片数据");
      } else {
        const rentHouseImageList = this.rentHouseImageList;
        const checkedRentHouseImage = this.checkedRentHouseImage;
        this.rentHouseImageList = rentHouseImageList.filter(function(item) {
          return checkedRentHouseImage.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleRentHouseImageSelectionChange(selection) {
      this.checkedRentHouseImage = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('house/rent/export', {
        ...this.queryParams
      }, `rent_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
