/**
 * Products Page Logic - Hệ thống quản lý sản phẩm cửa hàng online
 * Tác giả: Mai Thị Trang
 */

let allProductsList = [];
let allCategoriesList = [];

// Trạng thái bộ lọc hiện tại
let currentFilter = {
  cat: 'all',       // 'all', 'hot', hoặc ID số
  brand: 'all',     // 'all' hoặc tên hãng (Apple, Samsung...)
  price: 'all',     // 'all', 'under5m', '5to15m', '15to25m', 'above25m'
  sort: 'default',  // 'default', 'price-asc', 'price-desc', 'name-asc'
  search: ''
};

document.addEventListener('DOMContentLoaded', () => {
  readQueryParams();
  checkOAuth2Redirect();
  updateNavbarUser();
  loadData();

  // Bắt sự kiện tìm kiếm & dãn to dần theo chữ nhập
  const searchInput = document.getElementById('searchInput');
  const searchIconBtn = document.getElementById('searchIconBtn') || document.querySelector('.search-bar .search-icon');
  
  function updateSearchInputWidth() {
    if (!searchInput) return;
    const len = searchInput.value.length;
    if (len === 0) {
      if (document.activeElement === searchInput) {
        searchInput.style.width = '290px';
      } else {
        searchInput.style.width = '220px';
      }
    } else {
      const targetWidth = Math.min(500, Math.max(280, 240 + len * 11));
      searchInput.style.width = targetWidth + 'px';
    }
  }

  if (searchInput) {
    if (currentFilter.search) {
      searchInput.value = currentFilter.search;
      updateSearchInputWidth();
    }
    searchInput.addEventListener('focus', updateSearchInputWidth);
    searchInput.addEventListener('blur', () => setTimeout(updateSearchInputWidth, 150));
    searchInput.addEventListener('input', (e) => {
      updateSearchInputWidth();
      currentFilter.search = e.target.value.trim().toLowerCase();
      applyFilters();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        currentFilter.search = searchInput.value.trim().toLowerCase();
        applyFilters();
      }
    });
  }
  if (searchIconBtn) {
    searchIconBtn.style.cursor = 'pointer';
    searchIconBtn.addEventListener('click', () => {
      if (searchInput) {
        currentFilter.search = searchInput.value.trim().toLowerCase();
        applyFilters();
      }
    });
  }
});

function removeVietnameseTones(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function readQueryParams() {
  const params = new URLSearchParams(window.location.search);
  
  const catParam = params.get('cat');
  const filterParam = params.get('filter');
  const brandParam = params.get('brand');
  const priceParam = params.get('price');
  const qParam = params.get('q');
  const sortParam = params.get('sort');

  if (filterParam === 'hot' || catParam === 'hot') {
    currentFilter.cat = 'hot';
  } else if (filterParam === 'sale' || catParam === 'sale') {
    currentFilter.cat = 'sale';
  } else if (filterParam === 'new' || catParam === 'new') {
    currentFilter.cat = 'new';
  } else if (catParam && catParam !== 'all') {
    currentFilter.cat = Number(catParam);
  } else {
    currentFilter.cat = 'all';
  }

  if (brandParam) currentFilter.brand = brandParam;
  if (priceParam) currentFilter.price = priceParam;
  if (qParam) currentFilter.search = qParam.trim().toLowerCase();
  if (sortParam) {
    currentFilter.sort = sortParam;
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = sortParam;
  }
}

async function loadData() {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/categories`),
      fetch(`${API_BASE_URL}/api/products`)
    ]);

    if (!catRes.ok || !prodRes.ok) throw new Error('Không thể tải dữ liệu');

    allCategoriesList = await catRes.json();
    allProductsList = await prodRes.json();

    renderCategoryPills();
    updateBrandPills();
    applyFilters();

  } catch (err) {
    console.error('Lỗi tải dữ liệu sản phẩm:', err);
    document.getElementById('productsGrid').innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc2626;">
        ⚠️ Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối máy chủ!
      </div>
    `;
  }
}

// 1. Render các nút danh mục nhanh
function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  if (!container) return;

  let html = `
    <button class="filter-pill ${currentFilter.cat === 'all' ? 'active' : ''}" onclick="setCategoryFilter('all', this)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      <span>Tất cả</span>
    </button>
    <button class="filter-pill ${currentFilter.cat === 'sale' ? 'active' : ''}" onclick="setCategoryFilter('sale', this)" style="border-color: #fca5a5; color: #e11d48;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      <span>Khuyến mãi</span>
    </button>
    <button class="filter-pill ${currentFilter.cat === 'hot' ? 'active' : ''}" onclick="setCategoryFilter('hot', this)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
      <span>Bán chạy</span>
    </button>
    <button class="filter-pill ${currentFilter.cat === 'new' ? 'active' : ''}" onclick="setCategoryFilter('new', this)" style="border-color: #7dd3fc; color: #0284c7;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span>Mới về</span>
    </button>
  `;

  allCategoriesList.forEach(cat => {
    const isActive = (String(currentFilter.cat) === String(cat.id));
    const icon = getCategoryIcon(cat.name);
    html += `
      <button class="filter-pill ${isActive ? 'active' : ''}" onclick="setCategoryFilter(${cat.id}, this)">
        ${icon}
        <span>${cat.name}</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

// 2. Tự động trích xuất các hãng sản xuất và cập nhật Brand Pills
function updateBrandPills() {
  const container = document.getElementById('brandPills');
  if (!container) return;

  // Lọc sản phẩm theo danh mục hiện tại để lấy hãng liên quan
  let targetProducts = allProductsList;
  if (currentFilter.cat !== 'all' && currentFilter.cat !== 'hot') {
    targetProducts = allProductsList.filter(p => p.category && p.category.id === Number(currentFilter.cat));
  }

  const brandKeywords = [
    'Apple', 'iPhone', 'iPad', 'MacBook', 'Samsung', 'Sony', 
    'Marshall', 'Dell', 'Asus', 'HP', 'Lenovo', 'Xiaomi', 
    'OPPO', 'Garmin', 'JBL', 'Bose', 'Logitech', 'Acer', 'Huawei'
  ];

  const brandSet = new Set();
  targetProducts.forEach(p => {
    const name = p.name || '';
    brandKeywords.forEach(b => {
      if (name.toLowerCase().includes(b.toLowerCase())) {
        if (b === 'iPhone' || b === 'iPad' || b === 'MacBook') brandSet.add('Apple');
        else brandSet.add(b);
      }
    });
  });

  if (brandSet.size === 0) {
    ['Apple', 'Samsung', 'Sony', 'Dell', 'Marshall'].forEach(x => brandSet.add(x));
  }

  let html = `
    <button class="filter-pill ${currentFilter.brand === 'all' ? 'active' : ''}" onclick="setBrandFilter('all', this)">
      Tất cả hãng
    </button>
  `;

  brandSet.forEach(b => {
    const isActive = (currentFilter.brand.toLowerCase() === b.toLowerCase());
    html += `
      <button class="filter-pill ${isActive ? 'active' : ''}" onclick="setBrandFilter('${b}', this)">
        ${b}
      </button>
    `;
  });

  container.innerHTML = html;
}

// 3. Sự kiện chuyển đổi bộ lọc
function setCategoryFilter(catId, btnEl) {
  currentFilter.cat = catId;
  currentFilter.brand = 'all'; // Reset hãng khi đổi danh mục
  
  if (btnEl) {
    btnEl.parentElement.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }

  updateBrandPills();
  applyFilters();
}

function setBrandFilter(brand, btnEl) {
  currentFilter.brand = brand;
  if (btnEl) {
    btnEl.parentElement.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  applyFilters();
}

function setPriceFilter(priceRange, btnEl) {
  currentFilter.price = priceRange;
  if (btnEl) {
    btnEl.parentElement.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  applyFilters();
}

function resetAllFilters() {
  currentFilter = {
    cat: 'all',
    brand: 'all',
    price: 'all',
    sort: 'default',
    search: ''
  };

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'default';

  renderCategoryPills();
  updateBrandPills();

  // Reset active classes cho price
  document.querySelectorAll('.filter-row:nth-child(3) .filter-pill').forEach((btn, idx) => {
    if (idx === 0) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  applyFilters();
}

// 4. Lọc và Hiển thị sản phẩm
function applyFilters() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) currentFilter.sort = sortSelect.value;

  let filtered = [...allProductsList];

  // 1. Lọc theo Danh mục & Phân loại đặc biệt
  if (currentFilter.cat === 'hot') {
    filtered = filtered.filter(p => p.isHot || (p.soldQuantity && p.soldQuantity >= 10))
      .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
  } else if (currentFilter.cat === 'sale') {
    filtered = filtered.filter(p => p.discountPercent && p.discountPercent > 0)
      .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  } else if (currentFilter.cat === 'new') {
    filtered = filtered.filter(p => {
      if (p.isNew) return true;
      if (p.createdAt) {
        const diffDays = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 10;
      }
      return false;
    }).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (currentFilter.cat !== 'all') {
    filtered = filtered.filter(p => p.category && p.category.id === Number(currentFilter.cat));
  }

  // 2. Lọc theo Hãng
  if (currentFilter.brand !== 'all') {
    const brandLower = currentFilter.brand.toLowerCase();
    filtered = filtered.filter(p => {
      const name = (p.name || '').toLowerCase();
      if (brandLower === 'apple') {
        return name.includes('apple') || name.includes('iphone') || name.includes('ipad') || name.includes('macbook');
      }
      return name.includes(brandLower);
    });
  }

  // 3. Lọc theo Mức giá
  if (currentFilter.price === 'under5m') {
    filtered = filtered.filter(p => Number(p.price) < 5000000);
  } else if (currentFilter.price === '5to15m') {
    filtered = filtered.filter(p => Number(p.price) >= 5000000 && Number(p.price) <= 15000000);
  } else if (currentFilter.price === '15to25m') {
    filtered = filtered.filter(p => Number(p.price) > 15000000 && Number(p.price) <= 25000000);
  } else if (currentFilter.price === 'above25m') {
    filtered = filtered.filter(p => Number(p.price) > 25000000);
  }

  // 4. Lọc theo từ khóa Tìm kiếm thông minh (tên, hãng, danh mục, mô tả, có dấu & không dấu)
  if (currentFilter.search) {
    const kw = currentFilter.search.trim().toLowerCase();
    const kwNoTone = removeVietnameseTones(kw);
    filtered = filtered.filter(p => {
      const matchId = String(p.id) === kw || kw === '#' + p.id;
      const name = (p.name || '').toLowerCase();
      const nameNoTone = removeVietnameseTones(name);
      const cat = (p.category && p.category.name ? p.category.name : '').toLowerCase();
      const catNoTone = removeVietnameseTones(cat);
      const brand = (p.brand && p.brand.name ? p.brand.name : '').toLowerCase();
      const brandNoTone = removeVietnameseTones(brand);
      const desc = (p.description || '').toLowerCase();
      const descNoTone = removeVietnameseTones(desc);
      return matchId || name.includes(kw) || nameNoTone.includes(kwNoTone) ||
             cat.includes(kw) || catNoTone.includes(kwNoTone) ||
             brand.includes(kw) || brandNoTone.includes(kwNoTone) ||
             desc.includes(kw) || descNoTone.includes(kwNoTone);
    });
  }

  // 5. Sắp xếp: Mặc định MỚI NHẤT LÊN ĐẦU (ID giảm dần)
  if (currentFilter.sort === 'default') {
    filtered.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  } else if (currentFilter.sort === 'oldest') {
    filtered.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  } else if (currentFilter.sort === 'bestseller') {
    filtered.sort((a, b) => (Number(b.soldQuantity) || 0) - (Number(a.soldQuantity) || 0));
  } else if (currentFilter.sort === 'discount') {
    filtered.sort((a, b) => (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0));
  } else if (currentFilter.sort === 'price-asc') {
    filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (currentFilter.sort === 'price-desc') {
    filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (currentFilter.sort === 'name-asc') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // Cập nhật tiêu đề & Breadcrumb
  updateHeaderInfo(filtered.length);

  lastFilteredProducts = filtered;
  clientCurrentPage = 1;

  // Render danh sách sản phẩm có phân trang
  renderProductGrid(filtered);
}

let clientCurrentPage = 1;
let clientPageSize = 12;
let lastFilteredProducts = [];

function updateHeaderInfo(count) {
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');
  const breadcrumbSub = document.getElementById('breadcrumbSub');

  let titleText = 'Tất Cả Sản Phẩm';
  let breadcrumbText = '';

  if (currentFilter.cat === 'hot') {
    titleText = 'Sản Phẩm Bán Chạy Nhất (Hot)';
    breadcrumbText = ' &gt; <span style="color:var(--text-main); font-weight:600;">Sản phẩm Bán chạy</span>';
  } else if (currentFilter.cat === 'sale') {
    titleText = 'Sản Phẩm Đang Khuyến Mãi (Sale)';
    breadcrumbText = ' &gt; <span style="color:var(--text-main); font-weight:600;">Khuyến mãi</span>';
  } else if (currentFilter.cat === 'new') {
    titleText = 'Sản Phẩm Mới Về (New)';
    breadcrumbText = ' &gt; <span style="color:var(--text-main); font-weight:600;">Hàng mới về</span>';
  } else if (currentFilter.cat !== 'all') {
    const cat = allCategoriesList.find(c => c.id === Number(currentFilter.cat));
    if (cat) {
      titleText = `${cat.name}`;
      breadcrumbText = ` &gt; <span style="color:var(--text-main); font-weight:600;">${cat.name}</span>`;
    }
  }

  if (currentFilter.brand !== 'all') {
    titleText += ` - Thương hiệu ${currentFilter.brand}`;
  }

  if (pageTitle) pageTitle.innerHTML = titleText;
  if (pageSubtitle) pageSubtitle.textContent = `Hiển thị ${count} sản phẩm chính hãng`;
  if (breadcrumbSub) breadcrumbSub.innerHTML = breadcrumbText;
}

function renderProductGrid(products) {
  const container = document.getElementById('productsGrid');
  const pagWrap = document.getElementById('customerPaginationWrap');
  const pagWrapTop = document.getElementById('customerPaginationWrapTop');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: white; border-radius: 12px; border: 1px dashed var(--border-color);">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="color: #1e293b; margin-bottom: 0.5rem; font-weight: 700;">Không tìm thấy sản phẩm phù hợp</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Hãy thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
        <button onclick="resetAllFilters()" class="btn-buy" style="padding: 8px 20px; font-size: 0.9rem;">
          🔄 Xóa bộ lọc và tải lại
        </button>
      </div>
    `;
    if (pagWrap) {
      pagWrap.innerHTML = '';
      pagWrap.style.display = 'none';
    }
    if (pagWrapTop) {
      pagWrapTop.innerHTML = '';
      pagWrapTop.style.display = 'none';
    }
    return;
  }

  const totalItems = products.length;
  const totalPages = clientPageSize === 'all' ? 1 : Math.ceil(totalItems / clientPageSize);
  if (clientCurrentPage > totalPages) clientCurrentPage = totalPages;
  if (clientCurrentPage < 1) clientCurrentPage = 1;

  const startIndex = clientPageSize === 'all' ? 0 : (clientCurrentPage - 1) * clientPageSize;
  const endIndex = clientPageSize === 'all' ? totalItems : Math.min(startIndex + clientPageSize, totalItems);
  const pagedProducts = products.slice(startIndex, endIndex);

  container.innerHTML = pagedProducts.map(renderCard).join('');

  renderCustomerPagination(totalItems, totalPages, startIndex, endIndex);
}

function renderCustomerPagination(totalItems, totalPages, startIndex, endIndex) {
  const pagWrap = document.getElementById('customerPaginationWrap');
  const pagWrapTop = document.getElementById('customerPaginationWrapTop');
  if (!pagWrap && !pagWrapTop) return;

  if (totalItems <= clientPageSize && clientPageSize !== 'all') {
    const singleInfoHtml = `
      <div class="pagination-info">
        Hiển thị toàn bộ <strong>${totalItems}</strong> sản phẩm
      </div>
    `;
    if (pagWrap) {
      pagWrap.innerHTML = singleInfoHtml;
      pagWrap.style.display = 'flex';
    }
    if (pagWrapTop) {
      pagWrapTop.innerHTML = '';
      pagWrapTop.style.display = 'none';
    }
    return;
  }

  let buttonsHtml = '';
  // Nút Previous
  buttonsHtml += `
    <button class="page-btn" onclick="changeClientPage(${clientCurrentPage - 1})" ${clientCurrentPage === 1 ? 'disabled' : ''} title="Trang trước">
      &laquo; Trước
    </button>
  `;

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= clientCurrentPage - 2 && i <= clientCurrentPage + 2)) {
      buttonsHtml += `
        <button class="page-btn ${i === clientCurrentPage ? 'active' : ''}" onclick="changeClientPage(${i})">
          ${i}
        </button>
      `;
    } else if (i === clientCurrentPage - 3 || i === clientCurrentPage + 3) {
      buttonsHtml += `<span style="padding: 0 4px; color: #94a3b8;">...</span>`;
    }
  }

  // Nút Next
  buttonsHtml += `
    <button class="page-btn" onclick="changeClientPage(${clientCurrentPage + 1})" ${clientCurrentPage === totalPages ? 'disabled' : ''} title="Trang sau">
      Sau &raquo;
    </button>
  `;

  const paginationHtml = `
    <div class="pagination-info">
      Hiển thị <strong>${startIndex + 1} - ${endIndex}</strong> trên tổng số <strong>${totalItems}</strong> sản phẩm (Trang <strong>${clientCurrentPage}</strong> / ${totalPages})
    </div>
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 6px; font-size: 0.86rem; color: #64748b;">
        <span>Hiển thị:</span>
        <select class="page-size-select" onchange="changeClientPageSize(this.value)">
          <option value="12" ${clientPageSize == 12 ? 'selected' : ''}>12 SP/trang</option>
          <option value="24" ${clientPageSize == 24 ? 'selected' : ''}>24 SP/trang</option>
          <option value="48" ${clientPageSize == 48 ? 'selected' : ''}>48 SP/trang</option>
          <option value="all" ${clientPageSize === 'all' ? 'selected' : ''}>Xem tất cả</option>
        </select>
      </div>
      <div class="pagination-controls">
        ${buttonsHtml}
      </div>
    </div>
  `;

  if (pagWrap) {
    pagWrap.innerHTML = paginationHtml;
    pagWrap.style.display = 'flex';
  }
  if (pagWrapTop) {
    pagWrapTop.innerHTML = paginationHtml;
    pagWrapTop.style.display = 'flex';
  }
}

function changeClientPage(page) {
  clientCurrentPage = page;
  renderProductGrid(lastFilteredProducts);
  // Không ép cuộn ngược màn hình để người dùng duyệt trang mượt mà không bị gián đoạn
}

function changeClientPageSize(size) {
  clientPageSize = size === 'all' ? 'all' : Number(size);
  clientCurrentPage = 1;
  renderProductGrid(lastFilteredProducts);
}

function renderCard(p) {
  const imgUrl = (p.images && p.images.length > 0 && p.images[0].imageUrl) 
    ? p.images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';

  const categoryName = p.category ? p.category.name : 'Thiết bị';
  const brandName = p.brand ? p.brand.name : '';
  const isOutOfStock = (p.quantity === 0);

  const discount = p.discountPercent || 0;
  const isSale = discount > 0;
  const finalPrice = p.discountedPrice || Math.round(p.price * (1 - discount / 100));

  const isHot = p.isHot || (p.soldQuantity && p.soldQuantity >= 10);
  const isNew = p.isNew || false;

  return `
    <div class="product-card" style="position: relative;">
      <div class="card-thumb-wrap" style="position: relative;">
        <span class="category-badge">${categoryName}</span>
        ${isSale ? `
          <span style="position: absolute; top: 8px; right: 8px; background: #dc2626; color: white; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4); z-index: 2;">
            -${discount}%
          </span>
        ` : ''}
        <a href="product-detail.html?id=${p.id}" style="display:contents;">
          <img src="${imgUrl}" alt="${p.name}" class="product-card-img" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'">
        </a>
      </div>
      <div class="product-card-body">
        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px; font-weight: 800; border: 1px solid #bfdbfe;">#${p.id}</span>
          ${brandName ? `<span style="font-size: 0.72rem; color: #475569; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-weight: 600;">${brandName}</span>` : ''}
          ${isHot ? `<span style="background: #fee2e2; color: #dc2626; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 9999px;">HOT</span>` : ''}
          ${isNew ? `<span style="background: #e0f2fe; color: #0284c7; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 9999px;">MỚI</span>` : ''}
        </div>
        <a href="product-detail.html?id=${p.id}" class="product-title" title="${p.name}">
          ${p.name}
        </a>
        <div class="product-price" style="display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;">
          <span style="color: #dc2626; font-weight: 800; font-size: 1.15rem;">${formatCurrency(finalPrice)}</span>
          ${isSale ? `<span style="color: #94a3b8; font-size: 0.85rem; text-decoration: line-through;">${formatCurrency(p.price)}</span>` : ''}
        </div>
        <div class="product-meta">
          <span style="color: #f59e0b; font-size: 0.85rem; letter-spacing: 1px;">★★★★★</span>
          <span style="color: ${isOutOfStock ? '#dc2626' : '#16a34a'}; font-size: 0.8rem; font-weight: 600;">
            ${isOutOfStock ? 'Hết hàng' : `Còn hàng (${p.quantity})`}
          </span>
        </div>
        <div class="product-card-actions">
          <a href="product-detail.html?id=${p.id}" class="btn-detail">
            Chi tiết
          </a>
          <button onclick="handleAddToCartClick(event, ${p.id})" class="btn-buy" ${isOutOfStock ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Thêm giỏ</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
