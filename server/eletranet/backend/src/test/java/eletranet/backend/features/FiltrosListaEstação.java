package eletranet.backend.features;

import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Quando;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class FiltrosListaEstação {
    @Dado("que tenho sessão iniciada")
    public void setupLogin() {
        WebDriver driver = new FirefoxDriver();
        driver.get("http://localhost:5173/loguin");
        driver.findElement(By.id("username")).sendKeys("a");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("button-signin")).click();
    }

    @Quando("Seleciono o estado {string}")
    public void selecionarEstado(String estado) {
        // Falta implementar.
    }
}
