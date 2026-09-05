/* =========================================================
   AKA Shop – Giỏ hàng (Add to cart)
   Cách dùng: thêm dòng này vào cuối file index.html,
   ngay trước thẻ đóng </body>:

   <script src="cart.js"></script>

   Script này TỰ ĐỘNG:
   - Gắn sự kiện cho mọi nút có chữ "Thêm vào giỏ"
   - Lấy tên sản phẩm, giá, ảnh từ card sản phẩm gần nhất
   - Lưu giỏ hàng vào localStorage (không mất khi tải lại trang)
   - Vẽ khung giỏ hàng (cart drawer) khi bấm vào icon 🛒
   ========================================================= */

(function () {
  const CART_KEY = "aka_shop_cart";
  const PRICE_REGEX = /[\d.,]+\s*đ/;

  /* ---------- 1. Lấy / lưu dữ liệu giỏ hàng ---------- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    updateBadge();
  }

  /* ---------- 2. Tìm thông tin sản phẩm từ 1 nút "Thêm vào giỏ" ---------- */
  function getProductFromButton(btn) {
    // Đi lên tối đa 6 cấp cha để tìm khối chứa toàn bộ card sản phẩm
    let card = btn;
    for (let i = 0; i < 6 && card.parentElement; i++) {
      card = card.parentElement;
      if (card.querySelector("h3, h4") && card.querySelector("img")) break;
    }

    const nameEl = card.querySelector("h3, h4");
    const imgEl = card.querySelector("img");
    const priceMatch = card.textContent.match(PRICE_REGEX);

    const name = nameEl ? nameEl.textContent.trim() : "Sản phẩm";
    const price = priceMatch ? priceMatch[0].trim() : "0đ";
    const image = imgEl ? imgEl.src : "";
    const id = name; // tên sản phẩm dùng làm khoá duy nhất

    return { id, name, price, image };
  }

  /* ---------- 3. Thêm sản phẩm vào giỏ ---------- */
  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    openCart();
  }

  function changeQty(id, delta) {
    let cart = getCart();
    cart = cart
      .map((p) => (p.id === id ? { ...p, qty: p.qty + delta } : p))
      .filter((p) => p.qty > 0);
    saveCart(cart);
  }

  function removeItem(id) {
    saveCart(getCart().filter((p) => p.id !== id));
  }

  /* ---------- 4. Tính tổng tiền ---------- */
  function parsePrice(str) {
    return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
  }
  function formatPrice(num) {
    return num.toLocaleString("vi-VN") + "đ";
  }
  function getTotal(cart) {
    return cart.reduce((sum, p) => sum + parsePrice(p.price) * p.qty, 0);
  }

  /* ---------- 5. Giao diện: CSS ---------- */
  const style = document.createElement("style");
  style.textContent = `
    #aka-cart-overlay{position:fixed;inset:0;background:rgba(20,10,10,.5);
      opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:998}
    #aka-cart-overlay.open{opacity:1;pointer-events:auto}
    #aka-cart-drawer{position:fixed;top:0;right:0;height:100%;width:min(460px,90vw);
      background:#fff;box-shadow:-8px 0 24px rgba(0,0,0,.15);z-index:999;
      transform:translateX(100%);transition:transform .3s ease;
      display:flex;flex-direction:column;font-family:inherit}
    #aka-cart-drawer.open{transform:translateX(0)}
    #aka-cart-header{padding:18px 20px;border-bottom:1px solid #eee;
      display:flex;justify-content:space-between;align-items:center}
    #aka-cart-header h3{margin:0;font-size:17px;color:#c0392b}
    #aka-cart-close{background:none;border:none;font-size:20px;cursor:pointer;color:#888}
    #aka-cart-items{flex:1;overflow-y:auto;padding:10px 16px}
    .aka-cart-empty{color:#999;text-align:center;margin-top:40px;font-size:14px}
    .aka-cart-item{display:flex;gap:10px;padding:12px 0;border-bottom:1px solid #f1f1f1}
    .aka-cart-item img{width:190px;height:190px;object-fit:cover;border-radius:6px;flex-shrink:0}
    .aka-cart-item-info{flex:1;min-width:0}
    .aka-cart-item-info .name{font-size:20px;font-weight:600;color:#222;
      display:block;margin-bottom:4px;line-height:1.3}
    .aka-cart-item-info .price{font-size:20px;color:#c0392b;font-weight:600}
    .aka-qty{display:flex;align-items:center;gap:8px;margin-top:6px}
    .aka-qty button{width:50px;height:22px;border:1px solid #ddd;background:#fafafa;
      border-radius:4px;cursor:pointer;font-size:13px;line-height:1}
    .aka-qty span{font-size:13px;min-width:16px;text-align:center}
    .aka-remove{background:none;border:none;color:#bbb;cursor:pointer;font-size:40px}
    #aka-cart-footer{padding:16px 20px;border-top:1px solid #eee}
    #aka-cart-total{display:flex;justify-content:space-between;font-size:25px;
      margin-bottom:12px;font-weight:600;color:#222}
    #aka-cart-total span:last-child{color:#c0392b}
    #aka-checkout-btn{width:100%;padding:20px;background:#c0392b;color:#fff;
      border:none;border-radius:6px;font-size:18px;font-weight:600;cursor:pointer}
    #aka-checkout-btn:hover{background:#a5301f}
    .aka-cart-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);
      background:#222;color:#fff;padding:10px 18px;border-radius:6px;font-size:13.5px;
      opacity:0;transition:all .25s ease;z-index:1000;pointer-events:none}
    .aka-cart-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    #aka-cart-badge{position:relative;top:-8px;left:-4px;background:#c0392b;color:#fff;
      font-size:10px;padding:1px 5px;border-radius:10px;font-weight:700}
  `;
  document.head.appendChild(style);

  /* ---------- 6. Giao diện: HTML khung giỏ hàng ---------- */
  const overlay = document.createElement("div");
  overlay.id = "aka-cart-overlay";
  const drawer = document.createElement("div");
  drawer.id = "aka-cart-drawer";
  drawer.innerHTML = `
    <div id="aka-cart-header">
      <h3>Giỏ hàng của bạn</h3>
      <button id="aka-cart-close">✕</button>
    </div>
    <div id="aka-cart-items"></div>
    <div id="aka-cart-footer">
      <div id="aka-cart-total"><span>Tổng cộng</span><span id="aka-cart-total-value">0đ</span></div>
      <button id="aka-checkout-btn">Tiến hành thanh toán</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  function openCart() {
    overlay.classList.add("open");
    drawer.classList.add("open");
  }
  function closeCart() {
    overlay.classList.remove("open");
    drawer.classList.remove("open");
  }
  overlay.addEventListener("click", closeCart);
  drawer.querySelector("#aka-cart-close").addEventListener("click", closeCart);
  drawer.querySelector("#aka-checkout-btn").addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    showToast("Chức năng thanh toán sẽ được cập nhật sau!");
  });

  function renderCart() {
    const cart = getCart();
    const itemsEl = drawer.querySelector("#aka-cart-items");
    if (!cart.length) {
      itemsEl.innerHTML = `<p class="aka-cart-empty">Giỏ hàng đang trống</p>`;
    } else {
      itemsEl.innerHTML = cart
        .map(
          (p) => `
        <div class="aka-cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="aka-cart-item-info">
            <span class="name">${p.name}</span>
            <span class="price">${p.price}</span>
            <div class="aka-qty">
              <button data-action="dec" data-id="${encodeURIComponent(p.id)}">−</button>
              <span>${p.qty}</span>
              <button data-action="inc" data-id="${encodeURIComponent(p.id)}">+</button>
            </div>
          </div>
          <button class="aka-remove" data-action="remove" data-id="${encodeURIComponent(p.id)}">🗑</button>
        </div>`
        )
        .join("");
    }
    drawer.querySelector("#aka-cart-total-value").textContent = formatPrice(getTotal(cart));
  }

  drawer.querySelector("#aka-cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = decodeURIComponent(btn.dataset.id);
    if (btn.dataset.action === "inc") changeQty(id, 1);
    if (btn.dataset.action === "dec") changeQty(id, -1);
    if (btn.dataset.action === "remove") removeItem(id);
  });

  /* ---------- 7. Badge số lượng trên icon giỏ hàng ---------- */
  function findCartIcon() {
    return Array.from(document.querySelectorAll("a, button, span")).find(
      (el) => el.textContent.trim() === "🛒"
    );
  }
  function updateBadge() {
    const icon = findCartIcon();
    if (!icon) return;
    let badge = icon.querySelector("#aka-cart-badge");
    const count = getCart().reduce((s, p) => s + p.qty, 0);
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "aka-cart-badge";
      icon.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }

  /* ---------- 8. Thông báo nhỏ khi thêm vào giỏ ---------- */
  let toastTimer;
  function showToast(msg) {
    let toast = document.querySelector(".aka-cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "aka-cart-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  /* ---------- 9. Gắn sự kiện cho tất cả nút "Thêm vào giỏ" ---------- */
  function bindAddToCartButtons() {
    document.querySelectorAll("button, a").forEach((el) => {
      if (el.dataset.akaBound) return;
      if (el.textContent.trim() === "Thêm vào giỏ") {
        el.dataset.akaBound = "1";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          const product = getProductFromButton(el);
          addToCart(product);
          showToast(`Đã thêm "${product.name}" vào giỏ`);
        });
      }
    });

    const cartIcon = findCartIcon();
    if (cartIcon && !cartIcon.dataset.akaBound) {
      cartIcon.dataset.akaBound = "1";
      cartIcon.style.cursor = "pointer";
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        openCart();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindAddToCartButtons();
    renderCart();
    updateBadge();
  });
})();