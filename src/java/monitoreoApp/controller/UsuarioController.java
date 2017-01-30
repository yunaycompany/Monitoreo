/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import monitoreoApp.entity.Usuario;
import monitoreoApp.model.UsuarioJpaController;
import monitoreoApp.model.exceptions.NonexistentEntityException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Yosbel
 */
@Controller
public class UsuarioController {

    UsuarioJpaController usuarios = new UsuarioJpaController(null);

    @RequestMapping(value = "findAllUsuario.htm", method = RequestMethod.POST)
    public void listarUsuario(HttpServletRequest req, HttpServletResponse res) throws IOException {
        List<Usuario> listaUsuarios = this.usuarios.findUsuarioEntities();
        List<Map> usuariosJson = new LinkedList<>();

        for (Usuario usuario : listaUsuarios) {
            Map map = new HashMap();
            map.put("nombre", usuario.getNombre());          
            map.put("rol", usuario.getRol());          
            map.put("username", usuario.getUsser());
            map.put("password", usuario.getPass());
            usuariosJson.add(map);
        }
        Map map = new HashMap();
        map.put("items", usuariosJson);
        map.put("success", "true");

        Gson jsonObj = new Gson();
        PrintWriter out = res.getWriter();

        out.printf(jsonObj.toJson(map));
    }

    @RequestMapping(value = "addUsuario.htm", method = RequestMethod.POST)
    public void addUsuario(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String nombre = obj.get("nombre").getAsString();
            String rol = obj.get("rol").getAsString();

            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            Usuario usuario = new Usuario(user, password, nombre, rol);
            usuario.setEnabled(Boolean.TRUE);
            if (!this.usuarios.existUsuario(usuario)) {
                this.usuarios.create(usuario);
                map.put("success", "true");
                map.put("msg", "Usuario adicionado satisfactoriamente");
                out.printf(jsonObj.toJson(map));
            } else {
                throw new Exception();
            }

        } catch (Exception e) {
            Map map = new HashMap();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            map.put("error", e.getMessage());
            map.put("success", false);
            map.put("msg", "Ya existe el servidor");
            out.printf(jsonObj.toJson(map));
        }
    }

    @RequestMapping(value = "removeUsuario.htm", method = RequestMethod.POST)
    public void removeUsuario(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            String username = req.getParameterValues("username")[0];
            this.usuarios.destroy(username);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "true");
            map.put("msg", "Usuario eliminado satisfactoriamente");
            out.printf(jsonObj.toJson(map));
        } catch (NonexistentEntityException ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo eliminar el usuario");
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "updateUsuario.htm", method = RequestMethod.POST)
    public void updateUsuario(HttpServletRequest req, HttpServletResponse res) throws IOException {

        try {
            String dato = req.getParameterValues("params")[0];
            JsonParser parser = new JsonParser();
            JsonObject obj = (JsonObject) parser.parse(dato);
            String user = obj.get("username").getAsString();
            String password = obj.get("password").getAsString();
            String nombre = obj.get("nombre").getAsString();
            String rol = obj.get("rol").getAsString();
            Usuario usuario = this.usuarios.findUsuario(user);
            usuario.setNombre(nombre);
            usuario.setRol(rol);
            usuario.setPass(password);
            this.usuarios.edit(usuario);
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "true");
            map.put("msg", "Usuario actualizado satisfactoriamente");
            out.printf(jsonObj.toJson(map));

        } catch (Exception ex) {
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo actualizar el usuario");
            out.printf(jsonObj.toJson(map));
        }

    }

}
