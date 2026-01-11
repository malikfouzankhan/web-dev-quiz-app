import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm";
const baseURL = "http://localhost:5600/api";

let login = document.getElementById("login");
login.addEventListener("submit", async (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    let res = await axios.post(`${baseURL}/login-user`, user);
    console.log(res);

    if(res.status === 200)
    {
        localStorage.setItem("token", res.data.token);
        // console.log("STORED");
        window.location.href = "./app.html";
    }
  } catch (error) {
    alert(error.response?.data?.msg || "Log in failed!");
    console.error(error);
  }
});