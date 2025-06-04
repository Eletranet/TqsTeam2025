package eletranet.backend.serviceTests;

import eletranet.backend.entity.Reserva;
import eletranet.backend.enums.ReservaStatus;
import eletranet.backend.repository.ReservaRepository;
import eletranet.backend.services.imp.ReservaServicesIMP;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;


class ReservaServicesIMPTest {
    @Mock(strictness = Mock.Strictness.LENIENT)
    private ReservaRepository reservaRepository;
    @Mock(strictness = Mock.Strictness.LENIENT)
    private Reserva reserva;
    private ReservaServicesIMP reservaServicesIMP;

   @BeforeEach
   void setUp() {
       reservaRepository =mock(ReservaRepository.class);

       reservaServicesIMP = new ReservaServicesIMP(reservaRepository);

       reserva = new Reserva();
       reserva.setIdReserva(1L);
       reserva.setIdUsuario(1L);
       reserva.setStationId(1L);
       reserva.setDataReserva(LocalDate.now().toString());
       reserva.setHoraReserva("10:00");
       reserva.setDuracaoReserva("2");
       reserva.setStatusReserva(ReservaStatus.PENDENTE);
   }

    @Test
    void findById() {
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        Optional<Reserva> result = reservaServicesIMP.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getIdReserva()).isEqualTo(1L);
    }

    @Test
    void findAll() {
        when(reservaRepository.findAll()).thenReturn(List.of(reserva));

        List<Reserva> result = reservaServicesIMP.findAll();

        assertThat(result).hasSize(1).containsExactly(reserva);
    }

    @Test
    void findByClienteId() {
        Reserva r2 = new Reserva();
        r2.setIdUsuario(2L);

        when(reservaRepository.findAll()).thenReturn(List.of(reserva, r2));

        List<Reserva> result = reservaServicesIMP.findByClienteId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIdUsuario()).isEqualTo(1L);
        verify(reservaRepository, times(1)).findAll();
    }

    @Test
    void save() {
        when(reservaRepository.save(reserva)).thenReturn(reserva);

        Reserva result = reservaServicesIMP.save(reserva);

        assertThat(result).isEqualTo(reserva);
        verify(reservaRepository, times(1)).save(reserva);
    }

    @Test
    void findByIdUsuario() {
        when(reservaRepository.findByIdUsuario(1L)).thenReturn(List.of(reserva));

        List<Reserva> result = reservaServicesIMP.findByIdUsuario(1L);

        assertThat(result).containsExactly(reserva);
        verify(reservaRepository, times(1)).findByIdUsuario(1L);
    }

    @Test
    void existeConflitoDeReservaPendente_false() {
        when(reservaRepository.findAll()).thenReturn(Collections.emptyList());

        boolean result = reservaServicesIMP.existeConflitoDeReservaPendente(reserva);

        assertThat(result).isFalse();
    }
    @Test
    void existeConflitoDeReservaPendente_true() {
        Reserva r2 = new Reserva();
        r2.setIdReserva(2L);
        r2.setStationId(1L);
        r2.setDataReserva(reserva.getDataReserva());
        r2.setHoraReserva("11:00");
        r2.setDuracaoReserva("1");
        r2.setStatusReserva(ReservaStatus.PENDENTE);

        when(reservaRepository.findAll()).thenReturn(List.of(reserva, r2));

        boolean result = reservaServicesIMP.existeConflitoDeReservaPendente(reserva);

        assertThat(result).isTrue();
    }

    @Test
    void manageReserva_confirmar_true() {
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
        when(reservaRepository.findAll()).thenReturn(List.of());

        boolean result = reservaServicesIMP.manageReserva(1L, "CONFIRMAR");

        assertThat(result).isTrue();
        assertThat(reserva.getStatusReserva()).isEqualTo(ReservaStatus.CONFIRMADA);
        verify(reservaRepository).save(reserva);
    }



    @Test
    void manageReserva_cancelar_true() {
        reserva.setStatusReserva(ReservaStatus.PENDENTE);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "CANCELAR");

        assertThat(result).isTrue();
        assertThat(reserva.getStatusReserva()).isEqualTo(ReservaStatus.CANCELADA);
        verify(reservaRepository).save(reserva);
    }
    @Test
    void manageReserva_cancelar_false_quando_ja_cancelada() {
        reserva.setStatusReserva(ReservaStatus.CANCELADA);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "CANCELAR");

        assertThat(result).isFalse();
        verify(reservaRepository, never()).save(any());
    }
    @Test
    void manageReserva_cancelar_false_quando_ja_concluida() {
        reserva.setStatusReserva(ReservaStatus.CONCLUIDA);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "CANCELAR");

        assertThat(result).isFalse();
        verify(reservaRepository, never()).save(any());
    }
    @Test
    void manageReserva_id_invalido() {
        when(reservaRepository.findById(99L)).thenReturn(Optional.empty());

        boolean result = reservaServicesIMP.manageReserva(99L, "CONFIRMAR");

        assertThat(result).isFalse();
    }

    @Test
    void manageReserva_operacao_desconhecida() {
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "NAO_EXISTE");

        assertThat(result).isFalse();
    }

    @Test
    void manageReserva_confirmar_false() {
       reserva.setStatusReserva(ReservaStatus.CONFIRMADA);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "CONFIRMAR");

        assertThat(result).isFalse();
    }


    @Test
    void manageReserva_concluir_true() {
       reserva.setStatusReserva(ReservaStatus.CONFIRMADA);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        boolean result = reservaServicesIMP.manageReserva(1L, "CONCLUIR");

        assertThat(result).isTrue();
    }

}