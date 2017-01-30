/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.entity;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Yosbel
 */
@Entity
@Table(name = "servidor")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Servidor.findAll", query = "SELECT s FROM Servidor s"),
    @NamedQuery(name = "Servidor.findById", query = "SELECT s FROM Servidor s WHERE s.id = :id"),
    @NamedQuery(name = "Servidor.findByHost", query = "SELECT s FROM Servidor s WHERE s.host = :host"),
    @NamedQuery(name = "Servidor.findByPuerto", query = "SELECT s FROM Servidor s WHERE s.puerto = :puerto"),
    @NamedQuery(name = "Servidor.findByUsser", query = "SELECT s FROM Servidor s WHERE s.usser = :usser"),
    @NamedQuery(name = "Servidor.findByPassw", query = "SELECT s FROM Servidor s WHERE s.passw = :passw")})
public class Servidor implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "host")
    private String host;
    @Column(name = "puerto")
    private Integer puerto;
    @Column(name = "usser")
    private String usser;
    @Column(name = "passw")
    private String passw;
    @OneToMany(mappedBy = "idServidor")
    private List<Tarea> tareaList;

    public Servidor() {
    }

    public Servidor(String host, Integer puerto, String usser, String passw) {
        this.host = host;
        this.puerto = puerto;
        this.usser = usser;
        this.passw = passw;
        this.tareaList = new LinkedList<>();
    }

    public Servidor(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPuerto() {
        return puerto;
    }

    public void setPuerto(Integer puerto) {
        this.puerto = puerto;
    }

    public String getUsser() {
        return usser;
    }

    public void setUsser(String usser) {
        this.usser = usser;
    }

    public String getPassw() {
        return passw;
    }

    public void setPassw(String passw) {
        this.passw = passw;
    }

    @XmlTransient
    public List<Tarea> getTareaList() {
        return tareaList;
    }

    public void setTareaList(List<Tarea> tareaList) {
        this.tareaList = tareaList;
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
        if (!(object instanceof Servidor)) {
            return false;
        }
        Servidor other = (Servidor) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    public boolean equals2(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Servidor)) {
            return false;
        }
        Servidor other = (Servidor) object;
        if (this.host.equals(other.getHost())) {
            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        return "monitoreoApp.model.Servidor[ id=" + id + " ]";
    }

    public void addTareas(Tarea tarea) {
        this.tareaList.add(tarea);
    }

    public void modificarTarea(Tarea t) {
        int size=this.tareaList.size();
        for (int i = 0; i < size; i++) {
            if (t.getId() == this.tareaList.get(i).getId()) {
                this.tareaList.set(i, t);
                break;
            }
        }

    }

}
