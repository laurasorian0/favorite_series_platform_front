import { pintarSeries } from "../Home/Home";
import "./Series.css"

export const Series = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const anadirSerie = document.createElement("div");
  anadirSerie.id = "anadirSerie";
  anadirSerie.className = "anadirSerie";
  main.append(anadirSerie);

  formularioSerie(anadirSerie);
};

export const formularioSerie = (elementoPadre) => {
  const form = document.createElement("form");
  form.classList.add("formulario-flex");
  const inputNombre = document.createElement("input")
  const inputPlataforma = document.createElement("input")
  const imgSerie = document.createElement("input");
  const inputValoracion = document.createElement("input");
  const button = document.createElement("button");

  inputNombre.placeholder = "Nombre de la serie";
  inputPlataforma.placeholder = "Plataforma donde verla";
  imgSerie.placeholder = "URL de la portada";
  inputValoracion.placeholder = "1-5"
  button.textContent = "Enviar";

  form.append(inputNombre);
  form.append(inputPlataforma);
  form.append(imgSerie);
  form.append(inputValoracion)
  form.append(button);
  elementoPadre.append(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const titulo = inputNombre.value;
    const plataforma = inputPlataforma.value;
    const portada = imgSerie.value;
    const valoracion = parseInt(inputValoracion.value);

    registrarSerie(titulo, plataforma, portada, valoracion)
  });

  const registrarSerie = async (titulo, plataforma, portada, valoracion) => {
    console.log("Enviando solicitud para registrar la serie...");
    const objetoFinal = JSON.stringify({ titulo, plataforma, portada, valoracion });
    const token = localStorage.getItem("token");

    const opciones = {
      method: "POST",
      body: objetoFinal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/series", opciones);
      if (res.ok) {
        console.log("La serie se ha guardado correctamente en la base de datos.");
        actualizarYPintarSeries();
      } else {
        console.error("Error al registrar la serie:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };


  const actualizarYPintarSeries = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/series");
      if (res.ok) {
        const series = await res.json();
        const main = document.querySelector("main");
        main.innerHTML = "";
        pintarSeries(series, main);
      } else {
        console.error("Error al obtener la lista de series actualizada");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };
};

