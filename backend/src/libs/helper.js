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

module.exports = {
  caculatePromotionAmount,
};
