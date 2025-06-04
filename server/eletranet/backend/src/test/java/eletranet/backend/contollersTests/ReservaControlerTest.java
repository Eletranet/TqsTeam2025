package eletranet.backend.contollersTests;

import eletranet.backend.config.SecurityFilter;
import eletranet.backend.config.TokenProvider;
import eletranet.backend.controller.ReservaControler;
import eletranet.backend.entity.Person;
import eletranet.backend.entity.Reserva;
import eletranet.backend.entity.Station;
import eletranet.backend.enums.ConnectorType;
import eletranet.backend.enums.ReservaStatus;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.services.PersonServices;
import eletranet.backend.services.ReservaServices;
import eletranet.backend.services.StationServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ReservaControler.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservaControlerTest {
    @MockitoBean
    private TokenProvider tokenProvider;
    @MockitoBean
    private SecurityFilter securityFilter;
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ReservaServices reservaServices;
    @MockitoBean
    private PersonServices personServices;
    @MockitoBean
    private StationServices stationServices;

    private Reserva reserva1;
    private Reserva reserva2;
    private Person person  = new Person();
    private  Station s20;
    @BeforeEach
    void setUp() {
        // Mock de reservas
        reserva1 = new Reserva();
        reserva1.setIdReserva(101L);
        reserva1.setIdUsuario(1L);
        reserva1.setStationId(1L);
        reserva1.setStatusReserva(ReservaStatus.CONFIRMADA);
        reserva1.setDataReserva("2025-06-05");
        reserva1.setHoraReserva("14:00");
        reserva1.setTipoCaregamento("normal");
        reserva1.setDuracaoReserva("2");

        reserva2 = new Reserva();
        reserva2.setIdReserva(102L);
        reserva2.setIdUsuario(1L);
        reserva2.setStationId(1L);
        reserva2.setStatusReserva(ReservaStatus.PENDENTE);
        reserva2.setDataReserva("2025-06-06");
        reserva2.setHoraReserva("16:00");
        reserva2.setTipoCaregamento("rápido");
        reserva2.setDuracaoReserva("1");

        person.setId(1L);
        person.setFirstName("João");
        person.setLastName("Silva");
        person.setEmail("joao.silva@example.com");
        person.setPhone(912345678);
        person.setPassword("senhaSegura123");
        s20 = new Station("EletraNet Parque da Cidade",         StationStatus.STATUS_OCUPADO, 0.31,  80, ConnectorType.TIPO2,    40.6630, -8.6560);

    }

    @Test
    void getAllReservas_deveRetornarListaDeReservas() throws Exception {
        when(reservaServices.findAll()).thenReturn(List.of(reserva1, reserva2));

        mockMvc.perform(get("/reserva/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getAllReservas_deveRetornarNoContent_quandoListaVazia() throws Exception {
        when(reservaServices.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/reserva/getAll"))
                .andExpect(status().isNoContent());
    }



    @Test
    void getReservasByIdUsuario_deveRetornarReservasDoUtilizador() throws Exception {

        when(personServices.getUserFromContext()).thenReturn(person);
        when(reservaServices.findByIdUsuario(1L)).thenReturn(List.of(reserva1, reserva2));

        mockMvc.perform(get("/reserva/getReservasByIdUsuario"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].idUsuario").value(1))
                .andExpect(jsonPath("$[1].idUsuario").value(1));

    }
    @Test
    void getReservasByIdUsuario_deveRetornar_Lista_vazia_Quando_User_Nao_Tem_Reservas() throws Exception {

        when(personServices.getUserFromContext()).thenReturn(person);
        when(reservaServices.findByIdUsuario(1L)).thenReturn(List.of());

        mockMvc.perform(get("/reserva/getReservasByIdUsuario"))
                .andExpect(status().isNoContent());

    }


    @Test
    void fazerReserva_deveCriarReservaComSucesso() throws Exception {
        s20.setStatus(StationStatus.STATUS_ATIVA);
        when(personServices.getUserFromContext()).thenReturn(person);
        when(stationServices.getStationById(1L)).thenReturn(Optional.of(s20));
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(false);
        when(reservaServices.save(any())).thenReturn(reserva1);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isOk());
    }

    @Test
    void fazerReserva_deve_falhar_station_desligado() throws Exception {
        when(personServices.getUserFromContext()).thenReturn(person);
        when(stationServices.getStationById(1L)).thenReturn(Optional.of(s20));
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(false);
        when(reservaServices.save(any())).thenReturn(reserva1);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isNotAcceptable());
    }
    @Test
    void fazerReserva_deve_falhar_station_ocupado() throws Exception {
        s20.setStatus(StationStatus.STATUS_OCUPADO);
        when(personServices.getUserFromContext()).thenReturn(person);
        when(stationServices.getStationById(1L)).thenReturn(Optional.of(s20));
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(false);
        when(reservaServices.save(any())).thenReturn(reserva1);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isNotAcceptable());
    }
    @Test
    void fazerReserva_deve_falhar_station_null() throws Exception {
        when(personServices.getUserFromContext()).thenReturn(person);
        when(stationServices.getStationById(1L)).thenReturn(Optional.empty());
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(false);
        when(reservaServices.save(any())).thenReturn(reserva1);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isNoContent());
    }
    @Test
    void fazerReserva_deve_falhar_person_null() throws Exception {
        when(personServices.getUserFromContext()).thenReturn(null);
        when(stationServices.getStationById(1L)).thenReturn(Optional.of(s20));
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(false);
        when(reservaServices.save(any())).thenReturn(reserva1);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isNoContent());
    }
    @Test
    void fazerReserva_deve_falhar_existeConflitoDeReservaPendente() throws Exception {
        when(personServices.getUserFromContext()).thenReturn(person);
        s20.setStatus(StationStatus.STATUS_ATIVA);
        when(stationServices.getStationById(1L)).thenReturn(Optional.of(s20));
        when(reservaServices.existeConflitoDeReservaPendente(any())).thenReturn(Boolean.TRUE);

        mockMvc.perform(post("/reserva/fazerReserva")
                        .param("dataReserva", "2025-06-05")
                        .param("duracaoReserva", "2")
                        .param("stationID", "1")
                        .param("horaReserva", "14:00")
                        .param("tipoCaregamento", "normal"))
                .andExpect(status().isNotAcceptable());
    }


    @Test
    void manageReservaReserva_deveRetornarOk_quandoOperacaoForSucesso() throws Exception {
        when(reservaServices.manageReserva(101L, "CANCELAR")).thenReturn(true);

        mockMvc.perform(put("/reserva/manageReserva")
                        .param("idReserva", "101")
                        .param("operation", "CANCELAR"))
                .andExpect(status().isOk())
                .andExpect(content().string("Reserva atualiazada com Sucesso"));
    }
    @Test
    void manageReservaReserva_deveRetornarNOT_ACCEPTABLE_quandoOperacaoFalhar() throws Exception {
        when(reservaServices.manageReserva(101L, "CANCELAR")).thenReturn(false);

        mockMvc.perform(put("/reserva/manageReserva")
                        .param("idReserva", "101")
                        .param("operation", "CANCELAR"))
                .andExpect(status().isNotAcceptable())
                .andExpect(content().string("Erro ao autualizar a reserva"));
    }
}