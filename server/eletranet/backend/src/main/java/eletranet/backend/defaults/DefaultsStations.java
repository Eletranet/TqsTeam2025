package eletranet.backend.defaults;

import eletranet.backend.config.Generated;
import eletranet.backend.entity.Station;
import eletranet.backend.enums.ConnectorType;
import eletranet.backend.enums.StationStatus;
import eletranet.backend.repository.StationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Generated
@Component
public class DefaultsStations implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(DefaultsStations.class);

    StationRepository stationRepository;
    public DefaultsStations(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @Override
    public  void run(ApplicationArguments args) throws Exception {
        Station s1  = new Station("EletraNet Praça do Peixe",             StationStatus.STATUS_ATIVA,     0.26,  80, ConnectorType.CCS,      40.6406, -8.6580);
        Station s2  = new Station("EletraNet Fórum Aveiro",              StationStatus.STATUS_OCUPADO,   0.28,  90, ConnectorType.TIPO2,    40.6506, -8.6580);
        Station s3  = new Station("EletraNet Estação CP",               StationStatus.STATUS_RESERVADO, 0.24,  75, ConnectorType.CHADEMO,  40.6306, -8.6580);
        Station s4  = new Station("EletraNet Sé de Aveiro",             StationStatus.STATUS_ATIVA,     0.25,  70, ConnectorType.CCS,      40.6372, -8.6520);
        Station s5  = new Station("EletraNet Moliceiro Dock",           StationStatus.STATUS_DESLIGADO, 0.22,  65, ConnectorType.TIPO1,    40.6385, -8.6510);
        Station s6  = new Station("EletraNet Ponte do Canal Central",   StationStatus.STATUS_RESERVADO, 0.27,  80, ConnectorType.TIPO2,    40.6380, -8.6595);
        Station s7  = new Station("EletraNet Museu da Ria",             StationStatus.STATUS_ATIVA,     0.29,  95, ConnectorType.CCS,      40.6395, -8.6670);
        Station s8  = new Station("EletraNet Parque Infante D. Pedro",  StationStatus.STATUS_OCUPADO,   0.30, 100, ConnectorType.CHADEMO,  40.6390, -8.6500);
        Station s9  = new Station("EletraNet Palacete Bela Vista",      StationStatus.STATUS_ATIVA,     0.31,  85, ConnectorType.TIPO2,    40.6480, -8.6480);
        Station s10 = new Station("EletraNet Costa Nova",               StationStatus.STATUS_ATIVA,     0.26,  70, ConnectorType.CCS,      40.5730, -8.7410);
        Station s11 = new Station("EletraNet Farol da Barra",           StationStatus.STATUS_DESLIGADO, 0.23,  85, ConnectorType.TIPO1,    40.5738, -8.7341);
        Station s12 = new Station("EletraNet Salinas de Aveiro",        StationStatus.STATUS_ATIVA,     0.27,  80, ConnectorType.TIPO2,    40.6190, -8.6830);
        Station s13 = new Station("EletraNet Museu Marítimo de Ílhavo", StationStatus.STATUS_OCUPADO,   0.28,  90, ConnectorType.CHADEMO,  40.5880, -8.5900);
        Station s14 = new Station("EletraNet Ria de Aveiro",            StationStatus.STATUS_RESERVADO, 0.25,  75, ConnectorType.TIPO1,    40.6550, -8.6700);
        Station s15 = new Station("EletraNet Rossio",                   StationStatus.STATUS_ATIVA,     0.29,  95, ConnectorType.CCS,      40.6415, -8.6550);
        Station s16 = new Station("EletraNet Salão Nobre",              StationStatus.STATUS_OCUPADO,   0.30, 100, ConnectorType.TIPO2,    40.6460, -8.6500);
        Station s17 = new Station("EletraNet Canal de São Roque",       StationStatus.STATUS_ATIVA,     0.26,  60, ConnectorType.CHADEMO,  40.6520, -8.6630);
        Station s18 = new Station("EletraNet Mercado Manuel Firmino",   StationStatus.STATUS_DESLIGADO, 0.24,  65, ConnectorType.TIPO1,    40.6398, -8.6605);
        Station s19 = new Station("EletraNet Universidade de Aveiro",   StationStatus.STATUS_ATIVA,     0.27,  85, ConnectorType.CCS,      40.6370, -8.6565);
        Station s20 = new Station("EletraNet Parque da Cidade",         StationStatus.STATUS_RESERVADO, 0.31,  80, ConnectorType.TIPO2,    40.6630, -8.6560);

        if(stationRepository.count()>0){
           stationRepository.deleteAll();
            return;
        }

        List<Station > stations = Arrays.asList(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20);
        stationRepository.saveAll(stations);
        logger.info("Defaults Stations loaded");
    }
}
