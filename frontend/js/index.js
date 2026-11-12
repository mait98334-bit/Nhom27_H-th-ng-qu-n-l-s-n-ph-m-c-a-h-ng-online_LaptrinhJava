let allProducts = [];
let allCategories = [];
let allBrands = [];
let allPosts = [];

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const filter = params.get('filter');
  if (cat || filter) {
    window.location.replace(`products.html${window.location.search}`);
    return;
  }

  checkOAuth2Redirect();
  updateNavbarUser();
  await initHomePageData();

  // Khởi tạo tính năng tìm kiếm thông minh trực tiếp trên trang chủ
  initHomePageSearch();
});

// Hàm loại bỏ dấu tiếng Việt chuẩn
function removeVietnameseTones(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Kiểm tra sản phẩm có khớp từ khóa không (hỗ trợ cả có dấu và không dấu, tìm theo tên, danh mục, hãng, mô tả)
function matchSearchProduct(p, keyword) {
  if (!keyword) return false;
  const kw = keyword.toLowerCase().trim();
  const kwNoTone = removeVietnameseTones(kw);

  const name = (p.name || '').toLowerCase();
  const nameNoTone = removeVietnameseTones(name);

  const cat = (p.category && p.category.name ? p.category.name : '').toLowerCase();
  const catNoTone = removeVietnameseTones(cat);

  const brand = (p.brand && p.brand.name ? p.brand.name : '').toLowerCase();
  const brandNoTone = removeVietnameseTones(brand);

  const desc = (p.description || '').toLowerCase();
  const descNoTone = removeVietnameseTones(desc);

  return name.includes(kw) || nameNoTone.includes(kwNoTone) ||
         cat.includes(kw) || catNoTone.includes(kwNoTone) ||
         brand.includes(kw) || brandNoTone.includes(kwNoTone) ||
         desc.includes(kw) || descNoTone.includes(kwNoTone);
}

function highlightMatchText(text, keyword) {
  if (!text || !keyword) return text || '';
  const kw = keyword.trim();
  const idx = text.toLowerCase().indexOf(kw.toLowerCase());
  if (idx === -1) return text;
  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + kw.length);
  const after = text.substring(idx + kw.length);
  return `${before}<mark>${match}</mark>${after}`;
}

let isShowingSearchResults = false;

function initHomePageSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchIconBtn = document.getElementById('searchIconBtn') || document.querySelector('.search-bar .search-icon');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchDropdown = document.getElementById('searchDropdown');

  if (!searchInput) return;

  // Hàm tự động dãn to dần theo chiều ngang theo số chữ khách hàng nhập
  function updateSearchInputWidth() {
    const len = searchInput.value.length;
    if (len === 0) {
      if (document.activeElement === searchInput) {
        searchInput.style.width = '290px';
      } else {
        searchInput.style.width = '220px';
      }
    } else {
      // Dãn to dần ngang theo số chữ khách nhập (mỗi ký tự dãn thêm ~11px, tối đa 500px)
      const targetWidth = Math.min(500, Math.max(280, 240 + len * 11));
      searchInput.style.width = targetWidth + 'px';
    }
  }

  // Lắng nghe focus và blur để dãn/thu mượt mà
  searchInput.addEventListener('focus', () => {
    updateSearchInputWidth();
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      updateSearchInputWidth();
    }, 150);
  });

  let debounceTimer = null;

  // 1. Bắt sự kiện gõ phím: hiển thị gợi ý tức thời Dropdown & dãn to dần
  searchInput.addEventListener('input', (e) => {
    updateSearchInputWidth();
    const val = searchInput.value.trim();
    if (searchClearBtn) {
      searchClearBtn.style.display = val ? 'block' : 'none';
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (!val) {
        if (searchDropdown) searchDropdown.classList.remove('show');
        if (isShowingSearchResults) {
          clearHomeSearch();
        }
        return;
      }
      renderSearchDropdown(val);
    }, 120);
  });

  // 2. Nhấn phím Enter: thực thi tìm kiếm ngay trên trang chủ
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = searchInput.value.trim();
      if (val) {
        executeHomeSearch(val);
      } else {
        clearHomeSearch();
      }
    }
  });

  // 3. Nhấp vào icon Kính lúp: thực thi tìm kiếm
  if (searchIconBtn) {
    searchIconBtn.style.cursor = 'pointer';
    searchIconBtn.addEventListener('click', () => {
      const val = searchInput.value.trim();
      if (val) executeHomeSearch(val);
    });
  }

  // 4. Nhấp nút xóa từ khóa
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      clearHomeSearch();
    });
  }

  // 5. Đóng dropdown khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      if (searchDropdown) searchDropdown.classList.remove('show');
    }
  });
}

function renderSearchDropdown(keyword) {
  const searchDropdown = document.getElementById('searchDropdown');
  if (!searchDropdown) return;

  const matches = allProducts.filter(p => matchSearchProduct(p, keyword));
  if (matches.length === 0) {
    searchDropdown.innerHTML = `
      <div class="search-drop-empty">
        Không tìm thấy sản phẩm nào khớp với "<b>${keyword}</b>"
      </div>
    `;
    searchDropdown.classList.add('show');
    return;
  }

  const topMatches = matches.slice(0, 5);
  let html = `
    <div class="search-drop-header">
      <span>GỢI Ý TÌM KIẾM</span>
      <span style="color:#2563eb;">${matches.length} KẾT QUẢ</span>
    </div>
  `;

  topMatches.forEach(p => {
    const imgUrl = (p.images && p.images.length > 0 && p.images[0].imageUrl)
      ? p.images[0].imageUrl
      : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
    const discount = p.discountPercent || 0;
    const finalPrice = p.discountedPrice || Math.round(p.price * (1 - discount / 100));

    html += `
      <a href="product-detail.html?id=${p.id}" class="search-drop-item" title="${p.name}">
        <img src="${imgUrl}" alt="${p.name}" class="search-drop-img" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'">
        <div class="search-drop-info">
          <div class="search-drop-name">${highlightMatchText(p.name, keyword)}</div>
          <div class="search-drop-meta">
            <span class="search-drop-price">${formatCurrency(finalPrice)}</span>
            ${discount > 0 ? `<span class="search-drop-old">${formatCurrency(p.price)}</span>` : ''}
            ${p.category ? `<span class="search-drop-tag">${p.category.name}</span>` : ''}
          </div>
        </div>
      </a>
    `;
  });

  html += `
    <div class="search-drop-footer">
      <a href="javascript:void(0)" onclick="executeHomeSearch('${keyword.replace(/'/g, "\\'")}')">
        Xem tất cả ${matches.length} kết quả trên trang chủ &rarr;
      </a>
    </div>
  `;

  searchDropdown.innerHTML = html;
  searchDropdown.classList.add('show');
}

function executeHomeSearch(keyword) {
  const searchDropdown = document.getElementById('searchDropdown');
  if (searchDropdown) searchDropdown.classList.remove('show');

  const container = document.getElementById('productContentArea');
  if (!container) return;

  const matches = allProducts.filter(p => matchSearchProduct(p, keyword));
  isShowingSearchResults = true;

  if (matches.length > 0) {
    container.innerHTML = `
      <section style="margin-bottom: 3.5rem;" id="homeSearchResultsSection">
        <div class="section-header" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: #ffffff; border: 1px solid #e2e8f0; padding: 1.2rem 1.5rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div>
            <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 1.3rem;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Kết quả tìm kiếm: "<span style="color: #2563eb;">${keyword}</span>"</span>
            </h2>
            <p style="margin: 4px 0 0; font-size: 0.88rem; color: var(--text-muted);">Tìm thấy <b>${matches.length}</b> sản phẩm phù hợp</p>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <a href="products.html?q=${encodeURIComponent(keyword)}" class="nav-btn nav-btn-primary" style="font-size: 0.85rem; padding: 7px 16px;">
              Xem trên bộ lọc nâng cao &rarr;
            </a>
            <button onclick="clearHomeSearch()" class="nav-btn" style="border: 1px solid #cbd5e1; background: #f8fafc; color: #475569; font-size: 0.85rem; padding: 7px 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
              ✕ Đóng tìm kiếm
            </button>
          </div>
        </div>
        <div class="product-grid">
          ${matches.map(renderProductCard).join('')}
        </div>
      </section>
    `;
  } else {
    container.innerHTML = `
      <section style="margin-bottom: 3.5rem;">
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 3.5rem 1.5rem; text-align: center; max-width: 650px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div style="width: 64px; height: 64px; background: #fee2e2; color: #dc2626; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.2rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0 0 8px;">Không tìm thấy sản phẩm nào!</h3>
          <p style="color: #64748b; font-size: 0.92rem; margin: 0 0 1.5rem; line-height: 1.5;">
            Không có kết quả nào khớp với từ khóa "<b>${keyword}</b>".<br>
            Bạn có thể thử tìm theo danh mục hoặc hãng như: <b>iPhone, Samsung, MacBook, Laptop, Tai nghe, Đồng hồ</b>...
          </p>
          <button onclick="clearHomeSearch()" class="nav-btn nav-btn-primary" style="padding: 9px 22px; cursor: pointer;">
            ✕ Quay lại xem tất cả sản phẩm
          </button>
        </div>
      </section>
    `;
  }

  // Cuộn trang mượt mà xuống phần kết quả tìm kiếm
  const targetEl = document.getElementById('productContentArea');
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function clearHomeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
    searchInput.style.width = '220px';
  }

  const searchClearBtn = document.getElementById('searchClearBtn');
  if (searchClearBtn) searchClearBtn.style.display = 'none';

  const searchDropdown = document.getElementById('searchDropdown');
  if (searchDropdown) searchDropdown.classList.remove('show');

  isShowingSearchResults = false;
  renderHomePageSections();
}

// 1. Tải danh mục, sản phẩm, thương hiệu và bài viết đồng thời
async function initHomePageData() {
  const container = document.getElementById('productContentArea');
  try {
    const [catRes, prodRes, brandRes, postRes] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/api/categories`),
      fetch(`${API_BASE_URL}/api/products`),
      fetch(`${API_BASE_URL}/api/brands`),
      fetch(`${API_BASE_URL}/api/posts`)
    ]);

    if (catRes.status === 'fulfilled' && catRes.value.ok) {
      allCategories = await catRes.value.json();
    }
    if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
      allProducts = await prodRes.value.json();
      // Mặc định luôn sắp xếp sản phẩm mới nhất lên đầu
      allProducts.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    }
    if (brandRes.status === 'fulfilled' && brandRes.value.ok) {
      allBrands = await brandRes.value.json();
    }
    if (postRes.status === 'fulfilled' && postRes.value.ok) {
      allPosts = await postRes.value.json();
    }

    renderFeaturedCategories();
    renderHomePageSections();
    startFlashsaleTimer();
  } catch (error) {
    console.error('Lỗi tải dữ liệu trang chủ:', error);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; color: #dc2626; padding: 3rem 0;">
          <p style="font-size: 1.1rem; font-weight: bold;">Không thể kết nối tới máy chủ.</p>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Vui lòng kiểm tra API backend tại cổng 8080.</p>
        </div>
      `;
    }
  }
}

// 2. Render danh mục nổi bật dạng thẻ trực quan (Visual Category Grid)
function renderFeaturedCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  grid.innerHTML = allCategories.map(cat => {
    const iconObj = getCategoryVisualInfo(cat.name);
    const count = allProducts.filter(p => p.category && p.category.id === cat.id).length;
    return `
      <a href="products.html?cat=${cat.id}" class="home-cat-card" title="Xem tất cả ${cat.name}">
        <div class="cat-card-left">
          <div class="cat-icon-circle" style="background: ${iconObj.bg}; color: ${iconObj.color};">
            ${iconObj.icon}
          </div>
          <div>
            <div class="cat-card-name">${cat.name}</div>
            <div class="cat-card-count">${count} sản phẩm chính hãng</div>
          </div>
        </div>
        <div class="cat-card-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </a>
    `;
  }).join('');
}

function getCategoryVisualInfo(catName) {
  if (!catName) {
    return {
      bg: '#eff6ff',
      color: '#2563eb',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
    };
  }
  const n = catName.toLowerCase();
  if (n.includes('thoại') || n.includes('phone') || n.includes('tablet') || n.includes('ipad')) {
    return {
      bg: '#eff6ff',
      color: '#2563eb',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`
    };
  }
  if (n.includes('laptop') || n.includes('máy tính') || n.includes('pc') || n.includes('macbook')) {
    return {
      bg: '#f0fdf4',
      color: '#16a34a',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`
    };
  }
  if (n.includes('phụ kiện') || n.includes('tai nghe') || n.includes('loa') || n.includes('âm thanh')) {
    return {
      bg: '#fff1f2',
      color: '#e11d48',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`
    };
  }
  if (n.includes('đồng hồ') || n.includes('watch')) {
    return {
      bg: '#faf5ff',
      color: '#9333ea',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>`
    };
  }
  return {
    bg: '#f8fafc',
    color: '#475569',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  };
}

// 3. Đồng hồ đếm ngược Flashsale trực tiếp
function startFlashsaleTimer() {
  const timerEl = document.getElementById('flashsaleCountdown');
  if (!timerEl) return;

  function update() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, endOfDay - now);

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const mins = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const secs = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    timerEl.innerHTML = `
      <span class="countdown-digits">${hours}</span> :
      <span class="countdown-digits">${mins}</span> :
      <span class="countdown-digits">${secs}</span>
    `;
  }
  update();
  setInterval(update, 1000);
}

// 4. Hiển thị trang chủ chia theo từng Khối (Section) E-Commerce
function renderHomePageSections() {
  const container = document.getElementById('productContentArea');
  if (!container) return;

  // Lọc sản phẩm theo logic nghiệp vụ Backend
  // 1. Sản phẩm Khuyến Mãi (Sale): discountPercent > 0
  const saleProducts = allProducts
    .filter(p => p.discountPercent && p.discountPercent > 0)
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  // 2. Sản phẩm Bán Chạy (Hot): soldQuantity >= 10 hoặc isHot == true
  const hotProducts = allProducts
    .filter(p => p.isHot || (p.soldQuantity && p.soldQuantity >= 10))
    .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));

  // 3. Sản phẩm Mới (New): tạo trong vòng 10 ngày (isNew == true)
  const newProducts = allProducts
    .filter(p => {
      if (p.isNew) return true;
      if (p.createdAt) {
        const diffDays = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 10;
      }
      return false;
    })
    .sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  let html = '';

  // ==================== KHỐI 1: FLASHSALE / SẢN PHẨM KHUYẾN MÃI (SALE) ====================
  if (saleProducts.length > 0) {
    const displaySale = saleProducts.slice(0, 4);
    html += `
      <section style="margin-bottom: 3.5rem;">
        <div class="section-header" style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem; background: linear-gradient(135deg, #fff1f2, #ffffff); padding: 1.1rem 1.4rem; border-radius: 14px; border: 1px solid #fecdd3;">
          <div style="display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap;">
            <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px; color: #be123c;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>Sản Phẩm Khuyến Mãi Hot</span>
            </h2>
            <div class="flashsale-countdown-box">
              <span>Kết thúc sau:</span>
              <span id="flashsaleCountdown">08 : 45 : 00</span>
            </div>
            <span style="background: #e11d48; color: white; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.3px;">GIẢM ĐẾN ${saleProducts[0]?.discountPercent || 25}%</span>
          </div>
          <a href="products.html?filter=sale" class="nav-btn" style="border: 1px solid #f43f5e; color: #e11d48; font-weight: 700; background: white; padding: 7px 16px; border-radius: 8px; text-decoration: none !important;">
            Xem tất cả khuyến mãi (${saleProducts.length} SP) &rarr;
          </a>
        </div>
        <div class="product-grid">
          ${displaySale.map(renderProductCard).join('')}
        </div>
      </section>
    `;
  }

  // ==================== KHỐI 2: SẢN PHẨM BÁN CHẠY NỔI BẬT (HOT) ====================
  if (hotProducts.length > 0) {
    const displayHot = hotProducts.slice(0, 4);
    html += `
      <section style="margin-bottom: 3.5rem;">
        <div class="section-header" style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
              <span>Sản Phẩm Bán Chạy Nổi Bật</span>
            </h2>
            <span style="background: #fee2e2; color: #dc2626; font-size: 0.75rem; font-weight: 700; padding: 3px 9px; border-radius: 9999px;">HOT DEALS</span>
          </div>
          <a href="products.html?filter=hot" class="nav-btn" style="border: 1px solid var(--border-color); color: #2563eb; font-weight: 700; background: white; padding: 7px 16px; border-radius: 8px; text-decoration: none !important;">
            Xem tất cả (${hotProducts.length} sản phẩm) &rarr;
          </a>
        </div>
        <div class="product-grid">
          ${displayHot.map(renderProductCard).join('')}
        </div>
      </section>
    `;
  }

  // ==================== KHỐI 3: BANNER QUẢNG CÁO GIỮA TRANG (MID-PAGE BANNER) ====================
  html += `
    <div class="home-mid-banner">
      <div>
        <div class="mid-banner-title">Ưu Đãi Thanh Toán Không Tiền Mặt</div>
        <div class="mid-banner-desc">Giảm ngay 200.000₫ cho đơn hàng từ 5.000.000₫ khi thanh toán quét mã VietQR chuyển khoản nhanh 24/7.</div>
      </div>
      <a href="products.html" class="hero-primary-btn" style="box-shadow: none;">
        <span>Mua Sắm Ngay</span> &rarr;
      </a>
    </div>
  `;

  // ==================== KHỐI 4: SẢN PHẨM MỚI VỀ (NEW) ====================
  if (newProducts.length > 0) {
    const displayNew = newProducts.slice(0, 4);
    html += `
      <section style="margin-bottom: 3.5rem;">
        <div class="section-header" style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px; color: #0284c7;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Sản Phẩm Mới Ra Mắt</span>
            </h2>
            <span style="background: #e0f2fe; color: #0369a1; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 9999px;">MỚI 10 NGÀY</span>
          </div>
          <a href="products.html?filter=new" class="nav-btn" style="border: 1px solid var(--border-color); color: #0284c7; font-weight: 700; background: white; padding: 7px 16px; border-radius: 8px; text-decoration: none !important;">
            Xem tất cả (${newProducts.length} sản phẩm) &rarr;
          </a>
        </div>
        <div class="product-grid">
          ${displayNew.map(renderProductCard).join('')}
        </div>
      </section>
    `;
  }

  // ==================== KHỐI 5: THƯƠNG HIỆU ĐỒNG HÀNH (BRANDS) ====================
  if (allBrands && allBrands.length > 0) {
    html += `
      <section style="margin-bottom: 3.5rem;">
        <div class="section-header" style="margin-bottom: 1.2rem;">
          <div>
            <h2 class="section-title" style="margin: 0;">Thương Hiệu Đồng Hành Chính Hãng</h2>
            <p style="font-size: 0.86rem; color: var(--text-muted); margin: 3px 0 0 0;">Phân phối chính hãng từ các tập đoàn công nghệ hàng đầu</p>
          </div>
        </div>
        <div class="home-brand-grid">
          ${allBrands.map(b => `
            <a href="products.html?brand=${encodeURIComponent(b.name)}" class="home-brand-card" title="Xem sản phẩm ${b.name}">
              <div class="home-brand-name">${b.name}</div>
              <div class="home-brand-sub">${b.status === 'STRATEGIC' ? 'Đối tác chiến lược' : 'Chính hãng'}</div>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ==================== KHỐI 6: TIN TỨC & ĐÁNH GIÁ CÔNG NGHỆ (POSTS) ====================
  if (allPosts && allPosts.length > 0) {
    const displayPosts = allPosts.slice(0, 3);
    html += `
      <section style="margin-bottom: 3.5rem;">
        <div class="section-header" style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Tin Tức & Đánh Giá Công Nghệ</span>
            </h2>
            <p style="font-size: 0.86rem; color: var(--text-muted); margin: 3px 0 0 0;">Cập nhật xu hướng công nghệ mới nhất và tư vấn chuyên sâu</p>
          </div>
          <a href="news.html" class="nav-btn" style="border: 1px solid var(--border-color); color: #2563eb; font-weight: 700; background: white; padding: 7px 16px; border-radius: 8px; text-decoration: none !important;">
            Xem tất cả bài viết &rarr;
          </a>
        </div>
        <div class="home-news-grid">
          ${displayPosts.map(p => `
            <a href="news-detail.html?id=${p.id}" class="home-news-card">
              <img src="${p.thumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600'}" class="home-news-thumb" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600'">
              <div class="home-news-body">
                <div class="home-news-meta">
                  <span class="home-news-cat-pill">${p.category || 'Công nghệ'}</span>
                  <span>•</span>
                  <span>${p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</span>
                </div>
                <div class="home-news-title">${p.title}</div>
                <div style="margin-top: auto; font-size: 0.82rem; font-weight: 700; color: #2563eb; display: inline-flex; align-items: center; gap: 4px;">
                  Đọc tiếp &rarr;
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ==================== KHỐI 7: TỪNG DÒNG SẢN PHẨM RIÊNG BIỆT ====================
  allCategories.forEach(cat => {
    const catProducts = allProducts.filter(p => p.category && p.category.id === cat.id);
    if (catProducts.length > 0) {
      const displayList = catProducts.slice(0, 4);
      const iconObj = getCategoryVisualInfo(cat.name);
      html += `
        <section style="margin-bottom: 3.5rem;">
          <div class="section-header" style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 1.8rem;">
            <div>
              <h2 class="section-title" style="margin: 0; display: inline-flex; align-items: center; gap: 8px;">
                <span style="color: ${iconObj.color};">${iconObj.icon}</span>
                <span>${cat.name}</span>
              </h2>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 6px;">(${catProducts.length} sản phẩm)</span>
            </div>
            <a href="products.html?cat=${cat.id}" class="nav-btn" style="border: 1px solid var(--border-color); color: #2563eb; font-weight: 700; background: white; padding: 7px 16px; border-radius: 8px; text-decoration: none !important;">
              Xem tất cả ${cat.name} &rarr;
            </a>
          </div>
          <div class="product-grid">
            ${displayList.map(renderProductCard).join('')}
          </div>
        </section>
      `;
    }
  });

  container.innerHTML = html;
}

// 5. Template HTML cho từng thẻ sản phẩm (Card) với % giảm giá, Hot, New, Brand
function renderProductCard(product) {
  const imgUrl = (product.images && product.images.length > 0 && product.images[0].imageUrl) 
    ? product.images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';

  const categoryName = product.category ? product.category.name : 'Thiết bị';
  const brandName = product.brand ? product.brand.name : '';
  const isOutOfStock = (product.quantity === 0);

  const discount = product.discountPercent || 0;
  const isSale = discount > 0;
  const finalPrice = product.discountedPrice || Math.round(product.price * (1 - discount / 100));

  const isHot = product.isHot || (product.soldQuantity && product.soldQuantity >= 10);
  const isNew = product.isNew || false;

  return `
    <div class="product-card" style="position: relative;">
      <div class="card-thumb-wrap" style="position: relative;">
        <span class="category-badge">${categoryName}</span>
        ${isSale ? `
          <span style="position: absolute; top: 8px; right: 8px; background: #dc2626; color: white; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4); z-index: 2;">
            -${discount}%
          </span>
        ` : ''}
        <a href="product-detail.html?id=${product.id}" style="display:contents;">
          <img src="${imgUrl}" alt="${product.name}" class="product-card-img" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'">
        </a>
      </div>
      <div class="product-card-body">
        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px; font-weight: 800; border: 1px solid #bfdbfe;">#${product.id}</span>
          ${brandName ? `<span style="font-size: 0.72rem; color: #475569; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-weight: 600;">${brandName}</span>` : ''}
          ${isHot ? `<span style="background: #fee2e2; color: #dc2626; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 9999px;">HOT</span>` : ''}
          ${isNew ? `<span style="background: #e0f2fe; color: #0284c7; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 9999px;">MỚI</span>` : ''}
        </div>
        <a href="product-detail.html?id=${product.id}" class="product-title" title="${product.name}">
          ${product.name}
        </a>
        <div class="product-price" style="display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;">
          <span style="color: #dc2626; font-weight: 800; font-size: 1.15rem;">${formatCurrency(finalPrice)}</span>
          ${isSale ? `<span style="color: #94a3b8; font-size: 0.85rem; text-decoration: line-through;">${formatCurrency(product.price)}</span>` : ''}
        </div>
        <div class="product-meta">
          <span style="color: #f59e0b; font-size: 0.85rem; letter-spacing: 1px;">★★★★★</span>
          <span style="color: ${isOutOfStock ? '#dc2626' : '#16a34a'}; font-size: 0.8rem; font-weight: 600;">
            ${isOutOfStock ? 'Hết hàng' : `Còn hàng (${product.quantity})`}
          </span>
        </div>
        <div class="product-card-actions">
          <a href="product-detail.html?id=${product.id}" class="btn-detail">
            Chi tiết
          </a>
          <button onclick="handleAddToCartClick(event, ${product.id})" class="btn-buy" ${isOutOfStock ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Thêm giỏ</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
