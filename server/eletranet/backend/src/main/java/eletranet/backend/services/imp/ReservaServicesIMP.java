package eletranet.backend.services.imp;

import eletranet.backend.entity.Reserva;
import eletranet.backend.enums.ReservaStatus;
import eletranet.backend.repository.ReservaRepository;
import eletranet.backend.services.PersonServices;
import eletranet.backend.services.ReservaServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ReservaServicesIMP  implements ReservaServices {
    ReservaRepository reservaRepository;

    public ReservaServicesIMP(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Override
    public Optional<Reserva> findById(Long id) {

        return reservaRepository.findById(id);
    }

    @Override
    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }


    //  return  allReservas.stream().filter(reserva -> reserva.getIdUsuario().doubleValue()==id.doubleValue()).collect(Collectors.toList());

    @Override
    public List<Reserva> findByClienteId(Long id) {
        List<Reserva> allReservas = reservaRepository.findAll();
       return  allReservas.stream().filter(reserva -> reserva.getIdUsuario().doubleValue()==id.doubleValue()).toList();
    }

    @Override
    public Reserva save(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    @Override
    public boolean cancelarReserva(Long idReserva) {
        boolean flag;
        Optional<Reserva> optionalReserva = reservaRepository.findById(idReserva);
        if(optionalReserva.isPresent()){
            Reserva reserva = optionalReserva.get();
            reserva.setStatusReserva(ReservaStatus.CANCELADO);
            reservaRepository.save(reserva);
            flag = true;
        }else{
            flag = false;
        }
        return flag;
    }

    @Override
    public List<Reserva> findByIdUsuario(Long idCliente) {
        return reservaRepository.findByIdUsuario(idCliente);

    }

    @Override
    public boolean isReservaValid(Reserva reserva, PersonServices personServices) {
        var person = personServices.getUserFromContext();
        List<Reserva> reservaList =findByClienteId(person.getId());

        for(Reserva reserva1:reservaList){
            if(reserva1.getDataReserva().equals(reserva.getDataReserva()) && reserva1.getHoraReserva().equals(reserva.getHoraReserva())){
                return  false;
            }
        }
        return  true;
    }


}
