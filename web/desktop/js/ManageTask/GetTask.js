Ext.namespace('js.ManageTask.GetTask');

js.ManageTask.GetTask = Ext.extend(Ext.util.Observable, {
    constructor: function () {
        js.ManageTask.GetTask.superclass.constructor.apply(this);

    },
    updateTask: function (values, scope, callback) {
        var json = {
            idTask: values["id"],
            bd: values["bd"],
            idServer: values["idServer"],
            consulta: values["consulta"],
            repeticiones: values["repeticiones"],
            fecha: values["fecha"],
            estado: values["estado"]
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            params: {
                params: jsonE
            },
            url: 'updateTask.htm',
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });
                    callback.call(scope, values["idServer"]);
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
                    buttons: Ext.MessageBox.ERROR,
                    icon: Ext.MessageBox.ERROR,
                    msg: result.msg
                });
            }
        });
    },
    removeTask: function (record, scope, callback) {
         var json = {
            idTask: record.get("id"),
            idServer: record.get("idS")
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            params: {
                params: jsonE
            },
            url: "removeTask.htm",
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
                    callback.call(scope);
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
    addTask: function (values, scope, callback) {
        var json = {
            bd: values["bd"],
            idServer: values["idServer"],
            consulta: values["consulta"],
            repeticiones: values["repeticiones"],
            fecha: values["fecha"],
            estado: "Espera"
        };
        var jsonE = Ext.util.JSON.encode(json);
        Ext.Ajax.request({
            method: "POST",
            params: {
                params: jsonE
            },
            url: 'addTask.htm',
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });
                    callback.call(scope, values["idServer"]);
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
                            msg: result.msg
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
    ejecutarTask: function (idServer, scope, callback) {
        Ext.Ajax.request({
            method: "POST",
            params: {
                params: idServer
            },
            url: 'ejecutarTask.htm',
            success: function (response) {
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {
                     callback.call(scope, idServer);
                    Ext.Msg.show({
                        title: 'OK',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.OK,
                        msg: result.msg
                    });                  
                }
            },
            failure: function (response, options) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.show({
                    title: 'ERROR',
                    buttons: Ext.MessageBox.ERROR,
                    icon: Ext.MessageBox.ERROR,
                    msg: result.msg
                });
            }
        });
    },

});
