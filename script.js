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


