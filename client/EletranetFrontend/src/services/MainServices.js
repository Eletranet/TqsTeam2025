import axios from 'axios'

const backendAuthApi = "http://localhost:8080/api"


export const getAllStations = async () => {
  try {
    const result = await axios.get(backendAuthApi + "/getAllStations");
    console.log(result)
    if (result.status === 200) {
      console.log("Postos buscados da bd:", result.data);
      return result.data; // ✅ Retorna corretamente
    }
  } catch (error) {
    console.error("Erro ao buscar estações:", error);
    throw error;
  }
};