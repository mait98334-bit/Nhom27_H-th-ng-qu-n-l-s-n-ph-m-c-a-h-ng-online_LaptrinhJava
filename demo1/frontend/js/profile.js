document.addEventListener('DOMContentLoaded', () => {
  updateNavbarUser();
  loadUserProfile();
});

async function loadUserProfile() {
  const user = getCurrentUser();
  if (!user) {
    alert('Vui lòng đăng nhập để xem thông tin tài khoản!');
    window.location.href = 'login.html';
    return;
  }

  const isAdmin = (user.role === 'ADMIN');

  // 1. Render Avatar & Basic Info
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) {
    avatarEl.textContent = isAdmin ? '👑' : '👤';
    if (isAdmin) {
      avatarEl.classList.add('avatar-admin');
    }
  }

  document.getElementById('profileName').textContent = user.fullName || user.username;
  document.getElementById('profileEmail').textContent = user.email || 'Chưa liên kết email';

  // 2. Render Role Badge
  const roleBadgeEl = document.getElementById('profileRoleBadge');
  if (roleBadgeEl) {
    roleBadgeEl.innerHTML = isAdmin
      ? `<span class="tag-badge" style="background:#fee2e2; color:#b91c1c; font-size:0.9rem; padding:4px 14px; font-weight:800;">👑 QUẢN TRỊ VIÊN (ADMIN)</span>`
      : `<span class="tag-badge" style="background:#e0e7ff; color:#3730a3; font-size:0.9rem; padding:4px 14px; font-weight:800;">👤 KHÁCH HÀNG (CUSTOMER)</span>`;
  }

  // 3. Quick Action Button if Admin
  const actionArea = document.getElementById('adminQuickAction');
  if (actionArea && isAdmin) {
    actionArea.innerHTML = `
      <a href="admin.html" class="nav-btn" style="background:#2563eb; color:white; font-weight:700; text-decoration:none; padding:10px 18px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(37,99,235,0.3);">
        ⚙️ Vào Trang Quản Trị Hệ Thống ➔
      </a>
    `;
  }

  // 4. Fill in Edit Form
  document.getElementById('inputFullName').value = user.fullName || '';
  document.getElementById('inputEmail').value = user.email || '';
  document.getElementById('inputUsername').value = user.username || '';
  
  // Kiểm tra chính xác phương thức đăng nhập:
  const isGoogle = (user.authProvider === 'GOOGLE');
  document.getElementById('inputAuthType').value = isGoogle
    ? 'Google OAuth2 Client (Đăng nhập nhanh bảo mật Google)'
    : 'Tài khoản Nội bộ (Đăng ký qua Form - Mật khẩu mã hóa BCrypt)';

  // 5. Fetch User Orders to calculate stats
  await loadUserStats(user);

  // 6. Render Privileges List
  renderPrivileges(isAdmin);
}

async function loadUserStats(user) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    if (!res.ok) return;
    const allOrders = await res.json();

    // Lọc các đơn của user
    const myOrders = allOrders.filter(o => {
      if (o.user && o.user.id && user.id) return o.user.id === user.id;
      if (o.user && o.user.username && user.username) return o.user.username === user.username;
      return true; // Fallback demo
    });

    const countEl = document.getElementById('userOrderCount');
    const spentEl = document.getElementById('userTotalSpent');

    if (countEl) countEl.textContent = myOrders.length;
    if (spentEl) {
      const totalSpent = myOrders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
      spentEl.textContent = formatCurrency(totalSpent);
    }
  } catch (e) {
    console.error('Lỗi tính toán chỉ số đơn hàng:', e);
  }
}

function renderPrivileges(isAdmin) {
  const container = document.getElementById('privilegesList');
  if (!container) return;

  if (isAdmin) {
    container.innerHTML = `
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">📊</span>
        <div>
          <strong>Bảng Điều Khiển Quản Trị Doanh Nghiệp</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Xem biểu đồ doanh thu Chart.js, KPI đơn hàng, kiểm soát kho tồn và nhóm hàng theo thời gian thực.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">📦</span>
        <div>
          <strong>Quản Lý Toàn Bộ Sản Phẩm & Thư Viện Ảnh (CRUD)</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Thêm mới sản phẩm, tải ảnh lên từ máy tính, chỉnh sửa giá bán và quản lý album nhiều góc ảnh.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">🚚</span>
        <div>
          <strong>Quản Lý Đơn Hàng & Vận Chuyển</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Xem tất cả đơn hàng hệ thống, đổi trạng thái vận chuyển và kích hoạt thanh toán.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">👥</span>
        <div>
          <strong>Phân Quyền Người Dùng Hệ Thống</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Đặc quyền tối cao thay đổi vai trò tài khoản giữa ADMIN và CUSTOMER chỉ với 1 click.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">🖨️</span>
        <div>
          <strong>In Hóa Đơn Bán Hàng VAT</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Xuất phiếu bán hàng chuyên nghiệp kèm chữ ký đại diện cửa hàng ra file PDF.</p>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">🛍️</span>
        <div>
          <strong>Mua Sắm Không Giới Hạn</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Khám phá và đặt mua các sản phẩm công nghệ chính hãng với ưu đãi tốt nhất.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">💳</span>
        <div>
          <strong>Thanh Toán Trực Tuyến Linh Hoạt</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Hỗ trợ 2 phương thức: Tiền mặt COD và Chuyển khoản VietQR MB Bank tự động 24/7.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">📦</span>
        <div>
          <strong>Theo Dõi Đơn Hàng & In Hóa Đơn</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Xem lịch sử đơn mua, tiến trình vận chuyển và in lại hóa đơn mua hàng bất cứ lúc nào.</p>
        </div>
      </div>
      <div class="privilege-item">
        <span style="font-size: 1.3rem;">⭐</span>
        <div>
          <strong>Đánh Giá & Nhận Xét Sản Phẩm</strong>
          <p style="margin: 2px 0 0; color: var(--text-muted);">Chấm điểm sao và chia sẻ trải nghiệm thực tế với cộng đồng người mua hàng.</p>
        </div>
      </div>
    `;
  }
}

// Xử lý Cập nhật thông tin cá nhân
async function handleUpdateProfile(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user || !user.id) {
    showToast('Không tìm thấy ID người dùng!');
    return;
  }

  const fullName = document.getElementById('inputFullName').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const btn = document.getElementById('btnSaveProfile');

  if (!fullName || !email) {
    showToast('Vui lòng điền đủ họ tên và email!');
    return;
  }

  btn.textContent = 'Đang lưu...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email })
    });

    if (!res.ok) throw new Error();

    // Cập nhật localStorage
    user.fullName = fullName;
    user.email = email;
    setCurrentUser(user);

    showToast('🎉 Đã cập nhật thông tin hồ sơ thành công!');
    document.getElementById('profileName').textContent = fullName;
    document.getElementById('profileEmail').textContent = email;
    updateNavbarUser();
  } catch (err) {
    console.error(err);
    showToast('Không thể cập nhật thông tin!');
  } finally {
    btn.textContent = '💾 Lưu Thay Đổi';
    btn.disabled = false;
  }
}
