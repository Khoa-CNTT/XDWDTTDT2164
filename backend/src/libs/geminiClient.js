const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function moderateJob(job) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Bạn là một chuyên gia kiểm duyệt nội dung tuyển dụng. Hãy đọc kỹ bài đăng dưới đây và đánh giá dựa trên 5 tiêu chí:

1. Trong mô tả thì phải có mô tả công việc, yêu cầu ứng viên, quyền lợi.
2. Có nội dung phân biệt giới tính, vùng miền, tôn giáo không?
3. Có yêu cầu trái luật hoặc phi lý không?
4. Ngôn ngữ có lịch sự, chuyên nghiệp, rõ ràng không?
5. Có sai chính tả hoặc lỗi nghiêm trọng nào không?
6. Có dấu hiệu spam, quảng cáo hoặc gây hiểu nhầm không?

Thông tin bài đăng:
---
Tiêu đề: ${job.jobName}
Mô tả: ${job.description}
Địa chỉ: ${job.address}
Yêu cầu: ${job.requirements || "Không có"}
---

Nếu bài viết **phù hợp**, hãy trả lời: APPROVED

Nếu **không phù hợp**, hãy trả lời:
REJECTED - Lý do: [ghi rõ lý do từ 5 tiêu chí trên]

Chỉ trả lời duy nhất 1 dòng theo định dạng trên.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  return response;
}

async function moderateApplyJob(apply, job) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Điểm đánh giá: [số điểm /10]  
Mức độ phù hợp: [Phù hợp / Không phù hợp / Cần xem xét]  
Nhận xét: [viết nhận xét chi tiết, khoảng 3-5 câu về lý do đánh giá, điểm mạnh/yếu của ứng viên]

Chỉ trả lời theo đúng định dạng yêu cầu, không thêm nội dung khác. `;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  return response;
}

module.exports = { moderateJob, moderateApplyJob };
