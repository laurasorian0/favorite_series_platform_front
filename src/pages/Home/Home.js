import { fetchGet, fetchPut } from "../../utils/api";
import "./Home.css"

let seriesCache = null;

export const Home = async () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  if (seriesCache) {
    pintarSeries(seriesCache, main);
  } else {
    try {
      const series = await fetchGet("/series");
      seriesCache = series;
      pintarSeries(series, main);
    } catch (error) {
      console.error("Error al cargar las series", error);
      main.innerHTML = "<p>Error al cargar las series. Por favor intentalo de nuevo.</p>";
    }
  }
};

export const pintarSeries = (series, elementoPadre) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const divSeries = document.createElement("div");
  divSeries.className = "divSeries";

  for (const serie of series) {
    const divSerie = document.createElement("div");
    const titulo = document.createElement("h3");
    const portada = document.createElement("img");
    const plataforma = document.createElement("p");
    const info = document.createElement("div");

    divSerie.className = "divSerie";
    titulo.textContent = serie.titulo;
    portada.src = serie.portada;
    plataforma.textContent = serie.plataforma;
    info.className = "info";

    divSerie.appendChild(portada);
    info.appendChild(titulo);
    info.appendChild(plataforma);
    divSerie.appendChild(info);

    if (user) {
      const like = document.createElement("img");
      like.src = "/assets/corazon.png";
      like.className = "like";
      like.dataset.id = serie._id;

      if (user.favoritos?.includes(serie._id)) {
        like.src = "/assets/me-gusta.png";
      }

      like.addEventListener("click", () => {
        if (user.favoritos.includes(serie._id)) {
          removeFavorito(serie._id);
          like.src = "/assets/corazon.png";
        } else {
          addFavorito(serie._id);
          like.src = "/assets/me-gusta.png";
        }
      });

      info.appendChild(like);
    }

    divSeries.appendChild(divSerie);
  }

  elementoPadre.appendChild(divSeries);
};

const addFavorito = async (idSerie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user.favoritos.includes(idSerie)) {
    user.favoritos.push(idSerie);

    await updateFavoritos(user.favoritos);

    localStorage.setItem("user", JSON.stringify(user));
  }
}

const removeFavorito = async (idSerie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  user.favoritos = user.favoritos.filter(favorito => favorito !== idSerie);

  await updateFavoritos(user.favoritos);

  localStorage.setItem("user", JSON.stringify(user));
}

const updateFavoritos = async (favoritos) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const objetoFinal = JSON.stringify({ favoritos });

  await fetchPut(`/users/${user._id}`, objetoFinal);
}






