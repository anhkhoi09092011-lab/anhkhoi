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

// ---------- PHẦN GẠCH CHÂN DƯỚI CHỮ KHI DI CHUYỂN TỚI PHẦN ĐÓ (index.html) ----------
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navbar a");
    
    // Lấy tất cả các phần có ID tương ứng với thẻ menu
    const sections = document.querySelectorAll("section[id], footer[id]");

    function activateMenuOnScroll() {
        let scrollPosition = window.scrollY + 200; // Khoảng đệm điểm cắt ngang màn hình
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);

        // 1. Trường hợp đặc biệt: Nếu cuộn chạm hẳn xuống đáy trang -> Kích hoạt Liên hệ (#contact)
        if (isAtBottom) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#contact") {
                    link.classList.add("active");
                }
            });
            return;
        }

        // 2. Trường hợp bình thường: Duyệt qua từng section để xác định section đang hiển thị
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    const href = link.getAttribute("href");
                    link.classList.remove("active");

                    // Bật gạch chân cho Trang chủ nếu ở phần hero
                    if ((id === "hero" && href === "index.html") || href === `#${id}`) {
                        link.classList.add("active");
                    }

                    // Bật gạch chân cho Sản phẩm nếu ở phần diorama
                    if (id === "diorama" && href === "#xe") {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    // Chạy hàm kiểm tra ngay khi tải trang và khi cuộn chuột
    window.addEventListener("scroll", activateMenuOnScroll);
    activateMenuOnScroll(); // Gọi ngay lần đầu
});
