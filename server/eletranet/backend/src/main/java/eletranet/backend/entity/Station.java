package eletranet.backend.entity;

import eletranet.backend.enums.StationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String location;
    private StationStatus status;
    private double pricePerHour;
    private double maxPower;
    private String connectorType;

    public  Station(String name, String location, StationStatus status, double pricePerHour, double maxPower, String connectorType) {
        this.name = name;
        this.location = location;
        this.status = status;
        this.pricePerHour = pricePerHour;
        this.maxPower = maxPower;
        this.connectorType = connectorType;

    }

}
