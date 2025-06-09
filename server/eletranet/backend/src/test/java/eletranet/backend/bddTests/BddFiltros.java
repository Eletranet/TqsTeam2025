package eletranet.backend.bddTests;
import io.cucumber.java.After;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;

import java.time.Duration;

import static java.lang.invoke.MethodHandles.lookup;
import static org.assertj.core.api.Assertions.assertThat;
import static org.slf4j.LoggerFactory.getLogger;

public class BddFiltros {

    static final Logger log = getLogger(lookup().lookupClass());
    ChromeDriver driver = new ChromeDriver();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    @Given("que estou autenticado")
    public void queEstouAutenticado() {
        driver.get("http://localhost:5173/loguin");
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.clear();
        usernameInput.sendKeys("dovas123dovas");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys("123456");
        WebElement loginBtn = driver.findElement(By.id("loginbtn"));
        loginBtn.click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/"));
    }

    @When("filtro por tipo CCS e TIPO2")
    public void filtroPorTipoCCS() {
        driver.findElement(By.name("CCS")).click();
        driver.findElement(By.name("TIPO2")).click();
    }


    @After
    public void ShutDownB(){
        if(driver != null){
            driver.close();
        }
    }

    @Then("deve ver o texto Mostrando {int} de {int} estações na página")
    public void deveVerOTextoMostrandoDeEstaçõesNaPágina(int arg0, int arg1) {
        String text=driver.findElement(By.id("disponiveisafterfilter")).getText();
        assertThat(text).isEqualTo("Mostrando 12 de 20 estações");

    }


}
