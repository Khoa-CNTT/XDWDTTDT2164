const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv").config();
const ai = new GoogleGenerativeAI("AIzaSyCTpN9LXt1X8NlS1mhhosRRMVMwKPwXs3k");

async function moderateJob(job) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Bạn là một chuyên gia kiểm duyệt nội dung tuyển dụng. Hãy đánh giá bài đăng dưới đây dựa trên các tiêu chí sau:
  
  1. Mô tả phải bao gồm: mô tả công việc, yêu cầu ứng viên, quyền lợi.
  2. Không được chứa nội dung phân biệt giới tính, vùng miền, tôn giáo.
  3. Không có yêu cầu trái luật hoặc phi lý.
  4. Ngôn ngữ phải lịch sự, chuyên nghiệp, rõ ràng.
  5. Không có lỗi chính tả hoặc lỗi nghiêm trọng.
  6. Không chứa nội dung spam, quảng cáo hoặc gây hiểu lầm.
  
  Thông tin bài đăng:
  ---
  Tiêu đề: ${job.jobName}
  Mô tả công việc: ${job.description}
  Yêu cầu ứng viên: ${job.candidateRequirements}
  Quyền lợi: ${job.benefit}
  Thời gian làm việc: ${job.workTime}
  Địa chỉ làm việc: ${job.address}
  Yêu cầu khác: ${job.requirements || "Không có"}
  ---
  
  Hãy trả lời theo đúng định dạng sau:
  Kiểm duyệt: [Duyệt/Không duyệt]
  Nếu là **Không duyệt**, hãy đưa ra lý do (5–7 câu, giải thích rõ vấn đề).
  
  Chỉ trả lời duy nhất 1 dòng theo định dạng trên.
  `;
  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  return response;
}

async function moderateApplyJob(apply, job) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Bạn là một chuyên gia nhân sự có kinh nghiệm tuyển dụng trong nhiều lĩnh vực. Dưới đây là một bài ứng tuyển, hãy đọc kỹ và đưa ra đánh giá theo các tiêu chí sau:

1. Độ phù hợp với yêu cầu công việc (dựa trên kinh nghiệm, kỹ năng, học vấn).
2. Khả năng truyền đạt, trình bày rõ ràng, mạch lạc.
3. Mức độ nghiêm túc, chuyên nghiệp của ứng viên.
4. Ngữ pháp, chính tả, và văn phong.
5. Tổng thể: ứng viên có phù hợp với vị trí này hay không?

---

Nội dung ứng tuyển:
[Ứng viên viết: ${apply}]
---

Yêu cầu công việc:
[${job.description || "Không có yêu cầu rõ ràng"}]

---

Hãy trả lời theo định dạng sau:

Điểm đánh giá (theo %): [số điểm /100%]  
Mức độ phù hợp: [Phù hợp / Không phù hợp / Cần xem xét]  
Nhận xét: [viết nhận xét chi tiết, khoảng 5-7 câu về lý do đánh giá, điểm mạnh/yếu của ứng viên]

Chỉ trả lời theo đúng định dạng yêu cầu, không thêm nội dung khác. `;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  return response;
}

module.exports = { moderateJob, moderateApplyJob };
