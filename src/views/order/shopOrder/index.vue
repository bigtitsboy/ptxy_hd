<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单金额" prop="orderPrice">
        <el-input
          v-model="queryParams.orderPrice"
          placeholder="请输入订单金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="买家用户ID" prop="buyerUserId">
        <el-input
          v-model="queryParams.buyerUserId"
          placeholder="请输入买家用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人" prop="consignee">
        <el-input
          v-model="queryParams.consignee"
          placeholder="请输入收货人"
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
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请输入订单状态">
          <el-option
            v-for="item in orderTypeList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>

        <!--        <el-input-->
        <!--          v-model="queryParams.status"-->
        <!--          placeholder="请输入订单状态"-->
        <!--          clearable-->
        <!--          size="small"-->
        <!--          @keyup.enter.native="handleQuery"-->
        <!--        />-->
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
          v-hasPermi="['order:shopOrder:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order:shopOrder:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:shopOrder:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:shopOrder:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="商品订单ID" align="center" prop="orderId"/>
      <el-table-column label="订单金额" align="center" prop="orderPrice"/>
      <el-table-column label="买家用户ID" align="center" prop="buyerUserId"/>
      <el-table-column label="收货人" align="center" prop="consignee"/>
      <el-table-column label="详细地址" align="center" prop="addressContent"/>
      <el-table-column label="手机号码" align="center" prop="phonenumber"/>
      <el-table-column label="订单状态" align="center" prop="status" :formatter="formatter"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['order:shopOrder:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order:shopOrder:remove']"
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

    <!-- 添加或修改商品订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单金额" prop="orderPrice">
          <el-input v-model="form.orderPrice" placeholder="请输入订单金额"/>
        </el-form-item>
        <el-form-item label="买家用户ID" prop="buyerUserId">
          <el-input v-model="form.buyerUserId" placeholder="请输入买家用户ID"/>
        </el-form-item>
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="form.consignee" placeholder="请输入收货人"/>
        </el-form-item>
        <el-form-item label="详细地址">
          <editor v-model="form.addressContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <!--          <el-input v-model="form.status" placeholder="请输入订单状态"/>-->

          <el-select v-model="form.status" placeholder="请输入订单状态">
            <el-option
              v-for="item in orderTypeList"
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
        <el-divider content-position="center">订单货物信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddOrderGoods">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteOrderGoods">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="orderGoodsList" :row-class-name="rowOrderGoodsIndex"
                  @selection-change="handleOrderGoodsSelectionChange" ref="orderGoods"
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="商品ID" prop="goodsId">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsId" placeholder="请输入商品ID"/>
            </template>
          </el-table-column>
          <el-table-column label="商品数量" prop="goodsNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsNumber" placeholder="请输入商品数量"/>
            </template>
          </el-table-column>
          <el-table-column label="订单货物状态" prop="status">
            <template slot-scope="scope">
              <el-input v-model="scope.row.status" placeholder="请输入订单货物状态"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
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
import { listShopOrder, getShopOrder, delShopOrder, addShopOrder, updateShopOrder } from '@/api/order/shopOrder'

export default {
  name: 'ShopOrder',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedOrderGoods: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品订单表格数据
      shopOrderList: [],
      // 订单货物表格数据
      orderGoodsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      orderTypeList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderPrice: null,
        buyerUserId: null,
        consignee: null,
        addressContent: null,
        phonenumber: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderPrice: [
          { required: true, message: '订单金额不能为空', trigger: 'blur' }
        ],
        buyerUserId: [
          { required: true, message: '买家用户ID不能为空', trigger: 'blur' }
        ],
        consignee: [
          { required: true, message: '收货人不能为空', trigger: 'blur' }
        ],
        addressContent: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('order_type').then(res => {
      this.orderTypeList = (res.data)
    })
  },
  methods: {
    formatter(row) {
      // console.log(row.status)
      return this.orderTypeList[this.orderTypeList.findIndex(x => x.dictValue === row.status)].dictLabel
      // return row.dictLabel
    },
    /** 查询商品订单列表 */
    getList() {
      this.loading = true
      listShopOrder(this.queryParams).then(response => {
        this.shopOrderList = response.rows
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
        orderId: null,
        orderPrice: null,
        buyerUserId: null,
        consignee: null,
        addressContent: null,
        phonenumber: null,
        status: '0',
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      }
      this.orderGoodsList = []
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
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加商品订单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const orderId = row.orderId || this.ids
      getShopOrder(orderId).then(response => {
        this.form = response.data
        this.orderGoodsList = response.data.orderGoodsList
        this.open = true
        this.title = '修改商品订单'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.orderGoodsList = this.orderGoodsList
          if (this.form.orderId != null) {
            updateShopOrder(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addShopOrder(this.form).then(response => {
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
      const orderIds = row.orderId || this.ids
      this.$modal.confirm('是否确认删除商品订单编号为"' + orderIds + '"的数据项？').then(function() {
        return delShopOrder(orderIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 订单货物序号 */
    rowOrderGoodsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    /** 订单货物添加按钮操作 */
    handleAddOrderGoods() {
      let obj = {}
      obj.goodsId = ''
      obj.goodsNumber = ''
      obj.status = ''
      obj.remark = ''
      this.orderGoodsList.push(obj)
    },
    /** 订单货物删除按钮操作 */
    handleDeleteOrderGoods() {
      if (this.checkedOrderGoods.length == 0) {
        this.$modal.msgError('请先选择要删除的订单货物数据')
      } else {
        const orderGoodsList = this.orderGoodsList
        const checkedOrderGoods = this.checkedOrderGoods
        this.orderGoodsList = orderGoodsList.filter(function(item) {
          return checkedOrderGoods.indexOf(item.index) == -1
        })
      }
    },
    /** 复选框选中数据 */
    handleOrderGoodsSelectionChange(selection) {
      this.checkedOrderGoods = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('order/shopOrder/export', {
        ...this.queryParams
      }, `shopOrder_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
