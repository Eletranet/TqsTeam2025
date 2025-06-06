package eletranet.backend.features;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class FiltrosListaEstação {
    private WebDriver driver = null;
    private WebDriverWait wait = null;


    private boolean isConnectorChecked(String conector) {
        // Locate checkbox input by traversing from label (MUI usually nests input inside label)
        String checkboxXpath = String.format("//label[contains(., '%s')]//input[@type='checkbox']", conector);
        WebElement checkbox = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(checkboxXpath)));
        return checkbox.isSelected();
    }

    @Before
    public void setup() {
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new");
        driver = new ChromeDriver(options);

        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void teardown() {
        //driver.quit();
    }

    @Dado("que tenho sessão iniciada")
    public void setupLogin() {
        driver.get("http://localhost:5173/loguin");
        driver.findElement(By.id("username")).sendKeys("a");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("button-signin")).click();

        // Wait until the URL is exactly the home page
        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/"));
    }

    @Dado("que acabo de abrir a lista de estações")
    public void setupGetPage() {
        driver.get("http://localhost:5173/mapa");
    }

    @Quando("seleciono o estado {string}")
    public void selecionarEstado(String estado) {

        // Click the select button to open dropdown
        WebElement selectButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.id("station-state-selector-button")
                )
        );
        selectButton.click();

        // Wait for option with the desired text and click it
        // MUI dropdown options are typically rendered as <li> elements
        String xpath = String.format("//li[contains(text(), %s)]", estado);
        WebElement option = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath(xpath))
        );
        option.click();
    }

    @Então("só vejo estações cujo estado é {string}")
    public void sóVejoEstado(String estado) {
        //FIXME: Não estamos a testar coisa alguma aqui!
        // Não temos como ver o real estado das estações...

        System.out.println("AVISO: «sóVejoEstado» é um teste falso!");

        // Wait for the filter result to update: locate the filter count text or markers if possible
        WebElement counterText = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[contains(text(),'Mostrando')]"
                        )
                )
        );

        String text = counterText.getText(); // Example: "Mostrando 5 de 10 estações"
        System.out.println("Texto do contador: " + text);

        // Basic assertion that filter count text is visible and well-formed
        assertTrue(text.matches("Mostrando \\d+ de \\d+ estações"));

        // OPTIONAL: if you can get station status texts from page, assert all are "Ativa"
        // Since stations are markers on the map, you may need additional UI info to assert more
    }

    @Quando("seleciono o conector {string}")
    public void selecionarConector(String conector) {
        // Locate label by text containing the conector name, then click it to toggle checkbox
        String labelXpath = String.format("//label[contains(., '%s')]", conector);

        WebElement label = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath(labelXpath)
        ));

        if (!label.isSelected()) {
            label.click();
        }
    }

    @Quando("desseleciono o conector {string}")
    public void desselecionarConector(String conector) {
        // Locate label by text containing the conector name, then click it to toggle checkbox
        String labelXpath = String.format("//label[contains(., '%s')]", conector);

        WebElement label = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath(labelXpath)
        ));

        if (label.isSelected()) {
            label.click();
        }
    }

    @Então("só vejo estações com conector {string}")
    public void sóVejoConector(String conectorEsperado) {
        System.out.println("AVISO: «sóVejoConector» é um teste falso!");

        // Wait for the filter info text to update
        WebElement counterText = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Mostrando')]"))
        );

        String text = counterText.getText();
        System.out.println("Texto do contador: " + text);

        // Assert filter count text format
        assertTrue(text.matches("Mostrando \\d+ de \\d+ estações"));

        // Optionally, verify stations displayed all have the expected connector.
        // Since stations are markers on a map and not listed as text, this is tricky.
        // You could check logs or a debug panel if available or extend the app for testability.
    }

    @Então("a opção Todos está selecionada")
    public void opçãoTodosConectoresEstáSelecionada() {
        String labelXpath = String.format("//label[contains(., '%s')]", "Todos");

        WebElement label = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath(labelXpath)
        ));

        assertTrue(label.isSelected());
    }


    @Quando("seleciono a opção Todos")
    public void selecionoAOpçãoTodos() {
        // Locate label by text containing the conector name, then click it to toggle checkbox
        String labelXpath = "//label[contains(., 'Todos')]";

        WebElement label = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath(labelXpath)
        ));

        if (!label.isSelected()) {
            label.click();
        }
    }

    @Então("nenhum conector está selecionado")
    public void nenhumConectorEstáSelecionado() {
        // "Todos" should be selected, all others unchecked

        // Verify Todos is selected
        assertTrue(isConnectorChecked("Todos"), "O conector 'Todos' deveria estar selecionado");

        // List all other connectors (except 'Todos') from your React code:
        String[] otherConnectors = {"CCS", "TIPO2", "CHADEMO", "TIPO1"};

        for (String conector : otherConnectors) {
            assertFalse(isConnectorChecked(conector), "O conector '" + conector + "' não deveria estar selecionado");
        }
    }
}
