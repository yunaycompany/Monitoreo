/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
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
public class MonitoreoController {

    ServidorJpaController servidores = new ServidorJpaController(null);

    @RequestMapping(value = "pg_stat_database.htm", method = RequestMethod.POST)
    public void pg_stat_database(HttpServletRequest req, HttpServletResponse res) throws IOException {
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
            while (resultado.next()) {
                Map map = new HashMap();
                map.put("datname", resultado.getString("datname"));
                map.put("xact_commit", resultado.getString("xact_commit"));
                map.put("xact_rollback", resultado.getString("xact_rollback"));
                map.put("blks_read", resultado.getString("blks_read"));
                map.put("blks_hit", resultado.getString("blks_hit"));
                map.put("tup_returned", resultado.getString("tup_returned"));
                map.put("tup_fetched", resultado.getString("tup_fetched"));
                map.put("tup_inserted", resultado.getString("tup_inserted"));
                map.put("tup_updated", resultado.getString("tup_updated"));
                map.put("tup_deleted", resultado.getString("tup_deleted"));
                map.put("conflicts", resultado.getString("conflicts"));
                map.put("temp_files", resultado.getString("temp_files"));
                map.put("deadlocks", resultado.getString("deadlocks"));
                map.put("stats_reset", resultado.getString("stats_reset"));
                datosJson.add(map);
            }
            Map map = new HashMap();
            map.put("items", datosJson);
            map.put("success", "true");
            con.closeConexion();
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        } catch (ClassNotFoundException | SQLException ex) {
            Map map = new HashMap();
            map.put("success", "false");
            map.put("msg", "No se pudo establecer la conexi&oacute;n con el servidor");
            Gson jsonObj = new Gson();
            PrintWriter out = res.getWriter();
            out.printf(jsonObj.toJson(map));
        }

    }

    @RequestMapping(value = "exportarPDF.htm", method = RequestMethod.POST)
    public void exportarPDF(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String data = request.getParameterValues("data")[0];

        String nombreFichero = "Datos" + new Date().toString().replace(" ", "").replace(":", "") + ".pdf";
        String ubicacionArchivo = request.getServletContext().getRealPath("/") + nombreFichero;
        Map map = new HashMap();
        Gson jsonObj = new Gson();
        PrintWriter out = response.getWriter();

        try {
            pdf_pg_stat_database(ubicacionArchivo, data);
            map.put("success", "true");
            map.put("msg", "El fichero se ha exportado correctamente en la carpeta build");
            map.put("src", nombreFichero);
            out.printf(jsonObj.toJson(map));

        } catch (FileNotFoundException | DocumentException ex) {
            map.put("success", "false");
            map.put("msg", ex.getMessage());
            out.printf(jsonObj.toJson(map));
        }

    }

    private void pdf_pg_stat_database(String ubicacionArchivo, String data) throws FileNotFoundException, DocumentException {

        FileOutputStream archivo;
        archivo = new FileOutputStream(ubicacionArchivo);
        Document documento = new Document();
       documento.setPageSize(PageSize.A2);
        PdfWriter.getInstance((com.itextpdf.text.Document) documento, archivo);
        documento.open();
        int cantColumnas = 14;
        PdfPTable table = new PdfPTable(cantColumnas);
        PdfPCell celdaInicial = new PdfPCell(new Paragraph("Estadísticas de las bases de datos."));
        celdaInicial.setColspan(cantColumnas);
        table.addCell(celdaInicial);

//        PdfPCell celdaComp = new PdfPCell(new Paragraph("Comptencia: " + competencia.getNombre()));
//        celdaComp.setColspan(cantColumnas);
//        table.addCell(celdaComp);
//
//        PdfPCell celdaCateg = new PdfPCell(new Paragraph("Categoría: " + categoria.getCategoria()));
//        celdaCateg.setColspan(cantColumnas);
//        table.addCell(celdaCateg);
        table.addCell(new Paragraph("A"));
        table.addCell(new Paragraph("B"));
        table.addCell(new Paragraph("C"));
        table.addCell(new Paragraph("D"));
        table.addCell(new Paragraph("E"));
        table.addCell(new Paragraph("F"));
        table.addCell(new Paragraph("G"));
        table.addCell(new Paragraph("H"));
        table.addCell(new Paragraph("I"));
        table.addCell(new Paragraph("J"));
        table.addCell(new Paragraph("K"));
        table.addCell(new Paragraph("L"));
        table.addCell(new Paragraph("M"));
        table.addCell(new Paragraph("N"));

        JsonParser parser = new JsonParser();
        JsonArray array = (JsonArray) parser.parse(data);
        for (int i = 0; i < array.size(); i++) {
            JsonObject objeto = (JsonObject) array.get(i);
                       
            PdfPCell celda = new PdfPCell(new Paragraph(objeto.get("datname").getAsString()));
            
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("xact_commit").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("xact_rollback").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("blks_read").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("blks_hit").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("tup_returned").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("tup_fetched").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("tup_inserted").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("tup_updated").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("tup_deleted").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("conflicts").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("temp_files").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("deadlocks").getAsString()));
            table.addCell(celda);
            celda = new PdfPCell(new Paragraph(objeto.get("stats_reset").getAsString()));
            table.addCell(celda);

        }

        PdfPCell celda = new PdfPCell(new Paragraph("A: Bases de Datos"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("B: Commits"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("C: Revertidas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("D: Discos de Lectura"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("E: Discos de Caché"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("F: Filas Devueltas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("G: Filas Captadas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("H: Filas Insertadas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("I: Filas Actualizadas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("J: Filas Eliminadas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("K: Canceladas por Conflicto"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("L: Archivos Temporales"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("M:  Puntos Muertos"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);
        celda = new PdfPCell(new Paragraph("N: Fecha de Estadísticas"));
        celda.setColspan(cantColumnas);
        table.addCell(celda);

        PdfPCell celdaFinal = new PdfPCell(new Paragraph("Fecha: " + new Date().toString()));
        // Indicamos cuantas columnas ocupa la celda
        celdaFinal.setColspan(cantColumnas);
        table.addCell(celdaFinal);

        documento.add(table);
        documento.close();

    }

}
