Ext.namespace('js.ManageServer.ManageServer');

js.ManageServer.ManageServer = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        config = config || {};
        this.getServer = new js.ManageServer.GetServer();

        var reader = new Ext.data.ArrayReader({
            root: 'items',
            successProperty: 'success'
        }, [
            {name: 'id', mapping: 'id'},
            {name: 'host', mapping: 'host'},
            {name: 'port', mapping: 'port'},
            {name: 'username', mapping: 'username'},
            {name: 'password', mapping: 'password'}
        ]);



        this.store = new Ext.data.Store({
            method: 'POST',
            url: "findAllServer.htm",
//            autoLoad: true,
            remoteSort: true,
            reader: reader

        });

        this.btonAdd = new Ext.Button({
            text: "Adicionar",
            iconCls: 'add',            
            tooltip: "Adicionar Servidor",
            scope: this,
            handler: function () {
                this.viewServerInfo();
            }
        });
        this.btonModificar = new Ext.Button({
            text: "Modificar",
            iconCls: 'modificar',
            disabled: true,
            tooltip: "Modificar Servidor",
            scope: this,
            handler: function (grid) {
                var record = this.serverGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar un Servidor"
                    });
                } else
                    this.viewServerInfo(record);
            }});

        this.btonDelete = new Ext.Button({
            text: "Eliminar",
            iconCls: 'delete',
            disabled: true,
            tooltip: "Eliminar Servidor",
            scope: this,
            handler: function (grid) {
                var record = this.serverGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar un Servidor"
                    });
                } else {
                    Ext.Msg.show({
                        msg: "¿Est&aacute; seguro de eliminar el servidor seleccionado?",
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (buttonId) {
                            if (buttonId == "yes") {
                                this.getServer.removeServer(record.get("id"), this, this.updateServer);
                            }
                        }
                    });
                }
            }

        });


        var tbar = ["->", this.btonAdd, '', this.btonModificar, '', this.btonDelete];




        this.pagerToolBar = new Ext.PagingToolbar({
            pageSize: 17,
            store: this.store
        });




        this.serverGrid = new js.ManageServer.ServerGrid({
            store: this.store,
            emptyText: '<<Servidor>>',
            paramName: 'host',
            columns: [
                {
                    header: "Servidor",
                    dataIndex: "host",
                    sortable: false

                }, {
                    header: "Puerto",
                    dataIndex: "port",
                    sortable: false

                },
                {
                    header: "Usuario",
                    sortable: false,
                    dataIndex: "username"
                }],
            bbar: this.pagerToolBar
        });
        this.store.load({params: {start: 0, limit: 25}});
        var scope = this;
        this.serverGrid.getSelectionModel().on('selectionchange', function (model, selected, option) {
            var count = model.selections.items.length;
            scope.btonDelete.setDisabled(count != 1);
            scope.btonModificar.setDisabled(count == 0);

        });


        Ext.apply(config, {
            layout: "anchor",
            frame: true,
            width: 'auto',
            height: 400,
            items: [this.serverGrid],
            tbar: tbar,
            closable: true
        });

        js.ManageServer.ManageServer.superclass.constructor.call(this, config);

    },
    viewServerInfo: function (record) {
        if (record) {
            this.createServerInformation({
                host: record.get("host"),
                port: record.get("port"),
                username: record.get("username"),
                password: record.get("password"),
                id: record.get("id")
            }, "Modificar");
        }
        else {
            this.createServerInformation({
                host: "",
                port: "",
                username: "",
                password: "",
                id: ""
            }, "Nuevo");
        }
    },
    createServerInformation: function (data, state) {
        var title;
        if (state == "Nuevo") {
            title = "Adicionar Servidor";
        } else {
            title = "Modificar Servidor" + ": " + data["host"];
        }
        var serverInfo = new js.ManageServer.ServerInformation({
            title: title,
            host: data['host'],
            port: data["port"],
            username: data["username"],
            password: data["password"],
            id: data["id"]
        });

        serverInfo.on("success", function (values) {
            if (state == "Nuevo") {
                this.getServer.addServer(values, this, this.updateServer);
            } else {
                this.getServer.updateServer(values, this, this.updateServer);
            }

        }, this);

        serverInfo.on("test", function (values) {
            this.getServer.testServer(values);

        }, this);
        serverInfo.show();

    },
    updateServer: function () {
        this.store.load({params: {start: 0, limit: 25}});

    }
});
