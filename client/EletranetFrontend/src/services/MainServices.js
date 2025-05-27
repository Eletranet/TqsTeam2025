import axios from 'axios'

const backendAuthApi = "http://localhost:8080/api"


export const getAllStations = async () => {
  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.get(backendAuthApi + "/getAllStations", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    if (result.status === 200) {
      console.log("Postos buscados da bd:", result.data);
      return result.data; 
    }
  } catch (error) {
    console.error("Erro ao buscar estações:", error);
    throw error;
  }
};