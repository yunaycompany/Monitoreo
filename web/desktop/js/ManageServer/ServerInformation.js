Ext.namespace('js.ManageServer.ServerInformation');

js.ManageServer.ServerInformation = Ext.extend(Ext.Window, {
    constructor: function (config) {
        config = config || {};
        this.idServer = config.id;

        Ext.form.VTypes['identVal'] = /^[a-z][0-9a-z_]*$/;
        Ext.form.VTypes['identMask'] = /[0-9a-z_]/;
        Ext.form.VTypes['identText'] = 'Debe especificar un valor v&aacute;lido';
        Ext.form.VTypes['ident'] = function (v) {
            return Ext.form.VTypes['identVal'].test(v);
        };


        Ext.form.VTypes['ipVal'] = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        Ext.form.VTypes['ipMask'] = /[\d\.]/i;
        Ext.form.VTypes['ipText'] = 'Debe especificar un servidor v&aacute;lido';
        Ext.form.VTypes['ip'] = function (v) {
            return Ext.form.VTypes['ipVal'].test(v);
        };


        Ext.form.VTypes["portText"] = "El puerto tiene que estar entre 0 - 65535";
        Ext.form.VTypes["portMask"] = /[0-9]/;
        Ext.form.VTypes["portVal"] = /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
        Ext.form.VTypes["port"] = function (v) {
            return Ext.form.VTypes["portVal"].test(v);
        };


        Ext.form.VTypes["usernameVal"] = /^[a-zA-Z][-_.a-zA-Z0-9]{0,30}$/;
        Ext.form.VTypes["usernameText"] = 'Debe especificar un valor v&aacute;lido';
        Ext.form.VTypes["usernameMask"] = /[-_.a-zA-Z0-9]/;
        Ext.form.VTypes["username"] = function (v) {
            return Ext.form.VTypes["usernameVal"].test(v);
        };


        this.host = new Ext.form.TextField({
            name: "host",
            allowBlank: false,
            vtype: "ip",
            fieldLabel: "Servidor",
            blankText: "Debe especificar un servidor v&aacute;lido",
            value: config.host ? config.host : ""
        });

        this.port = new Ext.form.TextField({
            name: "port",
            allowBlank: false,
            maxLength: 5,
            vtype: "port",
            maxLengthText: 'Este campo s&oacute;lo permite 5 d&iacute;gitos.',
            fieldLabel: "Puerto",
            blankText: "Debe especificar un puerto v&aacute;lido",
            value: config.port ? config.port : ""
        });


        this.username = new Ext.form.TextField({
            name: "username",
            vtype: "username",
            fieldLabel: "Usuario",
            allowBlank: false,
            blankText: "Debe especificar un usuario v&aacute;lido",
            value: config.username ? config.username : ""
        });

        this.password = new Ext.form.TextField({
            name: "password",
            inputType: "password",
            allowBlank: false,
            maxLength: 255,
            blankText: "Debe especificar una contraseña v&aacute;lida",
            maxLengthText: "El n&uacute;mero m&aacute;ximo de caracteres es 255",
            fieldLabel: "Contraseña",
            value: config.password ? config.password : ""
        });

        this.form = new Ext.FormPanel({
            labelWidth: 75, // label settings here cascade unless overridden
            frame: true,
            width: 300,
            layout: 'form',
            height: 'auto',
            defaults: {width: 200},
            items: [this.host, this.port, this.username, this.password]
        });

        Ext.apply(config, {
            title: config.title,
            items: [this.form],
            buttons: [{
                    text: 'Probar Conexión', scope: this,
                    handler: function () {
                        this.fireEvent("test", this.getValues());
                    }
                }, {
                    text: 'Aceptar', scope: this,
                    handler: function () {
                        if (this.form.getForm().isValid()) {
                            this.fireEvent("success", this.getValues());
                            this.close();
                        } else {
                            Ext.Msg.alert('Advertencia', "Complete los datos correctamente");
                        }
                    }
                }, {
                    text: 'Cancelar', scope: this,
                    handler: function () {
                        this.hide();
                    }
                }]
        });
        js.ManageServer.ServerInformation.superclass.constructor.call(this, config);
    }, getValues: function () {
        var values = new Array();
        var items = this.form.items.items;

        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                values[items[i].getName()] = items[i].getValue();
            }
        }
        values["id"] = this.idServer;
        return values;
    }
});

