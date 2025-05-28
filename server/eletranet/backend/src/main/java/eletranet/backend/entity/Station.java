package eletranet.backend.entity;

import eletranet.backend.enums.StationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import eletranet.backend.enums.ConnectorType;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "stations")
public class Station {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;
    private StationStatus status;
    private double pricePerHour;
    private double maxPower;
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;
    private Double latitude;
    private Double longitude;

    public  Station(String name, StationStatus status, double pricePerHour, double maxPower, ConnectorType connectorType , Double latitude, Double longitude) {
        this.name = name;
        this.status = status;
        this.pricePerHour = pricePerHour;
        this.maxPower = maxPower;
        this.connectorType = connectorType;
        this.latitude = latitude;
        this.longitude = longitude;

    }

}
