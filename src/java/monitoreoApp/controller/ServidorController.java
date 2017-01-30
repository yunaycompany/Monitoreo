/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import monitoreoApp.entity.Servidor;
import monitoreoApp.entity.Tarea;
import monitoreoApp.model.Conexion;
import monitoreoApp.model.ServidorJpaController;
import monitoreoApp.model.exceptions.NonexistentEntityException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Yosbel
 */
@Controller
public class ServidorController {

    ServidorJpaController servidores = new ServidorJpaController(null);

    @RequestMapping(value = "findAllServer.htm", method = RequestMethod.POST)
    public void listarServer(HttpServletRequest req, HttpServletResponse res) throws IOException {
        List<Servidor> listaServidores = this.servidores.findServidorEntities();
        List<Map> servidoresJson = new LinkedList<>();

        for (Servidor server : listaServidores) {
            Map map = new HashMap();
            map.put("id", server.getId());
            map.put("host", server.getHost());
            map.put("username", server.getUsser());
            map.put("port", server.getPuerto());
            map.put("password", server.getPassw());
            map.put("leaf", true);
            map.put("text", server.getHost());
            servidoresJson.add(map);
        }
        Map map = new HashMap();
        map.put("items", servidoresJson);
        map.put("success", "true");

        Gson jsonObj = new Gson();
        PrintWriter out = res.getWriter();

        out.printf(jsonObj.toJson(map));
    }

    @RequestMapping(value = "findAllServerTree.htm", method = RequestMethod.POST)
    public void listarServerTree(HttpServletRequest req, HttpServletResponse res) throws IOException {
        List<Servidor> listaServidores = this.servidores.findServidorEntities();
        List<Map> servidoresJson = new LinkedList<>();

        for (Servidor server : listaServidores) {
            Map map = new HashMap();
            map.put("idS", server.getId());
            map.put("host", server.getHost());
            map.put("username", server.getUsser());
            map.put("port", server.getPuerto());
            map.put("password", server.getPassw());
            map.put("leaf", true);
            map.put("text", server.getHost());
            servidoresJson.add(map);
        }
        Gson jsonObj = new Gson();
        PrintWriter out = res.getWriter();

        out.printf(jsonObj.toJson(servidoresJson));
    }

    @RequestMapping(value = "findAllTaskbyServer.htm", method = RequestMethod.POST)
    public void findAllTaskbyServer(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int idServidor = Integer.parseInt(req.getParameterValues("idServer")[0]);
        Servidor server = this.servidores.findServidor(idServidor);
        List<Map> tareasJson = new LinkedList<>();
        List<Tarea> listaTareas = server.getTareaList();

        for (Tarea tarea : listaTareas) {
            Map map = new HashMap();
            map.put("id", tarea.getId());
            map.put("idS", idServidor);
            map.put("bd", tarea.getDbase());
            map.put("consulta", tarea.getSql());
            map.put("repeticiones", tarea.getRepetiones());
            map.put("fecha", tarea.getFecha());
            map.put("estado", tarea.getEstado());
            tareasJson.add(map);
        }
        Map map = new HashMap();
        map.put("items", tareasJson);
        map.put("success", "true");
        Gson jsonObj = new Gson();
        PrintWriter out = res.getWriter();

        out.printf(jsonObj.toJson(map));
    }

    @RequestMapping(value = "testConexion.htm", method = RequestMethod.POST)
    public void testConexion(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String host = obj.get("host").getAsString();
            String port = obj.get("port").getAsString();
            Map map = new HashMap();
            Conexion con = new Conexion(host, port, user, password);
            if (con.testConexion()) {
                map.put("success", "true");
            } else {
                map.put("success", "false");
            }
            con.closeConexion();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ServidorController.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "addServer.htm", method = RequestMethod.POST)
    public void addServer(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String host = obj.get("host").getAsString();
            String port = obj.get("port").getAsString();

            Conexion con = new Conexion(host, port, user, password);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            if (con.testConexion()) {
                Servidor server = new Servidor(host, Integer.parseInt(port), user, password);
                if (!this.servidores.existServidor(server)) {
                    this.servidores.create(server);
                    map.put("success", "true");
                    map.put("msg", "Servidor adicionado satisfactoriamente");
                    out.printf(jsonObj.toJson(map));
                } else {
                    throw new IOException();
                }

            } else {
                map.put("success", "false");
                map.put("msg", "No se pudo establecer la conexi&oacute;n con el servidor");
                out.printf(jsonObj.toJson(map));
            }
            con.closeConexion();

        } catch (ClassNotFoundException | SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo establecer la conexión con el servidor");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        } catch (JsonSyntaxException | IOException | NumberFormatException e) {
            Map map = new HashMap();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            map.put("error", e.getMessage());
            map.put("success", false);
            map.put("msg", "Ya existe el servidor");
            out.printf(jsonObj.toJson(map));
        }
    }

    @RequestMapping(value = "getServerInformation.htm", method = RequestMethod.POST)
    public void getServerInformation(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String host = obj.get("host").getAsString();
            String port = obj.get("port").getAsString();

            Conexion con = new Conexion(host, port, user, password);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            if (con.testConexion()) {
                Servidor server = new Servidor(host, Integer.parseInt(port), user, password);
                this.servidores.create(server);
                map.put("success", "true");
                map.put("msg", "Servidor insertado satisfactoriamente");
                out.printf(jsonObj.toJson(map));
            } else {
                map.put("success", "false");
                map.put("msg", "No se pudo establecer la conexi&oacute;n con el servidor que desea adicionar");
                out.printf(jsonObj.toJson(map));
            }
            con.closeConexion();
        } catch (ClassNotFoundException | SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo establecer la conexión con el servidor que desea adicionar");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        } catch (JsonSyntaxException | IOException | NumberFormatException e) {
            Map map = new HashMap();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            map.put("error", e.getMessage());
            map.put("success", false);
            map.put("msg", "Ya existe el servidor que desea adicionar");
            out.printf(jsonObj.toJson(map));
        }
    }

    @RequestMapping(value = "removeServer.htm", method = RequestMethod.POST)
    public void removeServer(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            int id = Integer.parseInt(req.getParameterValues("id")[0].toString());
            this.servidores.destroy(id);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "true");
            map.put("msg", "Servidor eliminado satisfactoriamente");
            out.printf(jsonObj.toJson(map));
        } catch (NonexistentEntityException ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo eliminar el servidor");
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "updateServer.htm", method = RequestMethod.POST)
    public void updateServer(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String host = obj.get("host").getAsString();
            String port = obj.get("port").getAsString();
            int id = Integer.parseInt(obj.get("id").getAsString());
            Servidor servidor = this.servidores.findServidor(id);

            Conexion con = new Conexion(host, port, user, password);
            if (con.testConexion()) {
                this.servidores.edit(servidor);
                Gson jsonObj = new Gson();
                PrintWriter out = res.getWriter();
                Map map = new HashMap();
                map.put("success", "true");
                map.put("msg", "Servidor actualizado satisfactoriamente");
                out.printf(jsonObj.toJson(map));
            } else {
                Map map = new HashMap();
                map.put("success", "false");
                map.put("msg", "No se actualizó el servidor porque no se pudo establecer la conexión con el servidor");
                Gson jsonObj = new Gson();
                PrintWriter out = res.getWriter();
                out.printf(jsonObj.toJson(map));
            }

        } catch (Exception ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo actualizar el servidor");
            out.printf(jsonObj.toJson(map));
        }

    }

}
