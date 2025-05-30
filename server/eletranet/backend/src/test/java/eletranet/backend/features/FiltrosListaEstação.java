package eletranet.backend.features;

import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

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
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Click the select button to open dropdown
        WebElement selectButton = wait.until(
                ExpectedConditions.elementToBeClickable(By.id("station-state-selector-button"))
        );
        selectButton.click();

        // Wait for option with text "Ativa" and click it
        // MUI dropdown options are typically rendered as <li> elements
        String xpath = String.format("//li[contains(text(), %s)]", estado);
        WebElement option = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath(xpath))
        );
        option.click();
    }

    @Então("só vejo estações cujo estado é {string}")
    public void sóVejoEstado(String estado) {
        // Falta implementar
    }
}
