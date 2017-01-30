/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.controller;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import monitoreoApp.entity.Servidor;
import monitoreoApp.model.Conexion;
import monitoreoApp.model.ServidorJpaController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Yosbel
 */
@Controller
public class GraficasController {

    ServidorJpaController servidores = new ServidorJpaController(null);

    @RequestMapping(value = "grafica1.htm", method = RequestMethod.POST)
    public void grafica1(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            int idServidor = Integer.parseInt(req.getParameterValues("idServer")[0]);
            Servidor server = this.servidores.findServidor(idServidor);

            String user = server.getUsser();
            String password = server.getPassw();
            String host = server.getHost();
            String port = server.getPuerto() + "";

            Conexion con = new Conexion(host, port, user, password);
            String consulta = "SELECT * from pg_stat_database;";
            ResultSet resultado = con.query(consulta);
            List<Map> datosJson = new LinkedList<>();
            double inser = 0, updat = 0, delet = 0;
            while (resultado.next()) {
//                inser += Double.parseDouble(resultado.getString("tup_inserted"));
//                updat += Double.parseDouble(resultado.getString("tup_updated"));
//                delet += Double.parseDouble(resultado.getString("tup_deleted"));
                Map map = new HashMap();
                map.put("datname", resultado.getString("datname"));              
                map.put("tup_inserted", resultado.getString("tup_inserted"));
                map.put("tup_updated", resultado.getString("tup_updated"));
                map.put("tup_deleted", resultado.getString("tup_deleted"));               
                datosJson.add(map);
            }
           
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(datosJson));
        } catch (ClassNotFoundException | SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo establecer la conexi&oacute;n con el servidor");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        }

    }

}
