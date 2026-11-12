document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'register') {
    switchTab('register');
  } else {
    switchTab('login');
  }
});

function switchTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const authTitle = document.getElementById('authTitle');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
    authTitle.textContent = 'Đăng nhập tài khoản';
  } else {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.style.display = 'block';
    formLogin.style.display = 'none';
    authTitle.textContent = 'Đăng ký tài khoản mới';
  }
}

// Xử lý Đăng nhập
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('btnLoginSubmit');

  if (!username || !password) {
    showToast('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  btn.textContent = 'Đang xác thực...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại!');
    }

    // Lưu thông tin đăng nhập vào localStorage
    data.authProvider = 'LOCAL';
    setCurrentUser(data);
    showToast('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    showToast(error.message);
  } finally {
    btn.textContent = 'Đăng nhập';
    btn.disabled = false;
  }
}

// Xử lý Đăng ký
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const fullName = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const btn = document.getElementById('btnRegisterSubmit');

  if (!username || !fullName || !email || !password) {
    showToast('Vui lòng điền đủ các trường bắt buộc!');
    return;
  }

  btn.textContent = 'Đang đăng ký...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, fullName, email, password, role: 'CUSTOMER' })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Đăng ký thất bại!');
    }

    data.authProvider = 'LOCAL';
    setCurrentUser(data);
    showToast('Đăng ký thành công! Đang chuyển đến trang chủ...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    showToast(error.message);
  } finally {
    btn.textContent = 'Tạo tài khoản';
    btn.disabled = false;
  }
}
