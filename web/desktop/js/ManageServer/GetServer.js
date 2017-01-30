Ext.namespace('js.ManageServer.GetServer');

js.ManageServer.GetServer = Ext.extend(Ext.util.Observable, {
    constructor: function () {
        js.ManageServer.GetServer.superclass.constructor.apply(this);

    },
      updateServer: function (values, scope, callback) {
         var json = {
            password: values["password"],
            host: values["host"],
            port: values["port"],
            username: values["username"],
            id: values["id"]
        };
          var jsonE = Ext.util.JSON.encode(json);
          Ext.Ajax.request({
            method: "POST",
            params: {
                id: jsonE
            },
            url: "updateServer.htm",
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    callback.call(scope);
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });
                } else {                   
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: result.msg
                    });

                }


            },
            failure: function (response, options) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'ERROR',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    msg: result.msg
                });
            }
        });
    },
    removeServer: function (id, scope, callback) {
        Ext.Ajax.request({
            method: "POST",
            params: {
                id: id
            },
            url: "removeServer.htm",
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    callback.call(scope);
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });
                } else {                   
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: result.msg
                    });

                }


            },
            failure: function (response, options) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'ERROR',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    msg: result.msg
                });
            }
        });
    },
    addServer: function (values, scope, callback) {
//        values["password"] = js.base64.encode(values["password"]);
        var json = {
            password: values["password"],
            host: values["host"],
            port: values["port"],
            username: values["username"]
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            url: 'addServer.htm',
            params: {
                params: jsonE
            },
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });
                    callback.call(scope);
                } else {
                    if (result.msg) {
                        Ext.Msg.show({
                            title: 'ERROR',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            msg: result.msg
                        });
                    } else {
                        Ext.Msg.show({
                            title: 'ERROR',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            msg: result.error
                        });
                    }
                }

            },
            failure: function (response, options) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'ERROR',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    msg: "Opps parece que hubo un error"
                });
            }
        });

    },
    testServer: function (values) {
//        values["password"] = js.base64.encode(values["password"]);
        var json = {
            password: values["password"],
            host: values["host"],
            port: values["port"],
            username: values["username"]
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            url: 'testConexion.htm',
            params: {
                params: jsonE
            },
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: "Conexión establecida satisfactoriamente"
                    });
                } else {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "No se pudo establecer la conexión"
                    });

                }

            },
            failure: function (response, options) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'ERROR',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    msg: result.msg
                });
            }
        });

    },
    getServerInformation: function (host, mask, scope, callback) {
        Ext.Ajax.request({
            method: "POST",
            params: {
                host: host
            },
            url: "getServerInformation.htm",
            success: function (response) {
                mask.hide();
                response = Ext.decode(response.responseText);
                callback.call(scope, response, mask);
            },
            failure: function (response, options) {
                mask.hide();
                Ext.Msg.show({
                    title: 'Error',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING,
                    msg: "Error"
                });
            }
        });
    },
});
