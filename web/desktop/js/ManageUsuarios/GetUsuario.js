Ext.namespace('js.ManageUsuarios.GetUsuario');

js.ManageUsuarios.GetUsuario = Ext.extend(Ext.util.Observable, {
    constructor: function () {
        js.ManageUsuarios.GetUsuario.superclass.constructor.apply(this);

    },
      updateUsuario: function (values, scope, callback) {
         var json = {
            password: values["password"],
            nombre: values["nombre"],
            rol: values["rol"],
            username: values["username"]           
        };
          var jsonE = Ext.util.JSON.encode(json);
          Ext.Ajax.request({
            method: "POST",
            params: {
                params: jsonE
            },
            url: "updateUsuario.htm",
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
    removeUsuario: function (id, scope, callback) {
        Ext.Ajax.request({
            method: "POST",
            params: {
                username: id
            },
            url: "removeUsuario.htm",
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
    addUsuario: function (values, scope, callback) {
//        values["password"] = js.base64.encode(values["password"]);
        var json = {
            password: values["password"],
            nombre: values["nombre"],
            rol: values["rol"],
            username: values["username"]
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            url: 'addUsuario.htm',
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
    getUsuarioInformation: function (host, mask, scope, callback) {
        Ext.Ajax.request({
            method: "POST",
            params: {
                host: host
            },
            url: "getUsuarioInformation.htm",
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
