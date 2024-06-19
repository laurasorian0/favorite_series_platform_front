import { detalleSerie } from "../../components/detalleSerie/detalleSerie";
import { API_BASE_URL, fetchGet } from "../../utils/api";
import "./Home.css";

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
    portada.className = "portada";
    plataforma.textContent = serie.plataforma;
    info.className = "info";

    divSerie.appendChild(portada);
    info.appendChild(titulo);
    info.appendChild(plataforma);
    divSerie.appendChild(info);

    portada.addEventListener("click", () => detalleSerie(serie));

    if (user) {
      const like = document.createElement("img");
      like.src = "/assets/corazon.png";
      like.className = "like";
      like.dataset.id = serie._id;

      if (user.favoritos?.includes(serie._id)) {
        like.src = "/assets/me-gusta.png";
      }

      like.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (user.favoritos.includes(serie._id)) {
          await removeFavorito(serie._id);
          like.src = "/assets/corazon.png";
        } else {
          await addFavorito(serie._id);
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
  const token = localStorage.getItem("token");

  if (!user.favoritos.includes(idSerie)) {
    user.favoritos.push(idSerie);

    const body = { favoritos: user.favoritos };


    try {
      const response = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al realizar la solicitud: ${errorText}`);
      }

      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  }
};

const removeFavorito = async (idSerie) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  user.favoritos = user.favoritos.filter((favorito) => favorito !== idSerie);

  const body = { favoritos: user.favoritos };

  try {
    const response = await fetch(`${API_BASE_URL}/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al realizar la solicitud: ${errorText}`);
    }

    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error al actualizar favoritos:", error);
  }
};


