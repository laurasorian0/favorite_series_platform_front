import { Home } from "../../pages/Home/Home";
import { fetchData } from "../../utils/api";
import "./PerfilUsuario.css";

export const PerfilUsuario = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const perfilDiv = document.createElement("div");
  perfilDiv.id = "perfil";
  main.append(perfilDiv);

  renderPerfil(perfilDiv);
};

export const renderPerfil = (elementoPadre) => {

  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserName = userData ? userData.userName : '';

  const form = document.createElement("form");
  const inputCurrentName = document.createElement("input");
  const inputNewName = document.createElement("input");
  const buttonModificar = document.createElement("button");

  form.className = "perfil-form";
  inputCurrentName.value = currentUserName;
  inputNewName.placeholder = "Nombre de usuario nuevo";
  inputCurrentName.disabled = true;
  buttonModificar.innerHTML = "Modificar nombre usuario";


  form.append(inputCurrentName);
  form.append(inputNewName);
  form.append(buttonModificar);
  elementoPadre.append(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentName = inputCurrentName.value;
    const newName = inputNewName.value;

    if (!newName) {
      const errorNombre = document.createElement("p");
      errorNombre.innerHTML = "Por favor, introduce el nombre nuevo para el usuario";
      const perfilDiv = document.getElementById("perfil");
      perfilDiv.innerHTML = "";
      perfilDiv.append(errorNombre);
      return;
    }
    modificarDatos(currentName, newName);
  });
};

const modificarDatos = async (currentName, newName) => {
  const token = localStorage.getItem("token");
  const userId = obtenerIdUsuario(); // Obtener el ID del usuario

  // Obtener los datos del usuario actual
  const usuarioActualResponse = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de autorización
    }
  });

  if (!usuarioActualResponse.ok) {
    console.error("Error al obtener los datos del usuario actual.");
    return;
  }

  const usuarioActual = await usuarioActualResponse.json();

  // Verificar si el nombre de usuario actual coincide
  if (usuarioActual.userName !== currentName) {
    console.error("El nombre de usuario actual no coincide.");
    alert("El nombre de usuario actual no coincide.");
    return;
  }

  const datosModificados = {
    userName: newName
  };

  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de autorización
      },
      body: JSON.stringify(datosModificados),
    });

    if (!response.ok) {
      throw new Error("Error al modificar el nombre de usuario.");
    }
    console.log("Nombre de usuario modificado con éxito");
    const main = document.querySelector("main");
    const pModificado = document.createElement("p");
    pModificado.innerHTML = "Nombre de usuario modificado";
    main.append(pModificado);

    setTimeout(() => {
      Home();
    }, 2000);

  } catch (error) {
    console.error(error);
  }
};

const obtenerIdUsuario = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData._id) {
    return userData._id;
  } else {
    throw new Error("No se encontró el ID del usuario");
  }
};
