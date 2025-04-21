<template>
  <div>
    <div class="user-management mt-3">
      <h2>Danh Sách Người Dùng</h2>
      <a href="blank">Quay trở lại trang chủ?</a>
      <div class="card mt-5">
        <div class="card-header">
          <h5 class="title-header">Danh Sách Người Dùng</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Số điện thoại</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr>
                <td>1</td>
                <td>Thái Mai Quang</td>
                <td>012345567</td>
                <td>Nam</td>
                <td>22/12/2003</td>
                <td>admin</td>
                <td><span class="badge bg-success">Đã kích hoạt</span></td>
                <td>
                  <button
                    class="btn btn-warning me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger">
                    <i class="fa-solid fa-user-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Cập nhật người dùng
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6">
                <label>Tên người dùng</label>
                <input class="form-control" type="text" />
              </div>
              <div class="col-6">
                <label>Số điện thoại</label>
                <input class="form-control" type="text" />
              </div>
            </div>
            <div class="mt-2">
              <label>Địa chỉ</label>
              <input class="form-control" type="text" />
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <label for="gioi_tinh" class="form-label">Giới tính</label>
                <select
                  class="form-select"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  aria-placeholder="Chọn giới tính..."
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div class="col-6">
                <label>Ngày sinh</label>
                <input class="form-control" type="date" />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <label for="gioi_tinh" class="form-label">Quyền</label>
                <select
                  class="form-select"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  aria-placeholder="Chọn quyền truy cập"
                >
                  <option value="Nam">admin</option>
                  <option value="Nữ">Ứng viên</option>
                  <option value="Khác">Công ty</option>
                </select>
              </div>
              <div class="col-6">
                <label for="gioi_tinh" class="form-label">Trạng thái</label>
                <select
                  class="form-select"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  aria-placeholder="Chọn trạng thái..."
                >
                  <option value="Nam">Kích hoạt</option>
                  <option value="Nữ">Dừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
};
</script>

<style scoped>
/* General container */
.user-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc; /* Light background for depth */
  border-radius: 12px;
  min-height: 100vh;
  margin-top: 0; /* Remove default margin */
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b; /* Dark slate for contrast */
  margin-bottom: 15px;
}

a[href="blank"] {
  font-size: 0.95rem;
  color: #2563eb; /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

a[href="blank"]:hover {
  color: #1e40af; /* Darker blue on hover */
  transform: translateX(-3px); /* Subtle shift */
}

a[href="blank"]::before {
  content: "\f060"; /* Font Awesome arrow-left */
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background: #ffffff;
  margin-top: 20px;
  overflow: hidden;
}

.card-header {
  background: #eff6ff; /* Light blue header */
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.title-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Table */
.card-body {
  padding: 25px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin-bottom: 0;
  font-size: 0.95rem;
  border-collapse: separate;
  border-spacing: 0;
}

.table th,
.table td {
  vertical-align: middle;
  padding: 12px 15px;
  border-color: #e2e8f0; /* Light border */
}

.table th {
  background: #f1f5f9; /* Light slate header */
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc; /* Subtle hover effect */
  transition: background 0.2s ease;
}

.table td {
  color: #334155; /* Dark slate text */
}

/* Badges */
.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.badge.bg-success {
  background: #d1fae5; /* Light green */
  color: #065f46;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-warning {
  background: #f59e0b; /* Amber */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(245, 158, 11, 0.2);
}

.btn-danger {
  background: #ef4444; /* Red */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

.btn-primary {
  background: #2563eb; /* Vibrant blue */
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background: #1e40af;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background: #6b7280; /* Gray */
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: #ffffff;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Modal */
.modal-dialog {
  max-width: 700px; /* Wider for form layout */
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

.modal-header {
  background: #f1f5f9; /* Light slate */
  border-bottom: 1px solid #e2e8f0;
  padding: 15px 20px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
}

/* Form */
.modal-body label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
  display: block;
}

.form-control,
.form-select {
  border: 1px solid #d1d5db; /* Light gray */
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.row {
  margin-bottom: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .user-management {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 15px;
  }

  .table th,
  .table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .modal-dialog {
    margin: 20px;
  }

  .modal-body {
    padding: 15px;
  }

  .row {
    flex-direction: column;
    gap: 15px;
  }

  .col-6 {
    width: 100%; /* Full-width inputs on mobile */
  }
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .btn-warning,
  .btn-danger {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
