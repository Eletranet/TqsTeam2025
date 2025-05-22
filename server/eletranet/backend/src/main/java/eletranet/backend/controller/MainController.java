package eletranet.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path="/api")
public class MainController {

    @GetMapping("/alldata")
    public ResponseEntity<String> getAllData() {
        return ResponseEntity.ok("All data");
    }

}
