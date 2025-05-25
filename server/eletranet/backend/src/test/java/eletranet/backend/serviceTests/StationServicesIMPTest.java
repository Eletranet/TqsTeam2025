package eletranet.backend.serviceTests;

import eletranet.backend.entity.Station;
import eletranet.backend.enums.ConnectorType;
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

        Station station  = new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580);



        when(stationRepository.save(station)).thenReturn(station);

        Station result = stationServices.saveStation(station);
        assertNotNull(result);
        assertEquals("EletraNet Praça do Peixe", result.getName());

        verify(stationRepository, times(1)).save(station);
    }

    @Test
    void testSaveStationException() {
        Station station  = new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580);

        when(stationRepository.save(station)).thenThrow(new RuntimeException("Erro ao guardar"));

        Station result = stationServices.saveStation(station);
        assertNull(result);

        verify(stationRepository, times(1)).save(station);
    }

    @Test
    void testGetStationByName() {
        Station station  = new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580);

        when(stationRepository.findByName("EletraNet Praça do Peixe")).thenReturn(Optional.of(station));

        Optional<Station> result = stationServices.getStationByName("EletraNet Praça do Peixe");

        assertTrue(result.isPresent());
        assertEquals("EletraNet Praça do Peixe", result.get().getName());

        verify(stationRepository, times(1)).findByName("EletraNet Praça do Peixe");
    }

    @Test
    void testGetAllStations() {
        List<Station> stations = List.of(
                new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580),
                new Station("EletraNet Praça do Peixe2",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580)
        );

        when(stationRepository.findAll()).thenReturn(stations);

        List<Station> result = stationServices.getAllStations();

        assertEquals(2, result.size());
        assertEquals("EletraNet Praça do Peixe", result.get(0).getName());

        verify(stationRepository, times(1)).findAll();
    }
}