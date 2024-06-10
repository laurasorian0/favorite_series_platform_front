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
    formData.append('portada', portadaFile); // Añadir el archivo de la portada al FormData
    formData.append('valoracion', valoracion);

    console.log(portadaFile.name)

    registrarSerie(titulo, plataforma, portadaFile, valoracion)
  });

  const registrarSerie = async (titulo, plataforma, portada, valoracion) => {
    console.log("Enviando solicitud para registrar la serie...");
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('plataforma', plataforma);
    formData.append('portada', portada); // Aquí ya tienes el archivo de la portada, no es necesario acceder a portada.files[0]
    formData.append('valoracion', valoracion);
    const token = localStorage.getItem("token");

    const opciones = {
      method: "POST",
      body: formData, // Usa FormData en lugar de objetoFinal
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/series", opciones);
      const responseData = await res.json();
      console.log(responseData);
      if (res.ok) {
        actualizarYPintarSeries();
      } else {
        mostrarError("Error al registrar la serie. Revisa todos los datos");
      }
    } catch (error) {
      mostrarError("Error de red al intentar registrar la serie.");
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

