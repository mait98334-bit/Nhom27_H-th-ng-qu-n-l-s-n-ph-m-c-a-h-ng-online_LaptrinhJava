const fs = require('fs');

const sampleComments = [
  "Sản phẩm chính hãng đóng gói rất kỹ, dùng cực kỳ ưng ý!",
  "Giao hàng siêu tốc, đúng mô tả. Thiết kế rất đẹp và sang trọng.",
  "Chất lượng vượt xa tầm giá, dùng mượt mà và pin rất bền.",
  "Mua làm quà tặng bạn bè ai cũng khen. Rất đáng đồng tiền bát gạo!",
  "Shop tư vấn nhiệt tình, chế độ bảo hành chu đáo. Sẽ tiếp tục ủng hộ!",
  "Trải nghiệm tuyệt vời, âm thanh/hiệu năng rất đỉnh, kết nối nhanh chóng."
];

// Sinh câu lệnh SQL insert review dựa trên subquery từ products
let sql = `SET NAMES utf8mb4;\n`;

sampleComments.forEach((c, idx) => {
  const rating = idx % 2 === 0 ? 5 : 4;
  const userId = idx % 2 === 0 ? 2 : 1;
  sql += `
INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, ${userId}, ${rating}, '${c}', NOW() - INTERVAL (${idx} + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = ${idx};
`;
});

fs.writeFileSync('scripts/insert_reviews_generated.sql', sql, 'utf8');
console.log('Đã tạo reviews SQL an toàn!');
