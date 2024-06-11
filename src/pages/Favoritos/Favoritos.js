import { fetchGet } from "../../utils/api";
import { pintarSeries } from "../Home/Home";
import "./Favoritos.css";

export const Favoritos = async () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const usuario = await fetchGet(`/users/${user._id}`);
    pintarSeries(usuario.favoritos, main);
  } catch (error) {
    console.error("Error al cargar los favoritos", error);
  }
};
