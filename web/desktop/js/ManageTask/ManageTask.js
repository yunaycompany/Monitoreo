Ext.namespace('js.ManageTask.ManageTask');

js.ManageTask.ManageTask = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        config = config || {};
        this.getTask = new js.ManageTask.GetTask();
        var scope = this;
        this.idServer = null;
        var reader = new Ext.data.ArrayReader({
            root: 'items',
            successProperty: 'success'
        }, [
            {name: 'idS', mapping: 'idS'},
            {name: 'id', mapping: 'id'},
            {name: 'bd', mapping: 'bd'},
            {name: 'consulta', mapping: 'consulta'},
            {name: 'repeticiones', mapping: 'repeticiones'},
            {name: 'fecha', mapping: 'fecha'},
            {name: 'estado', mapping: 'estado'}
        ]);



        this.store = new Ext.data.Store({
            method: 'POST',
            url: "findAllTaskbyServer.htm",
//            autoLoad: true,
            remoteSort: true,
            reader: reader

        });
        this.btonAdd = new Ext.Button({
            text: "Adicionar",
            iconCls: 'add',
            disabled: true,
            tooltip: "Adicionar Tarea",
            scope: this,
            handler: function () {
                this.viewTaskInfo();
            }
        });
         this.btonEjecutarTask = new Ext.Button({
            text: "Ejecutar",
            iconCls: 'ejecutar',
            disabled: true,
            tooltip: "Ejecutar Tareas",
            scope: this,
            handler: function () {
                this.getTask.ejecutarTask(this.idServer,this,this.updateTask); 
            }
        });
        this.btonDelete = new Ext.Button({
            text: "Eliminar",
            iconCls: 'delete',
            disabled: true,
            tooltip: "Eliminar Tarea",
            scope: this,
            handler: function (grid) {
                var record = this.taskGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar una Tarea"
                    });
                } else {
                    Ext.Msg.show({
                        msg: "¿Est&aacute; seguro de eliminar la tarea seleccionada?",
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (buttonId) {
                            if (buttonId == "yes") {
                                this.getTask.removeTask(record, this, this.updateTask);
                            }
                        }
                    });
                }
            }});

        this.btonModificar = new Ext.Button({
            text: "Modificar",
            iconCls: 'modificar',
            disabled: true,
            tooltip: "Modificar Tarea",
            scope: this,
            handler: function (grid) {
                var record = this.taskGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar una Tarea"
                    });
                } else
                    this.viewTaskInfo(record);
            }});
        var tbar = ["->", this.btonAdd, '', this.btonModificar, '', this.btonDelete,'', this.btonEjecutarTask];

        this.pagerToolBar = new Ext.PagingToolbar({
            pageSize: 17,
            store: this.store
        });




        this.taskGrid = new js.ManageServer.ServerGrid({
            store: this.store,
            emptyText: '<<Tarea>>',
            paramName: 'consulta',
            columns: [
                {
                    header: "Base de Datos",
                    dataIndex: "bd",
                    sortable: false

                }, {
                    header: "Consulta",
                    dataIndex: "consulta",
                    sortable: false

                },
                {
                    header: "Repeticiones",
                    sortable: false,
                    dataIndex: "repeticiones"
                }, {
                    header: "Fecha",
                    sortable: false,
                    dataIndex: "fecha"
                }, {
                    header: "Estado",
                    sortable: false,
                    dataIndex: "estado"
                }],
            bbar: this.pagerToolBar
        });
        this.taskGrid.getSelectionModel().on('selectionchange', function (model, selected, option) {
            var count = model.selections.items.length;
            scope.btonDelete.setDisabled(count != 1);
            scope.btonModificar.setDisabled(count == 0);

        });



        Ext.apply(config, {
            layout: "anchor",
            frame: true,
            width: 'auto',
            height: 400,
            items: [this.taskGrid],
            tbar: tbar,
            closable: true
        });

        js.ManageTask.ManageTask.superclass.constructor.call(this, config);

    },
    viewTaskInfo: function (record) {
        if (record) {
            this.createTaskInformation({
                bd: record.get("bd"),
                id: record.get("id"),
                consulta: record.get("consulta"),
                repeticiones: record.get("repeticiones"),
                fecha: record.get("fecha"),
                estado: record.get("estado")
            }, "Modificar");
        }
        else {
            this.createTaskInformation({
                bd: "",
                consulta: "",
                repeticiones: "",
                fecha: "",
                estado: ""
            }, "Nuevo");
        }
    },
    createTaskInformation: function (data, state) {
        var title;
        if (state == "Nuevo") {
            title = "Adicionar Tarea";
        } else {
            title = "Modificar Tarea";
        }
        var taskInfo = new js.ManageTask.TaskInformation({
            title: title,
            bd: data["bd"],
            consulta: data["consulta"],
            repeticiones: data["repeticiones"],
            fecha: data["fecha"],
            estado: data["estado"],
            idServer: this.idServer,
            id: data["id"]
        });

        taskInfo.on("success", function (values) {
            if (state == "Nuevo") {
                this.getTask.addTask(values, this, this.updateTask);
            }
            else {
                this.getTask.updateTask(values, this, this.updateTask);
            }
        }, this);


        taskInfo.show();

    },
    updateTask: function (idServer) {
        this.store.load({params: {start: 0, limit: 25, idServer: idServer}});

    }
});
