<template>
  <div class="formofwork-list">
    <h2>Danh Sách Khoản Lương</h2>
    <router-link to="/" class="mb-3 d-inline-block">Quay trở lại trang chủ?</router-link>
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Khoản Lương</h5>
        <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
          style="width: 150px; height: 40px" :disabled="salaryStore.isLoading">
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="salaryStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="salaryStore.salaries.length === 0" class="text-center">
          Không có khoản lương nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Khoản lương</th>
                <th>Mã code</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(salary, index) in salaryStore.salaries" :key="salary.id">
                <td>
                  {{ index + 1 }}
                </td>
                <td>{{ salary.salaryName }}</td>
                <td>{{ salary.salarySlug || "N/A" }}</td>
                <td>
                  <span :class="[
                    'badge',
                    salary.deletedAt ? 'bg-danger' : 'bg-success',
                  ]">
                    {{ salary.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#update-modal"
                    @click="loadSalaryForUpdate(salary)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger me-2" @click="deleteSalary(salary.id)"
                    :disabled="salaryStore.isLoading">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="salaryStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: salaryStore.currentPage === 1 }">
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li v-for="page in salaryStore.totalPages" :key="page" class="page-item"
                :class="{ active: salaryStore.currentPage === page }">
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{
                disabled: salaryStore.currentPage === salaryStore.totalPages,
              }">
                <button class="page-link" @click="nextPage">Trang sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal thêm mới -->
  <div class="modal fade" id="add-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Thêm mới khoản lương
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Khoảng lương</label>
            <input type="text" class="form-control" v-model="newSalary.salaryName" :disabled="salaryStore.isLoading" />
            <small v-if="salaryStore.error" class="text-danger">
              {{ salaryStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="salaryStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addNewSalary" :disabled="salaryStore.isLoading">
            <span v-if="salaryStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
            </span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal cập nhật -->
  <div class="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Cập nhật khoản lương
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Khoảng lương</label>
            <input type="text" class="form-control" v-model="updateSalary.salaryName"
              :disabled="salaryStore.isLoading" />
            <small v-if="salaryStore.error" class="text-danger">
              {{ salaryStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="salaryStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateSalaryDetails" :disabled="salaryStore.isLoading">
            <span v-if="salaryStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang cập nhật...
            </span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSalaryStore } from "@stores/useSalaryStore";

export default {
  name: "ListSalary",
  setup() {
    const salaryStore = useSalaryStore();
    return { salaryStore };
  },
  data() {
    return {
      newSalary: {
        salaryName: "",
      },
      updateSalary: {
        id: null,
        salaryName: "",
      },
    };
  },
  methods: {
    // Lấy danh sách khoản lương
    async fetchSalaries(page = 1) {
      try {
        await this.salaryStore.fetchSalaries(page, this.salaryStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khoản lương:", error);
      }
    },

    // Phân trang
    previousPage() {
      if (this.salaryStore.currentPage > 1) {
        this.fetchSalaries(this.salaryStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.salaryStore.currentPage < this.salaryStore.totalPages) {
        this.fetchSalaries(this.salaryStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.salaryStore.totalPages) {
        this.fetchSalaries(page);
      }
    },

    // Xử lý thêm mới
    async addNewSalary() {
      if (!this.newSalary.salaryName) {
        alert("Vui lòng nhập khoảng lương");
        return;
      }

      const salaryData = {
        salaryName: this.newSalary.salaryName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.salaryStore.error = null;
        await this.salaryStore.addNewSalary(salaryData);
        this.resetForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới khoản lương:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetForm() {
      this.newSalary = {
        salaryName: "",
      };
    },

    // Xử lý cập nhật
    loadSalaryForUpdate(salary) {
      this.updateSalary = {
        id: salary.id,
        salaryName: salary.salaryName,
      };
      // Reset lỗi khi mở modal cập nhật
      this.salaryStore.error = null;
    },
    async updateSalaryDetails() {
      if (!this.updateSalary.salaryName) {
        alert("Vui lòng nhập khoảng lương");
        return;
      }

      const salaryData = {
        salaryName: this.updateSalary.salaryName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.salaryStore.error = null;
        await this.salaryStore.updateSalary(this.updateSalary.id, salaryData);
        this.resetUpdateForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật khoản lương:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetUpdateForm() {
      this.updateSalary = {
        id: null,
        salaryName: "",
      };
    },

    // Xử lý xóa
    async deleteSalary(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa khoản lương này?")) {
        return;
      }
      try {
        await this.salaryStore.deleteSalary(id);
      } catch (error) {
        console.error("Lỗi khi xóa khoản lương:", error);
      }
    },
  },
  mounted() {
    this.fetchSalaries(); // Lấy danh sách khi component được mount
  },
};
</script>

<style scoped>
.formofwork-list {
  padding: 20px;
}

.title-header {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Style cho card */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: none;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px;
}

.card-header h5 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.card-body {
  padding: 20px;
}

.btn:disabled {
  opacity: 0.65;
}

/* Style cho phân trang */
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  cursor: pointer;
}

/* Style cho thông báo lỗi */
.text-danger {
  font-size: 0.875rem;
}
</style>
