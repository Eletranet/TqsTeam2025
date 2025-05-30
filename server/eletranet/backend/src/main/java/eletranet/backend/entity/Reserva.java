package eletranet.backend.entity;


import eletranet.backend.enums.ReservaStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;
    private Long idUsuario;
    private String nameCliente;
    @Enumerated(EnumType.STRING)
    private ReservaStatus statusReserva;
    private String dataReserva;
    private Double valorReserva;
    private String stationName;
    private Long stationId;


    public Reserva(Long idUsuario,String nameCliente,ReservaStatus statusreserva  , String dataReserva, Double valorReserva, String stationName, Long stationId) {
        this.idUsuario = idUsuario;
        this.nameCliente = nameCliente;
        this.statusReserva =statusreserva;
        this.dataReserva = dataReserva;
        this.valorReserva = valorReserva;
        this.stationName = stationName;
        this.stationId = stationId;

    }

    @Override
    public String toString() {
        return "Reserva{" +
                "idReserva=" + idReserva +
                ", idUsuario=" + idUsuario +
                ", nameCliente='" + nameCliente + '\'' +
                ", statusReserva=" + statusReserva +
                ", dataReserva='" + dataReserva + '\'' +
                ", valorReserva=" + valorReserva +
                ", stationName='" + stationName + '\'' +
                ", stationId=" + stationId +
                '}';
    }
}
