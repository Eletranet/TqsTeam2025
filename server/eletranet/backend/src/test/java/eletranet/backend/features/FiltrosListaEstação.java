package eletranet.backend.features;

import io.cucumber.java.pt.Dada;
import io.cucumber.java.pt.Quando;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class FiltrosListaEstação {
    @Dada("uma lista de estações acabada de abrir")
    public void setup() {
        WebDriver driver = new FirefoxDriver();
        driver.get("http://localhost:5173/");
    }

    @Quando("Seleciono o estado {string}")
    public void selecionarEstado(String estado) {}
}
