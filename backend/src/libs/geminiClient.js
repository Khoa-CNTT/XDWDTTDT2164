const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv").config();
const ai = new GoogleGenerativeAI("AIzaSyCTpN9LXt1X8NlS1mhhosRRMVMwKPwXs3k");
const { htmlToText } = require("html-to-text");

async function moderateJob(job) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Chuyển đổi các trường HTML sang văn bản thuần
  const convertToPlainText = (html) => {
    if (!html || typeof html !== "string") return html || "Không có";
    return htmlToText(html, {
      wordwrap: false, // Không tự động xuống dòng
      preserveNewlines: true, // Giữ các dòng mới
      tags: {
        ul: {
          format: "block",
          options: { leadingLineBreaks: 1, lineBreak: "\n- " },
        }, // Danh sách thành dấu đầu dòng
        ol: {
          format: "block",
          options: { leadingLineBreaks: 1, lineBreak: "\n1. " },
        },
        p: { format: "block", options: { leadingLineBreaks: 1 } },
        br: { format: "inline", options: { lineBreak: "\n" } },
      },
    }).trim();
  };

  // Áp dụng chuyển đổi cho các trường có thể chứa HTML
  const plainJob = {
    jobName: job.jobName || "Không có",
    description: convertToPlainText(job.description),
    candidateRequirements: convertToPlainText(job.candidateRequirements),
    benefit: convertToPlainText(job.benefit),
    workTime: job.workTime || "Không có",
    address: job.address || "Không có",
    requirements: convertToPlainText(job.requirements),
  };

  const prompt = `
  Bạn là một chuyên gia kiểm duyệt nội dung tuyển dụng. Hãy đánh giá bài đăng dưới đây dựa trên các tiêu chí sau:
  
  1. Mô tả phải bao gồm: mô tả công việc, yêu cầu ứng viên, quyền lợi.
  2. Ngôn ngữ phải lịch sự, chuyên nghiệp, rõ ràng.
  3. Không có lỗi chính tả hoặc lỗi nghiêm trọng.
  4. Không chứa nội dung spam, quảng cáo hoặc gây hiểu lầm.
  
  Thông tin bài đăng:
  ---
  Tiêu đề: ${plainJob.jobName}
  Mô tả công việc: ${plainJob.description}
  Yêu cầu ứng viên: ${plainJob.candidateRequirements}
  Quyền lợi: ${plainJob.benefit}
  Thời gian làm việc: ${plainJob.workTime}
  Địa chỉ làm việc: ${plainJob.address}
  Yêu cầu khác: ${plainJob.requirements}
  ---
  
  Trả về đúng định dạng sau (chỉ 1 dòng, không xuống dòng, không thêm ký tự thừa):
  - Nếu duyệt: "Kiểm duyệt: Duyệt"
  - Nếu không duyệt: "Kiểm duyệt: Không duyệt. Lý do: <lý do 5-7 câu>"

  Ví dụ:
  - "Kiểm duyệt: Duyệt"
  - "Kiểm duyệt: Không duyệt. Lý do: Bài đăng thiếu mô tả công việc chi tiết, không nêu rõ quyền lợi. Yêu cầu ứng viên không hợp lý khi đòi hỏi kinh nghiệm không liên quan. Ngôn ngữ thiếu chuyên nghiệp, có lỗi chính tả. Cần chỉnh sửa để phù hợp."
  `;

  try {
    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    console.log("Gemini response:", response);
    return response;
  } catch (error) {
    console.error("Gemini error:", error.message);
    return "Kiểm duyệt: Không duyệt. Lý do: Lỗi khi kiểm duyệt nội dung. Vui lòng thử lại.";
  }
}

async function moderateApplyJob(apply, job) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Bạn là một chuyên gia nhân sự dày dạn kinh nghiệm trong việc đánh giá ứng viên ở nhiều ngành nghề khác nhau.

Dưới đây là một bài ứng tuyển cho một vị trí cụ thể. Hãy đọc kỹ nội dung ứng tuyển và mô tả công việc, sau đó đánh giá ứng viên theo các tiêu chí sau:

1. Độ phù hợp với yêu cầu công việc (dựa trên kinh nghiệm, cấp bậc, kỹ năng, học vấn).
2. Khả năng truyền đạt và trình bày rõ ràng, mạch lạc.
3. Mức độ nghiêm túc, chuyên nghiệp của ứng viên.
4. Ngữ pháp, chính tả, và văn phong.
5. Tổng thể: ứng viên có phù hợp với vị trí này hay không?

---

**Nội dung ứng tuyển (do ứng viên viết):**
${apply}

---

**Mô tả công việc:**
${job.description || "Không có mô tả rõ ràng"}

**Yêu cầu ứng viên:**
${job.candidateRequirements || "Không có yêu cầu cụ thể"}

---

**Yêu cầu đầu ra - Chỉ trả lời đúng theo định dạng dưới đây, không thêm bất kỳ phần thừa nào:**

- Điểm đánh giá (theo %):ví dụ: 85/100% 
- Mức độ phù hợp:Phù hợp / Không phù hợp / Cần xem xét
- Nhận xét:Viết khoảng 5–7 câu, nêu rõ lý do đánh giá, điểm mạnh và điểm yếu của ứng viên
- Kỹ năng:Liệt kê danh sách kỹ năng chính của ứng viên
- Kinh nghiệm:Tóm tắt kinh nghiệm nổi bật, nếu không có ghi rõ là chưa có kinh nghiệm

*Không được thêm lời chào, giới thiệu, hay giải thích gì thêm ngoài nội dung trên.*
`;
  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  return response;
}

module.exports = { moderateJob, moderateApplyJob };
