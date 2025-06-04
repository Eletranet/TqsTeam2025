package eletranet.backend.services.imp;
import eletranet.backend.entity.Station;
import eletranet.backend.repository.StationRepository;
import eletranet.backend.services.StationServices;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StationServicesIMP implements StationServices {
    private static final Logger logger = LoggerFactory.getLogger(StationServicesIMP.class);

    private StationRepository stationRepository;

    public  StationServicesIMP(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }


    @Override
    public Station saveStation(Station station) {
        try{
            return  stationRepository.save(station);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return  null;
        }
    }

    @Override
    public Optional<Station> getStationByName(String stationName) {
        return  stationRepository.findByName(stationName);
    }

    @Override
    public List<Station> getAllStations() {
        return  stationRepository.findAll();
    }

    @Override
    public Optional<Station> getStationById(Long id) {
        return  stationRepository.findById(id);
    }
}
