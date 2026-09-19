import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const registerForm = document.querySelector("form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#registerName").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      alert("Đăng ký thành công!");
      window.location.href = "login.html";
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email này đã được đăng ký!");
      } else if (error.code === "auth/invalid-email") {
        alert("Email không hợp lệ!");
      } else if (error.code === "auth/weak-password") {
        alert("Mật khẩu quá yếu!");
      } else {
        alert("Đăng ký thất bại: " + error.message);
      }
    }
  });
}