/**
 * Orders Page Logic - Quản lý và tra cứu đơn mua hàng cá nhân & toàn hệ thống
 * Tác giả: Mai Thị Trang
 * Hỗ trợ phân quyền: Khách hàng xem đơn cá nhân; Admin xem cả đơn cá nhân và toàn bộ đơn khách.
 */

let currentOrdersView = 'personal'; // 'personal' | 'all'
let cachedPersonalOrders = [];
let cachedAllOrders = [];

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarUser();
  loadCustomerOrders();
});

async function loadCustomerOrders() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  const user = getCurrentUser();

  // 1. TRƯỜNG HỢP: KHÁCH CHƯA ĐĂNG NHẬP
  if (!user) {
    container.innerHTML = `
      <div style="background: white; border: 1px solid var(--border-color); border-radius: 16px; padding: 3rem 1.5rem; text-align: center; max-width: 580px; margin: 0 auto; box-shadow: var(--shadow-sm);">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔒</div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Vui lòng đăng nhập tài khoản</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.8rem; line-height: 1.5;">
          Để bảo mật thông tin đơn hàng, bạn vui lòng đăng nhập tài khoản để theo dõi lịch sử và tiến độ giao hàng của các đơn bạn đã đặt.
        </p>

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
          <a href="login.html?redirect=orders.html" class="nav-btn nav-btn-primary" style="padding: 10px 24px; font-weight: 700; font-size: 0.95rem;">
            Đăng nhập tài khoản
          </a>
          <a href="login.html?tab=register" class="nav-btn nav-btn-outline" style="padding: 10px 18px; font-size: 0.95rem;">
            Tạo tài khoản mới
          </a>
        </div>

        <div style="border-top: 1px dashed var(--border-color); padding-top: 1.8rem; text-align: left;">
          <div style="font-weight: 700; font-size: 0.9rem; color: #334155; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Hoặc tra cứu nhanh bằng Số điện thoại nhận hàng:
          </div>
          <form onsubmit="handleLookupByPhone(event)" style="display: flex; gap: 8px;">
            <input type="text" id="lookupPhoneInput" class="admin-input" placeholder="Ví dụ: 0912345678" style="flex: 1;" required>
            <button type="submit" class="nav-btn nav-btn-primary" style="white-space: nowrap; padding: 8px 18px;">
              Tra cứu
            </button>
          </form>
          <div id="lookupPhoneResult" style="margin-top: 1.2rem;"></div>
        </div>
      </div>
    `;
    return;
  }

  // 2. TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP
  container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 3rem 0;">Đang tải danh sách đơn hàng của bạn...</p>`;

  const userId = user.id || 1;
  const isAdmin = (user.role === 'ADMIN');

  try {
    // Tải đơn hàng cá nhân của tài khoản này
    const resPersonal = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
    cachedPersonalOrders = resPersonal.ok ? await resPersonal.json() : [];

    // Nếu là Admin, đồng thời tải sẵn toàn bộ đơn hàng hệ thống
    if (isAdmin) {
      const resAll = await fetch(`${API_BASE_URL}/api/orders`);
      cachedAllOrders = resAll.ok ? await resAll.json() : [];

      // Nếu tài khoản Admin chưa có đơn cá nhân, tự động hiển thị tab toàn bộ đơn hệ thống
      if (cachedPersonalOrders.length === 0 && cachedAllOrders.length > 0) {
        currentOrdersView = 'all';
      }
    }

    renderOrdersView(user);

  } catch (err) {
    console.error('Lỗi tải đơn hàng:', err);
    container.innerHTML = `
      <div style="text-align:center; padding: 3rem; color: #dc2626;">
        ⚠️ Không thể tải danh sách đơn hàng. Vui lòng kiểm tra kết nối máy chủ!
      </div>
    `;
  }
}

// Hàm render giao diện tùy theo tab đang chọn ('personal' hoặc 'all')
function renderOrdersView(user) {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  const isAdmin = (user.role === 'ADMIN');

  let adminHeaderHtml = '';
  if (isAdmin) {
    adminHeaderHtml = `
      <div style="background: linear-gradient(135deg, #eff6ff, #f8fafc); border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 1.2rem 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-weight: 800; color: #1e40af; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
              <span>🛡️ Bạn đang đăng nhập quyền Quản Trị Viên (${user.fullName || user.username})</span>
            </div>
            <div style="font-size: 0.86rem; color: #475569; margin-top: 4px;">
              Bạn có thể xem các đơn mua cá nhân của mình hoặc xem toàn bộ đơn đặt hàng của tất cả khách hàng.
            </div>
          </div>
          <a href="admin.html#orders" class="nav-btn" style="background: #1e40af; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
            <span>Quản Lý Đơn Trong Admin Panel &rarr;</span>
          </a>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 1.2rem; border-top: 1px solid #dbeafe; padding-top: 1rem;">
          <button onclick="switchOrdersTab('personal')" class="nav-btn" style="background: ${currentOrdersView === 'personal' ? '#2563eb' : '#ffffff'}; color: ${currentOrdersView === 'personal' ? '#ffffff' : '#334155'}; border: 1px solid ${currentOrdersView === 'personal' ? '#2563eb' : '#cbd5e1'}; font-weight: 700; font-size: 0.88rem; padding: 7px 16px; border-radius: 8px; cursor: pointer;">
            📦 Đơn mua cá nhân (${cachedPersonalOrders.length})
          </button>
          <button onclick="switchOrdersTab('all')" class="nav-btn" style="background: ${currentOrdersView === 'all' ? '#2563eb' : '#ffffff'}; color: ${currentOrdersView === 'all' ? '#ffffff' : '#334155'}; border: 1px solid ${currentOrdersView === 'all' ? '#2563eb' : '#cbd5e1'}; font-weight: 700; font-size: 0.88rem; padding: 7px 16px; border-radius: 8px; cursor: pointer;">
            👥 Toàn bộ đơn hàng hệ thống (${cachedAllOrders.length})
          </button>
        </div>
      </div>
    `;
  }

  const activeOrders = (currentOrdersView === 'all' && isAdmin) ? cachedAllOrders : cachedPersonalOrders;

  if (activeOrders.length === 0) {
    container.innerHTML = `
      ${adminHeaderHtml}
      <div style="text-align: center; padding: 3.5rem 1.5rem; background: white; border-radius: 16px; border: 1px solid var(--border-color); max-width: 540px; margin: 0 auto; box-shadow: var(--shadow-sm);">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">📦</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">Chưa có đơn hàng nào</h3>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin: 0.6rem 0 1.8rem; line-height: 1.5;">
          ${isAdmin && currentOrdersView === 'personal' 
            ? `Tài khoản Admin của bạn chưa đặt đơn mua cá nhân nào. Bấm vào tab <strong>"Toàn bộ đơn hàng hệ thống"</strong> ở trên để xem các đơn hàng của khách.`
            : `Hiện chưa có đơn đặt hàng nào trong mục này.`}
        </p>
        <a href="index.html" class="nav-btn nav-btn-primary" style="padding: 10px 24px; font-weight: 700; font-size: 0.95rem;">
          Khám phá sản phẩm ngay
        </a>
      </div>
    `;
    return;
  }

  const titlePrefix = (currentOrdersView === 'all' && isAdmin) 
    ? `Toàn bộ đơn hàng của khách (${activeOrders.length} đơn)`
    : `Đơn mua cá nhân của bạn (${activeOrders.length} đơn)`;

  container.innerHTML = `
    ${adminHeaderHtml}
    <div style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
      <span>Hiển thị <strong>${titlePrefix}</strong></span>
    </div>
    ${renderOrderListHtml(activeOrders)}
  `;
}

function switchOrdersTab(tab) {
  currentOrdersView = tab;
  const user = getCurrentUser();
  if (user) {
    renderOrdersView(user);
  }
}

// Xử lý tra cứu nhanh bằng Số điện thoại cho khách chưa đăng nhập
async function handleLookupByPhone(e) {
  e.preventDefault();
  const phone = document.getElementById('lookupPhoneInput').value.trim();
  const resultBox = document.getElementById('lookupPhoneResult');
  if (!phone) return;

  resultBox.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">Đang tìm kiếm đơn hàng...</p>';

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/phone/${encodeURIComponent(phone)}`);
    if (!res.ok) throw new Error('Không thể tra cứu đơn hàng');
    const orders = await res.json();

    if (!orders || orders.length === 0) {
      resultBox.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px; color: #dc2626; font-size: 0.88rem;">
          ❌ Không tìm thấy đơn hàng nào với số điện thoại <strong>${phone}</strong>.
        </div>
      `;
      return;
    }

    resultBox.innerHTML = `
      <div style="margin-top: 1rem;">
        <div style="font-weight: 700; font-size: 0.9rem; color: #15803d; margin-bottom: 0.8rem;">
          Tìm thấy ${orders.length} đơn hàng liên kết với SĐT ${phone}:
        </div>
        ${renderOrderListHtml(orders)}
      </div>
    `;
  } catch (err) {
    resultBox.innerHTML = `
      <div style="color: #dc2626; font-size: 0.88rem;">⚠️ Có lỗi khi tra cứu đơn hàng. Vui lòng thử lại!</div>
    `;
  }
}

// Render danh sách thẻ đơn hàng
function renderOrderListHtml(orders) {
  return orders.map(o => {
    const dateStr = o.orderDate ? new Date(o.orderDate).toLocaleString('vi-VN') : 'Mới đây';
    
    // Status tag
    let statusTag = '<span style="background:#fef3c7; color:#b45309; padding: 4px 10px; border-radius: 9999px; font-weight:700; font-size: 0.8rem;">⏳ Chờ xác nhận</span>';
    if (o.status === 'CONFIRMED') statusTag = '<span style="background:#e0e7ff; color:#4338ca; padding: 4px 10px; border-radius: 9999px; font-weight:700; font-size: 0.8rem;">📦 Đã xác nhận</span>';
    else if (o.status === 'SHIPPING') statusTag = '<span style="background:#dbeafe; color:#1e40af; padding: 4px 10px; border-radius: 9999px; font-weight:700; font-size: 0.8rem;">🚚 Đang giao hàng</span>';
    else if (o.status === 'COMPLETED') statusTag = '<span style="background:#dcfce7; color:#15803d; padding: 4px 10px; border-radius: 9999px; font-weight:700; font-size: 0.8rem;">✅ Đã hoàn thành</span>';
    else if (o.status === 'CANCELLED') statusTag = '<span style="background:#fee2e2; color:#dc2626; padding: 4px 10px; border-radius: 9999px; font-weight:700; font-size: 0.8rem;">❌ Đã hủy</span>';

    const paymentMethodStr = o.paymentMethod === 'VIETQR' ? '🏦 Chuyển khoản VietQR' : '💵 Tiền mặt (COD)';
    const paymentStatusStr = o.paymentStatus === 'PAID' ? '<span style="color:#10b981; font-weight:700;">● Đã thanh toán</span>' : '<span style="color:#f59e0b; font-weight:700;">● Chưa thanh toán</span>';

    const detailsHtml = (o.orderDetails && o.orderDetails.length > 0) ? o.orderDetails.map(d => {
      let variantTxt = '';
      if (d.selectedColor || d.selectedStorage) {
        const parts = [];
        if (d.selectedColor) parts.push(`Màu: ${d.selectedColor}`);
        if (d.selectedStorage) parts.push(`Bản: ${d.selectedStorage}`);
        variantTxt = `<small style="color: #64748b; display: block; font-size: 0.8rem; margin-top: 1px;">(${parts.join(' | ')})</small>`;
      }
      return `
        <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; font-size: 0.9rem; border-bottom: 1px dashed var(--border-color);">
          <div>
            <span>${d.product ? d.product.name : 'Sản phẩm'} <strong style="color:var(--text-muted);">x${d.quantity}</strong></span>
            ${variantTxt}
          </div>
          <span style="font-weight: 600;">${formatCurrency(d.price * d.quantity)}</span>
        </div>
      `;
    }).join('') : '<p style="color:var(--text-muted); font-size:0.85rem;">Thông tin chi tiết sản phẩm</p>';

    let payActionBtn = '';
    if (o.paymentMethod === 'VIETQR' && o.paymentStatus !== 'PAID') {
      payActionBtn = `
        <button onclick="viewQrModal(${o.id})" style="padding: 0.4rem 0.8rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
          📱 Quét lại mã VietQR
        </button>
      `;
    }

    return `
      <div style="background: white; border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
          <div>
            <span style="font-weight: 800; font-size: 1.1rem; color: #2563eb;">#DH${o.id}</span>
            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 0.8rem;">📅 ${dateStr}</span>
          </div>
          <div>${statusTag}</div>
        </div>

        <div style="margin-bottom: 1rem;">
          ${detailsHtml}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.9rem; flex-wrap: wrap; gap: 0.8rem;">
          <div>
            <div><strong>Giao đến:</strong> ${o.receiverName || 'Khách hàng'} (${o.receiverPhone || ''}) — ${o.shippingAddress || ''}</div>
            <div style="margin-top: 0.2rem;"><strong>Hình thức:</strong> ${paymentMethodStr} | ${paymentStatusStr}</div>
          </div>
          <div style="text-align: right; margin-left: auto;">
            <div style="font-size: 0.85rem; color: var(--text-muted);">Tổng thanh toán:</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #dc2626;">${formatCurrency(o.totalPrice)}</div>
            <div style="display: flex; gap: 6px; justify-content: flex-end; margin-top: 6px; flex-wrap: wrap;">
              ${payActionBtn}
              <button onclick="handlePrintInvoice(${o.id})" style="padding: 0.4rem 0.8rem; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                🖨️ In Hóa Đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// In hóa đơn bán hàng
async function handlePrintInvoice(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    if (!res.ok) throw new Error();
    const order = await res.json();
    printOrderInvoice(order);
  } catch (e) {
    showToast('Không thể tải thông tin đơn hàng để in hóa đơn!');
  }
}

// Xem mã QR thanh toán của đơn
async function viewQrModal(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/vietqr`);
    if (!res.ok) throw new Error();
    const qr = await res.json();
    window.open(qr.qrImageUrl, '_blank');
  } catch (e) {
    showToast('Không thể tải mã QR!');
  }
}
