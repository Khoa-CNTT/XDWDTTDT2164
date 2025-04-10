<template>
  <div class="list-skills">
    <h2>Danh Sách Kỹ Năng</h2>
    <router-link to="/" class="mb-3 d-inline-block"
      >Quay trở lại trang chủ?</router-link
    >
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Kỹ Năng</h5>
        <button
          class="btn btn-primary mt-2"
          data-bs-toggle="modal"
          data-bs-target="#add-modal"
          style="width: 150px; height: 40px"
          :disabled="skillStore.isLoading"
        >
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="skillStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="skillStore.skills.length === 0" class="text-center">
          Không có kỹ năng nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Tên kỹ năng</th>
                <th>Mã code</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(skill, index) in paginatedSkills" :key="skill.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ skill.skillName }}</td>
                <td>{{ skill.skillSlug || "N/A" }}</td>
                <td>{{ skill.Categories.categoryName || "N/A" }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      skill.deletedAt ? 'bg-danger' : 'bg-success',
                    ]"
                  >
                    {{ skill.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-success me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                    @click="loadSkillForUpdate(skill)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn btn-danger me-2"
                    @click="deleteSkill(skill.id)"
                    :disabled="skillStore.isLoading"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
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
            Thêm mới kỹ năng
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
            <label class="mb-2">Tên kỹ năng</label>
            <input
              type="text"
              class="form-control"
              v-model="newSkill.skillName"
              :disabled="skillStore.isLoading"
            />
          </div>
          <div class="mt-2">
            <label class="mb-2">Danh mục công việc</label>
            <select
              class="form-select"
              v-model="newSkill.categoryId"
              :disabled="skillStore.isLoading || categories.length === 0"
            >
              <option value="" disabled>Chọn danh mục công việc</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <small v-if="categories.length === 0" class="text-danger">
              Không có danh mục công việc nào.
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="skillStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="addNewSkill"
            :disabled="skillStore.isLoading"
          >
            <span v-if="skillStore.isLoading">
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
            Cập nhật kỹ năng
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
            <label class="mb-2">Tên kỹ năng</label>
            <input
              type="text"
              class="form-control"
              v-model="updateSkill.skillName"
              :disabled="skillStore.isLoading"
            />
          </div>
          <div class="mt-2">
            <label class="mb-2">Danh mục công việc</label>
            <select
              class="form-select"
              v-model="updateSkill.categoryId"
              :disabled="skillStore.isLoading || categories.length === 0"
            >
              <option value="" disabled>Chọn danh mục công việc</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <small v-if="categories.length === 0" class="text-danger">
              Không có danh mục công việc nào.
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="skillStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateSkillDetails"
            :disabled="skillStore.isLoading"
          >
            <span v-if="skillStore.isLoading">
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
import { useSkillStore } from "@stores/useSkillStore";
import { useCategoryStore } from "@stores/useCategoryStore";

export default {
  name: "ListSkills",
  setup() {
    const categoryStore = useCategoryStore();
    const skillStore = useSkillStore();
    return { skillStore, categoryStore };
  },
  data() {
    return {
      newSkill: {
        skillName: "",
        categoryId: "",
      },
      updateSkill: {
        id: null,
        skillName: "",
        categoryId: "",
      },
      categories: [], // Danh sách danh mục công việc
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 8, // Số phần tử mỗi trang
    };
  },
  computed: {
    // Tính tổng số trang
    totalPages() {
      return Math.ceil(this.skillStore.skills.length / this.itemsPerPage);
    },
    // Lấy danh sách kỹ năng cho trang hiện tại
    paginatedSkills() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.skillStore.skills.slice(start, end);
    },
  },
  methods: {
    // Lấy danh sách danh mục
    async fetchCategories() {
      try {
        // Gọi action fetchCategories từ useCategoryStore
        await this.categoryStore.fetchCategories();
        // Gán dữ liệu từ store vào categories
        this.categories = this.categoryStore.categories;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        this.categories = []; // Đảm bảo categories là mảng rỗng nếu có lỗi
      }
    },

    // Lấy danh sách kỹ năng
    async fetchSkills() {
      try {
        await this.skillStore.fetchSkills();
        this.currentPage = 1; // Reset về trang 1 khi dữ liệu thay đổi
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kỹ năng:", error);
      }
    },

    // Phân trang
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    // Xử lý thêm mới
    async addNewSkill() {
      if (!this.newSkill.skillName) {
        alert("Vui lòng nhập tên kỹ năng");
        return;
      }
      if (!this.newSkill.categoryId) {
        alert("Vui lòng chọn danh mục công việc");
        return;
      }

      const skillData = {
        skillName: this.newSkill.skillName,
        categoryId: this.newSkill.categoryId,
      };

      try {
        await this.skillStore.addNewSkill(skillData);
        this.resetForm();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới kỹ năng:", error);
      }
    },
    resetForm() {
      this.newSkill = {
        skillName: "",
        categoryId: "",
      };
    },

    // Xử lý cập nhật
    loadSkillForUpdate(skill) {
      this.updateSkill = {
        id: skill.id,
        skillName: skill.skillName,
        categoryId: skill.categoryId,
      };
    },
    async updateSkillDetails() {
      if (!this.updateSkill.skillName) {
        alert("Vui lòng nhập tên kỹ năng");
        return;
      }
      if (!this.updateSkill.categoryId) {
        alert("Vui lòng chọn danh mục công việc");
        return;
      }

      const skillData = {
        skillName: this.updateSkill.skillName,
        categoryId: this.updateSkill.categoryId,
      };

      try {
        await this.skillStore.updateSkill(this.updateSkill.id, skillData);
        this.resetUpdateForm();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật kỹ năng:", error);
      }
    },
    resetUpdateForm() {
      this.updateSkill = {
        id: null,
        skillName: "",
        categoryId: "",
      };
    },

    // Xử lý xóa
    async deleteSkill(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) {
        return;
      }
      try {
        await this.skillStore.deleteSkill(id);
        this.currentPage = 1; // Reset về trang 1 sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa kỹ năng:", error);
      }
    },
  },
  async mounted() {
    await this.fetchCategories(); // Lấy danh sách danh mục trước
    await this.fetchSkills(); // Lấy danh sách kỹ năng sau
  },
};
</script>

<style scoped>
.list-skills {
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
