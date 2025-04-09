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
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
    data() {
        return {
            revenueChartInstance: null,    // Đổi tên biến chart
            pieChartInstance: null,
            selectedRevenueFilter: "month", // Mặc định hiển thị theo tháng
            selectedPieFilter: "day",
            // Data cho biểu đồ đường
            revenueData: {
                day: {
                    labels: ["1", "2", "3", "4", "5", "6", "7"],
                    data: [50000, 75000, 120000, 90000, 150000, 200000, 180000]
                },
                month: {
                    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                    data: [700000, 500000, 200000, 100000, 50000, 10000, 150000, 200000, 300000, 250000, 400000, 600000]
                },
                year: {
                    labels: ["2020", "2021", "2022", "2023", "2024"],
                    data: [1200000, 1500000, 1800000, 2100000, 2500000]
                }
            },
            // Data cho biểu đồ tròn
            pieData: {
                day: {
                    labels: ["Thành công", "Đang xử lý", "Thất bại"],
                    data: [85, 10, 5]
                },
                month: {
                    labels: ["Thành công", "Đang xử lý", "Thất bại"],
                    data: [90, 7, 3]
                },
                year: {
                    labels: ["Thành công", "Đang xử lý", "Thất bại"],
                    data: [88, 8, 4]
                }
            }
        };
    },
    mounted() {
        this.renderPostChart();
        this.renderCandidateChart();
    },
    methods: {
    renderRevenueChart() {
        const ctx = this.$refs.revenueChartCanvas.getContext("2d");
        const { labels, data } = this.revenueData[this.selectedRevenueFilter];

        this.revenueChartInstance = new Chart(ctx, {
            type: "line", // Đổi thành line chart
            data: {
                labels,
                datasets: [{
                    label: "Doanh thu (VNĐ)",
                    data,
                    borderColor: "#36a2eb",
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `${value / 1000}k`
                        }
                    }
                }
            }
        });
    },
    renderPieChart() {
        const ctx = this.$refs.pieChartCanvas.getContext("2d");
        const { labels, data } = this.pieData[this.selectedPieFilter];

        this.pieChartInstance = new Chart(ctx, {
            type: "doughnut", // Biểu đồ doughnut
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ["#4BC0C0", "#FFCE56", "#FF6384"],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },
    updateRevenueChart() {
        if (this.revenueChartInstance) this.revenueChartInstance.destroy();
        this.renderRevenueChart();
    },
    updatePieChart() {
        if (this.pieChartInstance) this.pieChartInstance.destroy();
        this.renderPieChart();
    }
},
mounted() {
    this.renderRevenueChart();
}
};
</script>

<style scoped>
.title-header {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>