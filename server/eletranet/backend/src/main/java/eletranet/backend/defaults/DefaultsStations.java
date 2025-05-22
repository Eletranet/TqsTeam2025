package eletranet.backend.defaults;

import eletranet.backend.entity.Station;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.repository.StationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import org.springframework.stereotype.Component;


@Component
public class DefaultsStations implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(DefaultsStations.class);

    StationRepository stationRepository;
    public DefaultsStations(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @Override
    public  void run(ApplicationArguments args) throws Exception {
        Station s1 = new Station("Estação Central", "Lisboa", StationStatus.STATUS_ATIVA, 0.25, 50, "Tipo1");
        Station s2 = new Station("Estação Norte", "Porto", StationStatus.STATUS_ATIVA, 0.30, 75, "CCS");
        Station s3 = new Station("Estação Sul", "Faro", StationStatus.STATUS_DESLIGADO, 0.20, 60, "CHAdeMO");
        Station s4 = new Station("Estação Ribeirinha", "Coimbra", StationStatus.STATUS_RESERVADO, 0.27, 80, "Tipo22");
        Station s5 = new Station("Estação de Montanha", "Serra da Estrela", StationStatus.STATUS_OCUPADO, 0.22, 40, "CCS");
        Station s6 = new Station("Estação Urbana", "Aveiro", StationStatus.STATUS_RESERVADO, 0.28, 50, "Tipo2");
        Station s7 = new Station("Estação Rápida", "Braga", StationStatus.STATUS_ATIVA, 0.35, 100, "CCS");
        Station s8 = new Station("Estação Eco", "Viseu", StationStatus.STATUS_RESERVADO, 0.23, 45, "CHAdeMO");
        Station s9 = new Station("Estação Litoral", "Setúbal", StationStatus.STATUS_DESLIGADO, 0.29, 55, "Tipo23");
        Station s10 = new Station("Estação Industrial", "Leiria", StationStatus.STATUS_ATIVA, 0.31, 70, "CCS");

        if(stationRepository.count()>0){
            return;
        }
        stationRepository.save(s1);
        stationRepository.save(s2);
        stationRepository.save(s3);
        stationRepository.save(s4);
        stationRepository.save(s5);
        stationRepository.save(s6);
        stationRepository.save(s7);
        stationRepository.save(s8);
        stationRepository.save(s9);
        stationRepository.save(s10);
        logger.info("Defaults Stations loaded");
    }
}
