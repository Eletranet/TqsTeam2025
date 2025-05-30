package eletranet.backend.features;

import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

import java.time.Duration;

public class FiltrosListaEstação {
    private WebDriver driver = new FirefoxDriver();

    @Dado("que tenho sessão iniciada")
    public void setupLogin() {
        driver.get("http://localhost:5173/loguin");
        driver.findElement(By.id("username")).sendKeys("a");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("button-signin")).click();
    }

    @Dado("que acabo de abrir a lista de estações")
    public void setupGetPage() {
        driver.get("http://localhost:5173/mapa");
    }

    @Quando("seleciono o estado {string}")
    public void selecionarEstado(String estado) {
        driver.findElement(By.cssSelector(".MuiButtonBase-root:nth-child(4)")).click();
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
        Select drpEstado = new Select(driver.findElement(By.id("station-state-selector")));
        drpEstado.selectByVisibleText(estado);
    }

    @Então("só vejo estações cujo estado é {string}")
    public void sóVejoEstado(String estado) {
        // Falta implementar
    }
}
