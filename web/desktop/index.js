/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
var rolAutenticado = "";
var userAutenticado = "";



function guardarUser(rol, user) {
    rolAutenticado = rol;
    userAutenticado = user;
}

// Sample desktop configuration
MyDesktop = new Ext.app.App({
    init: function () {
        Ext.QuickTips.init();
    },
    getModules: function () {
        if (rolAutenticado == "Administrador") {
            return [
                new MyDesktop.ManageServer(),
                new MyDesktop.ManageTask(),
                new MyDesktop.ManageUsuario(),
                new MyDesktop.Monitorear()
            ];
        } else {
            return [
                new MyDesktop.ManageServer(),
                new MyDesktop.ManageTask(),
                new MyDesktop.Monitorear()
            ];
        }
    },
    // config for the start menu
    getStartConfig: function () {
        return {
            title: 'Hola: ' + userAutenticado,
//            iconCls: 'user',
            toolItems: [{
                    text: 'Salir',
                    iconCls: 'logout',
                    scope: this,
                    handler: this.logout
                }]
        };
    }
});





// for example purposes
var windowIndex = 0;

MyDesktop.ManageServer = Ext.extend(Ext.app.Module, {
    init: function () {
        this.launcher = {
            text: 'Gestionar Servidores',
            iconCls: 'server',
            handler: this.createWindow,
            scope: this,
            windowId: windowIndex++
        }
    },
    createWindow: function (src) {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('server' + src.windowId);
        var manageServer = new js.ManageServer.ManageServer();

        if (!win) {
            win = desktop.createWindow({
                id: 'server' + src.windowId,
                title: "Gestionar Servidores",
                width: 640,
                height: 480,
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items: [manageServer]

            });
        }
        win.show();
    }
});


MyDesktop.ManageTask = Ext.extend(Ext.app.Module, {
    init: function () {
        this.launcher = {
            text: 'Gestionar Tareas',
            iconCls: 'tareas',
            handler: this.createWindow,
            scope: this,
            windowId: windowIndex++
        }
    },
    createWindow: function (src) {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('tareas' + src.windowId);
        var manageTask = new js.ManageTask.ManageTask();
        var serverTree = new js.ManageTask.ServerTree({
            task: manageTask,
            ventana: "tareas"
        });
        if (!win) {
            win = desktop.createWindow(
                    {
                        id: 'tareas' + src.windowId,
                        title: "Gestionar Tareas",
                        width: 800,
                        height: 480,
                        shim: false,
                        animCollapse: false,
                        constrainHeader: true,
                        layout: 'border',
                        items: [{
                                region: 'west',
                                title: 'Servidores',
                                collapsible: true,
                                split: true,
                                minHeight: 100,
                                minWidth: 150,
                                maxWidth: 150,
                                width: 150,
                                items: [serverTree]
                            }, {
                                region: 'center',
                                split: true,
                                height: 100,
                                layout: 'column',
                                minHeight: 100,
                                collapsible: false,
                                items: [manageTask]
                            }]

                    }
            );
        }
        win.show();
    }
});


MyDesktop.ManageUsuario = Ext.extend(Ext.app.Module, {
    init: function () {
        this.launcher = {
            text: 'Gestionar Usuarios',
            iconCls: 'usuarios',
            handler: this.createWindow,
            scope: this,
            windowId: windowIndex++
        }
    },
    createWindow: function (src) {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('usuario' + src.windowId);
        var manageUsuario = new js.ManageUsuarios.ManageUsuario();

        if (!win) {
            win = desktop.createWindow({
                id: 'usuario' + src.windowId,
                title: "Gestionar Usuarios",
                width: 640,
                height: 480,
//                iconCls: 'bogus',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                items: [manageUsuario]

            });
        }
        win.show();
    }
});

MyDesktop.Monitorear = Ext.extend(Ext.app.Module, {
    init: function () {
        this.estadisticasBD = new Ext.Action({
            text: "Estad&iacute;sticas BD",
            scope: this,
            iconCls: 'estadistica',
            handler: this.createWindow
        });
        this.graficas = new Ext.Action({
            text: "Gr&aacute;ficas",
            scope: this,
            iconCls: 'grafica',
            handler: this.creategraficas
        });


        this.launcher = new Ext.Action({
            text: 'Monitorear Servidores',
            iconCls: 'monitoreo',
            scope: this,
            windowId: windowIndex++,
            menu: {
                items: [this.estadisticasBD, this.graficas]}
        });
    },
    createWindow: function (src) {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('estad' + src.windowId);
        var monitorear = new js.Monitorear.ManageGraficas();
        var serverTree = new js.ManageTask.ServerTree({
            task: monitorear,
            ventana: "estad"
        });
        if (!win) {
            win = desktop.createWindow(
                    {
                        id: 'estad' + src.windowId,
                        title: "Estad&iacute;sticas BD",
                        width: 800,
                        height: 480,
                        shim: false,
                        animCollapse: false,
                        constrainHeader: true,
                        layout: 'border',
                        items: [{
                                region: 'west',
                                title: 'Servidores',
                                collapsible: true,
                                split: true,
                                minHeight: 100,
                                minWidth: 150,
                                maxWidth: 150,
                                width: 150,
                                items: [serverTree]
                            }, {
                                region: 'center',
                                split: true,
                                height: 100,
                                layout: 'column',
                                minHeight: 100,
                                collapsible: false,
                                items: [monitorear]
                            }]

                    }
            );
        }
        win.show();
    },
    creategraficas: function (src) {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('graficas' + src.windowId);
        var monitorear = new js.Monitorear.Graficas();
        var serverTree = new js.ManageTask.ServerTree({
            task: monitorear,
            ventana: "graficas"
        });
        if (!win) {
            win = desktop.createWindow(
                    {
                        id: 'graficas' + src.windowId,
                        title: "Gr&aacute;ficas",
                        width: 800,
                        height: 480,
                        shim: false,
                        animCollapse: false,
                        constrainHeader: true,
                        layout: 'border',
                        items: [{
                                region: 'west',
                                title: 'Servidores',
                                collapsible: true,
                                split: true,
                                minHeight: 100,
                                minWidth: 150,
                                maxWidth: 150,
                                width: 150,
                                items: [serverTree]
                            }, {
                                region: 'center',
                                split: true,
                                height: 100,
                                layout: 'column',
                                minHeight: 100,
                                collapsible: false,
                                items: [monitorear]
                            }]

                    }
            );
        }
        win.show();

    }

});


MyDesktop.logout = function () {
    Ext.Msg.show({
        msg: "¿Est&aacute; seguro que desea cerrar la sesi&oacute;n?",
        buttons: Ext.MessageBox.YESNO,
        icon: Ext.MessageBox.WARNING,
        scope: this,
        fn: function (buttonId) {
            if (buttonId == "yes") {
                window.location.href = 'j_spring_security_logout';
            }
        }
    });

}