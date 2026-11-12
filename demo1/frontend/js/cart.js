/**
 * Giỏ hàng thông minh (Shopping Cart Engine với Hỗ trợ Thuộc tính Màu sắc & Dung lượng)
 */
function getCart() {
  const c = localStorage.getItem('sisi_cart');
  if (c) {
    try {
      const parsed = JSON.parse(c);
      // Đảm bảo mọi item đều có cartKey hợp lệ
      return parsed.map(item => {
        if (!item.cartKey) {
          item.cartKey = `${item.id}_${item.selectedColor || ''}_${item.selectedStorage || ''}`;
        }
        return item;
      });
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveCart(cart) {
  localStorage.setItem('sisi_cart', JSON.stringify(cart));
  updateCartBadge();
}

function parseOptions(str) {
  if (!str || typeof str !== 'string') return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function addToCart(productOrId, quantityOrName = 1, selectedColor = null, selectedStorage = null) {
  let item = null;
  let p = null;

  // Trường hợp 1: Truyền toàn bộ object sản phẩm: addToCart(product, qty, color, storage)
  if (typeof productOrId === 'object' && productOrId !== null) {
    p = productOrId;
  }
  // Trường hợp 2: Truyền ID sản phẩm: addToCart(id, qty, color, storage)
  else if (productOrId !== undefined && productOrId !== null) {
    const id = Number(productOrId);
    if (typeof allProducts !== 'undefined' && Array.isArray(allProducts)) {
      p = allProducts.find(x => x.id === id);
    }
    if (!p && typeof allProductsList !== 'undefined' && Array.isArray(allProductsList)) {
      p = allProductsList.find(x => x.id === id);
    }
  }

  if (p) {
    const qty = (typeof quantityOrName === 'number' && quantityOrName > 0) ? quantityOrName : 1;
    let coverImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120';
    if (p.images && p.images.length > 0 && p.images[0].imageUrl) {
      coverImg = p.images[0].imageUrl;
    } else if (p.imageUrl) {
      coverImg = p.imageUrl;
    }
    const finalPrice = (p.discountedPrice !== undefined && p.discountedPrice !== null)
      ? p.discountedPrice
      : (p.discountPercent ? Math.round(p.price * (1 - p.discountPercent / 100)) : p.price);

    const colorsList = parseOptions(p.colors);
    const storageList = parseOptions(p.storageOptions);

    const chosenColor = selectedColor || (colorsList.length > 0 ? colorsList[0] : null);
    const chosenStorage = selectedStorage || (storageList.length > 0 ? storageList[0] : null);

    item = {
      id: Number(p.id),
      name: p.name || 'Sản phẩm',
      price: Number(finalPrice) || 0,
      imageUrl: coverImg,
      quantity: qty,
      selectedColor: chosenColor,
      selectedStorage: chosenStorage,
      availableColors: colorsList,
      availableStorage: storageList
    };
  } else if (typeof productOrId === 'number' || typeof productOrId === 'string') {
    const id = Number(productOrId);
    const qty = (typeof quantityOrName === 'number' && quantityOrName > 0) ? quantityOrName : 1;
    item = {
      id: id,
      name: `Sản phẩm #${id}`,
      price: 0,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120',
      quantity: qty,
      selectedColor: selectedColor || null,
      selectedStorage: selectedStorage || null,
      availableColors: [],
      availableStorage: []
    };
  }

  if (!item || !item.id) {
    console.error('Không tìm thấy thông tin sản phẩm để thêm vào giỏ:', productOrId);
    return;
  }

  const cartKey = `${item.id}_${item.selectedColor || ''}_${item.selectedStorage || ''}`;
  item.cartKey = cartKey;

  const cart = getCart();
  const existing = cart.find(i => i.cartKey === cartKey || (!i.cartKey && i.id === item.id && i.selectedColor === item.selectedColor && i.selectedStorage === item.selectedStorage));

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);

  let variantDesc = '';
  if (item.selectedColor || item.selectedStorage) {
    const parts = [];
    if (item.selectedColor) parts.push(item.selectedColor);
    if (item.selectedStorage) parts.push(item.selectedStorage);
    variantDesc = ` (${parts.join(' - ')})`;
  }

  showToast(`Đã thêm "${item.name}${variantDesc}" vào giỏ hàng!`, 5500);
}

// Bắt sự kiện click nút Thêm giỏ an toàn (chặn nổi bọt chuyển hướng link)
function handleAddToCartClick(event, productId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  addToCart(productId);
}

function updateCartQuantity(cartKeyOrId, newQty) {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter(item => (item.cartKey !== cartKeyOrId && item.id !== Number(cartKeyOrId)));
  } else {
    const item = cart.find(i => (i.cartKey === cartKeyOrId || i.id === Number(cartKeyOrId)));
    if (item) item.quantity = newQty;
  }
  saveCart(cart);
  renderCartDrawer();
}

function removeFromCart(cartKeyOrId) {
  let cart = getCart();
  const item = cart.find(i => (i.cartKey === cartKeyOrId || i.id === Number(cartKeyOrId)));
  const itemName = item ? item.name : 'sản phẩm';
  cart = cart.filter(i => (i.cartKey !== cartKeyOrId && i.id !== Number(cartKeyOrId)));
  saveCart(cart);
  renderCartDrawer();
  showToast(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
}

// Cập nhật đổi nhanh biến thể (Màu sắc hoặc Dung lượng) trong giỏ hàng
function updateCartItemVariant(oldCartKey, newColor, newStorage) {
  let cart = getCart();
  const index = cart.findIndex(i => i.cartKey === oldCartKey);
  if (index === -1) return;

  const item = cart[index];
  const updatedColor = newColor !== undefined ? newColor : item.selectedColor;
  const updatedStorage = newStorage !== undefined ? newStorage : item.selectedStorage;
  const newCartKey = `${item.id}_${updatedColor || ''}_${updatedStorage || ''}`;

  // Nếu đã có item với đúng biến thể mới, gộp số lượng lại
  const duplicateIndex = cart.findIndex(i => i.cartKey === newCartKey);
  if (duplicateIndex !== -1 && duplicateIndex !== index) {
    cart[duplicateIndex].quantity += item.quantity;
    cart.splice(index, 1);
  } else {
    item.selectedColor = updatedColor;
    item.selectedStorage = updatedStorage;
    item.cartKey = newCartKey;
  }

  saveCart(cart);
  showToast(`Đã chuyển sang: ${updatedColor ? updatedColor : ''} ${updatedStorage ? `(${updatedStorage})` : ''}`);
}

function clearCart() {
  localStorage.removeItem('sisi_cart');
  updateCartBadge();
  renderCartDrawer();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

// Chuyển thẳng sang trang Thanh toán khi bấm vào Giỏ hàng
function toggleCartDrawer(open = null) {
  window.location.href = 'checkout.html';
}

function renderCartDrawer() {
  // Đã chuyển sang quản lý trực tiếp tại checkout.html
}

// Chuyển sang màn hình thanh toán
function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng trống! Hãy chọn ít nhất 1 sản phẩm.');
    return;
  }
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});
