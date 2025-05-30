package eletranet.backend.controller;


import eletranet.backend.entity.Person;
import eletranet.backend.entity.Reserva;
import eletranet.backend.entity.Station;
import eletranet.backend.enums.ReservaStatus;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.services.PersonServices;
import eletranet.backend.services.ReservaServices;
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
@RequestMapping("/reserva")
public class ReservaControler {

    private static final Logger logger = LoggerFactory.getLogger(ReservaControler.class);

    ReservaServices reservaServices;
    PersonServices personServices;
    StationServices stationServices;
    public ReservaControler(ReservaServices reservaServices , PersonServices personServices,StationServices stationServices) {
        this.reservaServices= reservaServices;
        this.personServices= personServices;
        this.stationServices= stationServices;
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Reserva>> getAllReservas(){
        logger.info("Buscando todas as reservas");

        List<Reserva> reservas = reservaServices.findAll();

        if(reservas.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{

            return new ResponseEntity<>(reservas, HttpStatus.OK);
        }

    }
    @GetMapping("/getReservasByIdUsuario")
    public ResponseEntity<List<Reserva>> getReservasByIdUsuario(){
        var person = personServices.getUserFromContext();
        List<Reserva> reservas = reservaServices.findByIdUsuario(person.getId());

        if(reservas.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{

            return new ResponseEntity<>(reservas, HttpStatus.OK);
        }

    }




    @PostMapping("/fazerReserva")
    public ResponseEntity<Reserva> fazerReserva(@RequestParam String dataReserva, @RequestParam Long stationID){
        var person = personServices.getUserFromContext();
        Optional<Station> station = stationServices.getStationById(stationID);


        if(station.isEmpty() || person == null){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        StationStatus atucalStatus = station.get().getStatus();
        if(atucalStatus==StationStatus.STATUS_DESLIGADO ||  atucalStatus == StationStatus.STATUS_OCUPADO ){
            logger.info("Reserva nao efetuada porque o posto esta {}" , atucalStatus);
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        Reserva reserva = new Reserva(person.getId(),person.getUsername(),ReservaStatus.ACTIVO,dataReserva,station.get().getPricePerHour(), station.get().getName(),stationID);


        Reserva saved = reservaServices.save(reserva);
        logger.info("Reserva {} salva com sucesso", reserva.getIdReserva());
        return  new ResponseEntity<>(saved,HttpStatus.OK);

    }

    @PutMapping("/cancelarReserva")
    public  ResponseEntity<String> cancelarReserva(@RequestParam Long idReserva){
        boolean canceled = reservaServices.cancelarReserva(idReserva);
        if(canceled){
            logger.info("Reserva {} cancelada com sucesso", idReserva);
            return new ResponseEntity<>("Reserva cancelada com Sucesso",HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Reserva nao encontrada",HttpStatus.NOT_ACCEPTABLE);
        }

    }







}
