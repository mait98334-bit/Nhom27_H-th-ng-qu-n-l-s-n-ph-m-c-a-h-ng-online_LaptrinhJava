/**
 * Configuration & Helper Utilities
 */
const API_BASE_URL = 'http://localhost:8080';

// Xử lý thông tin người dùng từ localStorage với phân quyền Role chuẩn
function getCurrentUser() {
  const userJson = localStorage.getItem('sisi_user');
  if (userJson) {
    try {
      const u = JSON.parse(userJson);
      if (!u) return null;
      // Đảm bảo user luôn có ID hợp lệ để liên kết đơn hàng chính xác
      if (!u.id) {
        if (u.role === 'ADMIN' || u.username === 'admin1' || u.email === 'mait98334@gmail.com' || u.username === 'google_user') {
          u.id = (u.email === 'mait98334@gmail.com') ? 2 : 1;
        } else {
          u.id = 1;
        }
        localStorage.setItem('sisi_user', JSON.stringify(u));
      }
      // Đảm bảo tài khoản admin1 và email mait98334@gmail.com luôn có vai trò ADMIN
      if (u && (u.email === 'mait98334@gmail.com' || u.username === 'admin1' || (u.role && u.role.toUpperCase() === 'ADMIN'))) {
        u.role = 'ADMIN';
      }
      return u;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setCurrentUser(user) {
  if (user) {
    // Tự động gán ADMIN nếu là tài khoản của bạn hoặc username admin1
    if (user.email === 'mait98334@gmail.com' || user.username === 'admin1' || (user.role && user.role.toUpperCase() === 'ADMIN')) {
      user.role = 'ADMIN';
    }
    localStorage.setItem('sisi_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('sisi_user');
  }
}

function logout() {
  localStorage.removeItem('sisi_user');
  window.location.reload();
}

// Bắt thông tin đăng nhập Google từ URL (nếu redirect từ OAuth2)
function checkOAuth2Redirect() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('login_success') === 'true') {
    const name = params.get('name');
    const email = params.get('email');
    const roleParam = params.get('role');
    const role = roleParam ? roleParam.toUpperCase() : ((email === 'mait98334@gmail.com' || (email && email.includes('admin'))) ? 'ADMIN' : 'CUSTOMER');
    
    // Nếu chưa có user từ auth page và URL có email, mới lưu user mới
    const currentUser = getCurrentUser();
    if (!currentUser && email) {
      const user = {
        id: (email === 'mait98334@gmail.com') ? 2 : 1,
        username: email.split('@')[0],
        fullName: decodeURIComponent(name || email),
        email: decodeURIComponent(email),
        role: role,
        authProvider: 'GOOGLE'
      };
      setCurrentUser(user);
    }
    // Xóa param trên URL cho đẹp
    window.history.replaceState({}, document.title, window.location.pathname);
    const u = getCurrentUser();
    if (u) {
      showToast(`Chào mừng ${u.fullName || u.username} [${u.role}] đã đăng nhập thành công!`);
    }
  }
}

// Định dạng tiền tệ VNĐ
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Render các ký tự sao ⭐
function renderStars(rating) {
  const rate = Math.round(rating || 5);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rate ? '★' : '☆';
  }
  return stars;
}

// Hiển thị thông báo Toast nổi (Non-blocking, hiển thị 5 - 6 giây mà không chặn thao tác màn hình)
let toastTimer = null;

function showToast(message, duration = 5500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  // Hủy bộ đếm giờ cũ nếu có thao tác dồn dập
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const isError = /lỗi|không thể|thất bại|cảnh báo|trống/i.test(message);
  const iconSvg = isError
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span style="flex: 1;">${message}</span>
  `;

  toast.classList.add('show');

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, duration);
}

// Cập nhật giao diện Navbar theo trạng thái đăng nhập và phân quyền ADMIN / CUSTOMER
function updateNavbarUser() {
  const user = getCurrentUser();

  // Cập nhật nhãn nút "Tra cứu đơn" -> "Đơn mua của tôi" nếu đã đăng nhập
  const orderLinks = document.querySelectorAll('a[href="orders.html"]');
  orderLinks.forEach(link => {
    const textSpan = link.querySelector('span');
    if (user) {
      if (textSpan) textSpan.textContent = 'Đơn mua của tôi';
      link.title = 'Xem lịch sử đơn mua của bạn';
    } else {
      if (textSpan) textSpan.textContent = 'Tra cứu đơn';
      link.title = 'Tra cứu đơn hàng';
    }
  });

  const userNav = document.getElementById('navbar-auth');
  if (!userNav) return;

  if (user) {
    const isAdmin = (user.role === 'ADMIN');
    const initial = (user.fullName || user.username || 'U').charAt(0).toUpperCase();
    userNav.innerHTML = `
      <a href="profile.html" class="user-badge" style="display:inline-flex; align-items:center; gap:0.5rem; background:#ffffff; padding:5px 12px; border-radius:9999px; font-weight:600; font-size:0.86rem; text-decoration:none; color:#0f172a; cursor:pointer; border:1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.03);" title="Xem hồ sơ cá nhân">
        <span style="width:22px; height:22px; border-radius:50%; background:#0f172a; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700;">${initial}</span>
        <span>${user.fullName || user.username}</span>
        <span style="font-size:0.72rem; background:${isAdmin ? '#fef2f2; color:#b91c1c; border:1px solid #fee2e2;' : '#f1f5f9; color:#475569; border:1px solid #e2e8f0;'} padding:2px 7px; border-radius:10px; font-weight:700;">${user.role}</span>
      </a>
      ${isAdmin ? `
        <a href="admin.html" class="nav-btn" style="background:#0f172a; color:white; font-weight:600; text-decoration:none; padding:6px 13px; border-radius:8px; font-size:0.85rem; display:inline-flex; align-items:center; gap:6px;">
          Quản Trị Admin
        </a>
      ` : ''}
      <button onclick="logout()" class="nav-btn" style="background:#f8fafc; color:#64748b; border:1px solid #e2e8f0; cursor:pointer; font-weight:600; font-size:0.85rem; padding:6px 12px; border-radius:8px;">
        Đăng xuất
      </button>
    `;
  } else {
    userNav.innerHTML = `
      <a href="login.html?tab=register" class="nav-btn" style="text-decoration:none; color:#334155; font-weight:600; font-size:0.85rem; padding:6px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        Đăng ký
      </a>
      <a href="login.html?tab=login" class="nav-btn nav-btn-primary" style="font-size:0.85rem; padding:6px 14px;">
        Đăng nhập
      </a>
    `;
  }
}

// Hàm Xuất và In Hóa Đơn Bán Hàng chuyên nghiệp (Dành cho cả Khách hàng và Admin)
function printOrderInvoice(order) {
  if (!order) return;
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  const details = order.orderDetails || [];
  const itemsHtml = details.map((d, idx) => {
    let variantTxt = '';
    if (d.selectedColor || d.selectedStorage) {
      const parts = [];
      if (d.selectedColor) parts.push(`Màu: ${d.selectedColor}`);
      if (d.selectedStorage) parts.push(`Bản: ${d.selectedStorage}`);
      variantTxt = `<br><small style="color: #64748b; font-weight: normal;">(${parts.join(' | ')})</small>`;
    }
    return `
      <tr>
        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <strong>${d.product ? d.product.name : 'Sản phẩm'}</strong>
          ${variantTxt}
        </td>
        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #e2e8f0;">${d.quantity}</td>
        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #e2e8f0;">${formatCurrency(d.price)}</td>
        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${formatCurrency(d.price * d.quantity)}</td>
      </tr>
    `;
  }).join('');

  const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Hóa đơn bán hàng #${order.id} - SiSi Shop</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
        .invoice-box { max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .title { font-size: 26px; font-weight: 800; color: #2563eb; margin: 0; }
        .info-section { display: flex; justify-content: space-between; margin: 25px 0; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f1f5f9; padding: 12px 10px; text-align: left; font-size: 13px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
        .total-box { margin-top: 25px; text-align: right; font-size: 16px; }
        .total-price { font-size: 24px; color: #dc2626; font-weight: 800; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
        .sign-block { width: 220px; }
        .sign-title { font-weight: bold; margin-bottom: 70px; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Bấm Để In Hoặc Lưu PDF
          </button>
        </div>

        <div class="header">
          <div>
            <h1 class="title">🛍️ SiSi Shop</h1>
            <p style="margin: 5px 0; font-size: 13px; color: #64748b;">Hệ thống Thương mại Điện tử Đồ án Tốt nghiệp</p>
            <p style="margin: 3px 0; font-size: 13px; color: #64748b;">Hotline: 0333.888.999 | Email: contact@sisishop.vn</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #0f172a; font-size: 20px;">HÓA ĐƠN BÁN HÀNG</h2>
            <p style="margin: 5px 0; font-size: 14px; font-weight: bold; color: #2563eb;">Mã: #ORD-${order.id}</p>
            <p style="margin: 3px 0; font-size: 13px; color: #64748b;">Ngày lập: ${dateStr}</p>
          </div>
        </div>

        <div class="info-section">
          <div>
            <h4 style="margin: 0 0 8px 0; color: #334155;">THÔNG TIN KHÁCH HÀNG:</h4>
            <p style="margin: 3px 0;"><strong>Người nhận:</strong> ${order.receiverName || 'Khách hàng'}</p>
            <p style="margin: 3px 0;"><strong>Số điện thoại:</strong> ${order.receiverPhone || '—'}</p>
            <p style="margin: 3px 0;"><strong>Địa chỉ giao:</strong> ${order.shippingAddress || '—'}</p>
          </div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #334155;">THANH TOÁN & GIAO HÀNG:</h4>
            <p style="margin: 3px 0;"><strong>Hình thức:</strong> ${order.paymentMethod || 'COD'}</p>
            <p style="margin: 3px 0;"><strong>Trạng thái:</strong> <span style="font-weight: bold; color: ${order.paymentStatus === 'PAID' ? '#16a34a' : '#d97706'}">${order.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}</span></p>
            <p style="margin: 3px 0;"><strong>Vận chuyển:</strong> ${order.status || 'PENDING'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">STT</th>
              <th>Tên sản phẩm</th>
              <th style="width: 80px; text-align: center;">SL</th>
              <th style="width: 140px; text-align: right;">Đơn giá</th>
              <th style="width: 150px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <p style="margin: 5px 0;">Tổng tiền hàng: <strong>${formatCurrency(order.totalPrice)}</strong></p>
          <p style="margin: 5px 0;">Phí vận chuyển: <strong>0 ₫ (Miễn phí)</strong></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 10px 0;">
          <p style="margin: 5px 0; font-size: 16px;">TỔNG CỘNG THANH TOÁN:</p>
          <div class="total-price">${formatCurrency(order.totalPrice)}</div>
        </div>

        <div class="signatures">
          <div class="sign-block">
            <div class="sign-title">Khách hàng nhận hàng<br><small style="font-weight: normal; color: #64748b;">(Ký và ghi rõ họ tên)</small></div>
            <div style="font-weight: bold;">${order.receiverName || ''}</div>
          </div>
          <div class="sign-block">
            <div class="sign-title">Đại diện SiSi Shop<br><small style="font-weight: normal; color: #64748b;">(Ký, đóng dấu)</small></div>
            <div style="font-weight: bold;">Admin Hệ Thống</div>
          </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
