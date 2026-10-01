import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const loginForm = document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("aka_current_user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "",
        email: user.email
      }));
 
      alert("Đăng nhập thành công!");
 
      // Quay lại trang trước đó (nếu bị chuyển sang đăng nhập khi thêm giỏ hàng)
      const back = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = back || "index.html";
    } catch (error) {
      console.error(error);
      alert("Email hoặc mật khẩu không chính xác!");
    }
  });
}