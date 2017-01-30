Ext.namespace('js.ManageServer.ServerGrid');

js.ManageServer.ServerGrid = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config) {
        config = config || {};
        Ext.applyIf(config, {
            viewConfig: {
                forceFit: true
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            loadMask: true,
            anchor: "100% 100%",
            autoScroll: true,
            frame:true
        });
       js.ManageServer.ServerGrid.superclass.constructor.call(this, config);
    }


});












//-------------------------------------------
//js.AddServer = Ext.extend(Ext.Panel, {
//    constructor: function(config) {
//        config = config || {};
//
//        Ext.form.VTypes['textVal'] = /^[a-zA-Z\á\é\í\ó\ú\ñ\Ñ\Ó\Á\Í\É\Ú\ü\Ü ]*$/;
//        Ext.form.VTypes['textMask'] = /[a-zA-Z\á\é\í\ó\ú\ñ\Ñ\Ó\Á\Í\É\Ú\ü\Ü ]/;
//        Ext.form.VTypes['textText'] = 'Debe especificar un valor v&aacute;lido';
//        Ext.form.VTypes['text'] = function(v) {
//            return Ext.form.VTypes['textVal'].test(v);
//        };
////        Ext.form.VTypes['identVal'] = /^[a-z][0-9a-z_]*$/;
////        Ext.form.VTypes['identMask'] = /[0-9a-z_]/;
////        Ext.form.VTypes['identText'] = 'Debe especificar un valor v&aacute;lido';
////        Ext.form.VTypes['ident'] = function(v) {
////            return Ext.form.VTypes['identVal'].test(v);
////        };
////        Ext.form.VTypes['mailVal'] = /^[a-z][a-z]*$/;
////        Ext.form.VTypes['mailMask'] = /[a-z]/;
////        Ext.form.VTypes['mailText'] = 'Debe especificar un valor v&aacute;lido';
////        Ext.form.VTypes['mail'] = function(v) {
////            return Ext.form.VTypes['mailVal'].test(v);
////        };
////        Ext.form.VTypes['codVal'] = /[0-9]/;
////        Ext.form.VTypes['codMask'] = /[0-9]/;
////        Ext.form.VTypes['codText'] = 'El c&oacute;digo s&oacute;lo debe incluir hasta 5 d&iacute;gitos';
////        Ext.form.VTypes['cod'] = function(v) {
////            return Ext.form.VTypes['codVal'].test(v);
////        };
//        Ext.form.VTypes["portText"] = "El puerto tiene que estar entre 0 - 65535";
//        Ext.form.VTypes["portMask"] = /[0-9]/;
//        Ext.form.VTypes["portVal"] = /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
//        Ext.form.VTypes["port"] = function(v) {
//            return Ext.form.VTypes["portVal"].test(v);
//        };
//        Ext.form.VTypes["ipVal"] = /^([1-9][0-9]{0,1}|1[013-9][0-9]|12[0-689]|2[01][0-9]|22[0-3])([.]([1-9]{0,1}[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){2}[.]([1-9][0-9]{0,1}|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;
//        Ext.form.VTypes["ipText"] = "Debe especificar un valor v&aacute;lido";
//        Ext.form.VTypes["ipMask"] = /[.0-9]/;
//        Ext.form.VTypes["ip"] = function(v) {
//            return Ext.form.VTypes["ipVal"].test(v);
//        };
////
////        Ext.form.VTypes['basednVal'] = /^[a-zA-Z\=\\,\ ]*$/;
////        Ext.form.VTypes['basednMask'] = /^[a-zA-Z\=\\,\ ]*$/;
////        Ext.form.VTypes['basednText'] = 'Debe especificar un valor v&aacute;lido';
////        Ext.form.VTypes['basedn'] = function(v) {
////            return Ext.form.VTypes['basednVal'].test(v);
////        };
//        Ext.form.VTypes["usernameVal"] = /^[a-zA-Z][-_.a-zA-Z0-9]{0,30}$/;
//        Ext.form.VTypes["usernameText"] = 'Debe especificar un valor v&aacute;lido';
//        Ext.form.VTypes["usernameMask"] = /[-_.a-zA-Z0-9]/;
//        Ext.form.VTypes["username"] = function(v) {
//            return Ext.form.VTypes["usernameVal"].test(v);
//        };
//        this.serverName = new Ext.form.TextField({
//            name: "serverName",
//            vtype: "text",
//            allowBlank: false,
//            fieldLabel: "Nombre"
//        });
//
//        this.host = new Ext.form.TextField({
//            name: "host",
//            allowBlank: false,
//            vtype: "ip",
//            fieldLabel: "Servidor"
//        });
//
//        this.port = new Ext.form.TextField({
//            name: "port",
//            allowBlank: false,
//            maxLength: 5,
//            vtype: "port",
//            maxLengthText: 'Este campo s&oacute;lo permite 5 d&iacute;gitos.',
//            fieldLabel: "Puerto"
//        });
//
//
//
//        this.password = new Ext.form.TextField({
//            name: "password",
//            inputType: "password",
//            allowBlank: false,
//            minLength: 6,
//            maxLength: 255,
//            maxLengthText: "El n&uacute;mero m&aacute;ximo de caracteres es 255",
//            fieldLabel: "Contraseña"
//        });
//
//        this.username = new Ext.form.TextField({
//            name: "username",
//            vtype: "username",
//            fieldLabel: "Usuario"
//        });
//
//
//
//
//        this.server = new Ext.form.FieldSet({
//            layout: "form",
//            defaults: {
//                anchor: "100%",
//                allowBlank: false,
//                width: 500
//            },
//            autoHeight: true,
//            title: "Adicionar Servidor",
//            items: [this.serverName, this.host, this.port, this.username, this.password]
//        });
//
//        Ext.apply(config, {
//            title: 'New Tab ',            
//            closable:true,
//            frame:true,
//            items: [this.server]
////                    }
//                    //iconCls: "config",
////                    form: {
////                        items: [this.server]
////                    }
//        });
//
//        js.AddServer.superclass.constructor.call(this, config);
//    }
//});

//patdsi.security.authentication_type.LDAPInformation.LDAP_NAME = "Nombre";
//patdsi.security.authentication_type.LDAPInformation.LDAP_HOST = "Servidor";
//patdsi.security.authentication_type.LDAPInformation.LDAP_PORT = "Puerto";
//patdsi.security.authentication_type.LDAPInformation.LDAP_ACCOUNT = "Cuenta o DN principal";
//patdsi.security.authentication_type.LDAPInformation.LDAP_PASSWORD = "Contrase&ntilde;a";
//patdsi.security.authentication_type.LDAPInformation.LDAP_BASE_DN = "DN base";
//
//patdsi.security.authentication_type.LDAPInformation.LDAP_ATTRIBUTES_TITLE = "Configurar";
//patdsi.security.authentication_type.LDAPInformation.USER = "Usuario";
//patdsi.security.authentication_type.LDAPInformation.NAME = "Nombre";
//patdsi.security.authentication_type.LDAPInformation.LAST_NAME = "Apellidos";
//patdsi.security.authentication_type.LDAPInformation.EMAIL = "Correo electr&oacute;nico";