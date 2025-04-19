<template>
  <div class="formofwork-list">
    <h2>Danh Sách Kinh Nghiệm Làm Việc</h2>
    <router-link to="/" class="mb-3 d-inline-block">Quay trở lại trang chủ?</router-link>
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Kinh Nghiệm Làm Việc</h5>
        <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
          style="width: 150px; height: 40px" :disabled="experienceStore.isLoading">
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="experienceStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="experienceStore.experiences.length === 0" class="text-center">
          Không có kinh nghiệm làm việc nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Yêu cầu kinh nghiệm làm việc</th>
                <th>Mã code</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(experience, index) in experienceStore.experiences" :key="experience.id">
                <td>
                  {{ index + 1 }}
                </td>
                <td>{{ experience.experienceName }}</td>
                <td>{{ experience.experienceSlug || "N/A" }}</td>
                <td>
                  <span :class="[
                    'badge',
                    experience.deletedAt ? 'bg-danger' : 'bg-success',
                  ]">
                    {{ experience.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#update-modal"
                    @click="loadExperienceForUpdate(experience)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger me-2" @click="deleteExperience(experience.id)"
                    :disabled="experienceStore.isLoading">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="experienceStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: experienceStore.currentPage === 1 }">
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li v-for="page in experienceStore.totalPages" :key="page" class="page-item"
                :class="{ active: experienceStore.currentPage === page }">
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{
                disabled:
                  experienceStore.currentPage === experienceStore.totalPages,
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
            Thêm mới yêu cầu
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Kinh nghiệm làm việc</label>
            <input type="text" class="form-control" v-model="newExperience.experienceName"
              :disabled="experienceStore.isLoading" />
            <small v-if="experienceStore.error" class="text-danger">
              {{ experienceStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="experienceStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addNewExperience" :disabled="experienceStore.isLoading">
            <span v-if="experienceStore.isLoading">
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
            Cập nhật kinh nghiệm làm việc
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Kinh nghiệm làm việc</label>
            <input type="text" class="form-control" v-model="updateExperience.experienceName"
              :disabled="experienceStore.isLoading" />
            <small v-if="experienceStore.error" class="text-danger">
              {{ experienceStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="experienceStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateExperienceDetails"
            :disabled="experienceStore.isLoading">
            <span v-if="experienceStore.isLoading">
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
import { useExperienceStore } from "@stores/useExperienceStore";

export default {
  name: "ListExperience",
  setup() {
    const experienceStore = useExperienceStore();
    return { experienceStore };
  },
  data() {
    return {
      newExperience: {
        experienceName: "",
      },
      updateExperience: {
        id: null,
        experienceName: "",
      },
    };
  },
  methods: {
    // Lấy danh sách kinh nghiệm làm việc
    async fetchExperiences(page = 1) {
      try {
        await this.experienceStore.fetchExperiences(
          page,
          this.experienceStore.pageSize
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kinh nghiệm làm việc:", error);
      }
    },

    // Phân trang
    previousPage() {
      if (this.experienceStore.currentPage > 1) {
        this.fetchExperiences(this.experienceStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.experienceStore.currentPage < this.experienceStore.totalPages) {
        this.fetchExperiences(this.experienceStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.experienceStore.totalPages) {
        this.fetchExperiences(page);
      }
    },

    // Xử lý thêm mới
    async addNewExperience() {
      if (!this.newExperience.experienceName) {
        alert("Vui lòng nhập kinh nghiệm làm việc");
        return;
      }

      const experienceData = {
        experienceName: this.newExperience.experienceName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.experienceStore.error = null;
        await this.experienceStore.addNewExperience(experienceData);
        this.resetForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới kinh nghiệm làm việc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetForm() {
      this.newExperience = {
        experienceName: "",
      };
    },

    // Xử lý cập nhật
    loadExperienceForUpdate(experience) {
      this.updateExperience = {
        id: experience.id,
        experienceName: experience.experienceName,
      };
      // Reset lỗi khi mở modal cập nhật
      this.experienceStore.error = null;
    },
    async updateExperienceDetails() {
      if (!this.updateExperience.experienceName) {
        alert("Vui lòng nhập kinh nghiệm làm việc");
        return;
      }

      const experienceData = {
        experienceName: this.updateExperience.experienceName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.experienceStore.error = null;
        await this.experienceStore.updateExperience(
          this.updateExperience.id,
          experienceData
        );
        this.resetUpdateForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật kinh nghiệm làm việc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetUpdateForm() {
      this.updateExperience = {
        id: null,
        experienceName: "",
      };
    },

    // Xử lý xóa
    async deleteExperience(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa kinh nghiệm làm việc này?")) {
        return;
      }
      try {
        await this.experienceStore.deleteExperience(id);
      } catch (error) {
        console.error("Lỗi khi xóa kinh nghiệm làm việc:", error);
      }
    },
  },
  mounted() {
    this.fetchExperiences(); // Lấy danh sách khi component được mount
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
