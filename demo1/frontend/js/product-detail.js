let currentProductId = null;
let currentRating = 5;
let loadedProduct = null;
let selectedDetailColor = null;
let selectedDetailStorage = null;

function changeDetailQty(delta) {
  const input = document.getElementById('detailQuantityInput');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
}

function handleDetailAddToCart() {
  if (!loadedProduct) return;
  const qty = parseInt(document.getElementById('detailQuantityInput').value) || 1;
  addToCart(loadedProduct, qty, selectedDetailColor, selectedDetailStorage);
}

function handleDetailBuyNow() {
  if (!loadedProduct) return;
  const qty = parseInt(document.getElementById('detailQuantityInput').value) || 1;
  addToCart(loadedProduct, qty, selectedDetailColor, selectedDetailStorage);
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarUser();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    showToast('Không tìm thấy mã sản phẩm!');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    return;
  }

  currentProductId = Number(id);
  loadProductDetails(currentProductId);
  loadProductReviews(currentProductId);
});

// 1. Tải thông tin chi tiết sản phẩm & Thư viện ảnh (ProductImage)
async function loadProductDetails(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('Không thể tải thông tin sản phẩm');
    const product = await res.json();
    loadedProduct = product;

    document.title = `${product.name} - SiSi Shop`;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('breadcrumbName').textContent = product.name;
    
    const displayPrice = (product.discountedPrice !== undefined && product.discountedPrice !== null)
      ? product.discountedPrice
      : (product.discountPercent ? Math.round(product.price * (1 - product.discountPercent / 100)) : product.price);
    
    document.getElementById('productPrice').textContent = formatCurrency(displayPrice);
    document.getElementById('productDescription').textContent = product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.';
    document.getElementById('productStock').textContent = `Tình trạng: ${product.quantity > 0 ? `Còn hàng (${product.quantity} sản phẩm)` : 'Hết hàng'}`;

    if (product.category) {
      const catUrl = `products.html?cat=${product.category.id}`;
      
      const prodCatEl = document.getElementById('productCategory');
      if (prodCatEl) {
        prodCatEl.textContent = product.category.name;
        prodCatEl.href = catUrl;
      }

      const breadCatEl = document.getElementById('breadcrumbCategory');
      if (breadCatEl) {
        breadCatEl.textContent = product.category.name;
        breadCatEl.href = catUrl;
      }
    }

    // Hiển thị chọn biến thể thuộc tính (Màu sắc & Dung lượng)
    renderProductVariants(product);

    // Tải danh sách ảnh (ProductImage)
    loadProductImages(id, product.images);
  } catch (error) {
    console.error('Lỗi chi tiết sản phẩm:', error);
    showToast('Không thể tải dữ liệu sản phẩm!');
  }
}

// Render các chip lựa chọn Màu sắc và Dung lượng / Phiên bản
function renderProductVariants(product) {
  const colorSec = document.getElementById('colorSelectSection');
  const storageSec = document.getElementById('storageSelectSection');
  const colorListEl = document.getElementById('colorChipsList');
  const storageListEl = document.getElementById('storageChipsList');
  const colorLabel = document.getElementById('selectedColorLabel');
  const storageLabel = document.getElementById('selectedStorageLabel');

  const colors = parseOptions(product.colors);
  const storages = parseOptions(product.storageOptions);

  if (colors.length > 0) {
    selectedDetailColor = colors[0];
    if (colorLabel) colorLabel.textContent = selectedDetailColor;
    if (colorSec) colorSec.style.display = 'block';
    if (colorListEl) {
      colorListEl.innerHTML = colors.map((c, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" onclick="selectDetailColor('${c.replace(/'/g, "\\'")}', this)">
          <span>${c}</span>
        </button>
      `).join('');
    }
  } else {
    selectedDetailColor = null;
    if (colorSec) colorSec.style.display = 'none';
  }

  if (storages.length > 0) {
    selectedDetailStorage = storages[0];
    if (storageLabel) storageLabel.textContent = selectedDetailStorage;
    if (storageSec) storageSec.style.display = 'block';
    if (storageListEl) {
      storageListEl.innerHTML = storages.map((s, idx) => `
        <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" onclick="selectDetailStorage('${s.replace(/'/g, "\\'")}', this)">
          <span>${s}</span>
        </button>
      `).join('');
    }
  } else {
    selectedDetailStorage = null;
    if (storageSec) storageSec.style.display = 'none';
  }
}

function selectDetailColor(color, btn) {
  selectedDetailColor = color;
  const label = document.getElementById('selectedColorLabel');
  if (label) label.textContent = color;
  document.querySelectorAll('#colorChipsList .variant-chip').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function selectDetailStorage(storage, btn) {
  selectedDetailStorage = storage;
  const label = document.getElementById('selectedStorageLabel');
  if (label) label.textContent = storage;
  document.querySelectorAll('#storageChipsList .variant-chip').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Tải ảnh từ API /api/product-images/product/{id} hoặc mảng images có sẵn
async function loadProductImages(productId, initialImages) {
  let images = initialImages || [];

  if (!images || images.length === 0) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/product-images/product/${productId}`);
      if (res.ok) {
        images = await res.json();
      }
    } catch (e) {
      console.warn('Lỗi tải API product-images:', e);
    }
  }

  const mainImg = document.getElementById('mainProductImg');
  const strip = document.getElementById('thumbnailStrip');

  // Nếu không có ảnh nào trong database, dùng ảnh mặc định chất lượng cao
  if (!images || images.length === 0) {
    const fallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
    mainImg.src = fallback;
    strip.innerHTML = `
      <img src="${fallback}" class="thumb-item active" alt="Ảnh mặc định" onclick="switchMainImage('${fallback}', this)">
    `;
    return;
  }

  // Set ảnh chính ban đầu
  mainImg.src = images[0].imageUrl;

  // Render danh sách thumbnail
  strip.innerHTML = images.map((img, index) => `
    <img 
      src="${img.imageUrl}" 
      class="thumb-item ${index === 0 ? 'active' : ''}" 
      alt="Ảnh ${index + 1}"
      onclick="switchMainImage('${img.imageUrl}', this)"
      onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'"
    >
  `).join('');
}

function switchMainImage(url, element) {
  const mainImg = document.getElementById('mainProductImg');
  mainImg.src = url;
  document.querySelectorAll('.thumb-item').forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');
}

// 2. Tải danh sách đánh giá từ API /api/reviews/product/{id}
async function loadProductReviews(productId) {
  const list = document.getElementById('reviewList');
  const badge = document.getElementById('reviewCountBadge');

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`);
    if (!res.ok) throw new Error('Không thể tải đánh giá');
    const reviews = await res.json();

    if (reviews.length === 0) {
      badge.textContent = '★ 0.0 (0 đánh giá)';
      list.innerHTML = `
        <p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
        </p>
      `;
      return;
    }

    // Tính điểm trung bình
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = (sum / reviews.length).toFixed(1);
    badge.textContent = `★ ${avg} (${reviews.length} đánh giá)`;

    // Render danh sách đánh giá
    list.innerHTML = reviews.map(r => {
      const author = r.user ? (r.user.fullName || r.user.username) : 'Khách hàng';
      const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : 'Gần đây';

      return `
        <div class="review-item">
          <div class="review-user-row">
            <span class="review-author">👤 ${author}</span>
            <span class="review-date">${dateStr}</span>
          </div>
          <div class="review-stars">${renderStars(r.rating)}</div>
          <div class="review-comment">${r.comment || ''}</div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Lỗi tải reviews:', error);
    list.innerHTML = `<p style="color: #dc2626; text-align: center;">Không thể tải đánh giá từ server.</p>`;
  }
}

// 3. Chọn số sao đánh giá
function setRating(rating) {
  currentRating = rating;
  document.getElementById('reviewRatingInput').value = rating;

  const stars = document.querySelectorAll('#starSelector span');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// 4. Gửi đánh giá mới lên API /api/reviews
async function handleReviewSubmit(e) {
  e.preventDefault();
  const comment = document.getElementById('reviewComment').value.trim();
  const btn = document.getElementById('btnSubmitReview');

  if (!comment) {
    showToast('Vui lòng nhập nội dung đánh giá!');
    return;
  }

  const currentUser = getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  btn.textContent = 'Đang gửi...';
  btn.disabled = true;

  try {
    const payload = {
      productId: currentProductId,
      userId: userId,
      rating: currentRating,
      comment: comment
    };

    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Gửi đánh giá thất bại!');
    }

    showToast('Cảm ơn bạn đã gửi đánh giá thành công!');
    document.getElementById('reviewComment').value = '';
    setRating(5);

    // Tải lại danh sách đánh giá ngay lập tức
    await loadProductReviews(currentProductId);
  } catch (error) {
    console.error('Lỗi gửi review:', error);
    showToast('Không thể gửi đánh giá, vui lòng thử lại sau!');
  } finally {
    btn.textContent = 'Gửi đánh giá';
    btn.disabled = false;
  }
}
