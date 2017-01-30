<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <title>Monitoreo</title>

        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ext/resources/css/ext-all.css" />
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/desktop/css/desktop.css" />


        <script type="text/javascript" src="<%=request.getContextPath()%>/ext/adapter/ext/ext-base.js"></script>


        <script type="text/javascript" src="<%=request.getContextPath()%>/ext/ext-all-debug.js"></script>


        <script  type = "text/javascript" src = "<%=request.getContextPath()%>/desktop/js/StartMenu.js" ></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/TaskBar.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/Desktop.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/App.js"></script>    
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/Module.js"></script>


        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageServer/ServerGrid.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageServer/ServerInformation.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageServer/GetServer.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageServer/ManageServer.js"></script>

        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageTask/ServerTree.js"></script> 
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageTask/TaskInformation.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageTask/GetTask.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageTask/ManageTask.js"></script>


        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageUsuarios/UsuarioInformation.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageUsuarios/GetUsuario.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/ManageUsuarios/ManageUsuario.js"></script>
        
        
        
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/Monitorear/ManageGraficas.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/js/Monitorear/Graficas.js"></script>



        <script type="text/javascript" src="<%=request.getContextPath()%>/desktop/index.js"></script>
    </head>
    <body >

        <div id="x-desktop">
            <a target="_blank" style="margin:5px; float:right;"><img src="<%=request.getContextPath()%>/desktop/images/powered.gif" /></a>

        </div>

        <div id="ux-taskbar">
            <div id="ux-taskbar-start"></div>
            <div id="ux-taskbuttons-panel"></div>
            <div class="x-clear"></div>
        </div>
       
       <script>
           direccion ="<%=request.getContextPath()%>/ext/resources/charts.swf";
           barra ="<%=request.getContextPath()%>/desktop/img/bar.gif";
            guardarUser('<% out.print(request.getSession().getAttribute("rol").toString()); %>','<% out.print(request.getSession().getAttribute("usser").toString()); %>');
        </script>
    </body>
</html>

