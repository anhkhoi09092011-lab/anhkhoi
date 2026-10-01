/* =========================================================
   AKA Shop – Tìm kiếm sản phẩm
   Lọc các .product-card theo tên + thương hiệu (không phân biệt hoa/thường, có/không dấu)
   ========================================================= */
(function () {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");
  if (!input) return;
 
  // Bỏ dấu tiếng Việt + chuyển về chữ thường
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }
 
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const sections = Array.from(document.querySelectorAll("section.products"));
 
  // Tạo sẵn dòng "không tìm thấy"
  const emptyMsg = document.createElement("p");
  emptyMsg.className = "search-empty";
  if (sections.length) {
    sections[sections.length - 1].after(emptyMsg);
  }
 
  // Lưu sẵn chuỗi dùng để so khớp cho từng sản phẩm
  const data = cards.map((card) => {
    const name = card.querySelector("h3")?.textContent || "";
    const brand = card.querySelector(".brand")?.textContent || "";
    return { card, text: normalize(name + " " + brand) };
  });
 
  function filter(scroll) {
    const keyword = normalize(input.value);
    const words = keyword.split(/\s+/).filter(Boolean);
    let found = 0;
 
    data.forEach(({ card, text }) => {
      // Mọi từ khoá phải xuất hiện trong tên/brand
      const match = words.every((w) => text.includes(w));
      card.classList.toggle("search-hidden", !match);
      if (match) found++;
    });
 
    // Ẩn cả mục nếu không còn sản phẩm nào trong đó
    sections.forEach((sec) => {
      const hasVisible = sec.querySelector(".product-card:not(.search-hidden)");
      sec.classList.toggle("search-hidden", !hasVisible && words.length > 0);
    });
 
    if (words.length && !found) {
      emptyMsg.textContent = `Không tìm thấy sản phẩm nào cho "${input.value.trim()}"`;
      emptyMsg.classList.add("show");
    } else {
      emptyMsg.classList.remove("show");
    }
 
    if (scroll && words.length && found) {
      const firstSection = sections.find((s) => !s.classList.contains("search-hidden"));
      if (firstSection) firstSection.scrollIntoView({ behavior: "smooth" });
    }
  }
 
  input.addEventListener("input", () => filter(false)); // lọc ngay khi gõ
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filter(true);
    }
  });
  if (button) button.addEventListener("click", () => filter(true));
})();
 