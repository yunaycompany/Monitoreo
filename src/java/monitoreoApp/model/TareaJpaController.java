/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.model;

import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.persistence.EntityNotFoundException;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import monitoreoApp.entity.Servidor;
import monitoreoApp.entity.Tarea;
import monitoreoApp.model.exceptions.NonexistentEntityException;

/**
 *
 * @author Yosbel
 */
public class TareaJpaController implements Serializable {

    public TareaJpaController(EntityManagerFactory emf) {
        if (emf == null) {
            this.emf = Persistence.createEntityManagerFactory("MonitoreoPU");
        } else {
            this.emf = emf;
        }
    }
    private EntityManagerFactory emf = null;

    public EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public void create(Tarea tarea) {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Servidor idServidor = tarea.getIdServidor();
            if (idServidor != null) {
                idServidor = em.getReference(idServidor.getClass(), idServidor.getId());
                tarea.setIdServidor(idServidor);
            }
            em.persist(tarea);
            if (idServidor != null) {
                idServidor.getTareaList().add(tarea);
                idServidor = em.merge(idServidor);
            }
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(Tarea tarea) throws NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Tarea persistentTarea = em.find(Tarea.class, tarea.getId());
            Servidor idServidorOld = persistentTarea.getIdServidor();
            Servidor idServidorNew = tarea.getIdServidor();
            if (idServidorNew != null) {
                idServidorNew = em.getReference(idServidorNew.getClass(), idServidorNew.getId());
                tarea.setIdServidor(idServidorNew);
            }
            tarea = em.merge(tarea);
            if (idServidorOld != null && !idServidorOld.equals(idServidorNew)) {
                idServidorOld.getTareaList().remove(tarea);
                idServidorOld = em.merge(idServidorOld);
            }
            if (idServidorNew != null && !idServidorNew.equals(idServidorOld)) {
                idServidorNew.getTareaList().add(tarea);
                idServidorNew = em.merge(idServidorNew);
            }
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = tarea.getId();
                if (findTarea(id) == null) {
                    throw new NonexistentEntityException("The tarea with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void destroy(Integer id) throws NonexistentEntityException {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Tarea tarea;
            try {
                tarea = em.getReference(Tarea.class, id);
                tarea.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("The tarea with id " + id + " no longer exists.", enfe);
            }
            Servidor idServidor = tarea.getIdServidor();
            if (idServidor != null) {
                idServidor.getTareaList().remove(tarea);
                idServidor = em.merge(idServidor);
            }
            em.remove(tarea);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<Tarea> findTareaEntities() {
        return findTareaEntities(true, -1, -1);
    }

    public List<Tarea> findTareaEntities(int maxResults, int firstResult) {
        return findTareaEntities(false, maxResults, firstResult);
    }

    private List<Tarea> findTareaEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(Tarea.class));
            Query q = em.createQuery(cq);
            if (!all) {
                q.setMaxResults(maxResults);
                q.setFirstResult(firstResult);
            }
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public Tarea findTarea(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Tarea.class, id);
        } finally {
            em.close();
        }
    }

    public int getTareaCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<Tarea> rt = cq.from(Tarea.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }

}
