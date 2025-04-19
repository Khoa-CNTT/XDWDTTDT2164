<template>
  <div class="hierarchy-management">
    <h2>Quản Lý Cấp Bậc</h2>
    <router-link to="/" class="mb-3 d-inline-block">Quay trở lại trang chủ?</router-link>
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Quản Lý Cấp Bậc</h5>
        <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
          style="width: 150px; height: 40px" :disabled="rankStore.isLoading">
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="rankStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="rankStore.ranks.length === 0" class="text-center">
          Không có cấp bậc nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Tên cấp bậc</th>
                <th>Mã code</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(rank, index) in rankStore.ranks" :key="rank.id">
                <td>
                  {{ index + 1 }}
                </td>
                <td>{{ rank.rankName }}</td>
                <td>{{ rank.rankSlug || "N/A" }}</td>
                <td>
                  <span :class="[
                    'badge',
                    rank.deletedAt ? 'bg-danger' : 'bg-success',
                  ]">
                    {{ rank.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#update-modal"
                    @click="loadRankForUpdate(rank)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger me-2" @click="deleteRank(rank.id)" :disabled="rankStore.isLoading">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="rankStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: rankStore.currentPage === 1 }">
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li v-for="page in rankStore.totalPages" :key="page" class="page-item"
                :class="{ active: rankStore.currentPage === page }">
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{
                disabled: rankStore.currentPage === rankStore.totalPages,
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
            Thêm mới cấp bậc
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên cấp bậc</label>
            <input type="text" class="form-control" v-model="newRank.rankName" :disabled="rankStore.isLoading" />
            <small v-if="rankStore.error" class="text-danger">
              {{ rankStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="rankStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addNewRank" :disabled="rankStore.isLoading">
            <span v-if="rankStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
            </span>
            <span v-else>Thêm mới</span>
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
            Cập nhật cấp bậc
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên cấp bậc</label>
            <input type="text" class="form-control" v-model="updateRank.rankName" :disabled="rankStore.isLoading" />
            <small v-if="rankStore.error" class="text-danger">
              {{ rankStore.error }}
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="rankStore.isLoading">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateRankDetails" :disabled="rankStore.isLoading">
            <span v-if="rankStore.isLoading">
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
import { useRankStore } from "@stores/useRankStore";

export default {
  name: "HierarchyManagement",
  setup() {
    const rankStore = useRankStore();
    return { rankStore };
  },
  data() {
    return {
      newRank: {
        rankName: "",
      },
      updateRank: {
        id: null,
        rankName: "",
      },
    };
  },
  methods: {
    // Lấy danh sách cấp bậc
    async fetchRanks(page = 1) {
      try {
        await this.rankStore.fetchRanks(page, this.rankStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cấp bậc:", error);
      }
    },

    // Phân trang
    previousPage() {
      if (this.rankStore.currentPage > 1) {
        this.fetchRanks(this.rankStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.rankStore.currentPage < this.rankStore.totalPages) {
        this.fetchRanks(this.rankStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.rankStore.totalPages) {
        this.fetchRanks(page);
      }
    },

    // Xử lý thêm mới
    async addNewRank() {
      if (!this.newRank.rankName) {
        alert("Vui lòng nhập tên cấp bậc");
        return;
      }

      const rankData = {
        rankName: this.newRank.rankName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.rankStore.error = null;
        await this.rankStore.addNewRank(rankData);
        this.resetForm();

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới cấp bậc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetForm() {
      this.newRank = {
        rankName: "",
      };
    },

    // Xử lý cập nhật
    loadRankForUpdate(rank) {
      this.updateRank = {
        id: rank.id,
        rankName: rank.rankName,
      };
      // Reset lỗi khi mở modal cập nhật
      this.rankStore.error = null;
    },
    async updateRankDetails() {
      if (!this.updateRank.rankName) {
        alert("Vui lòng nhập tên cấp bậc");
        return;
      }

      const rankData = {
        rankName: this.updateRank.rankName,
      };

      try {
        // Reset lỗi trước khi gọi API
        this.rankStore.error = null;
        await this.rankStore.updateRank(this.updateRank.id, rankData);
        this.resetUpdateForm();

        // Đóng modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật cấp bậc:", error);
        // Lỗi đã được xử lý trong store (toast.error), không đóng modal
      }
    },
    resetUpdateForm() {
      this.updateRank = {
        id: null,
        rankName: "",
      };
    },

    // Xử lý xóa
    async deleteRank(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa cấp bậc này?")) {
        return;
      }
      try {
        await this.rankStore.deleteRank(id);
      } catch (error) {
        console.error("Lỗi khi xóa cấp bậc:", error);
      }
    },
  },
  mounted() {
    this.fetchRanks(); // Lấy danh sách cấp bậc khi component được mount
  },
};
</script>

<style scoped>
.hierarchy-management {
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
