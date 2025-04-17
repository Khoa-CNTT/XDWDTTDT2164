<template>
    <div class="job-detail-container">
      <!-- Job Header Section -->
      <section class="job-header mb-5" style="background-color: #f3f6fd;">
        <div class="container">
          <h1 class="job-title mb-4">Software Engineer (Android), Libraries</h1>
          <div class="job-tags mb-4">
            <span class="badge bg-light text-dark me-2">Phân đoạn</span>
            <span class="badge bg-light text-dark me-2">Đà Nẵng</span>
            <span class="badge bg-light text-dark me-2">11 giờ trước</span>
            <span class="badge bg-light text-dark me-2">35 - 45 Triệu</span>
          </div>
          <div class="salary-badge">
            <span class="badge text-dark me-2" style="background-color: #e0e4fe;">Toàn thời gian</span>
            <span class="badge text-dark" style="background-color: #fdf2df;">Cấp bách</span>
          </div>
        </div>
      </section>
  
      <!-- Job Description Section -->
      <section class="job-description mb-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="section-title mb-4">Mô tả công việc</h2>
              <p class="job-description-text">
                As a Product Designer, you will work within a Product Delivery Team based with UK, engineering, product and data users. You will help the team design beautiful interfaces that some business challenges for our clients. We work with a number of Tier I banks on building web-based applications for AML, PVC and Sanctions List management workflows. This role is ideal if you are looking to equip your career into the FinTech or Big Data across.
              </p>
  
              <h3 class="mt-5 mb-3">Trách nhiệm chính</h3>
              <ul class="responsibilities-list">
                <li>Be involved in every step of the product design cycle from discovery to developer hazardif and user acceptance testing.</li>
                <li>Work with BMs, product managers and tech teams to lead the Product Design</li>
                <li>Maintain quality of the design process and ensure that when designs are translated into code they accurately reflect the design specifications.</li>
                <li>Accurately estimate design tickets during planning sessions.</li>
                <li>Contribute to selecting sessions involving non-designers/Clients, literals and material UI deliverables including sketch files, style guides, high fidelity prototypes, micro interaction specifications and pattern libraries.</li>
                <li>Ensure design choices are data led by identifying assumptions to test each sprint, and work with the analysts in your team to plan motivated stability test sessions.</li>
                <li>Design pilot perfect responsive UTs and understand that adapting common interface patterns is better for UK than reinventing the wheel</li>
                <li>Present your work to the wider business at Show & Tell sessions.</li>
              </ul>
  
              <h3 class="mt-5 mb-3">Kỹ năng và kinh nghiệm</h3>
              <ul class="skills-list">
                <li>You have at least 3 years' experience working as a Product Designer.</li>
                <li>You have experiences using Sketch and Intrição e Frame X</li>
                <li>You have some previous experiences working in an agile environment – Think new-weeksprints.</li>
                <li>You are familiar using Java and Confluence in your workflow</li>
              </ul>
            </div>
  
            <div class="col-lg-4">
              <!-- Job Overview Card -->
              <div class="card job-overview-card mb-4">
                <div class="card-body">
                  <h5 class="card-title">Tổng quan về công việc</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Daily change</span>
                      <span class="text-muted">Dịch vụ: 1000 trucks</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Ngày hội</span>
                      <span class="text-muted">ban 13/03/2023</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Đối tác</span>
                      <span class="text-muted">01/04/2024</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Tiếp đồ</span>
                      <span class="text-muted">công việc</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>Mức lương</span>
                      <span class="text-primary fw-bold">35 - 45 Triệu</span>
                    </li>
                  </ul>
                </div>
              </div>
  
              <!-- Apply Button -->
              <button class="btn btn-primary w-100 mb-4 py-3">
                <i class="fas fa-paper-plane me-2"></i> Ứng tuyển ngay
              </button>
  
              <!-- Save Job Button -->
              <button class="btn btn-outline-secondary w-100 mb-4 py-3">
                <i class="far fa-heart me-2"></i> Lưu công việc
              </button>
  
              <!-- Share Job Buttons -->
              <div class="social-share mb-4">
                <p class="text-muted mb-2">Chia sẻ công việc:</p>
                <div class="d-flex">
                  <button class="btn btn-outline-primary me-2">
                    <i class="fab fa-facebook-f"></i>
                  </button>
                  <button class="btn btn-outline-info me-2">
                    <i class="fab fa-twitter"></i>
                  </button>
                  <button class="btn btn-outline-danger me-2">
                    <i class="fab fa-linkedin-in"></i>
                  </button>
                  <button class="btn btn-outline-success">
                    <i class="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Related Jobs Section -->
      <section class="related-jobs bg-light py-5">
        <div class="container">
          <h2 class="section-title mb-4">Công việc liên quan</h2>
          <div class="row">
            <div class="col-md-4 mb-4" v-for="(job, index) in relatedJobs" :key="index">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">{{ job.title }}</h5>
                  <div class="job-tags mb-3">
                    <span class="badge bg-light text-dark me-1 mb-1" v-for="(tag, tagIndex) in job.tags" :key="tagIndex">{{ tag }}</span>
                  </div>
                  <div class="salary-badge mb-3">
                    <span class="badge bg-primary">{{ job.salary }}</span>
                  </div>
                  <button class="btn btn-outline-primary w-100">Xem chi tiết</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Company Info Section -->
      <section class="company-info py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="section-title mb-4">Thông tin công ty</h2>
              <div class="company-details">
                <p><strong>Segment</strong><br>Your chi tiết công ty</p>
                
                <div class="row mt-4">
                  <div class="col-md-6">
                    <p><strong>Ngành chính:</strong><br>Phần mềm</p>
                    <p><strong>Quý mô công ty:</strong><br>501 - 1000</p>
                  </div>
                  <div class="col-md-6">
                    <p><strong>Thành lập:</strong><br>2011</p>
                    <p><strong>Điện thoại:</strong><br>0123456789</p>
                  </div>
                </div>
                
                <p class="mt-3"><strong>Email:</strong><br>info@gmail.com</p>
                <p><strong>Địa chỉ:</strong><br>Đà Nẵng</p>
                <a href="https://segment.com" target="_blank" class="text-primary">https://segment.com</a>
              </div>
            </div>
            
            <div class="col-lg-4">
              <div class="card contact-card">
                <div class="card-body">
                  <h5 class="card-title">Superio</h5>
                  <p class="text-muted">Gọi cho chứng tú!</p>
                  <p class="contact-phone"><i class="fas fa-phone me-2"></i> 0857 178 357</p>
                  
                  <address class="mt-4">
                    <i class="fas fa-map-marker-alt me-2"></i> 235 16 Hòa, Phường Khai Trung<br>
                    Quận Gầu Lộ, TP. Đà Nẵng
                  </address>
                  
                  <p class="mt-3"><i class="fas fa-envelope me-2"></i> haiguang92030@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JobDetail',
    data() {
      return {
        relatedJobs: [
          {
            title: 'Software Engineer (Android), Libraries',
            tags: ['Plain draw', 'Go hiking', 'Trip git inside', 'Team help gear', 'Clip bitch'],
            salary: '35 - 45 Triệu'
          },
          {
            title: 'Software Engineer (Android), Libraries',
            tags: ['Plain draw', 'Go hiking', 'Trip git inside', 'Team help gear', 'Clip bitch'],
            salary: '35 - 45 Triệu'
          },
          {
            title: 'Software Engineer (Android), Libraries',
            tags: ['Plain draw', 'Go hiking', 'Trip git inside', 'Team help gear', 'Clip bitch'],
            salary: '35 - 45 Triệu'
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .job-detail-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  .job-header {
    padding: 2rem 0;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .job-title {
    font-size: 2rem;
    font-weight: 700;
    color: #212529;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #212529;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #0d6efd;
    display: inline-block;
  }
  
  .job-description-text, 
  .responsibilities-list, 
  .skills-list {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #495057;
  }
  
  .responsibilities-list li,
  .skills-list li {
    margin-bottom: 0.5rem;
  }
  
  .job-overview-card {
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  
  .job-overview-card .card-title {
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #212529;
  }
  
  .contact-card {
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: none;
  }
  
  .contact-card .card-title {
    font-weight: 600;
    color: #212529;
  }
  
  .contact-phone {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0d6efd;
  }
  
  address {
    font-style: normal;
    color: #6c757d;
  }
  
  .social-share .btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .related-jobs .card {
    transition: transform 0.2s;
    border-radius: 0.5rem;
  }
  
  .related-jobs .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
  
  .related-jobs .card-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .company-details p {
    margin-bottom: 0.8rem;
  }
  </style>