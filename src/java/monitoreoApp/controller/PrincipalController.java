/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package monitoreoApp.controller;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Yosbel
 */
@Controller
public class PrincipalController {
    
    @RequestMapping(value = "login.htm", method = RequestMethod.GET)
    public String login(HttpServletRequest req, HttpServletResponse res) throws IOException {
        return "login";
    }

    @RequestMapping(value = "principal.htm", method = RequestMethod.GET)
    public String principal(HttpServletRequest req, HttpServletResponse res) throws IOException {
        return "principal";
    }

    @RequestMapping(value = "administracion.htm", method = RequestMethod.GET)
    public String administracion(HttpServletRequest req, HttpServletResponse res) throws IOException {
        return "administracion";
    }

    @RequestMapping(value = "index.htm", method = RequestMethod.GET)
    public String index(HttpServletRequest req, HttpServletResponse res) throws IOException {
        return "index";
    }
    
}
