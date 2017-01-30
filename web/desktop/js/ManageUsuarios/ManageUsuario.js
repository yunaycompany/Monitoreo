Ext.namespace('js.ManageUsuarios.ManageUsuario');

js.ManageUsuarios.ManageUsuario = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        config = config || {};
        this.getUsuario = new js.ManageUsuarios.GetUsuario();

        var reader = new Ext.data.ArrayReader({
            root: 'items',
            successProperty: 'success'
        }, [
            {name: 'nombre', mapping: 'nombre'},
            {name: 'rol', mapping: 'rol'},
            {name: 'username', mapping: 'username'},
            {name: 'password', mapping: 'password'}
        ]);



        this.store = new Ext.data.Store({
            method: 'POST',
            url: "findAllUsuario.htm",
//            autoLoad: true,
            remoteSort: true,
            reader: reader

        });
        this.btonAdd = new Ext.Button({
            text: "Adicionar",
            iconCls: 'add',
            tooltip: "Adicionar Usuario",
            scope: this,
            handler: function () {
                this.viewUsuarioInfo();
            }
        });
        this.btonModificar = new Ext.Button({
            text: "Modificar",
            iconCls: 'modificar',
            disabled: true,
            tooltip: "Modificar Usuario",
            scope: this,
            handler: function (grid) {
                var record = this.usuarioGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar un Usuario"
                    });
                } else
                    this.viewUsuarioInfo(record);
            }});

        this.btonDelete = new Ext.Button({
            text: "Eliminar",
            iconCls: 'delete',
            disabled: true,
            tooltip: "Eliminar Usuario",
            scope: this,
            handler: function (grid) {
                var record = this.usuarioGrid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.show({
                        title: 'ERROR',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        msg: "Debe seleccionar un Usuario"
                    });
                } else {
                    Ext.Msg.show({
                        msg: "¿Est&aacute; seguro de eliminar el usuario seleccionado?",
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.WARNING,
                        scope: this,
                        fn: function (buttonId) {
                            if (buttonId == "yes") {
                                this.getUsuario.removeUsuario(record.get("username"), this, this.updateUsuario);
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




        this.usuarioGrid = new js.ManageServer.ServerGrid({
            store: this.store,
            emptyText: '<<Usuario>>',
            paramName: 'username',
            columns: [
                {
                    header: "Usuario",
                    dataIndex: "username",
                    sortable: false

                }, {
                    header: "Nombre",
                    dataIndex: "nombre",
                    sortable: false

                },
                {
                    header: "Rol",
                    sortable: false,
                    dataIndex: "rol"
                }],
            bbar: this.pagerToolBar
        });
        this.store.load({params: {start: 0, limit: 25}});
        var scope = this;
        this.usuarioGrid.getSelectionModel().on('selectionchange', function (model, selected, option) {
            var count = model.selections.items.length;
            scope.btonDelete.setDisabled(count != 1);
            scope.btonModificar.setDisabled(count == 0);

        });


        Ext.apply(config, {
            layout: "anchor",
            frame: true,
            width: 'auto',
            height: 400,
            items: [this.usuarioGrid],
            tbar: tbar,
            closable: true
        });

        js.ManageUsuarios.ManageUsuario.superclass.constructor.call(this, config);

    },
    viewUsuarioInfo: function (record) {
        if (record) {
            this.createUsuarioInformation({
                rol: record.get("rol"),
                nombre: record.get("nombre"),
                username: record.get("username"),
                password: record.get("password")
            }, "Modificar");
        }
        else {
            this.createUsuarioInformation({
                rol: "",
                nombre: "",
                username: "",
                password: "",
            }, "Nuevo");
        }
    },
    createUsuarioInformation: function (data, state) {
        var title;
        if (state == "Nuevo") {
            title = "Adicionar Usuario";
        } else {
            title = "Modificar Usuario" + ": " + data["nombre"];
        }
        var usuarioInfo = new js.ManageUsuario.UsuarioInformation({
            title: title,
            rol: data['rol'],
            nombre: data["nombre"],
            username: data["username"],
            password: data["password"]
        });

        usuarioInfo.on("success", function (values) {
            if (state == "Nuevo") {
                this.getUsuario.addUsuario(values, this, this.updateUsuario);
            } else {
                this.getUsuario.updateUsuario(values, this, this.updateUsuario);
            }

        }, this);

        usuarioInfo.show();

    },
    updateUsuario: function () {
        this.store.load({params: {start: 0, limit: 25}});

    }
});
