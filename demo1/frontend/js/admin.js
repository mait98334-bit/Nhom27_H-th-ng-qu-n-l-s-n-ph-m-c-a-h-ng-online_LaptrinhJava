// Auth Guard: Kiểm tra phân quyền truy cập - Chỉ tài khoản ADMIN mới được vào
(function checkAdminPermission() {
  const user = getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    alert('⛔ CẢNH BÁO PHÂN QUYỀN:\nBạn không có quyền truy cập trang Quản Trị Hệ Thống (Yêu cầu vai trò ADMIN)!\nHệ thống sẽ chuyển bạn về trang chủ.');
    window.location.href = 'index.html';
  }
})();

let adminProducts = [];
let adminCategories = [];
let adminBrands = [];
let adminReviews = [];
let adminUsers = [];
let adminOrders = [];
let adminPosts = [];
let adminPostComments = [];
let currentManagingProductId = null;
let currentTab = 'dashboard';
let revenueChartInstance = null;
let categoryChartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
  initCurrentUserDisplay();

  // Khôi phục tab đang đứng từ hash hoặc localStorage (đảm bảo reload không bị nhảy về Dashboard)
  const savedTab = window.location.hash ? window.location.hash.substring(1) : (localStorage.getItem('admin_active_tab') || 'dashboard');
  const validTabs = ['dashboard', 'products', 'orders', 'categories', 'brands', 'reviews', 'posts', 'postComments', 'users'];
  const initialTab = validTabs.includes(savedTab) ? savedTab : 'dashboard';

  // Kích hoạt tab đã lưu ngay lập tức
  switchAdminTab(initialTab);

  await loadAllData();

  // Cập nhật lại bộ lọc và dữ liệu cho tab đang đứng sau khi load data xong
  switchAdminTab(initialTab);
});

function initCurrentUserDisplay() {
  const user = getCurrentUser();
  if (user && user.fullName) {
    const el = document.getElementById('adminUserFullName');
    if (el) el.innerHTML = `${user.fullName} <span style="font-size:0.75rem; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:12px; margin-left:6px;">ADMIN</span>`;
  }
}

// Chuyển đổi giữa các Tab chính (lưu trạng thái tab để F5 / load lại vẫn giữ nguyên tab)
function switchAdminTab(tabKey, menuItemElement) {
  currentTab = tabKey;
  try {
    localStorage.setItem('admin_active_tab', tabKey);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${tabKey}`);
    } else {
      window.location.hash = tabKey;
    }
  } catch (e) {}

  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
  if (menuItemElement) {
    menuItemElement.classList.add('active');
  } else {
    const foundItem = document.querySelector(`.menu-item[onclick*="'${tabKey}'"]`);
    if (foundItem) foundItem.classList.add('active');
  }

  const tabs = ['dashboard', 'products', 'orders', 'categories', 'brands', 'reviews', 'posts', 'postComments', 'users'];
  tabs.forEach(t => {
    const el = document.getElementById(`tab${capitalize(t)}`);
    if (el) {
      el.style.display = (t === tabKey) ? 'block' : 'none';
    }
  });

  const titleEl = document.getElementById('viewTitle');
  const subEl = document.getElementById('viewSubtitle');
  const actionBtnArea = document.getElementById('headerActionBtnArea');

  switch (tabKey) {
    case 'dashboard':
      titleEl.textContent = 'Bảng Điều Khiển Tổng Quan';
      subEl.textContent = 'Theo dõi doanh số, phân tích nhóm hàng và kiểm soát kho theo thời gian thực.';
      actionBtnArea.innerHTML = `<button class="btn-primary-action" onclick="openAddProductModal()"><span>+</span> Thêm Sản Phẩm Mới</button>`;
      renderCharts();
      break;
    case 'products':
      titleEl.textContent = 'Quản Lý Kho Hàng & Sản Phẩm';
      subEl.textContent = 'Quản lý thông tin chi tiết, giá cả, số lượng tồn kho và album ảnh sản phẩm.';
      actionBtnArea.innerHTML = `<button class="btn-primary-action" onclick="openAddProductModal()"><span>+</span> Thêm Sản Phẩm Mới</button>`;
      populateCategoryDropdowns();
      applyProductFilters();
      break;
    case 'orders':
      titleEl.textContent = 'Quản Lý Đơn Hàng & Vận Chuyển';
      subEl.textContent = 'Xử lý các đơn hàng khách vừa đặt, cập nhật tiến độ giao và trạng thái thanh toán.';
      actionBtnArea.innerHTML = '';
      applyOrderFilters();
      break;
    case 'categories':
      titleEl.textContent = 'Quản Lý Danh Mục Nhóm Hàng';
      subEl.textContent = 'Phân loại sản phẩm thành các nhóm ngành hàng để khách hàng dễ dàng tìm kiếm.';
      actionBtnArea.innerHTML = `<button class="btn-primary-action" onclick="openAddCategoryModal()"><span>+</span> Thêm Danh Mục</button>`;
      applyCategoryFilters();
      break;
    case 'brands':
      titleEl.textContent = 'Quản Lý Thương Hiệu & Hãng Sản Xuất';
      subEl.textContent = 'Quản lý danh sách đối tác sản xuất, thương hiệu công nghệ và lượng sản phẩm phân bổ.';
      actionBtnArea.innerHTML = `<button class="btn-primary-action" onclick="openAddBrandModal()"><span>+</span> Thêm Thương Hiệu</button>`;
      populateBrandCategoryFilter();
      applyBrandFilters();
      break;
    case 'reviews':
      titleEl.textContent = 'Quản Lý Đánh Giá & Phản Hồi';
      subEl.textContent = 'Theo dõi mức độ hài lòng và kiểm duyệt các đánh giá của khách hàng.';
      actionBtnArea.innerHTML = '';
      applyReviewFilters();
      break;
    case 'posts':
      titleEl.textContent = 'Quản Lý Bài Viết & Tin Tức';
      subEl.textContent = 'Soạn thảo, quản lý bài viết đánh giá công nghệ và tin khuyến mãi.';
      actionBtnArea.innerHTML = `<button class="btn-primary-action" onclick="openAddPostModal()"><span>+</span> Viết Bài Mới</button>`;
      applyPostFilters();
      break;
    case 'postComments':
      titleEl.textContent = 'Quản Lý Bình Luận Bài Viết';
      subEl.textContent = 'Kiểm duyệt và quản lý toàn bộ phản hồi của người đọc dưới các bài viết.';
      actionBtnArea.innerHTML = '';
      populatePostCommentFilterDropdown();
      applyPostCommentFilters();
      break;
    case 'users':
      titleEl.textContent = 'Quản Lý Tài Khoản Người Dùng';
      subEl.textContent = 'Danh sách toàn bộ thành viên, người quản trị và khách hàng đăng nhập Google.';
      actionBtnArea.innerHTML = '';
      applyUserFilters();
      break;
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Tải dữ liệu toàn bộ hệ thống
async function loadAllData() {
  await Promise.all([
    fetchCategories(),
    fetchBrands(),
    fetchProducts(),
    fetchReviews(),
    fetchUsers(),
    fetchOrders(),
    fetchPosts(),
    fetchPostComments()
  ]);

  updateStatCounters();
  populateCategoryDropdowns();
  renderCharts();
}

function updateStatCounters() {
  document.getElementById('statProducts').textContent = adminProducts.length;
  document.getElementById('statCategories').textContent = adminCategories.length;
  document.getElementById('statOrders').textContent = adminOrders.length;
  document.getElementById('statUsers').textContent = adminUsers.length;

  const statPostsEl = document.getElementById('statPosts');
  if (statPostsEl) statPostsEl.textContent = adminPosts.length;

  // Tính tổng doanh thu từ các đơn hàng đã thanh toán (PAID)
  const totalRevenue = adminOrders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  
  const revEl = document.getElementById('statRevenue');
  if (revEl) {
    revEl.textContent = formatCurrency(totalRevenue);
  }
}

// ==================== CHARTS (BIỂU ĐỒ) ====================
function renderCharts() {
  // 1. Biểu đồ Doanh thu & Tăng trưởng theo tháng
  const ctxRev = document.getElementById('revenueChart');
  if (ctxRev) {
    if (revenueChartInstance) revenueChartInstance.destroy();

    const gradient = ctxRev.getContext('2d').createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    revenueChartInstance = new Chart(ctxRev, {
      type: 'line',
      data: {
        labels: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10 (Hiện tại)'],
        datasets: [{
          label: 'Doanh số ước tính (triệu VNĐ)',
          data: [45, 62, 58, 89, 120, 155],
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#2563eb',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Biểu đồ Cơ cấu Sản phẩm theo Danh mục
  const ctxCat = document.getElementById('categoryChart');
  if (ctxCat) {
    if (categoryChartInstance) categoryChartInstance.destroy();

    const catLabels = adminCategories.map(c => c.name);
    const catCounts = adminCategories.map(c => {
      return adminProducts.filter(p => p.category && p.category.id === c.id).length;
    });

    categoryChartInstance = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: catLabels.length ? catLabels : ['Chưa có danh mục'],
        datasets: [{
          data: catCounts.length && catCounts.some(v => v > 0) ? catCounts : [1],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        cutout: '68%'
      }
    });
  }
}

// ==================== 1. QUẢN LÝ SẢN PHẨM ====================
let adminProductCurrentPage = 1;
let adminProductPageSize = 10;
let currentFilteredAdminProducts = null;
let lastCreatedProductId = null;

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (res.ok) {
      adminProducts = await res.json();
      // Mặc định sắp xếp sản phẩm mới nhất lên đầu
      adminProducts.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    }
  } catch (e) {
    console.error('Lỗi tải products:', e);
  }
}

function renderProductsTable(filteredList = null) {
  currentFilteredAdminProducts = filteredList !== null ? filteredList : adminProducts;
  const list = currentFilteredAdminProducts;
  const tbody = document.getElementById('productTableBody');
  const pagWrap = document.getElementById('productPaginationWrap');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy sản phẩm phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    if (pagWrap) pagWrap.innerHTML = '';
    const pagWrapTop = document.getElementById('productPaginationWrapTop');
    if (pagWrapTop) pagWrapTop.innerHTML = '';
    return;
  }

  // Tính toán phân trang
  const totalItems = list.length;
  const totalPages = adminProductPageSize === 'all' ? 1 : Math.ceil(totalItems / adminProductPageSize);
  if (adminProductCurrentPage > totalPages) adminProductCurrentPage = totalPages;
  if (adminProductCurrentPage < 1) adminProductCurrentPage = 1;

  const startIndex = adminProductPageSize === 'all' ? 0 : (adminProductCurrentPage - 1) * adminProductPageSize;
  const endIndex = adminProductPageSize === 'all' ? totalItems : Math.min(startIndex + adminProductPageSize, totalItems);
  const pagedList = list.slice(startIndex, endIndex);

  tbody.innerHTML = pagedList.map(p => {
    let img = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
    if (p.images && p.images.length > 0 && p.images[0].imageUrl) {
      img = p.images[0].imageUrl;
    }

    const catName = p.category ? p.category.name : 'Chưa phân loại';
    let brandName = p.brand ? p.brand.name : '';
    if (!brandName && adminBrands) {
      const matchB = adminBrands.find(b => p.name && p.name.toLowerCase().includes(b.name.toLowerCase()));
      if (matchB) brandName = matchB.name;
    }

    const imgCount = p.images ? p.images.length : 0;
    const finalPrice = p.discountedPrice || Math.round(p.price * (1 - (p.discountPercent || 0) / 100));

    // Huy hiệu đặc biệt: HOT, SALE, NEW
    const isHot = p.isHot || (p.soldQuantity && p.soldQuantity >= 10);
    const isSale = (p.discountPercent && p.discountPercent > 0);
    const isNew = p.isNew || false;

    let badgeHtml = '';
    if (isSale) {
      badgeHtml += `<span style="background: #fef3c7; color: #b45309; font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">SALE -${p.discountPercent}%</span>`;
    }
    if (isHot) {
      badgeHtml += `<span style="background: #fee2e2; color: #dc2626; font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">HOT (${p.soldQuantity || 0} đã bán)</span>`;
    }
    if (isNew) {
      badgeHtml += `<span style="background: #e0f2fe; color: #0369a1; font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">MỚI</span>`;
    }

    // Badge tồn kho
    let stockBadge = `<span class="tag-badge tag-green">Còn ${p.quantity} SP</span>`;
    if (p.quantity === 0) stockBadge = `<span class="tag-badge tag-red">Hết hàng (0)</span>`;
    else if (p.quantity <= 10) stockBadge = `<span class="tag-badge tag-amber">Sắp hết (${p.quantity})</span>`;

    const isJustCreated = (lastCreatedProductId !== null && Number(p.id) === Number(lastCreatedProductId));
    return `
      <tr style="${isJustCreated ? 'background: #f0fdf4; border-left: 4px solid #16a34a;' : ''}">
        <td style="text-align: center;">
          <span style="font-weight: 800; color: ${isJustCreated ? '#15803d' : '#2563eb'}; background: ${isJustCreated ? '#dcfce7' : '#eff6ff'}; padding: 3px 8px; border-radius: 6px; font-size: 0.84rem; border: 1px solid ${isJustCreated ? '#86efac' : '#bfdbfe'}; display: inline-block;">#${p.id}</span>
          ${isJustCreated ? `<div style="font-size: 0.7rem; color: #15803d; font-weight: 700; margin-top: 2px;">✨ Vừa tạo</div>` : ''}
        </td>
        <td>
          <div class="product-row-info">
            <img src="${img}" class="table-thumb" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'">
            <div>
              <div class="product-name-txt" title="${p.name}">${p.name}</div>
              <div style="display: flex; gap: 4px; align-items: center; margin-top: 3px; flex-wrap: wrap;">
                ${badgeHtml}
              </div>
              ${(p.colors || p.storageOptions) ? `
                <div style="margin-top: 5px; font-size: 0.74rem; display: flex; flex-direction: column; gap: 3px; max-width: 330px;">
                  ${p.colors ? `<span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.colors}">🎨 <strong>Màu:</strong> ${p.colors}</span>` : ''}
                  ${p.storageOptions ? `<span style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.storageOptions}">💾 <strong>Bản:</strong> ${p.storageOptions}</span>` : ''}
                </div>
              ` : `
                <div style="margin-top: 4px; font-size: 0.72rem; color: #94a3b8; font-style: italic;">
                  (Bấm Sửa để thêm Màu & Dung lượng)
                </div>
              `}
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <span class="tag-badge tag-blue" style="width: fit-content;">${catName}</span>
            ${brandName ? `<span style="font-size: 0.76rem; color: var(--text-secondary); font-weight: 600;">Hãng: ${brandName}</span>` : '<span style="font-size: 0.76rem; color: #94a3b8;">Chưa gán hãng</span>'}
          </div>
        </td>
        <td>
          ${isSale ? `
            <div style="font-weight: 700; color: #dc2626; font-size: 0.95rem;">${formatCurrency(finalPrice)}</div>
            <div style="font-size: 0.78rem; color: #94a3b8; text-decoration: line-through;">${formatCurrency(p.price)}</div>
          ` : `
            <div style="font-weight: 700; color: #dc2626; font-size: 0.95rem;">${formatCurrency(p.price)}</div>
          `}
        </td>
        <td>${stockBadge}</td>
        <td>
          <button class="btn-action" style="background: #f8fafc; border: 1px solid #cbd5e1; color: #475569;" onclick="openImagesModal(${p.id}, '${p.name.replace(/'/g, "\\'")}')">
            Thư viện ảnh (${imgCount})
          </button>
        </td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-edit" title="Chỉnh sửa sản phẩm" onclick="openEditProductModal(${p.id})">
              Sửa
            </button>
            <button class="btn-action btn-delete" title="Xóa sản phẩm" onclick="deleteProduct(${p.id})">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  renderProductPagination(totalItems, totalPages, startIndex, endIndex);
}

function renderProductPagination(totalItems, totalPages, startIndex, endIndex) {
  const pagWrap = document.getElementById('productPaginationWrap');
  const pagWrapTop = document.getElementById('productPaginationWrapTop');
  if (!pagWrap && !pagWrapTop) return;

  if (totalItems === 0) {
    if (pagWrap) pagWrap.innerHTML = '';
    if (pagWrapTop) pagWrapTop.innerHTML = '';
    return;
  }

  let buttonsHtml = '';
  // Nút Previous
  buttonsHtml += `
    <button class="page-btn" onclick="changeProductPage(${adminProductCurrentPage - 1})" ${adminProductCurrentPage === 1 ? 'disabled' : ''} title="Trang trước">
      &larr;
    </button>
  `;

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= adminProductCurrentPage - 2 && i <= adminProductCurrentPage + 2)) {
      buttonsHtml += `
        <button class="page-btn ${i === adminProductCurrentPage ? 'active' : ''}" onclick="changeProductPage(${i})">
          ${i}
        </button>
      `;
    } else if (i === adminProductCurrentPage - 3 || i === adminProductCurrentPage + 3) {
      buttonsHtml += `<span style="padding: 0 4px; color: #94a3b8;">...</span>`;
    }
  }

  // Nút Next
  buttonsHtml += `
    <button class="page-btn" onclick="changeProductPage(${adminProductCurrentPage + 1})" ${adminProductCurrentPage === totalPages ? 'disabled' : ''} title="Trang sau">
      &rarr;
    </button>
  `;

  const paginationHtml = `
    <div class="pagination-info">
      Hiển thị <strong>${startIndex + 1} - ${endIndex}</strong> trên tổng số <strong>${totalItems}</strong> sản phẩm (Trang <strong>${adminProductCurrentPage}</strong> / ${totalPages})
    </div>
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 6px; font-size: 0.84rem; color: #64748b;">
        <span>Hiển thị:</span>
        <select class="page-size-select" onchange="changeProductPageSize(this.value)">
          <option value="10" ${adminProductPageSize == 10 ? 'selected' : ''}>10 SP/trang</option>
          <option value="20" ${adminProductPageSize == 20 ? 'selected' : ''}>20 SP/trang</option>
          <option value="50" ${adminProductPageSize == 50 ? 'selected' : ''}>50 SP/trang</option>
          <option value="all" ${adminProductPageSize === 'all' ? 'selected' : ''}>Tất cả</option>
        </select>
      </div>
      <div class="pagination-controls">
        ${buttonsHtml}
      </div>
    </div>
  `;

  if (pagWrap) pagWrap.innerHTML = paginationHtml;
  if (pagWrapTop) pagWrapTop.innerHTML = paginationHtml;
}

function changeProductPage(page) {
  adminProductCurrentPage = page;
  renderProductsTable(currentFilteredAdminProducts);
  // Không ép cuộn ngược màn hình gây giật hay mất dấu thanh phân trang
}

function changeProductPageSize(size) {
  adminProductPageSize = size === 'all' ? 'all' : Number(size);
  adminProductCurrentPage = 1;
  renderProductsTable(currentFilteredAdminProducts);
}

function toggleAdminProductSort(field) {
  const sortSelect = document.getElementById('sortProductSelect');
  if (!sortSelect) return;
  if (field === 'id') {
    sortSelect.value = (sortSelect.value === 'default') ? 'oldest' : 'default';
  } else if (field === 'price') {
    sortSelect.value = (sortSelect.value === 'price_asc') ? 'price_desc' : 'price_asc';
  } else if (field === 'stock') {
    sortSelect.value = (sortSelect.value === 'stock_desc') ? 'stock_asc' : 'stock_desc';
  }
  applyProductFilters();
}

function applyProductFilters() {
  const searchInput = document.getElementById('filterProductSearch');
  const catSelect = document.getElementById('filterCategorySelect');
  const brandSelect = document.getElementById('filterBrandSelect');
  const stockSelect = document.getElementById('filterProductStock');
  const priceSelect = document.getElementById('filterProductPrice');
  const sortSelect = document.getElementById('sortProductSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const catVal = catSelect ? catSelect.value : 'all';
  const brandVal = brandSelect ? brandSelect.value : 'all';
  const stockVal = stockSelect ? stockSelect.value : 'all';
  const priceVal = priceSelect ? priceSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'default';

  // Cập nhật biểu tượng mũi tên trên các tiêu đề cột bảng
  const iconId = document.getElementById('sortIconId');
  const iconPrice = document.getElementById('sortIconPrice');
  const iconStock = document.getElementById('sortIconStock');
  if (iconId) {
    iconId.textContent = sortVal === 'default' ? '▼' : (sortVal === 'oldest' ? '▲' : '↕');
    iconId.style.color = (sortVal === 'default' || sortVal === 'oldest') ? '#2563eb' : '#94a3b8';
  }
  if (iconPrice) {
    iconPrice.textContent = sortVal === 'price_asc' ? '▲' : (sortVal === 'price_desc' ? '▼' : '↕');
    iconPrice.style.color = (sortVal === 'price_asc' || sortVal === 'price_desc') ? '#2563eb' : '#94a3b8';
  }
  if (iconStock) {
    iconStock.textContent = sortVal === 'stock_desc' ? '▼' : (sortVal === 'stock_asc' ? '▲' : '↕');
    iconStock.style.color = (sortVal === 'stock_desc' || sortVal === 'stock_asc') ? '#2563eb' : '#94a3b8';
  }

  let result = [...adminProducts];

  // 1. Lọc theo từ khóa tìm kiếm (tên, mô tả, ID)
  if (keyword) {
    result = result.filter(p => {
      const matchName = p.name && p.name.toLowerCase().includes(keyword);
      const matchDesc = p.description && p.description.toLowerCase().includes(keyword);
      const matchId = String(p.id) === keyword || `#${p.id}` === keyword || String(p.id).includes(keyword);
      return matchName || matchDesc || matchId;
    });
  }

  // 2. Lọc theo danh mục
  if (catVal !== 'all') {
    result = result.filter(p => p.category && String(p.category.id) === String(catVal));
  }

  // 3. Lọc theo thương hiệu
  if (brandVal !== 'all') {
    const targetBrand = adminBrands ? adminBrands.find(b => String(b.id) === String(brandVal)) : null;
    const targetName = targetBrand ? targetBrand.name.toLowerCase() : '';
    result = result.filter(p => {
      if (p.brand && String(p.brand.id) === String(brandVal)) return true;
      if (targetName && p.name && p.name.toLowerCase().includes(targetName)) return true;
      return false;
    });
  }

  // 4. Lọc theo tình trạng tồn kho
  if (stockVal === 'in_stock') {
    result = result.filter(p => (Number(p.quantity) || 0) > 10);
  } else if (stockVal === 'low_stock') {
    result = result.filter(p => (Number(p.quantity) || 0) > 0 && (Number(p.quantity) || 0) <= 10);
  } else if (stockVal === 'out_of_stock') {
    result = result.filter(p => (Number(p.quantity) || 0) === 0);
  }

  // 5. Lọc theo khoảng giá
  if (priceVal === 'under_5m') {
    result = result.filter(p => (Number(p.price) || 0) < 5000000);
  } else if (priceVal === '5m_15m') {
    result = result.filter(p => (Number(p.price) || 0) >= 5000000 && (Number(p.price) || 0) <= 15000000);
  } else if (priceVal === '15m_30m') {
    result = result.filter(p => (Number(p.price) || 0) > 15000000 && (Number(p.price) || 0) <= 30000000);
  } else if (priceVal === 'over_30m') {
    result = result.filter(p => (Number(p.price) || 0) > 30000000);
  }

  // 6. Sắp xếp: Mặc định MỚI NHẤT LÊN ĐẦU (ID giảm dần)
  if (sortVal === 'default') {
    result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  } else if (sortVal === 'oldest') {
    result.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  } else if (sortVal === 'price_asc') {
    result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (sortVal === 'price_desc') {
    result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (sortVal === 'stock_desc') {
    result.sort((a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0));
  } else if (sortVal === 'stock_asc') {
    result.sort((a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0));
  } else if (sortVal === 'name_asc') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('productFilterStatsText');
  if (statsEl) {
    const outOfStockCount = result.filter(p => (Number(p.quantity) || 0) === 0).length;
    let outText = outOfStockCount > 0 ? ` · <span style="color: #dc2626; font-weight: 600;">(Có ${outOfStockCount} SP hết hàng)</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminProducts.length} sản phẩm${outText}`;
  }

  adminProductCurrentPage = 1;
  renderProductsTable(result);
}

function resetProductFilters() {
  const searchInput = document.getElementById('filterProductSearch');
  const catSelect = document.getElementById('filterCategorySelect');
  const brandSelect = document.getElementById('filterBrandSelect');
  const stockSelect = document.getElementById('filterProductStock');
  const priceSelect = document.getElementById('filterProductPrice');
  const sortSelect = document.getElementById('sortProductSelect');

  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'all';
  if (brandSelect) brandSelect.value = 'all';
  if (stockSelect) stockSelect.value = 'all';
  if (priceSelect) priceSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'default';

  applyProductFilters();
}

function populateCategoryDropdowns() {
  const filterCatSel = document.getElementById('filterCategorySelect');
  const filterBrandSel = document.getElementById('filterBrandSelect');
  const modalCatSel = document.getElementById('prodCategory');
  const modalBrandSel = document.getElementById('prodBrand');

  if (filterCatSel) {
    filterCatSel.innerHTML = `<option value="all">Tất cả danh mục (${adminCategories.length})</option>` +
      adminCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (filterBrandSel && adminBrands) {
    filterBrandSel.innerHTML = `<option value="all">Tất cả thương hiệu (${adminBrands.length})</option>` +
      adminBrands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  }

  if (modalCatSel) {
    modalCatSel.innerHTML = adminCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (modalBrandSel && adminBrands) {
    modalBrandSel.innerHTML = `<option value="">-- Chọn thương hiệu --</option>` +
      adminBrands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  }
}

function calculateDiscountPricePreview() {
  const price = Number(document.getElementById('prodPrice')?.value) || 0;
  const discount = Math.min(100, Math.max(0, Number(document.getElementById('prodDiscountPercent')?.value) || 0));
  const finalPrice = Math.round(price * (1 - discount / 100));
  const el = document.getElementById('prodFinalPriceText');
  if (el) {
    if (discount > 0 && price > 0) {
      el.innerHTML = `${formatCurrency(finalPrice)} <span style="font-size:0.75rem; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:12px; margin-left:6px; font-weight:700;">-${discount}%</span> <span style="font-size:0.78rem; color:#94a3b8; text-decoration:line-through; margin-left:4px;">${formatCurrency(price)}</span>`;
    } else {
      el.textContent = formatCurrency(price);
    }
  }
}

function filterProductsByCategory(catId) {
  const catSel = document.getElementById('filterCategorySelect');
  if (catSel) catSel.value = catId;
  applyProductFilters();
}

function updateCoverPreview(url) {
  const previewDiv = document.getElementById('coverImagePreview');
  const previewImg = document.getElementById('coverPreviewImg');
  if (!previewDiv) return;
  if (url && url.trim()) {
    if (previewImg) previewImg.src = url.trim();
    previewDiv.style.display = 'block';
  } else {
    previewDiv.style.display = 'none';
  }
}

// ==================== QUẢN LÝ NHIỀU ẢNH TRONG FORM SẢN PHẨM ====================
let currentProductFormImages = [];

function renderProductFormImagesPreview() {
  const container = document.getElementById('productFormImagesPreviewGrid');
  const countBadge = document.getElementById('formImagesCountBadge');
  const hiddenCover = document.getElementById('prodImageUrl');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${currentProductFormImages.length} ảnh`;
    countBadge.style.background = currentProductFormImages.length > 0 ? '#dbeafe' : '#e2e8f0';
    countBadge.style.color = currentProductFormImages.length > 0 ? '#1d4ed8' : '#475569';
  }

  if (hiddenCover) {
    hiddenCover.value = currentProductFormImages[0] || '';
  }

  if (currentProductFormImages.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 1.5rem; background: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1; color: #94a3b8; font-size: 0.85rem;">
        Chưa có ảnh nào trong album. Hãy bấm <b>"📷 Chọn Nhiều Ảnh Từ Máy Tính"</b> hoặc dán link online ở trên.
      </div>
    `;
    return;
  }

  container.innerHTML = currentProductFormImages.map((url, idx) => `
    <div style="position: relative; border-radius: 8px; overflow: hidden; border: 2px solid ${idx === 0 ? '#2563eb' : '#e2e8f0'}; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <span style="position: absolute; top: 4px; left: 4px; background: ${idx === 0 ? '#2563eb' : 'rgba(0,0,0,0.65)'}; color: white; font-size: 0.68rem; font-weight: 700; padding: 2px 5px; border-radius: 4px; z-index: 2;">
        ${idx === 0 ? 'Ảnh Bìa ★' : `#${idx + 1}`}
      </span>
      <button type="button" onclick="removeProductFormImage(${idx})" title="Xóa ảnh này" style="position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; border-radius: 50%; background: #fee2e2; border: 1px solid #ef4444; color: #dc2626; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2;">
        &times;
      </button>
      <img src="${url}" style="width: 100%; height: 95px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'">
      ${idx !== 0 ? `
        <button type="button" onclick="setAsCoverImage(${idx})" style="width: 100%; padding: 4px; border: none; background: #f8fafc; border-top: 1px solid #e2e8f0; color: #2563eb; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
          Đặt làm ảnh bìa
        </button>
      ` : `
        <div style="width: 100%; padding: 4px; text-align: center; background: #eff6ff; color: #1d4ed8; font-size: 0.72rem; font-weight: 700; border-top: 1px solid #bfdbfe;">
          Ảnh chính
        </div>
      `}
    </div>
  `).join('');
}

function removeProductFormImage(index) {
  currentProductFormImages.splice(index, 1);
  renderProductFormImagesPreview();
}

function setAsCoverImage(index) {
  if (index <= 0 || index >= currentProductFormImages.length) return;
  const item = currentProductFormImages.splice(index, 1)[0];
  currentProductFormImages.unshift(item);
  renderProductFormImagesPreview();
}

function handleAddUrlToFormImages() {
  const input = document.getElementById('prodMultiUrlInput');
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) {
    showToast('Vui lòng nhập ít nhất 1 đường dẫn URL ảnh!');
    return;
  }
  const urls = raw.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 5);
  if (urls.length === 0) {
    showToast('Không tìm thấy link ảnh hợp lệ!');
    return;
  }
  urls.forEach(u => {
    if (!currentProductFormImages.includes(u)) {
      currentProductFormImages.push(u);
    }
  });
  input.value = '';
  renderProductFormImagesPreview();
  showToast(`Đã thêm ${urls.length} ảnh vào danh sách!`);
}

async function handleProductMultiFilesSelected(e) {
  const files = Array.from(e.target.files);
  if (!files || files.length === 0) return;

  const progressEl = document.getElementById('productFormUploadProgress');
  if (progressEl) {
    progressEl.style.display = 'inline-block';
    progressEl.textContent = `Đang tải 0/${files.length} ảnh...`;
  }
  showToast(`Bắt đầu tải ${files.length} ảnh lên server...`);

  let successCount = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (progressEl) {
      progressEl.textContent = `Đang tải ${i + 1}/${files.length} ảnh...`;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const fullUrl = data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
        if (!currentProductFormImages.includes(fullUrl)) {
          currentProductFormImages.push(fullUrl);
        }
        successCount++;
      }
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
    }
  }

  if (progressEl) {
    progressEl.textContent = `Đã tải lên ${successCount}/${files.length} ảnh!`;
    setTimeout(() => { progressEl.style.display = 'none'; }, 2500);
  }
  renderProductFormImagesPreview();
  e.target.value = '';
  showToast(`Đã tải lên thành công ${successCount} ảnh!`);
}

async function uploadProductCover(e) {
  handleProductMultiFilesSelected(e);
}

async function uploadGalleryImage(e) {
  uploadMultipleGalleryImages(e);
}

async function uploadMultipleGalleryImages(e) {
  const files = Array.from(e.target.files);
  if (!files || files.length === 0) return;

  const statusText = document.getElementById('galleryUploadStatusText');
  if (statusText) statusText.textContent = `Đang tải 0/${files.length} ảnh...`;
  showToast(`Đang tải ${files.length} ảnh vào Thư viện...`);

  let successCount = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (statusText) statusText.textContent = `Đang tải ${i + 1}/${files.length} ảnh...`;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const fullUrl = data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
        await fetch(`${API_BASE_URL}/api/product-images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: currentManagingProductId, imageUrl: fullUrl })
        });
        successCount++;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (statusText) {
    statusText.textContent = `Đã thêm ${successCount} ảnh vào thư viện!`;
    setTimeout(() => { statusText.textContent = ''; }, 2500);
  }
  e.target.value = '';
  showToast(`Đã thêm thành công ${successCount} ảnh vào thư viện!`);
  await reloadProductImagesList(currentManagingProductId);
  await fetchProducts();
  renderProductsTable();
}

async function addNewProductImagesFromInput() {
  const input = document.getElementById('newImageUrlInput');
  const raw = input ? input.value.trim() : '';
  if (!raw) {
    showToast('Vui lòng nhập ít nhất 1 đường dẫn URL ảnh hợp lệ!');
    return;
  }
  const urls = raw.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 5);
  if (urls.length === 0) {
    showToast('Không tìm thấy link ảnh hợp lệ!');
    return;
  }
  showToast(`Đang thêm ${urls.length} ảnh vào thư viện...`);
  let successCount = 0;
  for (const url of urls) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/product-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: currentManagingProductId, imageUrl: url })
      });
      if (res.ok) successCount++;
    } catch (e) {
      console.error(e);
    }
  }
  input.value = '';
  showToast(`Đã thêm thành công ${successCount} ảnh vào bộ sưu tập!`);
  await reloadProductImagesList(currentManagingProductId);
  await fetchProducts();
  renderProductsTable();
}

function previewAdminVariantChips() {
  const colorsVal = document.getElementById('prodColors')?.value || '';
  const storageVal = document.getElementById('prodStorageOptions')?.value || '';

  const colorPreviewEl = document.getElementById('adminColorChipsPreview');
  if (colorPreviewEl) {
    const list = colorsVal.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 0) {
      colorPreviewEl.innerHTML = list.map(c => `
        <span style="display: inline-flex; align-items: center; gap: 4px; background: #ffffff; border: 1px solid #93c5fd; color: #1e40af; font-size: 0.73rem; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #3b82f6;"></span> ${c}
        </span>
      `).join('');
    } else {
      colorPreviewEl.innerHTML = '<span style="font-size: 0.72rem; color: #94a3b8; font-style: italic;">Chưa nhập màu</span>';
    }
  }

  const storagePreviewEl = document.getElementById('adminStorageChipsPreview');
  if (storagePreviewEl) {
    const list = storageVal.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 0) {
      storagePreviewEl.innerHTML = list.map(s => `
        <span style="display: inline-flex; align-items: center; gap: 4px; background: #ffffff; border: 1px solid #86efac; color: #166534; font-size: 0.73rem; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
          💾 ${s}
        </span>
      `).join('');
    } else {
      storagePreviewEl.innerHTML = '<span style="font-size: 0.72rem; color: #94a3b8; font-style: italic;">Chưa nhập dung lượng</span>';
    }
  }
}

function openAddProductModal() {
  try {
    const titleEl = document.getElementById('productModalTitle');
    if (titleEl) titleEl.textContent = 'Thêm Sản Phẩm Mới';

    const setVal = (elmId, val) => {
      const el = document.getElementById(elmId);
      if (el) el.value = val;
    };

    setVal('prodId', '');
    setVal('prodName', '');
    setVal('prodPrice', '');
    setVal('prodDiscountPercent', 0);
    setVal('prodQuantity', '');
    setVal('prodSoldQuantity', 0);
    setVal('prodImageUrl', '');
    setVal('prodDescription', '');
    setVal('prodColors', '');
    setVal('prodStorageOptions', '');
    setVal('prodMultiUrlInput', '');

    updateCoverPreview('');
    currentProductFormImages = [];
    renderProductFormImagesPreview();
    previewAdminVariantChips();
    populateCategoryDropdowns();
    calculateDiscountPricePreview();
  } catch (err) {
    console.error('Lỗi thiết lập form thêm sản phẩm:', err);
  }
  openAdminModal('productModal');
}

function openEditProductModal(id) {
  try {
    const p = adminProducts.find(item => item.id === id);
    if (!p) return;

    const titleEl = document.getElementById('productModalTitle');
    if (titleEl) titleEl.textContent = `Chỉnh Sửa: ${p.name}`;

    const setVal = (elmId, val) => {
      const el = document.getElementById(elmId);
      if (el) el.value = val;
    };

    setVal('prodId', p.id);
    setVal('prodName', p.name);
    setVal('prodPrice', p.price);
    setVal('prodDiscountPercent', p.discountPercent || 0);
    setVal('prodQuantity', p.quantity);
    setVal('prodSoldQuantity', p.soldQuantity || 0);

    const coverUrl = (p.images && p.images.length > 0) ? p.images[0].imageUrl : '';
    setVal('prodImageUrl', coverUrl);
    setVal('prodDescription', p.description || '');
    setVal('prodColors', p.colors || '');
    setVal('prodStorageOptions', p.storageOptions || '');
    setVal('prodMultiUrlInput', '');

    updateCoverPreview(coverUrl);

    // Nạp toàn bộ danh sách ảnh hiện tại vào album xem trước
    currentProductFormImages = (p.images && p.images.length > 0) ? p.images.map(img => img.imageUrl) : [];
    renderProductFormImagesPreview();
    previewAdminVariantChips();

    populateCategoryDropdowns();
    if (p.category) {
      setVal('prodCategory', p.category.id);
    }
    if (p.brand && p.brand.id) {
      setVal('prodBrand', p.brand.id);
    } else {
      const matchB = adminBrands ? adminBrands.find(b => p.name && p.name.toLowerCase().includes(b.name.toLowerCase())) : null;
      if (matchB) setVal('prodBrand', matchB.id);
      else setVal('prodBrand', '');
    }

    calculateDiscountPricePreview();
  } catch (err) {
    console.error('Lỗi thiết lập form sửa sản phẩm:', err);
  }
  openAdminModal('productModal');
}

async function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('prodId').value;
  const name = document.getElementById('prodName').value.trim();
  const categoryId = document.getElementById('prodCategory').value;
  const brandId = document.getElementById('prodBrand').value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const discountPercent = parseInt(document.getElementById('prodDiscountPercent').value) || 0;
  const quantity = parseInt(document.getElementById('prodQuantity').value);
  const soldQuantity = parseInt(document.getElementById('prodSoldQuantity').value) || 0;
  const description = document.getElementById('prodDescription').value.trim();
  const colors = document.getElementById('prodColors').value.trim();
  const storageOptions = document.getElementById('prodStorageOptions').value.trim();
  const initialImageUrl = (currentProductFormImages && currentProductFormImages.length > 0)
    ? currentProductFormImages[0]
    : document.getElementById('prodImageUrl').value.trim();

  if (!name) {
    showToast('Vui lòng nhập tên sản phẩm!');
    return;
  }
  if (!categoryId) {
    showToast('Vui lòng chọn danh mục cho sản phẩm!');
    return;
  }

  const payload = {
    name,
    price: isNaN(price) ? 0 : price,
    discountPercent,
    quantity: isNaN(quantity) ? 0 : quantity,
    soldQuantity,
    description,
    colors,
    storageOptions,
    category: { id: Number(categoryId) }
  };
  if (brandId) {
    payload.brand = { id: Number(brandId) };
  } else {
    payload.brand = null;
  }

  try {
    let savedProduct;
    if (id) {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Lỗi khi cập nhật sản phẩm');
      }
      savedProduct = await res.json();
      lastCreatedProductId = savedProduct.id;
      showToast(`Đã cập nhật sản phẩm #${savedProduct.id} thành công!`);
    } else {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Lỗi khi tạo sản phẩm');
      }
      savedProduct = await res.json();
      lastCreatedProductId = savedProduct.id;
      showToast(`🎉 Đã thêm thành công sản phẩm #${savedProduct.id} - ${savedProduct.name}! (Hiển thị ở dòng đầu tiên)`);
    }

    // Tự động đồng bộ toàn bộ danh sách ảnh trong album vào CSDL
    const pId = savedProduct.id;
    if (pId && currentProductFormImages.length > 0) {
      try {
        const existingRes = await fetch(`${API_BASE_URL}/api/product-images/product/${pId}`);
        const existingImages = existingRes.ok ? await existingRes.json() : [];
        const existingUrls = existingImages.map(img => img.imageUrl);

        for (const url of currentProductFormImages) {
          if (!existingUrls.includes(url)) {
            await fetch(`${API_BASE_URL}/api/product-images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: pId, imageUrl: url })
            });
          }
        }
      } catch (errImages) {
        console.error('Lỗi đồng bộ album ảnh:', errImages);
      }
    }

    closeAdminModal('productModal');
    await fetchProducts();
    updateStatCounters();

    // Tự động đặt bộ lọc về Mới nhất và Trang 1 để người dùng thấy ngay sản phẩm vừa thêm
    const sortSelect = document.getElementById('sortProductSelect');
    if (sortSelect) sortSelect.value = 'default';
    const searchInput = document.getElementById('filterProductSearch');
    if (searchInput) searchInput.value = '';
    adminProductCurrentPage = 1;
    applyProductFilters();
    renderCharts();
  } catch (err) {
    console.error('Lỗi khi lưu sản phẩm:', err);
    showToast(err.message || 'Lỗi khi lưu sản phẩm!');
  }
}

async function deleteProduct(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Đã xóa sản phẩm thành công!');
    await fetchProducts();
    updateStatCounters();
    renderProductsTable();
    renderCharts();
  } catch (e) {
    showToast('Không thể xóa sản phẩm!');
  }
}

// ==================== 2. QUẢN LÝ ẢNH (ProductImage) ====================
async function openImagesModal(productId, productName) {
  currentManagingProductId = productId;
  document.getElementById('imagesModalTitle').textContent = `Thư Viện Ảnh: ${productName}`;
  document.getElementById('newImageUrlInput').value = '';
  await reloadProductImagesList(productId);
  openAdminModal('imagesModal');
}

async function reloadProductImagesList(productId) {
  const container = document.getElementById('productImagesList');
  try {
    const res = await fetch(`${API_BASE_URL}/api/product-images/product/${productId}`);
    const images = await res.json();

    if (images.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary); padding: 1rem 0;">Sản phẩm chưa có ảnh nào trong album.</p>`;
      return;
    }

    container.innerHTML = images.map((img, idx) => `
      <div style="position: relative; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-light); box-shadow: var(--shadow-card); background: #ffffff;">
        <span style="position: absolute; top: 4px; left: 4px; background: rgba(0,0,0,0.6); color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
          #${idx + 1}
        </span>
        <img src="${img.imageUrl}" style="width: 100%; height: 110px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'">
        <button onclick="deleteProductImage(${img.id})" style="width: 100%; padding: 6px; border: none; background: #fee2e2; color: #dc2626; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          Xóa ảnh này
        </button>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<p style="color: red;">Lỗi tải ảnh!</p>`;
  }
}

async function addNewProductImage() {
  await addNewProductImagesFromInput();
}

async function deleteProductImage(imageId) {
  if (!confirm('Xác nhận xóa ảnh này?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/product-images/${imageId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Đã xóa ảnh thành công!');
    await reloadProductImagesList(currentManagingProductId);
    await fetchProducts();
    renderProductsTable();
  } catch (e) {
    showToast('Không thể xóa ảnh!');
  }
}

// ==================== 3. QUẢN LÝ DANH MỤC ====================
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (res.ok) adminCategories = await res.json();
  } catch (e) {
    console.error('Lỗi tải categories:', e);
  }
}

function renderCategoriesTable(filteredList = null) {
  const list = filteredList !== null ? filteredList : adminCategories;
  const tbody = document.getElementById('categoryTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy danh mục phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => {
    // Đếm số lượng sản phẩm thuộc danh mục
    const productCount = adminProducts.filter(p => p.category && String(p.category.id) === String(c.id)).length;
    const hasProducts = productCount > 0;

    const statusBadge = hasProducts
      ? `<span class="tag-badge tag-green">Đang kinh doanh</span>`
      : `<span class="tag-badge tag-amber">Chưa có sản phẩm</span>`;

    return `
      <tr>
        <td>
          <strong style="color: #2563eb; font-size: 0.95rem;">#DM${c.id}</strong>
        </td>
        <td>
          <div style="font-size: 0.98rem; font-weight: 700; color: var(--text-primary);">${c.name}</div>
        </td>
        <td>
          <span style="font-weight: 700; color: ${hasProducts ? '#2563eb' : 'var(--text-secondary)'};">
            ${productCount} sản phẩm
          </span>
        </td>
        <td>${statusBadge}</td>
        <td style="color: var(--text-secondary); max-width: 320px; font-size: 0.88rem; line-height: 1.4;">
          ${c.description || 'Chưa có phần mô tả chi tiết'}
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-delete" title="Xóa danh mục" onclick="deleteCategory(${c.id})">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function applyCategoryFilters() {
  const searchInput = document.getElementById('filterCategorySearch');
  const statusSelect = document.getElementById('filterCategoryStatus');
  const sortSelect = document.getElementById('sortCategorySelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusSelect ? statusSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'default';

  let result = [...adminCategories];

  // 1. Tìm kiếm theo Tên danh mục, Mô tả, Mã ID (#1, DM1, 1)
  if (keyword) {
    result = result.filter(c => {
      const idStr = String(c.id);
      const matchId = idStr === keyword || `#${idStr}` === keyword || `dm${idStr}` === keyword || `#dm${idStr}` === keyword;
      const matchName = c.name && c.name.toLowerCase().includes(keyword);
      const matchDesc = c.description && c.description.toLowerCase().includes(keyword);
      return matchId || matchName || matchDesc;
    });
  }

  // 2. Lọc theo trạng thái (Đang có sản phẩm / Danh mục trống)
  if (statusVal === 'has_products') {
    result = result.filter(c => {
      const count = adminProducts.filter(p => p.category && String(p.category.id) === String(c.id)).length;
      return count > 0;
    });
  } else if (statusVal === 'empty_products') {
    result = result.filter(c => {
      const count = adminProducts.filter(p => p.category && String(p.category.id) === String(c.id)).length;
      return count === 0;
    });
  }

  // 3. Sắp xếp danh mục
  if (sortVal === 'products_desc') {
    result.sort((a, b) => {
      const countA = adminProducts.filter(p => p.category && String(p.category.id) === String(a.id)).length;
      const countB = adminProducts.filter(p => p.category && String(p.category.id) === String(b.id)).length;
      return countB - countA;
    });
  } else if (sortVal === 'products_asc') {
    result.sort((a, b) => {
      const countA = adminProducts.filter(p => p.category && String(p.category.id) === String(a.id)).length;
      const countB = adminProducts.filter(p => p.category && String(p.category.id) === String(b.id)).length;
      return countA - countB;
    });
  } else if (sortVal === 'name_asc') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('categoryFilterStatsText');
  if (statsEl) {
    const emptyCount = result.filter(c => {
      return adminProducts.filter(p => p.category && String(p.category.id) === String(c.id)).length === 0;
    }).length;
    let emptyNote = emptyCount > 0 ? ` · <span style="color: #d97706; font-weight: 600;">(Có ${emptyCount} danh mục trống chưa có SP)</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminCategories.length} danh mục${emptyNote}`;
  }

  renderCategoriesTable(result);
}

function resetCategoryFilters() {
  const searchInput = document.getElementById('filterCategorySearch');
  const statusSelect = document.getElementById('filterCategoryStatus');
  const sortSelect = document.getElementById('sortCategorySelect');

  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'default';

  applyCategoryFilters();
}

function openAddCategoryModal() {
  document.getElementById('catName').value = '';
  document.getElementById('catDescription').value = '';
  openAdminModal('categoryModal');
}

async function saveCategory(e) {
  e.preventDefault();
  const name = document.getElementById('catName').value.trim();
  const description = document.getElementById('catDescription').value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (!res.ok) throw new Error();
    showToast('Đã thêm danh mục mới!');
    closeAdminModal('categoryModal');
    await fetchCategories();
    updateStatCounters();
    populateCategoryDropdowns();
    renderCategoriesTable();
    renderCharts();
  } catch (e) {
    showToast('Lỗi khi lưu danh mục!');
  }
}

async function deleteCategory(id) {
  if (!confirm('Cảnh báo: Xóa danh mục sẽ xóa toàn bộ sản phẩm bên trong! Bạn có chắc không?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Đã xóa danh mục thành công!');
    await fetchCategories();
    await fetchProducts();
    updateStatCounters();
    populateCategoryDropdowns();
    renderCategoriesTable();
    renderCharts();
  } catch (e) {
    showToast('Không thể xóa danh mục!');
  }
}

// ==================== 4. QUẢN LÝ ĐÁNH GIÁ (Review) ====================
async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (res.ok) adminReviews = await res.json();
  } catch (e) {
    console.error('Lỗi tải reviews:', e);
  }
}

function renderReviewsTable(filteredList = null) {
  const list = filteredList !== null ? filteredList : adminReviews;
  const tbody = document.getElementById('reviewTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy đánh giá phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const prodName = r.product ? r.product.name : 'Sản phẩm đã gỡ bỏ';
    const author = r.user ? (r.user.fullName || r.user.username) : 'Khách vãng lai';
    const authorEmail = r.user && r.user.email ? r.user.email : '';
    const date = r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : 'Mới đây';

    const isLowRating = (r.rating <= 2);

    return `
      <tr style="${isLowRating ? 'background-color: #fffaf0;' : ''}">
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${prodName}</div>
          <small style="color: var(--text-secondary); font-size: 0.78rem;">Mã SP: #${r.product ? r.product.id : 'N/A'}</small>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${author}</div>
          ${authorEmail ? `<div style="font-size: 0.78rem; color: var(--text-secondary);">${authorEmail}</div>` : ''}
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #f59e0b; font-size: 1rem; letter-spacing: 1px;">${renderStars(r.rating)}</span>
            <span style="font-weight: 700; font-size: 0.85rem; color: #475569;">(${r.rating}/5)</span>
          </div>
          ${isLowRating ? '<span class="tag-badge tag-red" style="font-size: 0.7rem; margin-top: 3px;">Cần xử lý</span>' : ''}
        </td>
        <td style="max-width: 320px; line-height: 1.4; color: #334155; font-size: 0.88rem;">
          ${r.comment || '<i style="color: #94a3b8;">Không có nội dung lời nhắn</i>'}
        </td>
        <td style="font-size: 0.82rem; color: var(--text-secondary); white-space: nowrap;">${date}</td>
        <td style="text-align: right; white-space: nowrap;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-delete" title="Xóa đánh giá này" onclick="deleteReview(${r.id})">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function applyReviewFilters() {
  const searchInput = document.getElementById('filterReviewSearch');
  const ratingSelect = document.getElementById('filterReviewRating');
  const sortSelect = document.getElementById('sortReviewSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const ratingVal = ratingSelect ? ratingSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'date_desc';

  let result = [...adminReviews];

  // 1. Tìm theo tên khách hàng, email, tên sản phẩm hoặc nội dung nhận xét
  if (keyword) {
    result = result.filter(r => {
      const prodName = (r.product && r.product.name) ? r.product.name.toLowerCase() : '';
      const authorName = (r.user && (r.user.fullName || r.user.username)) ? (r.user.fullName || r.user.username).toLowerCase() : '';
      const authorEmail = (r.user && r.user.email) ? r.user.email.toLowerCase() : '';
      const commentTxt = r.comment ? r.comment.toLowerCase() : '';
      return prodName.includes(keyword) || authorName.includes(keyword) || authorEmail.includes(keyword) || commentTxt.includes(keyword);
    });
  }

  // 2. Lọc theo số sao (5, 4, 3, low_stars: 1-2 sao)
  if (ratingVal === 'low_stars') {
    result = result.filter(r => r.rating <= 2);
  } else if (ratingVal !== 'all') {
    result = result.filter(r => String(r.rating) === String(ratingVal));
  }

  // 3. Sắp xếp đánh giá
  if (sortVal === 'date_desc') {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortVal === 'date_asc') {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (sortVal === 'rating_asc') {
    // Ưu tiên số sao thấp trước để xử lý khiếu nại
    result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  } else if (sortVal === 'rating_desc') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('reviewFilterStatsText');
  if (statsEl) {
    const lowCount = result.filter(r => r.rating <= 2).length;
    let note = lowCount > 0 ? ` · <span style="color: #dc2626; font-weight: 600;">(Có ${lowCount} phản hồi 1-2 sao cần hỗ trợ)</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminReviews.length} đánh giá${note}`;
  }

  renderReviewsTable(result);
}

function resetReviewFilters() {
  const searchInput = document.getElementById('filterReviewSearch');
  const ratingSelect = document.getElementById('filterReviewRating');
  const sortSelect = document.getElementById('sortReviewSelect');

  if (searchInput) searchInput.value = '';
  if (ratingSelect) ratingSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'date_desc';

  applyReviewFilters();
}

async function deleteReview(id) {
  if (!confirm('Bạn có muốn xóa bài đánh giá này không?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Đã xóa đánh giá thành công!');
    await fetchReviews();
    updateStatCounters();
    renderReviewsTable();
  } catch (e) {
    showToast('Không thể xóa đánh giá!');
  }
}

// ==================== 5. QUẢN LÝ NGƯỜI DÙNG ====================
async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    if (res.ok) adminUsers = await res.json();
  } catch (e) {
    console.error('Lỗi tải users:', e);
  }
}

function renderUsersTable(usersToRender = null) {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  const list = usersToRender !== null ? usersToRender : adminUsers;

  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy tài khoản người dùng phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(u => {
    const isUAdmin = (u.role && u.role.toUpperCase() === 'ADMIN');
    const firstLetter = (u.fullName || u.username || 'U').charAt(0).toUpperCase();
    return `
      <tr>
        <td style="font-weight: 600; color: var(--text-secondary);">#${u.id}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isUAdmin ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)'}; color: ${isUAdmin ? '#2563eb' : '#059669'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">
              ${firstLetter}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-main);">${u.username || ''}</div>
            </div>
          </div>
        </td>
        <td style="font-weight: 500;">${u.fullName || 'Chưa cập nhật'}</td>
        <td style="color: var(--text-secondary);">${u.email || '—'}</td>
        <td>
          <span class="tag-badge ${isUAdmin ? 'tag-blue' : 'tag-green'}" style="font-weight: 600; font-size: 0.78rem;">
            ${isUAdmin ? 'ADMIN' : 'CUSTOMER'}
          </span>
        </td>
        <td style="text-align: right;">
          <select onchange="changeUserRole(${u.id}, this.value)" class="filter-select" style="padding: 4px 10px; font-size: 0.82rem; width: auto; font-weight: 600; height: auto;">
            <option value="ADMIN" ${isUAdmin ? 'selected' : ''}>ADMIN</option>
            <option value="CUSTOMER" ${!isUAdmin ? 'selected' : ''}>CUSTOMER</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function applyUserFilters() {
  const searchVal = (document.getElementById('filterUserSearch')?.value || '').trim().toLowerCase();
  const roleVal = document.getElementById('filterUserRole')?.value || 'all';
  const sortVal = document.getElementById('sortUserSelect')?.value || 'id_desc';

  let result = [...adminUsers];

  // 1. Tìm theo username, họ tên hoặc email
  if (searchVal) {
    result = result.filter(u => {
      const uname = (u.username || '').toLowerCase();
      const fname = (u.fullName || '').toLowerCase();
      const mail = (u.email || '').toLowerCase();
      return uname.includes(searchVal) || fname.includes(searchVal) || mail.includes(searchVal);
    });
  }

  // 2. Lọc theo Phân quyền (role)
  if (roleVal !== 'all') {
    result = result.filter(u => (u.role || '').toUpperCase() === roleVal.toUpperCase());
  }

  // 3. Sắp xếp
  result.sort((a, b) => {
    switch (sortVal) {
      case 'id_asc':
        return (a.id || 0) - (b.id || 0);
      case 'name_asc': {
        const nameA = (a.fullName || a.username || '').toLowerCase();
        const nameB = (b.fullName || b.username || '').toLowerCase();
        return nameA.localeCompare(nameB, 'vi');
      }
      case 'name_desc': {
        const nameA = (a.fullName || a.username || '').toLowerCase();
        const nameB = (b.fullName || b.username || '').toLowerCase();
        return nameB.localeCompare(nameA, 'vi');
      }
      case 'id_desc':
      default:
        return (b.id || 0) - (a.id || 0);
    }
  });

  // 4. Cập nhật thống kê hiển thị
  const statsEl = document.getElementById('userFilterStatsText');
  if (statsEl) {
    if (result.length === adminUsers.length) {
      statsEl.textContent = `Đang hiển thị toàn bộ ${adminUsers.length} tài khoản`;
    } else {
      statsEl.textContent = `Đang hiển thị ${result.length} / ${adminUsers.length} tài khoản phù hợp`;
    }
  }

  renderUsersTable(result);
}

function resetUserFilters() {
  const searchEl = document.getElementById('filterUserSearch');
  if (searchEl) searchEl.value = '';

  const roleEl = document.getElementById('filterUserRole');
  if (roleEl) roleEl.value = 'all';

  const sortEl = document.getElementById('sortUserSelect');
  if (sortEl) sortEl.value = 'id_desc';

  applyUserFilters();
}

async function changeUserRole(userId, newRole) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    if (!res.ok) throw new Error();
    showToast(`Đã cập nhật vai trò người dùng #${userId} thành ${newRole}!`);
    await fetchUsers();
    applyUserFilters();
  } catch (e) {
    showToast('Lỗi khi phân quyền người dùng!');
  }
}

// ==================== 6. QUẢN LÝ ĐƠN HÀNG (Order Management) ====================
async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    if (res.ok) adminOrders = await res.json();
  } catch (e) {
    console.error('Lỗi tải orders:', e);
  }
}

function renderOrdersTable(filteredList = null) {
  const list = filteredList !== null ? filteredList : adminOrders;
  const tbody = document.getElementById('orderTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy đơn hàng phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng mã đơn, số điện thoại khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(o => {
    const date = o.orderDate ? new Date(o.orderDate).toLocaleString('vi-VN') : '—';
    
    // Status Tag (Loại bỏ emoji, dùng tag-badge màu sắc phẳng hiện đại)
    let statusBadge = '<span class="tag-badge tag-amber">Chờ xử lý</span>';
    if (o.status === 'CONFIRMED') statusBadge = '<span class="tag-badge tag-blue">Đã xác nhận</span>';
    else if (o.status === 'SHIPPING') statusBadge = '<span class="tag-badge tag-blue" style="background:#e0f2fe; color:#0369a1;">Đang giao hàng</span>';
    else if (o.status === 'COMPLETED') statusBadge = '<span class="tag-badge tag-green">Đã hoàn thành</span>';
    else if (o.status === 'CANCELLED') statusBadge = '<span class="tag-badge tag-red">Đã hủy đơn</span>';

    // Payment Tag
    const isPaid = (o.paymentStatus === 'PAID');
    const payBadge = isPaid
      ? `<span class="tag-badge tag-green" style="cursor:pointer;" title="Bấm để chuyển sang Chưa thanh toán" onclick="toggleOrderPaymentStatus(${o.id}, '${o.paymentStatus}')">● Đã thanh toán</span>`
      : `<span class="tag-badge tag-amber" style="cursor:pointer;" title="Bấm để chuyển sang Đã thanh toán" onclick="toggleOrderPaymentStatus(${o.id}, '${o.paymentStatus}')">● Chưa thanh toán</span>`;

    let payMethodName = (o.paymentMethod === 'VIETQR') ? 'VietQR Chuyển khoản' : 'Tiền mặt (COD)';

    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: #2563eb; font-size: 0.95rem;">#DH${o.id}</div>
          <small style="color: var(--text-secondary); font-size: 0.76rem;">ID: ${o.id}</small>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${o.receiverName || 'Khách hàng'}</div>
          <div style="font-size: 0.8rem; color: #2563eb; font-weight: 600;">${o.receiverPhone || '—'}</div>
          <small style="color: var(--text-secondary); display: block; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${o.shippingAddress || ''}">
            ${o.shippingAddress || '—'}
          </small>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-secondary); white-space: nowrap;">${date}</td>
        <td>
          <div style="font-size: 0.82rem; font-weight: 600; margin-bottom: 0.25rem; color: #334155;">${payMethodName}</div>
          ${payBadge}
        </td>
        <td style="font-weight: 800; color: #dc2626; font-size: 0.95rem; white-space: nowrap;">
          ${formatCurrency(o.totalPrice)}
        </td>
        <td>${statusBadge}</td>
        <td style="text-align: right; white-space: nowrap;">
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
            <select class="admin-select" style="padding: 0.35rem 0.6rem; font-size: 0.82rem; width: auto; font-weight: 600;" onchange="updateOrderStatusAdmin(${o.id}, this.value)">
              <option value="PENDING" ${o.status === 'PENDING' ? 'selected' : ''}>Chờ xử lý</option>
              <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>Xác nhận</option>
              <option value="SHIPPING" ${o.status === 'SHIPPING' ? 'selected' : ''}>Đang giao</option>
              <option value="COMPLETED" ${o.status === 'COMPLETED' ? 'selected' : ''}>Hoàn thành</option>
              <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>Hủy đơn</option>
            </select>
            <button onclick="handleAdminPrintInvoice(${o.id})" class="btn-action" title="In Hóa Đơn Bán Hàng" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding: 0.38rem 0.65rem;">
              In đơn
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function applyOrderFilters() {
  const searchInput = document.getElementById('filterOrderSearch');
  const statusSelect = document.getElementById('filterOrderStatus');
  const payStatusSelect = document.getElementById('filterOrderPaymentStatus');
  const payMethodSelect = document.getElementById('filterOrderPaymentMethod');
  const sortSelect = document.getElementById('sortOrderSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusSelect ? statusSelect.value : 'all';
  const payStatusVal = payStatusSelect ? payStatusSelect.value : 'all';
  const payMethodVal = payMethodSelect ? payMethodSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'date_desc';

  let result = [...adminOrders];

  // 1. Tìm kiếm theo Mã đơn (#101, DH101, 101), Người nhận, SĐT
  if (keyword) {
    result = result.filter(o => {
      const idStr = String(o.id);
      const matchId = idStr === keyword || `#${idStr}` === keyword || `dh${idStr}` === keyword || `#dh${idStr}` === keyword;
      const matchName = o.receiverName && o.receiverName.toLowerCase().includes(keyword);
      const matchPhone = o.receiverPhone && o.receiverPhone.toLowerCase().includes(keyword);
      const matchAddress = o.shippingAddress && o.shippingAddress.toLowerCase().includes(keyword);
      return matchId || matchName || matchPhone || matchAddress;
    });
  }

  // 2. Lọc theo trạng thái đơn hàng (PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED)
  if (statusVal !== 'all') {
    result = result.filter(o => o.status === statusVal);
  }

  // 3. Lọc theo trạng thái thanh toán (PAID / UNPAID)
  if (payStatusVal !== 'all') {
    result = result.filter(o => o.paymentStatus === payStatusVal);
  }

  // 4. Lọc theo phương thức thanh toán (COD / VIETQR)
  if (payMethodVal !== 'all') {
    result = result.filter(o => {
      if (!o.paymentMethod) return payMethodVal === 'COD';
      return o.paymentMethod.toUpperCase() === payMethodVal;
    });
  }

  // 5. Sắp xếp đơn hàng
  if (sortVal === 'date_desc') {
    result.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));
  } else if (sortVal === 'date_asc') {
    result.sort((a, b) => new Date(a.orderDate || 0) - new Date(b.orderDate || 0));
  } else if (sortVal === 'total_desc') {
    result.sort((a, b) => (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0));
  } else if (sortVal === 'total_asc') {
    result.sort((a, b) => (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0));
  }

  // Cập nhật text thống kê đơn hàng
  const statsEl = document.getElementById('orderFilterStatsText');
  if (statsEl) {
    const pendingCount = result.filter(o => o.status === 'PENDING').length;
    let pendingNote = pendingCount > 0 ? ` · <span style="color: #d97706; font-weight: 600;">(${pendingCount} đơn chờ xử lý)</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminOrders.length} đơn hàng${pendingNote}`;
  }

  renderOrdersTable(result);
}

function resetOrderFilters() {
  const searchInput = document.getElementById('filterOrderSearch');
  const statusSelect = document.getElementById('filterOrderStatus');
  const payStatusSelect = document.getElementById('filterOrderPaymentStatus');
  const payMethodSelect = document.getElementById('filterOrderPaymentMethod');
  const sortSelect = document.getElementById('sortOrderSelect');

  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  if (payStatusSelect) payStatusSelect.value = 'all';
  if (payMethodSelect) payMethodSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'date_desc';

  applyOrderFilters();
}

function handleAdminPrintInvoice(orderId) {
  const o = adminOrders.find(item => item.id === orderId);
  if (o) {
    printOrderInvoice(o);
  } else {
    showToast('Không tìm thấy thông tin đơn hàng!');
  }
}

function filterOrdersByStatus(status) {
  const sel = document.getElementById('filterOrderStatus');
  if (sel) sel.value = status;
  applyOrderFilters();
}

async function updateOrderStatusAdmin(orderId, newStatus) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error();
    showToast(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"!`);
    await fetchOrders();
    renderOrdersTable();
  } catch (e) {
    showToast('Lỗi khi cập nhật trạng thái đơn hàng!');
  }
}

async function toggleOrderPaymentStatus(orderId, currentStatus) {
  const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
  if (!confirm(`Chuyển trạng thái thanh toán đơn #${orderId} sang "${newStatus}"?`)) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: newStatus })
    });
    if (!res.ok) throw new Error();
    showToast(`Đã chuyển thanh toán thành công sang "${newStatus}"!`);
    await fetchOrders();
    renderOrdersTable();
  } catch (e) {
    showToast('Lỗi khi cập nhật thanh toán!');
  }
}

// ==================== TÌM KIẾM TOÀN CỤC ====================
function handleGlobalSearch(query) {
  if (currentTab === 'products') {
    const input = document.getElementById('filterSearchInput');
    if (input) input.value = query;
    applyProductFilters();
  } else if (currentTab === 'orders') {
    const input = document.getElementById('filterOrderSearch');
    if (input) input.value = query;
    applyOrderFilters();
  } else if (currentTab === 'categories') {
    const input = document.getElementById('filterCategorySearch');
    if (input) input.value = query;
    applyCategoryFilters();
  } else if (currentTab === 'brands') {
    const input = document.getElementById('filterBrandSearch');
    if (input) input.value = query;
    applyBrandFilters();
  } else if (currentTab === 'reviews') {
    const input = document.getElementById('filterReviewSearch');
    if (input) input.value = query;
    applyReviewFilters();
  } else if (currentTab === 'posts') {
    const input = document.getElementById('filterPostSearch');
    if (input) input.value = query;
    applyPostFilters();
  } else if (currentTab === 'postComments') {
    const input = document.getElementById('filterPostCommentSearch');
    if (input) input.value = query;
    applyPostCommentFilters();
  } else if (currentTab === 'users') {
    const input = document.getElementById('filterUserSearch');
    if (input) input.value = query;
    applyUserFilters();
  }
}

// ==================== QUẢN LÝ BÀI VIẾT (POSTS) ====================
async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    if (res.ok) {
      adminPosts = await res.json();
    }
  } catch (err) {
    console.error('Lỗi tải bài viết:', err);
  }
}

function renderAdminPostsTable(postsToRender = null) {
  const list = postsToRender !== null ? postsToRender : adminPosts;
  const tbody = document.getElementById('postTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy bài viết phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng tiêu đề khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const img = p.thumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
    const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '';
    const commentCount = (p.comments && p.comments.length) || 0;
    const isPub = (p.status === 'PUBLISHED');

    return `
      <tr>
        <td>
          <a href="news-detail.html?id=${p.id}" target="_blank" title="Xem bài viết trên web">
            <img src="${img}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; cursor: pointer;">
          </a>
        </td>
        <td style="max-width: 260px;">
          <a href="news-detail.html?id=${p.id}" target="_blank" style="font-weight: 700; color: #1e293b; line-height: 1.35; text-decoration: none; display: block;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#1e293b'" title="Bấm để xem chi tiết bài viết">
            ${p.title} <span style="font-size: 0.8rem; color: #2563eb;">↗</span>
          </a>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${p.summary || ''}
          </div>
        </td>
        <td>
          <span style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">
            ${p.category || 'Công nghệ'}
          </span>
        </td>
        <td style="font-size: 0.88rem; color: #334155;">${p.author || 'SiSi Tech'}</td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${dateStr}</td>
        <td style="font-weight: 700; color: #2563eb;">${p.views || 0}</td>
        <td>
          <span class="tag-badge ${isPub ? 'tag-green' : 'tag-amber'}">
            ${isPub ? 'Đã Xuất Bản' : 'Bản Nháp'}
          </span>
        </td>
        <td>
          <button onclick="filterCommentsByPost(${p.id})" class="btn-action" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 3px 8px;" title="Xem các bình luận của bài viết này">
            ${commentCount} bình luận
          </button>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <div class="action-btns" style="justify-content: flex-end;">
            <a href="news-detail.html?id=${p.id}" target="_blank" class="btn-action" title="Xem bài viết trên giao diện web" style="background:#f8fafc; border:1px solid #cbd5e1; color:#2563eb; text-decoration:none;">
              Xem
            </a>
            <button class="btn-action btn-edit" onclick="openEditPostModal(${p.id})" title="Chỉnh sửa bài viết">
              Sửa
            </button>
            <button class="btn-action btn-delete" onclick="deletePost(${p.id})" title="Xóa bài viết">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function applyPostFilters() {
  const searchInput = document.getElementById('filterPostSearch');
  const catSelect = document.getElementById('filterPostCategorySelect');
  const statusSelect = document.getElementById('filterPostStatusSelect');
  const sortSelect = document.getElementById('sortPostSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const catVal = catSelect ? catSelect.value : 'all';
  const statusVal = statusSelect ? statusSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'date_desc';

  let result = [...adminPosts];

  // 1. Tìm theo Tiêu đề, Tác giả hoặc Tóm tắt
  if (keyword) {
    result = result.filter(p => {
      const matchTitle = p.title && p.title.toLowerCase().includes(keyword);
      const matchAuthor = p.author && p.author.toLowerCase().includes(keyword);
      const matchSummary = p.summary && p.summary.toLowerCase().includes(keyword);
      const matchId = String(p.id) === keyword || `#${p.id}` === keyword;
      return matchTitle || matchAuthor || matchSummary || matchId;
    });
  }

  // 2. Lọc theo chuyên mục
  if (catVal !== 'all') {
    result = result.filter(p => (p.category || '').toLowerCase() === catVal.toLowerCase());
  }

  // 3. Lọc theo trạng thái xuất bản (PUBLISHED / DRAFT)
  if (statusVal !== 'all') {
    result = result.filter(p => (p.status || 'PUBLISHED').toUpperCase() === statusVal.toUpperCase());
  }

  // 4. Sắp xếp bài viết
  if (sortVal === 'date_desc') {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortVal === 'date_asc') {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (sortVal === 'views_desc') {
    result.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
  } else if (sortVal === 'title_asc') {
    result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('postFilterStatsText');
  if (statsEl) {
    const pubCount = result.filter(p => p.status === 'PUBLISHED').length;
    let note = ` · <span style="color: #059669; font-weight: 600;">(${pubCount} bài đã xuất bản)</span>`;
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminPosts.length} bài viết${note}`;
  }

  renderAdminPostsTable(result);
}

function resetPostFilters() {
  const searchInput = document.getElementById('filterPostSearch');
  const catSelect = document.getElementById('filterPostCategorySelect');
  const statusSelect = document.getElementById('filterPostStatusSelect');
  const sortSelect = document.getElementById('sortPostSelect');

  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'date_desc';

  applyPostFilters();
}

function filterPostsByCategory(cat) {
  const catSelect = document.getElementById('filterPostCategorySelect');
  if (catSelect) catSelect.value = cat;
  applyPostFilters();
}

function openAddPostModal() {
  document.getElementById('postModalTitle').textContent = 'Viết Bài Mới';
  document.getElementById('postId').value = '';
  document.getElementById('postTitleInput').value = '';
  document.getElementById('postCategorySelect').value = 'Đánh giá công nghệ';
  document.getElementById('postAuthorInput').value = 'Ban biên tập SiSi Tech';
  document.getElementById('postStatusSelect').value = 'PUBLISHED';
  document.getElementById('postThumbnailInput').value = '';
  document.getElementById('postSummaryInput').value = '';
  document.getElementById('postContentInput').value = '';

  const preview = document.getElementById('postThumbPreviewArea');
  if (preview) preview.style.display = 'none';

  openAdminModal('postModal');
}

function openEditPostModal(id) {
  const post = adminPosts.find(p => p.id === id);
  if (!post) return;

  document.getElementById('postModalTitle').textContent = `Chỉnh Sửa Bài Viết #${post.id}`;
  document.getElementById('postId').value = post.id;
  document.getElementById('postTitleInput').value = post.title || '';
  document.getElementById('postCategorySelect').value = post.category || 'Đánh giá công nghệ';
  document.getElementById('postAuthorInput').value = post.author || '';
  document.getElementById('postStatusSelect').value = post.status || 'PUBLISHED';
  document.getElementById('postThumbnailInput').value = post.thumbnail || '';
  document.getElementById('postSummaryInput').value = post.summary || '';
  document.getElementById('postContentInput').value = post.content || '';

  updatePostThumbPreview(post.thumbnail);
  openAdminModal('postModal');
}

function updatePostThumbPreview(url) {
  const area = document.getElementById('postThumbPreviewArea');
  const img = document.getElementById('postThumbPreviewImg');
  if (url && url.trim()) {
    img.src = url.trim();
    area.style.display = 'block';
  } else {
    area.style.display = 'none';
  }
}

async function uploadPostThumbnail(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    showToast('Đang tải ảnh bài viết lên máy chủ...');
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Tải ảnh thất bại');
    const data = await res.json();
    const url = `${API_BASE_URL}${data.url}`;

    document.getElementById('postThumbnailInput').value = url;
    updatePostThumbPreview(url);
    showToast('Tải ảnh lên thành công!');
  } catch (err) {
    console.error('Lỗi upload ảnh:', err);
    showToast('Không thể upload ảnh, vui lòng thử lại!');
  }
}

async function savePost(e) {
  e.preventDefault();
  const id = document.getElementById('postId').value;
  const title = document.getElementById('postTitleInput').value.trim();
  const category = document.getElementById('postCategorySelect').value;
  const author = document.getElementById('postAuthorInput').value.trim() || 'Ban biên tập SiSi Tech';
  const status = document.getElementById('postStatusSelect').value;
  const thumbnail = document.getElementById('postThumbnailInput').value.trim();
  const summary = document.getElementById('postSummaryInput').value.trim();
  const content = document.getElementById('postContentInput').value.trim();

  const postData = { title, category, author, status, thumbnail, summary, content };

  try {
    let res;
    if (id) {
      res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
    } else {
      res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
    }

    if (!res.ok) throw new Error('Lỗi khi lưu bài viết');

    closeAdminModal('postModal');
    showToast(`${id ? 'Cập nhật' : 'Thêm mới'} bài viết thành công!`);

    await fetchPosts();
    renderAdminPostsTable();
    updateStatCounters();

  } catch (err) {
    console.error('Lỗi lưu bài viết:', err);
    showToast('Có lỗi xảy ra khi lưu bài viết!');
  }
}

async function deletePost(id) {
  if (!confirm(`Bạn có chắc chắn muốn xóa bài viết #${id}?\nTất cả bình luận thuộc bài viết này cũng sẽ bị xóa vĩnh viễn!`)) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Không thể xóa bài viết');

    showToast(`Đã xóa bài viết #${id} thành công!`);
    await fetchPosts();
    await fetchPostComments();
    renderAdminPostsTable();
    renderAdminPostCommentsTable();
    updateStatCounters();
  } catch (err) {
    console.error('Lỗi xóa bài viết:', err);
    showToast('Lỗi khi xóa bài viết!');
  }
}

function viewPostDetail(id) {
  window.open(`news-detail.html?id=${id}`, '_blank');
}

// ==================== QUẢN LÝ BÌNH LUẬN BÀI VIẾT ====================
async function fetchPostComments() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/comments`);
    if (res.ok) {
      adminPostComments = await res.json();
    }
  } catch (err) {
    console.error('Lỗi tải bình luận bài viết:', err);
  }
}

function renderAdminPostCommentsTable(commentsToRender = null) {
  const list = commentsToRender !== null ? commentsToRender : adminPostComments;
  const tbody = document.getElementById('postCommentTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy bình luận phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => {
    const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : '';
    const postTitle = c.postTitle || 'Bài viết';
    const postId = c.postId;

    return `
      <tr>
        <td style="font-weight: 700; color: #1e293b;">${c.authorName || 'Khách'}</td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${c.authorEmail || '—'}</td>
        <td style="max-width: 220px;">
          <a href="news-detail.html?id=${postId}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: none; font-size: 0.88rem; display: block; line-height: 1.35;" title="Xem bài viết: ${postTitle}">
            ${postTitle} <span style="font-size: 0.75rem;">↗</span>
          </a>
        </td>
        <td style="max-width: 300px; font-size: 0.9rem; color: #334155; line-height: 1.4;">
          ${c.content}
        </td>
        <td style="font-size: 0.85rem; color: var(--text-muted); white-space: nowrap;">${dateStr}</td>
        <td>
          <span class="tag-badge tag-green">
            ${c.status || 'Đã duyệt'}
          </span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-delete" onclick="deleteAdminPostComment(${c.id})" title="Xóa bình luận này">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function populatePostCommentFilterDropdown() {
  const sel = document.getElementById('filterPostCommentSelect');
  if (!sel) return;

  const currentVal = sel.value;
  let opts = '<option value="all">Tất cả bài viết</option>';
  adminPosts.forEach(p => {
    opts += `<option value="${p.id}">Bài #${p.id}: ${p.title.length > 35 ? p.title.substring(0, 35) + '...' : p.title}</option>`;
  });
  sel.innerHTML = opts;
  if (currentVal) sel.value = currentVal;
}

function applyPostCommentFilters() {
  const searchInput = document.getElementById('filterPostCommentSearch');
  const postSelect = document.getElementById('filterPostCommentSelect');
  const sortSelect = document.getElementById('sortPostCommentSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const postVal = postSelect ? postSelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'date_desc';

  let result = [...adminPostComments];

  // 1. Tìm theo nội dung, tên người gửi, email
  if (keyword) {
    result = result.filter(c => {
      const matchContent = c.content && c.content.toLowerCase().includes(keyword);
      const matchAuthor = c.authorName && c.authorName.toLowerCase().includes(keyword);
      const matchEmail = c.authorEmail && c.authorEmail.toLowerCase().includes(keyword);
      const matchPostTitle = c.postTitle && c.postTitle.toLowerCase().includes(keyword);
      return matchContent || matchAuthor || matchEmail || matchPostTitle;
    });
  }

  // 2. Lọc theo bài viết cụ thể
  if (postVal !== 'all') {
    result = result.filter(c => String(c.postId) === String(postVal));
  }

  // 3. Sắp xếp bình luận
  if (sortVal === 'date_desc') {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortVal === 'date_asc') {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (sortVal === 'name_asc') {
    result.sort((a, b) => (a.authorName || '').localeCompare(b.authorName || ''));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('postCommentFilterStatsText');
  if (statsEl) {
    let postNote = postVal !== 'all' ? ` · <span style="color: #2563eb; font-weight: 600;">(Lọc theo Bài viết #${postVal})</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminPostComments.length} bình luận${postNote}`;
  }

  renderAdminPostCommentsTable(result);
}

function resetPostCommentFilters() {
  const searchInput = document.getElementById('filterPostCommentSearch');
  const postSelect = document.getElementById('filterPostCommentSelect');
  const sortSelect = document.getElementById('sortPostCommentSelect');

  if (searchInput) searchInput.value = '';
  if (postSelect) postSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'date_desc';

  applyPostCommentFilters();
}

function filterCommentsByPost(postId) {
  switchAdminTab('postComments', document.querySelector('.menu-item[onclick*="postComments"]'));
  populatePostCommentFilterDropdown();
  const sel = document.getElementById('filterPostCommentSelect');
  if (sel) sel.value = String(postId);
  applyPostCommentFilters();
}

// ==================== MODAL HELPERS ====================
function openAdminModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeAdminModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ==================== QUẢN LÝ THƯƠNG HIỆU ====================
async function fetchBrands() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/brands`);
    if (res.ok) {
      adminBrands = await res.json();
    }
  } catch (e) {
    console.warn('Chưa thể kết nối API brands, dùng dữ liệu local:', e);
  }
  if (!adminBrands || adminBrands.length === 0) {
    initBrandsData();
  }
}

function initBrandsData() {
  const saved = localStorage.getItem('sisi_tech_brands');
  if (saved) {
    try {
      adminBrands = JSON.parse(saved);
    } catch(e) {
      adminBrands = [];
    }
  }
  if (!adminBrands || adminBrands.length === 0) {
    adminBrands = [
      { id: 1, name: 'Apple', category: 'iPhone, iPad, MacBook, Phụ kiện', status: 'STRATEGIC' },
      { id: 2, name: 'Samsung', category: 'Galaxy Phone, Tablet, Màn hình', status: 'STRATEGIC' },
      { id: 3, name: 'Xiaomi', category: 'Smartphone, Thiết bị Smart Home', status: 'ACTIVE' },
      { id: 4, name: 'Sony', category: 'Tai nghe chụp tai, Loa, Máy ảnh', status: 'ACTIVE' },
      { id: 5, name: 'Asus', category: 'Laptop ROG, Vivobook, Linh kiện', status: 'ACTIVE' },
      { id: 6, name: 'Marshall', category: 'Loa Bluetooth, Âm thanh Hi-Fi', status: 'ACTIVE' },
      { id: 7, name: 'Logitech', category: 'Chuột, Bàn phím cơ, Tai nghe', status: 'ACTIVE' }
    ];
    saveBrandsToStorage();
  }
}

function saveBrandsToStorage() {
  localStorage.setItem('sisi_tech_brands', JSON.stringify(adminBrands));
}

function renderBrandsTable(filteredList = null) {
  const list = filteredList !== null ? filteredList : adminBrands;
  const tbody = document.getElementById('brandTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">
      <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.3rem;">Không tìm thấy thương hiệu phù hợp</div>
      <div style="font-size: 0.85rem;">Vui lòng thử tìm kiếm bằng tên hãng khác hoặc bấm "Đặt lại" bộ lọc.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((b, idx) => {
    // Đếm số lượng sản phẩm liên quan
    const bNameLower = b.name.toLowerCase();
    const productCount = adminProducts.filter(p => 
      (p.brand && p.brand.id === b.id) ||
      (p.name && p.name.toLowerCase().includes(bNameLower)) ||
      (p.description && p.description.toLowerCase().includes(bNameLower))
    ).length;

    let statusBadge = '<span class="tag-badge tag-green">Chính hãng</span>';
    if (b.status === 'STRATEGIC') {
      statusBadge = '<span class="tag-badge tag-blue">Đối tác chiến lược</span>';
    } else if (b.status === 'PAUSED') {
      statusBadge = '<span class="tag-badge tag-amber">Tạm dừng</span>';
    }

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-secondary);">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; border: 1px solid #bfdbfe;">
              ${b.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${b.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary);">Mã: BR-${String(b.id).padStart(3, '0')}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight: 700; color: ${productCount > 0 ? '#2563eb' : 'var(--text-secondary)'};">
            ${productCount} sản phẩm
          </span>
        </td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">
          ${b.category || 'Tất cả ngành hàng'}
        </td>
        <td>${statusBadge}</td>
        <td style="text-align: right;">
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-action btn-edit" title="Sửa thương hiệu" onclick="openEditBrandModal(${b.id})">
              Sửa
            </button>
            <button class="btn-action btn-delete" title="Xóa thương hiệu" onclick="deleteBrand(${b.id})">
              Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function populateBrandCategoryFilter() {
  const sel = document.getElementById('filterBrandCategorySelect');
  if (!sel) return;

  const currentVal = sel.value;
  const categoriesSet = new Set();
  adminBrands.forEach(b => {
    if (b.category) {
      b.category.split(',').forEach(item => {
        const trimmed = item.trim();
        if (trimmed) categoriesSet.add(trimmed);
      });
    }
  });

  let opts = '<option value="all">Tất cả ngành hàng</option>';
  categoriesSet.forEach(cat => {
    opts += `<option value="${cat}">${cat}</option>`;
  });
  sel.innerHTML = opts;
  if (currentVal && categoriesSet.has(currentVal)) {
    sel.value = currentVal;
  }
}

function applyBrandFilters() {
  const searchInput = document.getElementById('filterBrandSearch');
  const statusSelect = document.getElementById('filterBrandStatus');
  const categorySelect = document.getElementById('filterBrandCategorySelect');
  const sortSelect = document.getElementById('sortBrandSelect');

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusSelect ? statusSelect.value : 'all';
  const categoryVal = categorySelect ? categorySelect.value : 'all';
  const sortVal = sortSelect ? sortSelect.value : 'default';

  let result = [...adminBrands];

  // 1. Tìm theo Tên hãng (Apple, Samsung...), Ngành hàng, Mã BR
  if (keyword) {
    result = result.filter(b => {
      const matchName = b.name && b.name.toLowerCase().includes(keyword);
      const matchCat = b.category && b.category.toLowerCase().includes(keyword);
      const matchDesc = b.description && b.description.toLowerCase().includes(keyword);
      const matchId = String(b.id) === keyword || `br-${b.id}` === keyword || `br-${String(b.id).padStart(3, '0')}` === keyword;
      return matchName || matchCat || matchDesc || matchId;
    });
  }

  // 2. Lọc theo trạng thái đối tác: STRATEGIC / ACTIVE / PAUSED
  if (statusVal !== 'all') {
    result = result.filter(b => (b.status || 'ACTIVE').toUpperCase() === statusVal.toUpperCase());
  }

  // 3. Lọc theo ngành hàng chủ lực
  if (categoryVal !== 'all') {
    const catLower = categoryVal.toLowerCase();
    result = result.filter(b => b.category && b.category.toLowerCase().includes(catLower));
  }

  // 4. Sắp xếp thương hiệu
  if (sortVal === 'products_desc') {
    result.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const countA = adminProducts.filter(p => (p.brand && p.brand.id === a.id) || (p.name && p.name.toLowerCase().includes(aLower))).length;
      const countB = adminProducts.filter(p => (p.brand && p.brand.id === b.id) || (p.name && p.name.toLowerCase().includes(bLower))).length;
      return countB - countA;
    });
  } else if (sortVal === 'products_asc') {
    result.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const countA = adminProducts.filter(p => (p.brand && p.brand.id === a.id) || (p.name && p.name.toLowerCase().includes(aLower))).length;
      const countB = adminProducts.filter(p => (p.brand && p.brand.id === b.id) || (p.name && p.name.toLowerCase().includes(bLower))).length;
      return countA - countB;
    });
  } else if (sortVal === 'name_asc') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // Cập nhật text thống kê kết quả lọc
  const statsEl = document.getElementById('brandFilterStatsText');
  if (statsEl) {
    const strategicCount = result.filter(b => b.status === 'STRATEGIC').length;
    let note = strategicCount > 0 ? ` · <span style="color: #2563eb; font-weight: 600;">(Có ${strategicCount} đối tác chiến lược)</span>` : '';
    statsEl.innerHTML = `Đang hiển thị <strong>${result.length}</strong> / ${adminBrands.length} thương hiệu${note}`;
  }

  renderBrandsTable(result);
}

function resetBrandFilters() {
  const searchInput = document.getElementById('filterBrandSearch');
  const statusSelect = document.getElementById('filterBrandStatus');
  const categorySelect = document.getElementById('filterBrandCategorySelect');
  const sortSelect = document.getElementById('sortBrandSelect');

  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  if (categorySelect) categorySelect.value = 'all';
  if (sortSelect) sortSelect.value = 'default';

  applyBrandFilters();
}

function openAddBrandModal() {
  document.getElementById('brandModalTitle').textContent = 'Thêm Thương Hiệu Mới';
  document.getElementById('brandEditId').value = '';
  document.getElementById('brandNameInput').value = '';
  document.getElementById('brandCategoryInput').value = '';
  document.getElementById('brandStatusInput').value = 'ACTIVE';
  openAdminModal('brandModal');
}

function openEditBrandModal(brandId) {
  const brand = adminBrands.find(b => b.id === brandId);
  if (!brand) return;
  document.getElementById('brandModalTitle').textContent = 'Chỉnh Sửa Thương Hiệu';
  document.getElementById('brandEditId').value = brand.id;
  document.getElementById('brandNameInput').value = brand.name;
  document.getElementById('brandCategoryInput').value = brand.category || '';
  document.getElementById('brandStatusInput').value = brand.status || 'ACTIVE';
  openAdminModal('brandModal');
}

async function saveBrand(event) {
  event.preventDefault();
  const editId = document.getElementById('brandEditId').value;
  const name = document.getElementById('brandNameInput').value.trim();
  const category = document.getElementById('brandCategoryInput').value.trim();
  const status = document.getElementById('brandStatusInput').value;

  if (!name) {
    showToast('Vui lòng nhập tên thương hiệu!');
    return;
  }

  const payload = { name, category, status };

  try {
    if (editId) {
      const res = await fetch(`${API_BASE_URL}/api/brands/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Đã cập nhật thương hiệu "${name}" thành công!`);
      } else {
        throw new Error('API update failed');
      }
    } else {
      const res = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Đã thêm thương hiệu "${name}" thành công!`);
      } else {
        throw new Error('API create failed');
      }
    }
  } catch (err) {
    if (editId) {
      const id = parseInt(editId);
      const b = adminBrands.find(x => x.id === id);
      if (b) { b.name = name; b.category = category; b.status = status; }
    } else {
      const newId = adminBrands.length > 0 ? Math.max(...adminBrands.map(b => b.id)) + 1 : 1;
      adminBrands.push({ id: newId, name, category, status });
    }
    saveBrandsToStorage();
    showToast(`Đã lưu thương hiệu "${name}" thành công!`);
  }

  await fetchBrands();
  closeAdminModal('brandModal');
  renderBrandsTable();
}

async function deleteBrand(brandId) {
  const brand = adminBrands.find(b => b.id === brandId);
  if (!brand) return;
  if (!confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brand.name}"?`)) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/brands/${brandId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('API delete failed');
    showToast(`Đã xóa thương hiệu "${brand.name}" thành công!`);
  } catch (err) {
    adminBrands = adminBrands.filter(b => b.id !== brandId);
    saveBrandsToStorage();
    showToast(`Đã xóa thương hiệu "${brand.name}" thành công!`);
  }

  await fetchBrands();
  renderBrandsTable();
}
