/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package monitoreoApp.controller;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 *
 * @author Yosbel
 */
public class mySimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    protected Log logger = LogFactory.getLog(this.getClass());

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response, Authentication authentication) throws IOException {
        handle(request, response, authentication);
        clearAuthenticationAttributes(request);
    }

    protected void handle(HttpServletRequest request,
            HttpServletResponse response, Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(authentication, request, response);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

    /**
     * Builds the target URL according to the logic defined in the main class
     * Javadoc.
     */
    protected String determineTargetUrl(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean isUser = false;
        boolean isAdmin = false;        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (GrantedAuthority grantedAuthority : authorities) {
            if (grantedAuthority.getAuthority().equals("Invitado")) {
                isUser = true;
                break;
            } else if (grantedAuthority.getAuthority().equals("Administrador")) {
                isAdmin = true;
                break;
            }
        }
        User username=(User)authentication.getPrincipal();
        String user=username.getUsername();
        Gson jsonObj = new Gson();
        PrintWriter out = response.getWriter();
        Map map = new HashMap();        

        if (isUser) {            
            request.getSession().setAttribute("rol", "Invitado");
            request.getSession().setAttribute("usser", user);            
            map.put("success", true);
            map.put("msg", "Invitado");
            out.printf(jsonObj.toJson(map));
            return "/index.htm";
        } else if (isAdmin) {
            request.getSession().setAttribute("rol", "Administrador");
            request.getSession().setAttribute("usser", user);
            map.put("success", true);
            map.put("msg", "Administrador");
            out.printf(jsonObj.toJson(map));
            return "/index.htm";
        } else {
            throw new IllegalStateException();
        }
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

    public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }

    protected RedirectStrategy getRedirectStrategy() {
        return redirectStrategy;
    }

}
