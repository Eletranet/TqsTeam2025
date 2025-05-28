package eletranet.backend.contollersTests;

import eletranet.backend.config.SecurityFilter;
import eletranet.backend.config.TokenProvider;
import eletranet.backend.controller.StationController;
import eletranet.backend.entity.Station;
import eletranet.backend.enums.ConnectorType;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.services.StationServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(StationController.class)
@AutoConfigureMockMvc(addFilters = false)
class StationControllerTest {
    @MockitoBean
    private TokenProvider tokenProvider;
    @MockitoBean
    private SecurityFilter securityFilter;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StationServices stationServices;


    @BeforeEach
    void setUp() {
        Station s1  = new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580);
        Station s2  = new Station("EletraNet Fórum Aveiro",              StationStatus.STATUS_OCUPADO,   0.28,  90, ConnectorType.TIPO2,    40.6506, -8.6580);
        Station s3  = new Station("EletraNet Estação CP",               StationStatus.STATUS_RESERVADO, 0.24,  75, ConnectorType.CHADEMO,  40.6306, -8.6580);
        Station s4  = new Station("EletraNet Sé de Aveiro",             StationStatus.STATUS_ATIVA,     0.25,  70, ConnectorType.CCS,      40.6372, -8.6520);

        when(stationServices.getStationByName(s1.getName())).thenReturn(Optional.of(s1));
        when(stationServices.getAllStations()).thenReturn(List.of(s1, s2,s3,s4));
    }

    @Test
    void getStationByName() throws Exception {
        mockMvc.perform(
                        get("/api/getStationByname")
                                .param("name", "EletraNet Praça do Peixe")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
            verify(stationServices, times(1)).getStationByName("EletraNet Praça do Peixe");
    }
    @Test
    void getAllStations() throws Exception {
        mockMvc.perform(
                        get("/api/getAllStations")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
        verify(stationServices, Mockito.times(1)).getAllStations();

    }

    @Test
    void getStationBynameNotFound() throws Exception {
        when(stationServices.getStationByName(Mockito.anyString())).thenReturn(Optional.empty());
        mockMvc.perform(
                get("/api/getStationByname")
                        .param("name", "EletraNet Sé de Aveiro2sd")
                        .contentType(MediaType.APPLICATION_JSON)

        ).andExpect(status().isNotFound());
        verify(stationServices,times(1)).getStationByName(Mockito.anyString());
    }
    @Test
    void getAllStationsNotFound() throws Exception {
        when(stationServices.getAllStations()).thenReturn(List.of());
        mockMvc.perform(get("/api/getAllStations"))
                .andExpect(status().isNoContent());
        verify(stationServices,times(1)).getAllStations();
    }
}
