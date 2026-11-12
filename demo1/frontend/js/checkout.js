let selectedPaymentMethod = 'COD';

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  prefillUserInfo();
});

// Điền trước thông tin nếu đã đăng nhập
function prefillUserInfo() {
  const user = getCurrentUser();
  if (user) {
    if (user.fullName) {
      document.getElementById('orderReceiverName').value = user.fullName;
    }
  }
}

// Hiển thị tóm tắt sản phẩm trong giỏ hàng (Có thể chỉnh sửa số lượng, đổi màu sắc/dung lượng và xóa món ngay tại bước thanh toán)
function renderCheckoutSummary() {
  const cart = getCart();
  const list = document.getElementById('checkoutItemsList');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  const placeOrderBtn = document.getElementById('btnPlaceOrder');

  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
        <p style="font-weight: 700; margin-bottom: 0.5rem; font-size: 1rem; color: var(--text-main);">Giỏ hàng của bạn đang trống!</p>
        <p style="font-size: 0.85rem; margin-bottom: 1.2rem;">Bạn chưa có sản phẩm nào để tiến hành thanh toán.</p>
        <a href="products.html" class="hero-primary-btn" style="padding: 8px 18px; font-size: 0.85rem; display: inline-flex; border-radius: 8px;">
          Tiếp tục mua sắm &rarr;
        </a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '0 ₫';
    if (grandTotalEl) grandTotalEl.textContent = '0 ₫';
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.style.opacity = '0.5';
      placeOrderBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  if (placeOrderBtn) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.opacity = '1';
    placeOrderBtn.style.cursor = 'pointer';
  }

  list.innerHTML = cart.map(item => {
    const key = item.cartKey || `${item.id}_${item.selectedColor || ''}_${item.selectedStorage || ''}`;
    
    // Quick-change variant selectors or badge
    let variantHtml = '';
    const hasColorSelect = item.availableColors && item.availableColors.length > 1;
    const hasStorageSelect = item.availableStorage && item.availableStorage.length > 1;

    if (hasColorSelect || hasStorageSelect) {
      variantHtml = `
        <div style="display: flex; gap: 6px; margin: 4px 0 6px; flex-wrap: wrap; align-items: center;">
          ${hasColorSelect ? `
            <select onchange="changeCheckoutItemVariant('${key.replace(/'/g, "\\'")}', this.value, undefined)" style="padding: 2px 6px; font-size: 0.76rem; border-radius: 4px; border: 1px solid var(--border-color); background: #f8fafc; font-weight: 600; color: #334155; outline: none; cursor: pointer;">
              ${item.availableColors.map(c => `<option value="${c}" ${c === item.selectedColor ? 'selected' : ''}>🎨 ${c}</option>`).join('')}
            </select>
          ` : (item.selectedColor ? `<span style="font-size: 0.76rem; color: var(--text-muted); background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">🎨 ${item.selectedColor}</span>` : '')}

          ${hasStorageSelect ? `
            <select onchange="changeCheckoutItemVariant('${key.replace(/'/g, "\\'")}', undefined, this.value)" style="padding: 2px 6px; font-size: 0.76rem; border-radius: 4px; border: 1px solid var(--border-color); background: #f8fafc; font-weight: 600; color: #334155; outline: none; cursor: pointer;">
              ${item.availableStorage.map(s => `<option value="${s}" ${s === item.selectedStorage ? 'selected' : ''}>💾 ${s}</option>`).join('')}
            </select>
          ` : (item.selectedStorage ? `<span style="font-size: 0.76rem; color: var(--text-muted); background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">💾 ${item.selectedStorage}</span>` : '')}
        </div>
      `;
    } else if (item.selectedColor || item.selectedStorage) {
      const parts = [];
      if (item.selectedColor) parts.push(`🎨 ${item.selectedColor}`);
      if (item.selectedStorage) parts.push(`💾 ${item.selectedStorage}`);
      variantHtml = `<div style="font-size: 0.76rem; color: var(--text-muted); margin: 2px 0 5px;">${parts.join(' | ')}</div>`;
    }

    return `
      <div style="display: flex; gap: 0.85rem; padding: 0.9rem 0; border-bottom: 1px solid var(--border-color); align-items: center;">
        <img src="${item.imageUrl}" style="width: 52px; height: 52px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-color); flex-shrink: 0;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'">
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.92rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-main);" title="${item.name}">${item.name}</div>
          ${variantHtml}
          <div style="font-size: 0.82rem; color: #dc2626; font-weight: 600; margin: 2px 0 6px 0;">${formatCurrency(item.price)}</div>
          
          <!-- BỘ CHỈNH SỐ LƯỢNG TRỰC TIẾP TRÊN TRANG THANH TOÁN -->
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <button type="button" onclick="updateCheckoutItemQty('${key.replace(/'/g, "\\'")}', ${item.quantity - 1})" style="width: 24px; height: 24px; border: 1px solid var(--border-color); background: #f8fafc; border-radius: 4px; cursor: pointer; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;" title="Giảm số lượng">-</button>
            <span style="font-size: 0.88rem; font-weight: 700; min-width: 24px; text-align: center;">${item.quantity}</span>
            <button type="button" onclick="updateCheckoutItemQty('${key.replace(/'/g, "\\'")}', ${item.quantity + 1})" style="width: 24px; height: 24px; border: 1px solid var(--border-color); background: #f8fafc; border-radius: 4px; cursor: pointer; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;" title="Tăng số lượng">+</button>
          </div>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
          <div style="font-weight: 800; color: #dc2626; font-size: 0.95rem;">
            ${formatCurrency(item.price * item.quantity)}
          </div>
          <button type="button" onclick="removeCheckoutItem('${key.replace(/'/g, "\\'")}')" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 2px 6px; line-height: 1;" title="Xóa món này khỏi đơn">&times;</button>
        </div>
      </div>
    `;
  }).join('');

  const total = getCartTotal();
  if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
  if (grandTotalEl) grandTotalEl.textContent = formatCurrency(total);
}

function changeCheckoutItemVariant(cartKey, newColor, newStorage) {
  updateCartItemVariant(cartKey, newColor, newStorage);
  renderCheckoutSummary();
}

function updateCheckoutItemQty(cartKey, newQty) {
  let cart = getCart();
  if (newQty <= 0) {
    removeCheckoutItem(cartKey);
    return;
  }
  const item = cart.find(i => (i.cartKey === cartKey || i.id === Number(cartKey)));
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
    renderCheckoutSummary();
    showToast(`Đã cập nhật số lượng ${item.name}: ${newQty}`);
  }
}

function removeCheckoutItem(cartKey) {
  let cart = getCart();
  const item = cart.find(i => (i.cartKey === cartKey || i.id === Number(cartKey)));
  const itemName = item ? item.name : 'sản phẩm';
  cart = cart.filter(i => (i.cartKey !== cartKey && i.id !== Number(cartKey)));
  saveCart(cart);
  renderCheckoutSummary();
  showToast(`Đã xóa "${itemName}" khỏi đơn hàng.`);
}

// Chọn phương thức thanh toán
function selectPaymentMethod(method) {
  selectedPaymentMethod = method;

  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  const radioCOD = document.querySelector('input[value="COD"]');
  const radioQR = document.querySelector('input[value="VIETQR"]');

  if (method === 'COD') {
    document.getElementById('optCOD').classList.add('selected');
    if (radioCOD) radioCOD.checked = true;
  } else if (method === 'VIETQR') {
    document.getElementById('optVIETQR').classList.add('selected');
    if (radioQR) radioQR.checked = true;
  }
}

// Xử lý gửi đơn hàng
async function handlePlaceOrder(e) {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng trống, không thể đặt hàng!');
    return;
  }

  const receiverName = document.getElementById('orderReceiverName').value.trim();
  const receiverPhone = document.getElementById('orderReceiverPhone').value.trim();
  const shippingAddress = document.getElementById('orderShippingAddress').value.trim();
  const notes = document.getElementById('orderNotes').value.trim();
  const btn = document.getElementById('btnPlaceOrder');

  const currentUser = getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  const orderItems = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    selectedColor: item.selectedColor || null,
    selectedStorage: item.selectedStorage || null
  }));

  const payload = {
    userId: userId,
    receiverName: receiverName,
    receiverPhone: receiverPhone,
    shippingAddress: shippingAddress,
    notes: notes,
    paymentMethod: selectedPaymentMethod,
    items: orderItems
  };

  btn.textContent = 'Đang khởi tạo đơn hàng...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Không thể tạo đơn hàng');
    }

    // Đặt hàng thành công!
    clearCart(); // Xóa sạch giỏ hàng

    // Hiển thị màn hình thành công cho COD và VietQR
    document.getElementById('checkoutMainSection').style.display = 'none';
    document.getElementById('orderSuccessSection').style.display = 'block';

    document.getElementById('successOrderId').textContent = `#DH${data.id}`;
    document.getElementById('successReceiver').textContent = data.receiverName;
    document.getElementById('successPhone').textContent = data.receiverPhone;
    document.getElementById('successAddress').textContent = data.shippingAddress;
    
    let payName = data.paymentMethod === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Thanh toán tiền mặt (COD)';

    document.getElementById('successPaymentMethod').textContent = payName;
    document.getElementById('successTotal').textContent = formatCurrency(data.totalPrice);

    // Nếu chọn VietQR, gọi API lấy mã QR động
    if (data.paymentMethod === 'VIETQR') {
      await loadVietQrCode(data.id);
    }

    showToast('🎉 Đặt hàng thành công!');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Lỗi đặt hàng:', error);
    showToast(error.message);
  } finally {
    btn.textContent = 'Xác Nhận Đặt Hàng Ngay ➔';
    btn.disabled = false;
  }
}

// Tải thông tin VietQR từ API
async function loadVietQrCode(orderId) {
  const container = document.getElementById('vietqrContainer');
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/vietqr`);
    if (!res.ok) throw new Error('Không thể tạo mã VietQR');
    const qrData = await res.json();

    document.getElementById('qrBankName').textContent = qrData.bankName;
    document.getElementById('qrAccountNo').textContent = qrData.accountNo;
    document.getElementById('qrAccountName').textContent = qrData.accountName;
    document.getElementById('qrAmount').textContent = formatCurrency(qrData.totalPrice);
    document.getElementById('qrMemo').textContent = qrData.transferContent;

    const qrImg = document.getElementById('vietqrImage');
    qrImg.src = qrData.qrImageUrl;
    qrImg.alt = `Mã VietQR thanh toán đơn hàng #${orderId}`;

    container.style.display = 'block';
  } catch (e) {
    console.error('Lỗi tạo VietQR:', e);
    showToast('Không thể tạo mã VietQR, vui lòng liên hệ shop để hỗ trợ!');
  }
}

// Sao chép nội dung vào Clipboard
function copyToClipboard(text, msg = 'Đã sao chép vào bộ nhớ tạm!') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  }).catch(() => {
    showToast('Không thể sao chép tự động, vui lòng copy thủ công!');
  });
}
