/**
 * Mega Menu CellphoneS Style - Tự động đồng bộ và cập nhật theo CSDL
 * Tác giả: Mai Thị Trang - Hệ thống quản lý sản phẩm cửa hàng online
 */

let globalMegaCategories = [];
let globalMegaProducts = [];
let activeMegaCatKey = 'hot'; // Mặc định mở tab Sản phẩm HOT hoặc category đầu tiên
let megaMenuCloseTimer = null;
let sidebarHoverTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initMegaMenu();
});

async function initMegaMenu() {
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown');
  if (!dropdownWrappers.length) return;

  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/categories`),
      fetch(`${API_BASE_URL}/api/products`)
    ]);

    if (catRes.ok) globalMegaCategories = await catRes.json();
    if (prodRes.ok) globalMegaProducts = await prodRes.json();

    if (globalMegaCategories.length > 0) {
      activeMegaCatKey = 'hot';
    }

    dropdownWrappers.forEach(wrap => {
      buildMegaMenuStructure(wrap);
    });

  } catch (err) {
    console.error('Lỗi khởi tạo Mega Menu:', err);
  }
}

function getCategoryIcon(catName) {
  if (!catName) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  }
  const n = catName.toLowerCase();
  if (n.includes('thoại') || n.includes('phone') || n.includes('tablet') || n.includes('ipad')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
  }
  if (n.includes('laptop') || n.includes('máy tính') || n.includes('pc') || n.includes('macbook')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`;
  }
  if (n.includes('phụ kiện') || n.includes('tai nghe') || n.includes('loa') || n.includes('âm thanh')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`;
  }
  if (n.includes('đồng hồ') || n.includes('watch')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>`;
  }
  if (n.includes('camera') || n.includes('máy ảnh')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
  }
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
}

function extractBrandsForCategory(catId) {
  let prods = [];
  if (catId === 'all' || catId === 'hot') {
    prods = globalMegaProducts;
  } else {
    prods = globalMegaProducts.filter(p => p.category && p.category.id === Number(catId));
  }

  const brandKeywords = [
    'Apple', 'iPhone', 'iPad', 'MacBook', 'Samsung', 'Sony', 
    'Marshall', 'Dell', 'Asus', 'HP', 'Lenovo', 'Xiaomi', 
    'OPPO', 'Garmin', 'JBL', 'Bose', 'Logitech', 'Acer', 'Huawei'
  ];

  const brands = new Set();
  prods.forEach(p => {
    const name = p.name || '';
    brandKeywords.forEach(b => {
      if (name.toLowerCase().includes(b.toLowerCase())) {
        if (b === 'iPhone' || b === 'iPad' || b === 'MacBook') {
          brands.add('Apple');
        } else {
          brands.add(b);
        }
      }
    });
  });

  // Gợi ý thêm nếu danh mục ít sản phẩm thực tế
  if (brands.size < 3) {
    if (catId == 2) ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Sony'].forEach(x => brands.add(x));
    else if (catId == 3) ['Apple', 'Dell', 'Asus', 'Lenovo', 'HP'].forEach(x => brands.add(x));
    else if (catId == 4) ['Apple', 'Sony', 'Marshall', 'JBL', 'Logitech'].forEach(x => brands.add(x));
    else if (catId == 5) ['Apple Watch', 'Galaxy Watch', 'Garmin'].forEach(x => brands.add(x));
    else ['Apple', 'Samsung', 'Sony'].forEach(x => brands.add(x));
  }

  return Array.from(brands);
}

function buildMegaMenuStructure(wrapper) {
  // Thay thế hoặc làm mới menu con bên trong nav-dropdown
  let megaContainer = wrapper.querySelector('.mega-menu-dropdown');
  if (!megaContainer) {
    // Xóa dropdown cũ nếu có
    const oldDropdown = wrapper.querySelector('.nav-dropdown-menu');
    if (oldDropdown) oldDropdown.remove();

    megaContainer = document.createElement('div');
    megaContainer.className = 'mega-menu-dropdown';
    wrapper.appendChild(megaContainer);
  }

  // Cập nhật link nút chính thành products.html
  const mainLink = wrapper.querySelector('a.nav-link');
  if (mainLink) {
    mainLink.href = 'products.html';
  }

  renderMegaMenuContent(megaContainer);
  setupMegaMenuHoverEvents(wrapper, megaContainer);
}

/**
 * Xử lý sự kiện Hover với độ trễ (Delay) chống mất menu đột ngột
 */
function setupMegaMenuHoverEvents(wrapper, megaContainer) {
  const openMenu = () => {
    if (megaMenuCloseTimer) {
      clearTimeout(megaMenuCloseTimer);
      megaMenuCloseTimer = null;
    }
    megaContainer.classList.add('is-open');
    wrapper.classList.add('is-open');
  };

  const closeMenuWithDelay = () => {
    if (megaMenuCloseTimer) {
      clearTimeout(megaMenuCloseTimer);
    }
    // Độ trễ 380ms: người dùng di chuyển chuột thoải mái không lo bị ẩn menu
    megaMenuCloseTimer = setTimeout(() => {
      megaContainer.classList.remove('is-open');
      wrapper.classList.remove('is-open');
    }, 380);
  };

  wrapper.addEventListener('mouseenter', openMenu);
  wrapper.addEventListener('mouseleave', closeMenuWithDelay);

  megaContainer.addEventListener('mouseenter', openMenu);
  megaContainer.addEventListener('mouseleave', closeMenuWithDelay);
}

function renderMegaMenuContent(megaContainer) {
  if (!megaContainer) return;

  // CỘT 1: SIDEBAR TRÁI
  let sidebarHtml = `
    <div class="mega-sidebar">
      <div class="mega-sidebar-item ${activeMegaCatKey === 'hot' ? 'active' : ''}" 
           onmouseenter="changeMegaActiveTab('hot', this)">
        <div class="mega-item-main">
          <span class="mega-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
          </span>
          <span class="mega-item-title">Sản phẩm bán chạy</span>
        </div>
        <span class="mega-item-arrow">›</span>
      </div>
  `;

  globalMegaCategories.forEach(cat => {
    const icon = getCategoryIcon(cat.name);
    const count = (cat.products && cat.products.length) || 0;
    const isActive = (String(activeMegaCatKey) === String(cat.id));
    sidebarHtml += `
      <div class="mega-sidebar-item ${isActive ? 'active' : ''}" 
           onmouseenter="changeMegaActiveTab('${cat.id}', this)">
        <div class="mega-item-main">
          <span class="mega-item-icon">${icon}</span>
          <span class="mega-item-title">${cat.name}</span>
        </div>
        <span class="mega-item-arrow">›</span>
      </div>
    `;
  });

  sidebarHtml += `
      <div class="mega-sidebar-item ${activeMegaCatKey === 'all' ? 'active' : ''}" 
           onmouseenter="changeMegaActiveTab('all', this)" style="margin-top:auto; border-top:1px dashed #cbd5e1; padding-top:10px;">
        <div class="mega-item-main">
          <span class="mega-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </span>
          <span class="mega-item-title">Tất cả sản phẩm</span>
        </div>
        <span class="mega-item-arrow">›</span>
      </div>
    </div>
  `;

  // CỘT 2: CHI TIẾT PHẢI
  let contentHtml = `<div class="mega-content" id="megaContentArea">`;
  contentHtml += buildMegaDetailsHtml(activeMegaCatKey);
  contentHtml += `</div>`;

  megaContainer.innerHTML = sidebarHtml + contentHtml;
}

function changeMegaActiveTab(key, el) {
  if (activeMegaCatKey === key) return;

  if (sidebarHoverTimer) {
    clearTimeout(sidebarHoverTimer);
  }

  // Độ trễ chuyển đổi 60ms để khi di chuyển chuột chéo sang content không bị nhảy tab ngoài ý muốn
  sidebarHoverTimer = setTimeout(() => {
    activeMegaCatKey = key;
    const items = el.parentElement.querySelectorAll('.mega-sidebar-item');
    items.forEach(it => it.classList.remove('active'));
    el.classList.add('active');

    const contentArea = el.closest('.mega-menu-dropdown').querySelector('#megaContentArea');
    if (contentArea) {
      contentArea.innerHTML = buildMegaDetailsHtml(key);
    }
  }, 60);
}

function buildMegaDetailsHtml(key) {
  let title = '';
  let icon = '';
  let targetUrl = 'products.html';
  let categoryProducts = [];

  if (key === 'hot') {
    title = 'Sản Phẩm Bán Chạy Nhất';
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>`;
    targetUrl = 'products.html?filter=hot';
    categoryProducts = globalMegaProducts.slice(0, 8);
  } else if (key === 'all') {
    title = 'Toàn Bộ Sản Phẩm Cửa Hàng';
    icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
    targetUrl = 'products.html';
    categoryProducts = globalMegaProducts;
  } else {
    const cat = globalMegaCategories.find(c => String(c.id) === String(key));
    if (cat) {
      title = cat.name;
      icon = getCategoryIcon(cat.name);
      targetUrl = `products.html?cat=${cat.id}`;
      categoryProducts = globalMegaProducts.filter(p => p.category && p.category.id === cat.id);
    }
  }

  const brands = extractBrandsForCategory(key);
  const hotList = categoryProducts.slice(0, 6);

  let html = `
    <div class="mega-detail-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="display:inline-flex; align-items:center; color:#dc2626;">${icon}</span>
        <h3 style="margin:0; font-size:1.15rem; font-weight:800; color:#1e293b;">${title}</h3>
        <span style="color:#64748b; font-size:0.85rem; font-weight:500;">(${categoryProducts.length} sản phẩm)</span>
      </div>
      <a href="${targetUrl}" class="mega-view-all-top">
        Xem tất cả &rarr;
      </a>
    </div>

    <div class="mega-detail-grid">
      <!-- CỘT 1: HÃNG & MỨC GIÁ -->
      <div class="mega-col-left">
        <!-- Hãng -->
        <div class="mega-section-block">
          <div class="mega-block-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            <span>Thương hiệu chọn lọc</span>
          </div>
          <div class="mega-brands-wrap">
            ${brands.map(b => `
              <a href="${key !== 'hot' && key !== 'all' ? `products.html?cat=${key}&brand=${encodeURIComponent(b)}` : `products.html?brand=${encodeURIComponent(b)}`}" class="mega-brand-pill">
                ${b}
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Mức giá -->
        <div class="mega-section-block" style="margin-top:1.2rem;">
          <div class="mega-block-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
            <span>Mức giá phổ biến</span>
          </div>
          <div class="mega-prices-wrap">
            <a href="${key !== 'hot' && key !== 'all' ? `products.html?cat=${key}&price=under5m` : `products.html?price=under5m`}" class="mega-price-pill">Dưới 5 triệu</a>
            <a href="${key !== 'hot' && key !== 'all' ? `products.html?cat=${key}&price=5to15m` : `products.html?price=5to15m`}" class="mega-price-pill">Từ 5 - 15 triệu</a>
            <a href="${key !== 'hot' && key !== 'all' ? `products.html?cat=${key}&price=above15m` : `products.html?price=above15m`}" class="mega-price-pill">Trên 15 triệu</a>
          </div>
        </div>
      </div>

      <!-- CỘT 2: SẢN PHẨM NỔI BẬT ĐƯỢC QUAN TÂM NHẤT -->
      <div class="mega-col-right">
        <div class="mega-block-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
          <span>Sản phẩm gợi ý nổi bật</span>
        </div>
        <div class="mega-hot-list">
          ${hotList.map(p => {
            const img = (p.images && p.images[0] && p.images[0].imageUrl) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
            return `
              <a href="product-detail.html?id=${p.id}" class="mega-hot-item">
                <img src="${img}" alt="${p.name}" class="mega-hot-thumb">
                <div class="mega-hot-details">
                  <div class="mega-hot-name">
                    ${p.name}
                    <span class="mega-tag-badge">HOT</span>
                  </div>
                  <div class="mega-hot-price">${formatCurrency(p.price)}</div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- FOOTER VIEW ALL BUTTON -->
    <a href="${targetUrl}" class="mega-detail-footer-btn">
      Xem toàn bộ ${categoryProducts.length} sản phẩm thuộc mục ${title} &rarr;
    </a>
  `;

  return html;
}
