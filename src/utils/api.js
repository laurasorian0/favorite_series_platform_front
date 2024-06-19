export const API_BASE_URL = "http://localhost:3000/api/v1";

export const fetchData = async (url, method = "GET", data) => {
  const opciones = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (method !== "GET") {
    opciones.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, opciones);
    if (!response.ok) {
      throw new Error("Error al realizar la solicitud");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};


export const fetchGet = async (endpoint) => fetchData(endpoint);
export const fetchPost = async (endpoint, body) => fetchData(endpoint, "POST", body);
export const fetchPut = async (endpoint, body) => fetchData(endpoint, "PUT", body);


