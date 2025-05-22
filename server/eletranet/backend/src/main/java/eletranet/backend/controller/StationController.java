package eletranet.backend.controller;
import eletranet.backend.entity.Station;
import eletranet.backend.services.StationServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path = "/api")
public class StationController {

    private static final Logger logger = LoggerFactory.getLogger(StationController.class);

    StationServices stationServices;
    public StationController(StationServices stationServices) {
        this.stationServices = stationServices;
    }


    @GetMapping(path = "/getStationByname")
    public ResponseEntity<Station> getStationByName(@RequestParam String name) {
        Optional<Station> stationFound = stationServices.getStationByName(name);
        if (stationFound.isPresent()) {
            return new ResponseEntity<>(stationFound.get(), HttpStatus.OK);
        }else{
            logger.error("Station not found with name: {}", name);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path="/getAllStations")
    public ResponseEntity<List<Station>> getAllStations() {
        List<Station> stations = stationServices.getAllStations();
        if (stations.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(stations, HttpStatus.OK);
        }

    }


}
