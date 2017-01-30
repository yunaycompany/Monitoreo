/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.model;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @author Yosbel
 */
public class Conexion {

    Connection con;
    private Statement stm;

    public Conexion(String host, String port, String user, String password, String bd) throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        String url = "jdbc:postgresql://" + host + ":" + port + "/" + bd;
        con = DriverManager.getConnection(url, user, password);
    }

    public Conexion(String host, String port, String user, String password) throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        String url = "jdbc:postgresql://" + host + ":" + port + "/" + "postgres";
        con = DriverManager.getConnection(url, user, password);
    }

    public boolean testConexion() {
        if (con != null) {
            return true;
        } else {
            return false;
        }
    }

    public ResultSet query(String sql) throws SQLException {
        CallableStatement query = con.prepareCall(sql);
        ResultSet res = query.executeQuery();
        if (!res.next()) {
            return null;
        }
        return res;
    }

    public void query2(String sql) throws SQLException {
        stm = con.createStatement();
        stm.execute(sql);

    }

    public void closeConexion() throws SQLException {
        con.close();

    }

}
