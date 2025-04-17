<template>
  <div class="formofwork-list">
    <h2>Danh Sách Hình Thức Làm Việc</h2>
    <router-link to="/" class="mb-3 d-inline-block"
      >Quay trở lại trang chủ?</router-link
    >
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Hình Thức Làm Việc</h5>
        <button
          class="btn btn-primary mt-2"
          data-bs-toggle="modal"
          data-bs-target="#add-modal"
          style="width: 150px; height: 40px"
          :disabled="jobTypeStore.isLoading"
        >
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="jobTypeStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="jobTypeStore.jobTypes.length === 0" class="text-center">
          Không có hình thức làm việc nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Hình thức làm việc</th>
                <th>Mã code</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr
                v-for="(jobType, index) in jobTypeStore.jobTypes"
                :key="jobType.id"
              >
                <td>
                  {{
                    (jobTypeStore.currentPage - 1) * jobTypeStore.pageSize +
                    index +
                    1
                  }}
                </td>
                <td>{{ jobType.jobTypeName }}</td>
                <td>{{ jobType.jobTypeSlug || "N/A" }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      jobType.deletedAt ? 'bg-danger' : 'bg-success',
                    ]"
                  >
                    {{ jobType.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-success me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                    @click="loadJobTypeForUpdate(jobType)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn btn-danger me-2"
                    @click="deleteJobType(jobType.id)"
                    :disabled="jobTypeStore.isLoading"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="jobTypeStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: jobTypeStore.currentPage === 1 }"
              >
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in jobTypeStore.totalPages"
                :key="page"
                class="page-item"
                :class="{ active: jobTypeStore.currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled:
                    jobTypeStore.currentPage === jobTypeStore.totalPages,
                }"
              >
                <button class="page-link" @click="nextPage">Trang sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal thêm mới -->
  <div
    class="modal fade"
    id="add-modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Thêm mới hình thức làm việc
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên hình thức làm việc</label>
            <input
              type="text"
              class="form-control"
              v-model="newJobType.jobTypeName"
              :disabled="jobTypeStore.isLoading"
            />
            <small v-if="jobTypeStore.error" class="text-danger">
              {{ jobTypeStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="jobTypeStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="addNewJobType"
            :disabled="jobTypeStore.isLoading"
          >
            <span v-if="jobTypeStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
            </span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal cập nhật -->
  <div
    class="modal fade"
    id="update-modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Cập nhật hình thức làm việc
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên hình thức làm việc</label>
            <input
              type="text"
              class="form-control"
              v-model="updateJobType.jobTypeName"
              :disabled="jobTypeStore.isLoading"
            />
            <small v-if="jobTypeStore.error" class="text-danger">
              {{ jobTypeStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="jobTypeStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateJobTypeDetails"
            :disabled="jobTypeStore.isLoading"
          >
            <span v-if="jobTypeStore.isLoading">
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
import { useJobTypeStore } from "@stores/useJobTypeStore";

export default {
  name: "ListJobType",
  setup() {
    const jobTypeStore = useJobTypeStore();
    return { jobTypeStore };
  },
  data() {
    return {
      newJobType: {
        jobTypeName: "",
      },
      updateJobType: {
        id: null,
        jobTypeName: "",
      },
    };
  },
  methods: {
    // Lấy danh sách hình thức làm việc
    async fetchJobTypes(page = 1) {
      try {
        await this.jobTypeStore.fetchJobTypes(page, this.jobTypeStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hình thức làm việc:", error);
      }
    },

    // Phân trang
    previousPage() {
      if (this.jobTypeStore.currentPage > 1) {
        this.fetchJobTypes(this.jobTypeStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.jobTypeStore.currentPage < this.jobTypeStore.totalPages) {
        this.fetchJobTypes(this.jobTypeStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.jobTypeStore.totalPages) {
        this.fetchJobTypes(page);
      }
    },

    // Xử lý thêm mới
    async addNewJobType() {
      if (!this.newJobType.jobTypeName) {
        alert("Vui lòng nhập tên hình thức làm việc");
        return;
      }

      const jobTypeData = {
        jobTypeName: this.newJobType.jobTypeName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.jobTypeStore.error = null;
        await this.jobTypeStore.addNewJobType(jobTypeData);
        this.resetForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới hình thức làm việc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetForm() {
      this.newJobType = {
        jobTypeName: "",
      };
    },

    // Xử lý cập nhật
    loadJobTypeForUpdate(jobType) {
      this.updateJobType = {
        id: jobType.id,
        jobTypeName: jobType.jobTypeName,
      };
      // Reset lỗi khi mở modal cập nhật
      this.jobTypeStore.error = null;
    },
    async updateJobTypeDetails() {
      if (!this.updateJobType.jobTypeName) {
        alert("Vui lòng nhập tên hình thức làm việc");
        return;
      }

      const jobTypeData = {
        jobTypeName: this.updateJobType.jobTypeName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.jobTypeStore.error = null;
        await this.jobTypeStore.updateJobType(
          this.updateJobType.id,
          jobTypeData
        );
        this.resetUpdateForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật hình thức làm việc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetUpdateForm() {
      this.updateJobType = {
        id: null,
        jobTypeName: "",
      };
    },

    // Xử lý xóa
    async deleteJobType(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa hình thức làm việc này?")) {
        return;
      }
      try {
        await this.jobTypeStore.deleteJobType(id);
      } catch (error) {
        console.error("Lỗi khi xóa hình thức làm việc:", error);
      }
    },
  },
  mounted() {
    this.fetchJobTypes(); // Lấy danh sách khi component được mount
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
