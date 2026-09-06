/* =========================================================
   script.js — Đăng ký / Đăng nhập / Trang chủ (AKA Shop)
   ========================================================= */

const AKA_USERS_KEY = "aka_users";          // danh sách tài khoản
const AKA_CURRENT_KEY = "aka_current_user"; // người đang đăng nhập (lưu cả tên + email)

// ---------- Helper ----------
function getUsers() {
  return JSON.parse(localStorage.getItem(AKA_USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(AKA_USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  // user = { name, email }
  localStorage.setItem(AKA_CURRENT_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  const data = localStorage.getItem(AKA_CURRENT_KEY);
  return data ? JSON.parse(data) : null;
}

function logout() {
  localStorage.removeItem(AKA_CURRENT_KEY);
  window.location.href = "login.html";
}

// ---------- ĐĂNG KÝ (register.html) ----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    let messageEl = document.getElementById("register-message");
    if (!messageEl) {
      messageEl = document.createElement("p");
      messageEl.id = "register-message";
      registerForm.appendChild(messageEl);
    }

    if (!name || !email || !password || !confirmPassword) {
      messageEl.textContent = "Vui lòng nhập đầy đủ thông tin.";
      messageEl.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      messageEl.textContent = "Mật khẩu nhập lại không khớp!";
      messageEl.style.color = "red";
      return;
    }

    const users = getUsers();

    const existed = users.find((u) => u.email === email);
    if (existed) {
      messageEl.textContent = "Email này đã được đăng ký!";
      messageEl.style.color = "red";
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    setCurrentUser({ name, email });

    messageEl.textContent = "Đăng ký thành công! Đang chuyển hướng...";
    messageEl.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

// ---------- ĐĂNG NHẬP (login.html) ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let messageEl = document.getElementById("login-message");
    if (!messageEl) {
      messageEl = document.createElement("p");
      messageEl.id = "login-message";
      loginForm.appendChild(messageEl);
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      messageEl.textContent = "Sai email hoặc mật khẩu!";
      messageEl.style.color = "red";
      return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    messageEl.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
    messageEl.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

// ---------- TRANG CHỦ (index.html) ----------
const greetingEl = document.getElementById("user-greeting");
if (greetingEl) {
  const currentUser = getCurrentUser();

  if (currentUser) {
    greetingEl.innerHTML = `
    <strong>${currentUser.name}</strong>
      <a href="#" id="logout-btn" style="margin-left:8px;font-size:18px;">(Đăng xuất)</a>
    `;
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
      });
    }
  } else {
    greetingEl.innerHTML = `<a href="login.html">Đăng nhập</a>`;
  }
}


