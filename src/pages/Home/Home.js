import "./Home.css"

let seriesCache = null;

export const Home = async () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  if (seriesCache) {
    pintarSeries(seriesCache, main);
  } else {
    try {
      const res = await fetch("http://localhost:3000/api/v1/series");
      if (!res.ok) {
        throw new Error("Error al cargar las series");
      }
      const series = await res.json();
      seriesCache = series;
      pintarSeries(series, main);
    } catch (error) {
      console.error(error);
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

    // Solo agregar la imagen de like si el usuario está logueado
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

  // Verificar si el nuevo favorito ya está en la lista
  if (!user.favoritos.includes(idSerie)) {
    // Agregar el nuevo favorito a la lista de favoritos existente
    user.favoritos.push(idSerie);

    // Actualizar la lista de favoritos en el servidor solo si el favorito no estaba presente antes
    await updateFavoritos(user.favoritos);

    // Guardar el usuario actualizado en el almacenamiento local
    localStorage.setItem("user", JSON.stringify(user));
  }
}


const removeFavorito = async (idSerie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Filtrar la lista de favoritos para eliminar el favorito específico
  user.favoritos = user.favoritos.filter(favorito => favorito !== idSerie);

  // Actualizar solo la lista de favoritos en el servidor sin el favorito eliminado
  await updateFavoritos(user.favoritos);

  // Guardar el usuario actualizado en el almacenamiento local
  localStorage.setItem("user", JSON.stringify(user));
}





const updateFavoritos = async (favoritos) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Actualizar la lista de favoritos del usuario en el servidor
  const objetoFinal = JSON.stringify({
    favoritos: favoritos
  });

  const opciones = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: objetoFinal
  };

  await fetch(`http://localhost:3000/api/v1/users/${user._id}`, opciones);
}





