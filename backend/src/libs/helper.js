const pdfParse = require("pdf-parse");
const fs = require("fs");

const caculatePromotionAmount = (amount) => {
  const amountFloat = parseFloat(amount);

  // Các ngưỡng và tỷ lệ khuyến mãi
  const tier1Min = 100000; // 100k VND
  const tier1Max = 100000; // 1 triệu VND
  const tier1Rate = 0.1; // 10%

  const tier2Min = 1000000; // 1 triệu VND
  const tier2Max = 5000000; // 5 triệu VND
  const tier2Rate = 0.2; // 20%

  const tier3Min = 20000000; // 20 triệu VND
  const tier3Rate = 0.25; // 25%

  let promotionAmount = 0.0;

  if (amountFloat >= tier1Min && amountFloat <= tier1Max) {
    // Nạp từ 100 đến 1 triệu: 10%
    promotionAmount = amountFloat * tier1Rate;
  } else if (amountFloat > tier2Min && amountFloat <= tier2Max) {
    promotionAmount = amountFloat * tier2Rate;
  } else if (amountFloat > tier2Max && amountFloat <= tier3Min) {
    promotionAmount = amountFloat * tier3Rate;
  }
  const promotionAmountFixed = parseFloat(promotionAmount.toFixed(3));
  return promotionAmountFixed;
};

/**
 * Convert a PDF file to plain text.
 * @param {string} filePath - Đường dẫn tới file PDF.
 * @returns {Promise<string>} - Nội dung văn bản từ PDF.
 */
const convertPdfToText = async (file) => {
  try {
    const pdfBuffer = fs.readFileSync(file);
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Lỗi khi chuyển đổi pdf: ", error);
    throw error;
  }
};

const parseGeminiResult = (resultText) => {
  const matchScoreRegex = /Điểm đánh giá:\s*([0-9.]+)%/;
  const suitableRegex = /Mức độ phù hợp:\s*(.+)/;
  const commentRegex = /Nhận xét:\s*(.+)/s;

  const scoreMatch = resultText.match(matchScoreRegex);
  const suitableMatch = resultText.match(suitableRegex);
  const commentMatch = resultText.match(commentRegex);

  return {
    matchScore: scoreMatch ? parseFloat(scoreMatch[1]) : null,
    isSuitable: suitableMatch ? suitableMatch[1].trim() : null,
    moderateReview: commentMatch ? commentMatch[1].trim() : null,
  };
};

const parseGeminiResultMatch = (resultText) => {
  console.log("Parsing Gemini result:", resultText);

  // Regex linh hoạt hơn
  const match = resultText.match(
    /Kiểm duyệt:\s*(Duyệt|Không duyệt)\s*(?:\.?\s*Lý do:\s*(.*))?/i
  );

  if (!match) {
    console.error("Invalid Gemini result format:", resultText);
    return {
      result: "Không duyệt",
      reason:
        "Định dạng phản hồi từ AI không đúng. Vui lòng kiểm tra lại nội dung bài đăng.",
    };
  }

  return {
    result: match[1],
    reason: match[2] || null,
  };
};

module.exports = {
  caculatePromotionAmount,
  convertPdfToText,
  parseGeminiResult,
  parseGeminiResultMatch,
};
