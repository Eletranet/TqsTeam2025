package eletranet.backend.services;

import eletranet.backend.entity.Station;

import java.util.List;
import java.util.Optional;

public interface StationServices {
    public Station saveStation(Station station);
    public Optional<Station> getStationByName(String stationName);
    public List<Station> getAllStations();
    public Optional<Station> getStationById(Long id);
}
