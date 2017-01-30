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
import java.sql.ResultSet;
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
import monitoreoApp.model.TareaJpaController;

import monitoreoApp.model.exceptions.NonexistentEntityException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Yosbel
 */
@Controller
public class TareaController {

    TareaJpaController tareas = new TareaJpaController(null);
    ServidorJpaController servidores = new ServidorJpaController(null);

    @RequestMapping(value = "listarBD.htm", method = RequestMethod.POST)
    public void listarBaseDato(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int idServidor = Integer.parseInt(req.getParameterValues("idServer")[0]);
        Servidor server = this.servidores.findServidor(idServidor);
        String host = server.getHost();
        String port = server.getPuerto().toString();
        String user = server.getUsser();
        String pass = server.getPassw();
        List<Map> bds = new LinkedList<>();
        try {
            Conexion con = new Conexion(host, port, user, pass);
            ResultSet resul = con.query("select datname from pg_database where datallowconn=true");
            while (resul.next()) {
                String r = resul.getString("datname");
                Map map = new HashMap();
                map.put("id", r);
                map.put("bd", r);
                bds.add(map);
            }
            con.closeConexion();
            Map map = new HashMap();
            map.put("items", bds);
            map.put("success", "true");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        } catch (ClassNotFoundException | SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo listar las bases de datos");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        }
    }

    @RequestMapping(value = "findAllTask1.htm", method = RequestMethod.POST)
    public void listarTareas(HttpServletRequest req, HttpServletResponse res) throws IOException {
        List<Tarea> listaTareas = this.tareas.findTareaEntities();
        List<Map> tareasJson = new LinkedList<>();

        for (Tarea tarea : listaTareas) {
            Map map = new HashMap();
            map.put("id", tarea.getId());
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

    @RequestMapping(value = "addTask.htm", method = RequestMethod.POST)
    public void addTask(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            int idServer = Integer.parseInt(obj.get("idServer").getAsString());
            String bd = obj.get("bd").getAsString();
            String consulta = obj.get("consulta").getAsString();
            int repeticiones = Integer.parseInt(obj.get("repeticiones").getAsString());
            String fecha = obj.get("fecha").getAsString();
            String estado = obj.get("estado").getAsString();
            Servidor servidor = this.servidores.findServidor(idServer);
            String host = servidor.getHost();
            String port = servidor.getPuerto().toString();
            String user = servidor.getUsser();
            String pass = servidor.getPassw();

//            Conexion con = new Conexion(host, port, user, pass, bd);

            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
//            if (con.query(consulta) != null) {
                Tarea t = new Tarea(consulta, repeticiones, bd, fecha, estado);
                this.tareas.create(t);
                servidor.addTareas(t);
                this.servidores.edit(servidor);
                t.setIdServidor(servidor);
                map.put("success", "true");
                map.put("msg", "Operaci&oacute;n realizada satisfactoriamente");
                out.printf(jsonObj.toJson(map));
//            } else {
//                map.put("success", "false");
//                map.put("msg", "La consulta es inv&aacute;lida");
//                out.printf(jsonObj.toJson(map));
//            }
//            con.closeConexion();

        } catch (JsonSyntaxException | IOException | NumberFormatException e) {
            Map map = new HashMap();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            map.put("error", e.getMessage());
            map.put("success", false);
            map.put("msg", "Ya existe la tarea");
            out.printf(jsonObj.toJson(map));
        } catch (Exception ex) {
            Logger.getLogger(TareaController.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @RequestMapping(value = "updateTask.htm", method = RequestMethod.POST)
    public void updateTask(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            int idServer = Integer.parseInt(obj.get("idServer").getAsString());
            String bd = obj.get("bd").getAsString();
            String consulta = obj.get("consulta").getAsString();
            int repeticiones = Integer.parseInt(obj.get("repeticiones").getAsString());
            String fecha = obj.get("fecha").getAsString();
            String estado = obj.get("estado").getAsString();
            int idTask = Integer.parseInt(obj.get("idTask").getAsString());
            Servidor servidor = this.servidores.findServidor(idServer);
//            String host = servidor.getHost();
//            String port = servidor.getPuerto().toString();
//            String user = servidor.getUsser();
//            String pass = servidor.getPassw();
//
//            Conexion con = new Conexion(host, port, user, pass, bd);
//            if (con.query(consulta) != null) {
                Tarea t = this.tareas.findTarea(idTask);
                t.setDbase(bd);
                t.setEstado(estado);
                t.setFecha(fecha);
                t.setRepetiones(repeticiones);
                t.setSql(consulta);
                servidor.modificarTarea(t);
                this.tareas.edit(t);
                this.servidores.edit(servidor);
                Gson jsonObj = new Gson();
                PrintWriter out = res.getWriter();
                Map map = new HashMap();
                map.put("success", "true");
                map.put("msg", "Tarea actualizada satisfactoriamente");
                out.printf(jsonObj.toJson(map));
//            } else {
//                Map map = new HashMap();
//                map.put("success", "false");
//                map.put("msg", "No se actualizó la tarea porque la consulta no es v&aacute;");
//                Gson jsonObj = new Gson();
//                PrintWriter out = res.getWriter();
//                out.printf(jsonObj.toJson(map));
//            }
//            con.closeConexion();

        } catch (Exception ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo actualizar la tarea");
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "removeTask.htm", method = RequestMethod.POST)
    public void removeTask(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            int idServer = Integer.parseInt(obj.get("idServer").getAsString());
            int idTask = Integer.parseInt(obj.get("idTask").getAsString());
            Servidor server = this.servidores.findServidor(idServer);
            Tarea t = this.tareas.findTarea(idTask);
            server.getTareaList().remove(t);
            this.tareas.destroy(idTask);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "true");
            map.put("msg", "Tarea eliminada satisfactoriamente");
            out.printf(jsonObj.toJson(map));
        } catch (NonexistentEntityException ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo eliminar la tarea");
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "ejecutarTask.htm", method = RequestMethod.POST)
    public void ejecutarTask(HttpServletRequest req, HttpServletResponse res) throws IOException, Exception {
        try {
            String dato = req.getParameterValues("params")[0];
            int idServer = Integer.parseInt(dato);
            Servidor server = this.servidores.findServidor(idServer);
            List<Tarea> tareas = server.getTareaList();
//            while (true) {
            for (int i = 0; i < tareas.size(); i++) {
                String estado = tareas.get(i).getEstado();
                if (estado.equals("Espera")) {
                    tareas.get(i).ejecutarTarea();
                    if (!tareas.get(i).getEstado().equals(estado)) {
                        this.tareas.edit(tareas.get(i));
                    }
                }
            }
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "true");
            map.put("msg", "Se ejecutaron las tareas correctamente");
            out.printf(jsonObj.toJson(map));
//                Thread.sleep(60000L);
//            }

        } catch (InterruptedException ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo ejecutar las tareas del servidor seleccionado");
            out.printf(jsonObj.toJson(map));
        }

    }

}
