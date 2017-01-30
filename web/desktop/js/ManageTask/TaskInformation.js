Ext.namespace('js.ManageTask.TaskInformation');

js.ManageTask.TaskInformation = Ext.extend(Ext.Window, {
    constructor: function (config) {
        config = config || {};
        this.idTask = config.id;
        this.idServer = config.idServer;
        var params={start: 0, limit: 25, idServer: this.idServer};       
        var scope = this;
        Ext.form.VTypes['textVal'] = /^[a-zA-Z\á\é\í\ó\ú\ñ\Ñ\Ó\Á\Í\É\Ú\ü\Ü ]*$/;
        Ext.form.VTypes['textMask'] = /[a-zA-Z\á\é\í\ó\ú\ñ\Ñ\Ó\Á\Í\É\Ú\ü\Ü ]/;
        Ext.form.VTypes['textText'] = 'Debe especificar un valor v&aacute;lido';
        Ext.form.VTypes['text'] = function (v) {
            return Ext.form.VTypes['textVal'].test(v);
        };
        Ext.form.VTypes['identVal'] = /^[a-z][0-9a-z_]*$/;
        Ext.form.VTypes['identMask'] = /[0-9a-z_]/;
        Ext.form.VTypes['identText'] = 'Debe especificar un valor v&aacute;lido';
        Ext.form.VTypes['ident'] = function (v) {
            return Ext.form.VTypes['identVal'].test(v);
        };

        this.bdStore = new Ext.data.JsonStore({
            autoDestroy: true,
            url: 'listarBD.htm',
            root: 'items',
            mode: "remote",
            idProperty: 'bd',
            fields: ['id', 'bd']
        });

        this.bd = new Ext.form.ComboBox({
            name: "bd",
            fieldLabel: "Base de Datos",
            store: this.bdStore,
            displayField: "bd",
            value: config.bd ? config.bd : "",
            valueField: "id",
            mode: "remote",
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            blankText: "Debe especificar una base de datos v&aacute;lida"
        });
        this.bdStore.baseParams=params;
        
        this.bd.on("focus", function (field) {
            scope.bdStore.load({params: params});
        });



        this.consulta = new Ext.form.TextArea({
            xtype: 'textarea',
            allowBlank: false,
            fieldLabel: "Consulta",
            blankText: "Debe especificar una consulta v&aacute;lida",
            name: 'consulta',
            value: config.consulta ? config.consulta : "",
            flex: 1  // Take up all *remaining* vertical space
        });


        this.repeticiones = new Ext.form.NumberField({
            name: "repeticiones",
            fieldLabel: "Repeticiones",
            allowBlank: false,
            blankText: "Debe especificar una cantidad v&aacute;lida",
            value: config.repeticiones ? config.repeticiones : ""
        });


        this.fecha = new Ext.form.DateField({
            name: "fecha",
            allowBlank: false,
            fieldLabel: "Fecha",
            blankText: "Debe especificar una fecha v&aacute;lida",
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            value: config.fecha ? new Date(config.fecha) : ""
        });
        if (config.consulta) {
            var estadoStore = new Ext.data.ArrayStore({
                fields: ['id', 'state'],
                data: [['Espera', 'Espera'], ['Aplicada', 'Aplicada']]
            });
            this.estado = new Ext.form.ComboBox({
//                anchor: '92%',
                name: "estado",
                fieldLabel: "Estado",
                allowBlank: false,
                blankText: "Debe especificar un estado v&aacute;lido",
                displayField: 'state',
                mode: 'local',
                store: estadoStore,
//            triggerAction: 'all',
                valueField: 'id',
                editable: false
            });

        }
        this.form = new Ext.FormPanel({
            labelWidth: 75, // label settings here cascade unless overridden
            frame: true,
            width: 300,
            layout: 'form',
            height: 'auto',
            defaults: {width: 200},
            items: config.consulta ? [this.bd, this.consulta, this.repeticiones, this.fecha, this.estado] : [this.bd, this.consulta, this.repeticiones, this.fecha]
        });

        Ext.apply(config, {
            title: config.title,
            items: [this.form],
            buttons: [{
                    text: 'Aceptar', scope: this,
                    handler: function () {
                        this.fireEvent("success", this.getValues());
                        this.close();
                    }
                }, {
                    text: 'Cancelar', scope: this,
                    handler: function () {
                        this.hide();
                    }
                }]
        });
        js.ManageTask.TaskInformation.superclass.constructor.call(this, config);
    }, getValues: function () {
        var values = new Array();
        var items = this.form.items.items;

        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                values[items[i].getName()] = items[i].getValue();
            }
        }
        values["id"] = this.idTask;      
        values["idServer"] = this.idServer;      
        return values;
    }
});

