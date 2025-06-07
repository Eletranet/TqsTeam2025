package eletranet.backend.controller;
import eletranet.backend.entity.Station;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.services.PersonServices;
import eletranet.backend.services.StationServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path = "/api")
public class StationController {

    private static final Logger logger = LoggerFactory.getLogger(StationController.class);

    StationServices stationServices;
    PersonServices personServices;

    public StationController(StationServices stationServices , PersonServices personServices) {
        this.personServices = personServices;
        this.stationServices = stationServices;
    }


    @GetMapping(path = "/getStationByname")
    public ResponseEntity<Station> getStationByName(@RequestParam String name) {
        Optional<Station> stationFound = stationServices.getStationByName(name);
        if (stationFound.isPresent()) {
            return new ResponseEntity<>(stationFound.get(), HttpStatus.OK);
        }else{
            logger.error("Station not found with that username");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path="/getAllStations")
    public ResponseEntity<List<Station>> getAllStations() {

        var person = personServices.getUserFromContext();

        if (person == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not logged in");
        }

        List<Station> stations = stationServices.getAllStations();
        if (stations.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(stations, HttpStatus.OK);
        }

    }

    @PutMapping(path = "/editStation")
    public ResponseEntity<HttpStatus> editStation(@RequestParam String newPreco, @RequestParam String newEstado, @RequestParam String stationID) {

        var person = personServices.getUserFromContext();
        if (person == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not logged in");
        }
        StationStatus statusToSave;
        double newPrecoDouble;
        Long stationIDLong;
        try{
            statusToSave = StationStatus.valueOf(newEstado.toUpperCase());
            newPrecoDouble = Double.parseDouble(newPreco);
            stationIDLong = Long.parseLong(stationID);
        }catch (IllegalArgumentException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<Station> station = stationServices.getStationById(stationIDLong);
        if (station.isPresent()) {
            Station currentStation = station.get();
            currentStation.setPricePerHour(newPrecoDouble);
            currentStation.setStatus(statusToSave);
            stationServices.saveStation(currentStation);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
