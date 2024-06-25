import { fetchGet, fetchPost } from "../../utils/api";
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
  const inputPortada = document.createElement("input");
  const inputValoracion = document.createElement("input");
  const button = document.createElement("button");

  inputNombre.placeholder = "Nombre de la serie";
  inputPlataforma.placeholder = "Plataforma donde verla";
  inputPortada.type = "file";
  inputPortada.id = "portada";
  inputPortada.name = "portada";
  inputPortada.accept = "image/*";
  inputValoracion.placeholder = "1-5"
  button.textContent = "Enviar";

  form.append(inputNombre);
  form.append(inputPlataforma);
  form.append(inputPortada);
  form.append(inputValoracion)
  form.append(button);
  elementoPadre.append(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const titulo = inputNombre.value;
    const plataforma = inputPlataforma.value;
    const portadaFile = inputPortada.files[0];
    const valoracion = parseInt(inputValoracion.value);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('plataforma', plataforma);
    formData.append('portada', portadaFile);
    formData.append('valoracion', valoracion);

    registrarSerie(formData);
  });

  const registrarSerie = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/v1/series", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Error al registrar la serie: " + errorData.message);
      }

      const responseData = await response.json();
      console.log(responseData);
      actualizarYPintarSeries();
    } catch (error) {
      mostrarError("Error al hacer la petición para registrar la serie: " + error.message);
    }
  };

  const mostrarError = (mensaje) => {
    const erroresAnteriores = document.querySelectorAll(".error");
    erroresAnteriores.forEach(error => error.remove());

    const divError = document.createElement("div");
    divError.classList.add("error");
    divError.textContent = mensaje;

    const main = document.querySelector("main");
    main.appendChild(divError);
  };

  const actualizarYPintarSeries = async () => {
    try {
      const series = await fetchGet("/series");
      const main = document.querySelector("main");
      main.innerHTML = "";
      pintarSeries(series, main);
    } catch (error) {
      console.error("Error al obtener la lista de series actualizada", error);
    }
  };
};


