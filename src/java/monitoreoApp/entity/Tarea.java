/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.entity;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import monitoreoApp.model.Conexion;

/**
 *
 * @author Yosbel
 */
@Entity
@Table(name = "tarea")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Tarea.findAll", query = "SELECT t FROM Tarea t"),
    @NamedQuery(name = "Tarea.findById", query = "SELECT t FROM Tarea t WHERE t.id = :id"),
    @NamedQuery(name = "Tarea.findBySql", query = "SELECT t FROM Tarea t WHERE t.sql = :sql"),
    @NamedQuery(name = "Tarea.findByRepetiones", query = "SELECT t FROM Tarea t WHERE t.repetiones = :repetiones"),
    @NamedQuery(name = "Tarea.findByDbase", query = "SELECT t FROM Tarea t WHERE t.dbase = :dbase"),
    @NamedQuery(name = "Tarea.findByFecha", query = "SELECT t FROM Tarea t WHERE t.fecha = :fecha"),
    @NamedQuery(name = "Tarea.findByEstado", query = "SELECT t FROM Tarea t WHERE t.estado = :estado")})
public class Tarea implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "sql")
    private String sql;
    @Basic(optional = false)
    @Column(name = "repetiones")
    private int repetiones;
    @Basic(optional = false)
    @Column(name = "dbase")
    private String dbase;
    @Basic(optional = false)
    @Column(name = "fecha")
    private String fecha;
    @Basic(optional = false)
    @Column(name = "estado")
    private String estado;
    @JoinColumn(name = "id_servidor", referencedColumnName = "id")
    @ManyToOne
    private Servidor idServidor;

    public Tarea() {
    }

    public Tarea(Integer id) {
        this.id = id;
    }

    public Tarea(String sql, int repetiones, String dbase, String fecha, String estado) {
        this.sql = sql;
        this.repetiones = repetiones;
        this.dbase = dbase;
        this.fecha = fecha;
        this.estado = estado;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public int getRepetiones() {
        return repetiones;
    }

    public void setRepetiones(int repetiones) {
        this.repetiones = repetiones;
    }

    public String getDbase() {
        return dbase;
    }

    public void setDbase(String dbase) {
        this.dbase = dbase;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Servidor getIdServidor() {
        return idServidor;
    }

    public void setIdServidor(Servidor idServidor) {
        this.idServidor = idServidor;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Tarea)) {
            return false;
        }
        Tarea other = (Tarea) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "monitoreoApp.model.Tarea[ id=" + id + " ]";
    }

    public void ejecutarTarea() {
        if (esMomento()) {
            actualizarEstado(ejecutarSql(this.sql));
        } else {

        }
    }

    private boolean esMomento() {
        Date f = new Date();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String datos = df.format(f);

        String[] datosFecha = datos.split("-");
        int dia = Integer.parseInt(datosFecha[2]);
        int mes = Integer.parseInt(datosFecha[1]);
        int anno = Integer.parseInt(datosFecha[0]);

        String[] planificada = this.fecha.split("T")[0].split("-");

        int mesPla = Integer.parseInt(planificada[1]);
        int diaPla = Integer.parseInt(planificada[2]);
        int annoPla = Integer.parseInt(planificada[0]);

        if (anno > annoPla) {
            return true;
        }
        if (anno == annoPla) {
            if (mes > mesPla) {
                return true;
            }
            if ((mes == mesPla) && ((dia >= diaPla) || (dia == diaPla))) {
                return true;
            }

        }

        return false;
    }

    private void actualizarEstado(String estado) {
        this.setEstado(estado);
    }

    private String ejecutarSql(String sql) {
        String host = this.idServidor.getHost();
        String port = this.idServidor.getPuerto().toString();
        String user = this.idServidor.getUsser();
        String pass = this.idServidor.getPassw();
        String bd = this.dbase;
        try {
            Conexion con = new Conexion(host, port, user, pass, bd);

            for (int i = 0; i < this.repetiones; i++) {
                con.query2(sql);
            }
            con.closeConexion();
            return "Aplicada";
        } catch (SQLException | ClassNotFoundException ex) {
            return ex.getMessage();
        }

    }

}
