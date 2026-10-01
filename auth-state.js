import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const greetingEl = document.getElementById("user-greeting");

onAuthStateChanged(auth, (user) => {
    // Đồng bộ trạng thái đăng nhập sang localStorage để cart.js dùng
    if (user) {
        localStorage.setItem("aka_current_user", JSON.stringify({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email
        }));
    } else {
        localStorage.removeItem("aka_current_user");
    }
    window.dispatchEvent(new Event("aka-auth-changed"));
 
    if (!greetingEl) return;

    if (user) {
        // Đã đăng nhập
        greetingEl.innerHTML = `Tài khoản: <strong>${user.displayName || user.email}</strong>`;
        greetingEl.style.cursor = "pointer";
        greetingEl.onclick = async () => {
            if (confirm("Bạn có muốn đăng xuất không?")) {
                await signOut(auth);
                window.location.reload();
            }
        };
    } else {
        // Chưa đăng nhập
        greetingEl.textContent = "Đăng nhập";
        greetingEl.style.cursor = "pointer";
        greetingEl.onclick = () => {
            window.location.href = "login.html";
        };
    }
});