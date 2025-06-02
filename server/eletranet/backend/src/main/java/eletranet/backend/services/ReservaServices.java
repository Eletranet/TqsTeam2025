package eletranet.backend.services;

import eletranet.backend.entity.Reserva;

import java.util.List;
import java.util.Optional;

public interface ReservaServices {
    Optional<Reserva> findById(Long id);
    List<Reserva> findAll();
    List<Reserva> findByClienteId(Long id);
    Reserva save(Reserva reserva);
    List<Reserva> findByIdUsuario(Long idCliente);
    boolean existeConflitoDeReservaPendente(Reserva reserva);

    boolean manageReserva(Long idReserva, String operation);
}
