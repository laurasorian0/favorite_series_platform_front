import "./LoginRegister.css"
import { Header } from "../../components/Header/Header";
import { Home } from "../Home/Home";

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
  const inputUN = document.createElement("input")
  const inputPass = document.createElement("input")
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
    registerUser(userName, password);
  });
}

const loginUser = async (userName, password) => {
  const objetoFinal = JSON.stringify({ userName, password });
  const opciones = {
    method: "POST",
    body: objetoFinal,
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/login", opciones);
    if (!res.ok) {
      const errorMessage = await res.text();
      if (res.status === 404) {
        renderLoginForm(document.getElementById("login"));
        renderErrorMessage(document.getElementById("login"), "El usuario no existe. ¿Desea registrarse?");
      } else {
        throw new Error("Usuario o contraseña incorrectos");
      }
    }

    const respuestaFinal = await res.json();
    localStorage.setItem("token", respuestaFinal.token);
    localStorage.setItem("user", JSON.stringify(respuestaFinal.user));
    Home();
    Header();
  } catch (error) {
    const loginDiv = document.getElementById("login");
    renderErrorMessage(loginDiv, error.message);
  }
}

const registerUser = async (userName, password) => {
  const objetoFinal = JSON.stringify({ userName, password });
  const opciones = {
    method: "POST",
    body: objetoFinal,
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/register", opciones);
    if (!res.ok) {
      throw new Error("Error al registrar el usuario");
    }

    loginUser(userName, password);
  } catch (error) {
    const loginDiv = document.getElementById("login");
    renderErrorMessage(loginDiv, error.message);
  }
}

const renderErrorMessage = (elementoPadre, errorMessage) => {
  const pError = document.createElement("p");
  pError.classList.add("error");
  pError.textContent = errorMessage;
  elementoPadre.append(pError);
}
