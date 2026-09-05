/* =========================================================
   script.js — Đăng ký / Đăng nhập / Trang chủ (AKA Shop)
   Dùng localStorage để lưu tài khoản (không cần backend).
   Gắn file này vào CUỐI thẻ <body> của cả 3 trang:
   index.html, login.html, register.html
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
/*
  Thêm chỗ này vào index.html, ngay tại vị trí nút "Đăng nhập" hiện có
  (ví dụ thay thế thẻ <a> đăng nhập trong menu):
  <span id="user-greeting"></span>
*/
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


// Kiểm tra trạng thái đăng nhập
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Nếu chưa đăng nhập
    if (!isLoggedIn()) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");

        // Lưu lại trang hiện tại để đăng nhập xong quay lại
        localStorage.setItem("redirectAfterLogin", window.location.href);

        // Chuyển sang trang đăng nhập
        window.location.href = "login.html";
        return;
    }

    // Nếu đã đăng nhập thì thêm vào giỏ hàng
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm sản phẩm vào giỏ hàng!");}


    // ===============================
// KIỂM TRA ĐĂNG NHẬP
// ===============================
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}


// ===============================
// THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ===============================
document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", function () {

        // Nếu chưa đăng nhập
        if (!isLoggedIn()) {

            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");

            // Lưu trang hiện tại
            localStorage.setItem(
                "redirectAfterLogin",
                window.location.href
            );

            // Chuyển sang trang đăng nhập
            window.location.href = "login.html";

            return;
        }


        // Lấy thông tin sản phẩm
        const productCard = this.closest(".product-card");

        const productName =
            productCard.querySelector("h3").innerText;

        const productPrice =
            productCard.querySelector(".new-price").innerText;

        const productImage =
            productCard.querySelector("img").src;


        // Tạo sản phẩm
        const product = {
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };


        // Lấy giỏ hàng hiện tại
        let cart = JSON.parse(localStorage.getItem("cart")) || [];


        // Kiểm tra sản phẩm đã có chưa
        const existingProduct = cart.find(
            item => item.name === product.name
        );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push(product);

        }


        // Lưu giỏ hàng
        localStorage.setItem("cart", JSON.stringify(cart));


        alert("Đã thêm sản phẩm vào giỏ hàng!");

    });

});