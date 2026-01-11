import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm";
const baseURL = "http://localhost:5600/api";

let form = document.getElementById("register");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  console.log(user);
  try {
    const res = await axios.post(`${baseURL}/register-user`, user);

    if (res.status === 201) {
      alert("Registered Successfully! Login to continue");
      window.location.href = "./index.html";
    }
  } catch (err) {
    alert(err.response?.data?.msg || "Registration failed");
    console.error(err);
  }
});


