<template>
    <div class="transaction-management">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2>Quản Lý Giao Dịch</h2>
                <a href="blank">Quay trở lại trang chủ?</a>
            </div>
            <div>
                <button class="btn btn-success">Xuất file CSV <i class="fa-solid fa-circle-down"></i></button>
            </div>
        </div>

        <!-- Card doanh thu -->
        <div class="row mt-5">
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Tổng doanh thu hôm nay</h5>
                        <span class="text-success">5.000.000 VNĐ</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Tổng doanh thu tháng này</h5>
                        <span class="text-success">70.000.000 VNĐ</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Tổng số giao dịch</h5>
                        <div>
                            <span class="text-success">Thành công: 90</span> / <span class="text-danger">Thất bại:
                                10</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Tổng tiền nạp vào ví</h5>
                        <span class="text-success">60.000.000 VNĐ</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Biểu đồ doanh thu -->
        <div class="row mt-4">
            <div class="col-lg-7 col-md-12">
                <div class="card p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5>Doanh thu theo thời gian</h5>
                        <select v-model="selectedRevenueFilter" @change="updateRevenueChart" class="form-select"
                            style="width: 100px;">
                            <option value="day">Theo ngày</option>
                            <option value="month">Theo tháng</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>
                    <canvas ref="revenueChartCanvas"></canvas>
                </div>
            </div>
            <div class="col-lg-5 col-md-12">
                <div class="card p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5>Phân bổ doanh thu</h5>
                        <select v-model="selectedPieFilter" @change="updatePieChart" class="form-select"
                            style="width: 100px;">
                            <option value="day">Theo ngày</option>
                            <option value="month">Theo tháng</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>
                    <canvas ref="pieChartCanvas"></canvas>
                </div>
            </div>
        </div>



        <!-- Bảng giao dịch -->
        <div class="card mt-5">
            <table class="table table-bordered table-hover">
                <thead class="table-success text-center align-middle">
                    <tr>
                        <th>STT</th>
                        <th>Mã giao dịch</th>
                        <th>Tên công ty</th>
                        <th>Loại giao dịch</th>
                        <th>Số tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Aciton</th>
                    </tr>
                </thead>
                <tbody class="text-center align-middle">
                    <tr>
                        <td>1</td>
                        <td>PX01231414323</td>
                        <td>Công TNHH Văn Minh</td>
                        <td>Thanh toán bài đăng</td>
                        <td>50.000đ</td>
                        <td>
                            <button class="badge bg-success">Thành công</button>
                        </td>
                        <td>22:50 3/4/2025</td>
                        <td>
                            <button class="btn btn-success me-2" data-bs-toggle="modal"
                                data-bs-target="#update-modal">Xem chi tiết</button>
                            <button class="btn btn-danger me-2">
                                Hoàn Tiền
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

export default {
    name: "UserManagement",

}
</script>

<style scoped>
.title-header {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>