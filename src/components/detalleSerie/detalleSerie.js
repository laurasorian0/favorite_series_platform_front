import "./detalleSerie.css";

export const detalleSerie = (serie) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Debes iniciar sesión para ver los detalles de la serie.");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeModal = document.createElement("span");
  closeModal.className = "close";
  closeModal.innerHTML = "&times;";

  const imagen = document.createElement("img");
  imagen.src = serie.portada;

  const titulo = document.createElement("h2");
  titulo.textContent = serie.titulo;

  const plataforma = document.createElement("p");
  plataforma.textContent = `Plataforma: ${serie.plataforma}`;

  const valoracionCreador = document.createElement("p");
  valoracionCreador.textContent = `Valoración creador: ${serie.valoracion}/5`;

  const valoracionUsuarioLabel = document.createElement("label");
  valoracionUsuarioLabel.textContent = "Tu valoración:";
  const valoracionUsuarioInput = document.createElement("input");
  valoracionUsuarioInput.type = "number";
  valoracionUsuarioInput.min = "1";
  valoracionUsuarioInput.max = "5";
  valoracionUsuarioInput.step = "1";


  let valoracionUsuarioGuardada = null;
  if (user.valoraciones && user.valoraciones[serie._id]) {
    valoracionUsuarioGuardada = user.valoraciones[serie._id];
    valoracionUsuarioInput.value = valoracionUsuarioGuardada;
  }

  const enviarValoracionBtn = document.createElement("button");
  enviarValoracionBtn.textContent = "Enviar Valoración";


  enviarValoracionBtn.addEventListener("click", () => {
    const valoracionUsuario = parseInt(valoracionUsuarioInput.value);
    if (valoracionUsuario >= 1 && valoracionUsuario <= 5) {

      console.log(`Valoración del usuario: ${valoracionUsuario}`);

      if (!user.valoraciones) user.valoraciones = {};
      user.valoraciones[serie._id] = valoracionUsuario;
      localStorage.setItem("user", JSON.stringify(user));

    } else {
      alert("Por favor ingresa una valoración válida entre 1 y 5.");
    }
  });

  modalContent.appendChild(closeModal);
  modalContent.appendChild(imagen);
  modalContent.appendChild(titulo);
  modalContent.appendChild(plataforma);
  modalContent.appendChild(valoracionCreador);
  modalContent.appendChild(valoracionUsuarioLabel);
  modalContent.appendChild(valoracionUsuarioInput);


  if (valoracionUsuarioGuardada !== null) {
    const valoracionUsuarioGuardadaElement = document.createElement("p");
    valoracionUsuarioGuardadaElement.textContent = `Tu valoración: ${valoracionUsuarioGuardada}/5`;
    modalContent.appendChild(valoracionUsuarioGuardadaElement);
  }

  modalContent.appendChild(enviarValoracionBtn);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);


  modal.style.display = "block";


  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.removeChild(modal);
  });


  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.removeChild(modal);
    }
  });
};

