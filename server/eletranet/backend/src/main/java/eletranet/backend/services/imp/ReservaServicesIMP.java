package eletranet.backend.services.imp;

import eletranet.backend.entity.Reserva;
import eletranet.backend.enums.ReservaStatus;
import eletranet.backend.repository.ReservaRepository;
import eletranet.backend.services.ReservaServices;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
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
    public List<Reserva> findByIdUsuario(Long idCliente) {
        return reservaRepository.findByIdUsuario(idCliente);

    }

    @Override
    public boolean existeConflitoDeReservaPendente(Reserva novaReserva) {
        LocalTime novaHoraInicio = LocalTime.parse(novaReserva.getHoraReserva());
        LocalTime novaHoraFim = novaHoraInicio.plusHours(Integer.parseInt(novaReserva.getDuracaoReserva()));
        if(reservaRepository.findAll().isEmpty()) return false;
        return reservaRepository.findAll().stream()
                .filter(r -> !r.getIdReserva().equals(novaReserva.getIdReserva())) // evitar comparar consigo mesma
                .filter(r -> r.getStationId().equals(novaReserva.getStationId()))
                .filter(r -> r.getDataReserva().equals(novaReserva.getDataReserva()))
                .filter(r -> r.getStatusReserva() == ReservaStatus.PENDENTE)
                .anyMatch(r -> {
                    LocalTime horaInicio = LocalTime.parse(r.getHoraReserva());
                    LocalTime horaFim = horaInicio.plusHours(Integer.parseInt(r.getDuracaoReserva()));
                    // Há sobreposição?
                    return !(novaHoraFim.compareTo(horaInicio) <= 0 || horaFim.compareTo(novaHoraInicio) <= 0);
                });
    }

    @Override
    public boolean manageReserva(Long idReserva, String operation) {
        Optional<Reserva> reservaOpt = findById(idReserva);
        if (reservaOpt.isEmpty()) return false;

        Reserva reserva = reservaOpt.get();

        return switch (operation) {
            case "CANCELAR" -> cancelarReserva(reserva);
            case "CONCLUIR" -> concluirReserva(reserva);
            case "CONFIRMAR" -> confirmarReserva(reserva);
            default -> false;
        };
    }

    private boolean cancelarReserva(Reserva reserva) {
        if (reserva.getStatusReserva() == ReservaStatus.CANCELADA || reserva.getStatusReserva() == ReservaStatus.CONCLUIDA) return false;
        reserva.setStatusReserva(ReservaStatus.CANCELADA);
        reservaRepository.save(reserva);
        return true;
    }

    private boolean concluirReserva(Reserva reserva) {
        if (reserva.getStatusReserva() != ReservaStatus.CONFIRMADA) return false;
        reserva.setStatusReserva(ReservaStatus.CONCLUIDA);
        reservaRepository.save(reserva);
        return true;
    }

    private boolean confirmarReserva(Reserva reserva) {
        if (reserva.getStatusReserva() != ReservaStatus.PENDENTE) return false;
        if (existeConflitoDeReservaPendente(reserva)) return false;

        reserva.setStatusReserva(ReservaStatus.CONFIRMADA);
        reservaRepository.save(reserva);
        return true;
    }
}
