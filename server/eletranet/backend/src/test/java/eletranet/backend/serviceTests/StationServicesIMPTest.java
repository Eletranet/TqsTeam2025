package eletranet.backend.serviceTests;

import eletranet.backend.entity.Station;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.repository.StationRepository;
import eletranet.backend.services.imp.StationServicesIMP;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;


import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StationServicesIMPTest {

    @Mock(strictness = Mock.Strictness.LENIENT)
    private StationRepository stationRepository;
    @Mock(strictness = Mock.Strictness.LENIENT)

    private StationServicesIMP stationServices;

    @BeforeEach
    void setUp() {
        stationRepository = mock(StationRepository.class);
        stationServices = new StationServicesIMP(stationRepository);
    }

    @Test
    void testSaveStationSuccess() {
        Station station = new Station("Estação Teste", "Lisboa", StationStatus.STATUS_ATIVA, 0.30, 50, "Tipo2");

        when(stationRepository.save(station)).thenReturn(station);

        Station result = stationServices.saveStation(station);
        assertNotNull(result);
        assertEquals("Estação Teste", result.getName());

        verify(stationRepository, times(1)).save(station);
    }

    @Test
    void testSaveStationException() {
        Station station = new Station("Estação Falha", "Porto", StationStatus.STATUS_ATIVA, 0.30, 50, "CCS");

        when(stationRepository.save(station)).thenThrow(new RuntimeException("Erro ao guardar"));

        Station result = stationServices.saveStation(station);
        assertNull(result);

        verify(stationRepository, times(1)).save(station);
    }

    @Test
    void testGetStationByName() {
        Station station = new Station("Estação X", "Faro", StationStatus.STATUS_ATIVA, 0.25, 60, "CHAdeMO");

        when(stationRepository.findByName("Estação X")).thenReturn(Optional.of(station));

        Optional<Station> result = stationServices.getStationByName("Estação X");

        assertTrue(result.isPresent());
        assertEquals("Estação X", result.get().getName());

        verify(stationRepository, times(1)).findByName("Estação X");
    }

    @Test
    void testGetAllStations() {
        List<Station> stations = List.of(
                new Station("S1", "Lisboa", StationStatus.STATUS_ATIVA, 0.3, 40, "Tipo1"),
                new Station("S2", "Porto", StationStatus.STATUS_OCUPADO, 0.35, 60, "CCS")
        );

        when(stationRepository.findAll()).thenReturn(stations);

        List<Station> result = stationServices.getAllStations();

        assertEquals(2, result.size());
        assertEquals("S1", result.get(0).getName());

        verify(stationRepository, times(1)).findAll();
    }
}