// src/services/LoginService.js
import axios from 'axios'

//const backendAuthApi = "http://deti-tqs-17.ua.pt:8080/auth"
//const backendAuthApi ="http://localhost:8080/auth"

const backendAuthApi = import.meta.env.VITE_BACKEND_API+"/auth";
console.log("backendAuthApi:",backendAuthApi)


export const LoguinService = async (username, password, navigate) => {
  const finalUrl = backendAuthApi+`/login?username=${username}&password=${password}`
  try {
    const result = await axios.post(finalUrl)

    if (result.status === 200) {
      localStorage.setItem("TokenEletraNet", result.data.token)
      navigate("/")
    }
  } catch (error) {
    console.error(error)
    if(error.code=="ERR_NETWORK"){
      alert("Network Error")
    }else{
      alert("Erro, verifica o nome de utilizador e a palavra-passe")
    }
  }
}

export const RegisterService = async (payload,navigate) => {
  
    const result = await axios.post(backendAuthApi + "/register",payload).then((result) => {
        console.log(result)
        if (result.status === 201) {
          alert("Conta criada com sucesso. Inicie sessão para continuar.")
          navigate("/")
        }



    }).catch((error) => {
        if(error.status == 409 ){
              alert("Ja existe um Usuario com esse UserName")
            }
            console.error(error)

    })
    
 
}
