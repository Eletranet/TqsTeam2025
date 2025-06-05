import axios from 'axios'

//const backendApi = "http://deti-tqs-17.ua.pt:8080"
//const backendApi ="http://localhost:8080"

const backendApi = import.meta.env.VITE_BACKEND_API;

export const getAllStations = async () => {
  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.get(backendApi + "/api/getAllStations", {
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

export const getAllReservas = async () => {
  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.get(backendApi + "/reserva/getAll", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    if (result.status === 200) {
      console.log("Reservas buscados da bd:", result.data);
      return result.data; 
    }
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    throw error;
  }
};

export const getMyReservas = async () => {
  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.get(backendApi + "/reserva/getReservasByIdUsuario", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    if (result.status === 200) {
      console.log("Reservas buscados da bd:", result.data);
      return result.data; 
    }
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    throw error;
  }
};



export const fazerReserva = async (reservaData) => {
  
  const url=backendApi+`/reserva/fazerReserva?stationID=${reservaData.selectedStationID}&dataReserva=${reservaData.data}&horaReserva=${reservaData.hora}&duracaoReserva=${reservaData.duracao}&tipoCaregamento=${reservaData.tipoCaregamento}`

  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.post(url, {},{
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    if (result.status === 200) {
      return result.data; 
    }
  } catch (error) {
    console.error("Erro ao fazer reserva:", error);
    return null;
  }
};

export const autualizarReserva = async (idReserva,operation) => {
  
  const url=backendApi+`/reserva/manageReserva?idReserva=${idReserva}&operation=${operation}`

  try {
    const token = localStorage.getItem("TokenEletraNet") ? localStorage.getItem("TokenEletraNet"): undefined;
    if (token == undefined) {return}
    const result = await axios.put(url, {},{
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    if (result.status === 200) {
      window.location.reload()
    }
  } catch (error) {
    alert("Erro ao autualizar reserva")
    console.error("Erro ao atualizar reserva:", error);

    return null;
  }
};