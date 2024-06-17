import { Favoritos } from "../../pages/Favoritos/Favoritos";
import { Home } from "../../pages/Home/Home";
import { LoginRegister } from "../../pages/LoginRegister/LoginRegister";
import { Series } from "../../pages/Series/Series";
import { PerfilUsuario } from "../PerfilUsuario/PerfilUsuario";
import "./Header.css";


const routes = [
  {
    texto: "Home",
    funcion: Home
  },
  {
    texto: "Favoritos",
    funcion: Favoritos
  },
  {
    texto: "Añadir Serie",
    funcion: Series
  },
  {
    texto: "Login",
    funcion: LoginRegister
  },
  {
    texto: "Perfil",
    funcion: PerfilUsuario
  }
]

export const Header = () => {
  const header = document.querySelector("header");
  header.innerHTML = "";
  const nav = document.createElement("nav");

  for (const route of routes) {
    const a = document.createElement("a");
    a.href = "#";

    if (route.texto === "Login" && localStorage.getItem("token")) {
      a.textContent = "Logout";
      a.addEventListener("click", () => {
        localStorage.clear();
        Header();
        Home();
      });
    } else if (!localStorage.getItem("token") && (route.texto === "Añadir Serie" || route.texto === "Favoritos" || route.texto === "Perfil")) {
      continue;
    } else {
      a.textContent = route.texto;
      a.addEventListener("click", route.funcion);
    }

    nav.append(a);
  }

  header.append(nav);
};

