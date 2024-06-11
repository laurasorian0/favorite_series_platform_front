import "./LoginRegister.css";
import { Header } from "../../components/Header/Header";
import { Home } from "../Home/Home";
import { fetchData } from "../../utils/api";

export const LoginRegister = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const loginDiv = document.createElement("div");
  loginDiv.id = "login";
  main.append(loginDiv);

  renderLoginForm(loginDiv);
};

const renderLoginForm = (elementoPadre) => {
  const form = document.createElement("form");
  const inputUN = document.createElement("input");
  const inputPass = document.createElement("input");
  const buttonLogin = document.createElement("button");
  const buttonRegister = document.createElement("button");

  inputPass.type = "password";
  inputUN.placeholder = "Usuario";
  inputPass.placeholder = "******";
  buttonLogin.textContent = "LOGIN";
  buttonRegister.textContent = "REGISTER";

  form.append(inputUN);
  form.append(inputPass);
  form.append(buttonLogin);
  form.append(buttonRegister);
  elementoPadre.append(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const userName = inputUN.value;
    const password = inputPass.value;
    loginUser(userName, password);
  });

  buttonRegister.addEventListener("click", (event) => {
    event.preventDefault();
    const userName = inputUN.value;
    const password = inputPass.value;
    const user = { userName, password };
    registerUser(userName, password);
  });
};

const loginUser = async (userName, password) => {
  try {
    const data = await fetchData("/users/login", "POST", { userName, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    Home();
    Header();
  } catch (error) {
    const loginDiv = document.getElementById("login");
    renderErrorMessage(loginDiv, error.message);
  }
};

const registerUser = async (userName, password) => {
  try {
    const data = await fetchData("/users/register", "POST", { userName, password });
    loginUser(userName, password);
  } catch (error) {
    const loginDiv = document.getElementById("login");
    renderErrorMessage(loginDiv, error.message);
  }
};

const renderErrorMessage = (elementoPadre, errorMessage) => {
  const existingErrorMessages = elementoPadre.querySelectorAll(".error");
  existingErrorMessages.forEach(errorElement => errorElement.remove());

  const pError = document.createElement("p");
  pError.classList.add("error");
  pError.textContent = errorMessage;
  elementoPadre.append(pError);
};

