Ext.namespace('js.ManageUsuario.UsuarioInformation');

js.ManageUsuario.UsuarioInformation = Ext.extend(Ext.Window, {
    constructor: function (config) {
        config = config || {};
        this.idUsuario = config.username;

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


        this.nombre = new Ext.form.TextField({
            name: "nombre",
            allowBlank: false,
            fieldLabel: "Nombre",
            blankText: "Debe especificar un nombre v&aacute;lido",
            value: config.nombre ? config.nombre : ""
        });
        var rolStore = new Ext.data.ArrayStore({
            fields: ['id', 'rol'],
            data: [['Administrador', 'Administrador'], ['Invitado', 'Invitado']]
        });

        this.rol = new Ext.form.ComboBox({
            name: "rol",
            fieldLabel: "Rol",
            allowBlank: false,
            blankText: "Debe especificar un rol v&aacute;lido",
            displayField: 'rol',
            mode: 'local',
            store: rolStore,
            valueField: 'id',
            editable: false
        });



        this.username = new Ext.form.TextField({
            name: "username",
            vtype: "username",
            fieldLabel: "Usuario",
            allowBlank: false,
            disabled: config.username ? true : false,
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
            items: [this.nombre, this.rol, this.username, this.password]
        });

        Ext.apply(config, {
            title: config.title,
            items: [this.form],
            buttons: [{
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
        js.ManageUsuario.UsuarioInformation.superclass.constructor.call(this, config);
    }, getValues: function () {
        var values = new Array();
        var items = this.form.items.items;

        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                values[items[i].getName()] = items[i].getValue();
            }
        }
        if (this.idUsuario && this.idUsuario!="") {
            values["username"] =  this.idUsuario;
        }

        return values;
    }
});

