<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="id" label="id">
      </el-table-column>
      <el-table-column property="url" label="url">
        <template slot-scope="scope">
          <div class="urlword" @current-change="handleCurrentChange" @click="handleClick(scope.row.id,scope.row.url)">{{ scope.row.url }}</div>
        </template>
      </el-table-column>
      <el-table-column property="isclick" label="点击?">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="!scope.row.isclick" class="urls" >网址未点击1</el-tag>
          <el-tag type="success" v-else class="urls">网址已点击</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="iserror" label="有bug?">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="!scope.row.iserror"
            @click="handleError(scope.row.id)">确认有bug</el-button>
          <el-tag type="danger" v-else>有bug</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" :current-page="page"
        :page-sizes="[10,20,30,40]" :page-size="perPage" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>


export default {
  name: 'App',
  data() {
    return {
      tableData: [
      ],
      page: 1,
      total: 10,
      perPage: 10,
      currentRow: null
    }
  },

  methods: {
    async getData() {
      let page  = this.page;
      let perPage = this.perPage
      const { status, data} = (await this.$http.get(`/getdata?page=${page}&perPage=${perPage}`)).data;
      if (status == 200) {
        let { datalist, page, perPage, total } = data;
        this.tableData = datalist;
        this.total = total;
        this.page = page;
        this.perPage = perPage
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      // console.log(this.$refs.urls.click());
      document.querySelector(".urls").click();
      // console.log("val:",val);
    },
    async handleClick(id,url) {
      window.open(url)
      await this.$http.get(`/click?id=${id}`);
      this.getData();
     

    },
    async handleError(id) {
      console.log("你点击了链接", id)
      await this.$http.get(`/error?id=${id}`);
      this.getData();
    },
    async handleFinsh(id) {
      console.log("你点击了链接", id)
      await this.$http.get(`/finsh?id=${id}`);
      this.getData();
    },
    handlePageSizeChange(val) {
      this.perPage=val;
      this.getData();
    },
    handleCurrentPageChange(val) {
      this.page=val;
      console.log(this.page)
      this.getData();

    }

  },
  created() {

  },
  mounted() {
    this.getData()
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
  color: red;
}
.block {
  margin: 20px 10px;
}
.urlword {
  cursor: default;
}
</style>
