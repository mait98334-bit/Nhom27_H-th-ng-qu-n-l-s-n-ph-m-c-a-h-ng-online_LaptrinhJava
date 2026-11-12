const fs = require('fs');

const seedContent = fs.readFileSync('scripts/seed_products.js', 'utf8');

const startIdx = seedContent.indexOf('const products = [');
const endIdx = seedContent.indexOf('// Sinh câu lệnh SQL');

if (startIdx === -1 || endIdx === -1) {
  console.error("Không tìm thấy vị trí mảng products");
  process.exit(1);
}

const rawArray = seedContent.substring(startIdx + 17, endIdx).trim().replace(/;$/, '');
const products = eval(rawArray);

console.log(`Đã đọc thành công ${products.length} sản phẩm với đầy đủ dấu Tiếng Việt.`);

let sql = `SET NAMES utf8mb4;\nUSE sisi_shop;\n\n`;

// 1. Cập nhật chính xác 49 sản phẩm từ ID 33 đến 81
products.forEach((p, idx) => {
  const targetId = 33 + idx;
  const escName = p.name.replace(/'/g, "''");
  const escDesc = p.desc.replace(/'/g, "''");
  const escColors = p.colors.replace(/'/g, "''");
  const escStorage = p.storage.replace(/'/g, "''");

  sql += `-- Product ID ${targetId}: ${escName}\n`;
  sql += `UPDATE products SET 
  name = '${escName}', 
  description = '${escDesc}', 
  colors = '${escColors}', 
  storage_options = '${escStorage}' 
WHERE id = ${targetId};\n\n`;
});

// 2. Cập nhật lại các đánh giá (reviews) bị lỗi dấu hỏi '?'
const sampleComments = [
  "Sản phẩm chính hãng đóng gói rất kỹ, dùng cực kỳ ưng ý!",
  "Giao hàng siêu tốc, đúng mô tả. Thiết kế rất đẹp và sang trọng.",
  "Chất lượng vượt xa tầm giá, dùng mượt mà và pin rất bền.",
  "Mua làm quà tặng bạn bè ai cũng khen. Rất đáng đồng tiền bát gạo!",
  "Shop tư vấn nhiệt tình, chế độ bảo hành chu đáo. Sẽ tiếp tục ủng hộ!",
  "Trải nghiệm tuyệt vời, âm thanh/hiệu năng rất đỉnh, kết nối nhanh chóng."
];

sql += `-- Cập nhật chuẩn hóa Tiếng Việt cho toàn bộ reviews bị lỗi font\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[0]}' WHERE comment LIKE '%S?n ph?m ch?nh h?ng%';\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[1]}' WHERE comment LIKE '%Giao h?ng si?u t?c%';\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[2]}' WHERE comment LIKE '%Ch?t l??ng v??t xa%';\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[3]}' WHERE comment LIKE '%Mua l?m qu? t?ng%';\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[4]}' WHERE comment LIKE '%Shop t? v?n nhi?t t?nh%';\n`;
sql += `UPDATE reviews SET comment = '${sampleComments[5]}' WHERE comment LIKE '%Tr?i nghi?m tuy?t v?i%';\n`;

const outPath = 'scripts/update_products_utf8.sql';
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Đã xuất file ${outPath} thành công!`);
