package eletranet.backend.contollersTests;

import eletranet.backend.config.SecurityFilter;
import eletranet.backend.config.TokenProvider;
import eletranet.backend.controller.StationController;
import eletranet.backend.entity.Station;
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
        Station s1 = new Station("Estação Central", "Lisboa", StationStatus.STATUS_ATIVA, 0.25, 50, "Tipo1");
        Station s2 = new Station("Estação Norte", "Porto", StationStatus.STATUS_ATIVA, 0.30, 75, "CCS");
        Station s3 = new Station("Estação Sul", "Faro", StationStatus.STATUS_DESLIGADO, 0.20, 60, "CHAdeMO");
        Station s4 = new Station("Estação Ribeirinha", "Coimbra", StationStatus.STATUS_RESERVADO, 0.27, 80, "Tipo22");

        when(stationServices.getStationByName(s1.getName())).thenReturn(Optional.of(s1));
        when(stationServices.getAllStations()).thenReturn(List.of(s1, s2,s3,s4));
    }

    @Test
    void getStationByName() throws Exception {
        mockMvc.perform(
                        get("/api/getStationByname")
                                .param("name", "Estação Central")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
            verify(stationServices, times(1)).getStationByName("Estação Central");
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
                        .param("name", "Estação Central da luz")
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