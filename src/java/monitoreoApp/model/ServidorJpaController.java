/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.model;

import java.io.Serializable;
import javax.persistence.Query;
import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import monitoreoApp.entity.Tarea;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import monitoreoApp.entity.Servidor;
import monitoreoApp.model.exceptions.NonexistentEntityException;

/**
 *
 * @author Yosbel
 */
public class ServidorJpaController implements Serializable {

    public ServidorJpaController(EntityManagerFactory emf) {
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

    public void create(Servidor servidor) {
        if (servidor.getTareaList() == null) {
            servidor.setTareaList(new ArrayList<Tarea>());
        }
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            List<Tarea> attachedTareaList = new ArrayList<Tarea>();
            for (Tarea tareaListTareaToAttach : servidor.getTareaList()) {
                tareaListTareaToAttach = em.getReference(tareaListTareaToAttach.getClass(), tareaListTareaToAttach.getId());
                attachedTareaList.add(tareaListTareaToAttach);
            }
            servidor.setTareaList(attachedTareaList);
            em.persist(servidor);
            for (Tarea tareaListTarea : servidor.getTareaList()) {
                Servidor oldIdServidorOfTareaListTarea = tareaListTarea.getIdServidor();
                tareaListTarea.setIdServidor(servidor);
                tareaListTarea = em.merge(tareaListTarea);
                if (oldIdServidorOfTareaListTarea != null) {
                    oldIdServidorOfTareaListTarea.getTareaList().remove(tareaListTarea);
                    oldIdServidorOfTareaListTarea = em.merge(oldIdServidorOfTareaListTarea);
                }
            }
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(Servidor servidor) throws NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Servidor persistentServidor = em.find(Servidor.class, servidor.getId());
            List<Tarea> tareaListOld = persistentServidor.getTareaList();
            List<Tarea> tareaListNew = servidor.getTareaList();
            List<Tarea> attachedTareaListNew = new ArrayList<Tarea>();
            for (Tarea tareaListNewTareaToAttach : tareaListNew) {
                tareaListNewTareaToAttach = em.getReference(tareaListNewTareaToAttach.getClass(), tareaListNewTareaToAttach.getId());
                attachedTareaListNew.add(tareaListNewTareaToAttach);
            }
            tareaListNew = attachedTareaListNew;
            servidor.setTareaList(tareaListNew);
            servidor = em.merge(servidor);
            for (Tarea tareaListOldTarea : tareaListOld) {
                if (!tareaListNew.contains(tareaListOldTarea)) {
                    tareaListOldTarea.setIdServidor(null);
                    tareaListOldTarea = em.merge(tareaListOldTarea);
                }
            }
            for (Tarea tareaListNewTarea : tareaListNew) {
                if (!tareaListOld.contains(tareaListNewTarea)) {
                    Servidor oldIdServidorOfTareaListNewTarea = tareaListNewTarea.getIdServidor();
                    tareaListNewTarea.setIdServidor(servidor);
                    tareaListNewTarea = em.merge(tareaListNewTarea);
                    if (oldIdServidorOfTareaListNewTarea != null && !oldIdServidorOfTareaListNewTarea.equals(servidor)) {
                        oldIdServidorOfTareaListNewTarea.getTareaList().remove(tareaListNewTarea);
                        oldIdServidorOfTareaListNewTarea = em.merge(oldIdServidorOfTareaListNewTarea);
                    }
                }
            }
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = servidor.getId();
                if (findServidor(id) == null) {
                    throw new NonexistentEntityException("The servidor with id " + id + " no longer exists.");
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
            Servidor servidor;
            try {
                servidor = em.getReference(Servidor.class, id);
                servidor.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("El servidor con id " + id + " no existe.", enfe);
            }
            List<Tarea> tareaList = servidor.getTareaList();
            for (Tarea tareaListTarea : tareaList) {
                tareaListTarea.setIdServidor(null);
                tareaListTarea = em.merge(tareaListTarea);
            }
            em.remove(servidor);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<Servidor> findServidorEntities() {
        return findServidorEntities(true, -1, -1);
    }

    public List<Servidor> findServidorEntities(int maxResults, int firstResult) {
        return findServidorEntities(false, maxResults, firstResult);
    }

    private List<Servidor> findServidorEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(Servidor.class));
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

    public Servidor findServidor(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Servidor.class, id);
        } finally {
            em.close();
        }
    }

    public boolean existServidor(Servidor server) {
        List<Servidor> servidores = findServidorEntities();
        for (int i = 0; i < servidores.size(); i++) {
            if (servidores.get(i).equals2(server)) {
                return true;
            }
        }
        return false;
    }

    public int getServidorCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<Servidor> rt = cq.from(Servidor.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }

}
