<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ext/resources/css/style_login.css">
       
    </head>
    <body>    
        <div id="login">

            <h1>Autenticaci&oacute;n</h1>
            <form action="j_spring_security_check" method="post">
                <input type="text" name="username" placeholder="Usuario..." />
                <input type="password" name="password" placeholder="Clave..." />
                <input type="submit" value="Aceptar" />
                <!--input type="submit" value="An&oacute;nimo"/-->
            </form>

        </div>

    </body>

</html>
