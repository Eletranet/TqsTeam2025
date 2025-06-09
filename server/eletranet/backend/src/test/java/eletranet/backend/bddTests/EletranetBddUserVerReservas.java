package eletranet.backend.bddTests;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
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
import static org.junit.Assert.assertTrue;
import static org.slf4j.LoggerFactory.getLogger;

public class EletranetBddUserVerReservas{

    static final Logger log = getLogger(lookup().lookupClass());
    ChromeDriver driver = new ChromeDriver();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    @After
    public void ShutDownB(){
        if(driver != null){
            driver.close();
        }
    }

    @Given("I am on the bookstore homepage")
    public void iAmOnTheBookstoreHomepage() {
        driver.get("http://localhost:5173/loguin");
    }

    @Given("o utilizador abre a página de login")
    public void oUtilizadorAbreAPáginaDeLogin() {
        driver.get("http://localhost:5173/loguin");
    }

    @When("o utilizador insere o nome de utilizador {string}")
    public void oUtilizadorInsereONomeDeUtilizador(String username) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.clear();
        usernameInput.sendKeys(username);
    }

    @And("o utilizador insere a palavra-passe {string}")
    public void oUtilizadorInsereAPalavraPasse(String password) {
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    @And("o utilizador clica no botão de login")
    public void oUtilizadorClicaNoBotãoDeLogin() {
        WebElement loginBtn = driver.findElement(By.id("loginbtn"));
        loginBtn.click();
    }

    @And("o utilizador deve ser redirecionado para a homepage")
    public void oUtilizadorDeveSerRedirecionadoParaAHomepage() {
        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/"));
    }


    @And("o utilizador clica no botão de minhas reservas")
    public void oUtilizadorClicaNoBotãoDeMinhasReservas() {
        WebElement minhasreservasbtn = driver.findElement(By.id("minhasreservasbtn"));
        minhasreservasbtn.click();
    }

    @And("o utilizador deve ser redirecionado para a a pagina de suas reservas")
    public void oUtilizadorDeveSerRedirecionadoParaAAPaginaDeSuasReservas() {
        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/minhas_reservas"));

    }
    @Then("deve ver o texto {string} na página")
    public void deveVerOTextoNaPágina(String texto) {
        boolean presente = driver.findElements(By.xpath("//*[text()='" + texto + "']")).size() > 0;
        assertTrue( presente);
    }



}

