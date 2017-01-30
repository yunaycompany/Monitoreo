Ext.namespace('js.Monitorear.ManageGraficas');

js.Monitorear.ManageGraficas = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        config = config || {};
        this.idServer = null;

        // this.getUsuario = new js.ManageUsuarios.GetUsuario();

        var reader = new Ext.data.ArrayReader({
            root: 'items',
            successProperty: 'success'
        }, [
            {name: 'datname', mapping: 'datname'},
            {name: 'xact_commit', mapping: 'xact_commit'},
            {name: 'xact_rollback', mapping: 'xact_rollback'},
            {name: 'blks_read', mapping: 'blks_read'},
            {name: 'blks_hit', mapping: 'blks_hit'},
            {name: 'tup_returned', mapping: 'tup_returned'},
            {name: 'tup_fetched', mapping: 'tup_fetched'},
            {name: 'tup_inserted', mapping: 'tup_inserted'},
            {name: 'tup_updated', mapping: 'tup_updated'},
            {name: 'tup_deleted', mapping: 'tup_deleted'},
            {name: 'conflicts', mapping: 'conflicts'},
            {name: 'temp_files', mapping: 'temp_files'},
            {name: 'deadlocks', mapping: 'deadlocks'},
            {name: 'stats_reset', mapping: 'stats_reset'}
        ]);



        this.store = new Ext.data.Store({
            method: 'POST',
            url: "pg_stat_database.htm",
            remoteSort: true,
            reader: reader

        });
        this.btonExportar = new Ext.Button({
            text: "Exportar",
            iconCls: 'exportar',
            tooltip: "Exportar a PDF",
            scope: this,
            disabled:true,
            handler: function () {
                this.exportarPDF();
            }
        });

        var tbar = ["->", this.btonExportar, ''];

        this.pagerToolBar = new Ext.PagingToolbar({
            pageSize: 17,
            store: this.store
        });

        this.graficaGrid = new js.ManageServer.ServerGrid({
            store: this.store,
            emptyText: '<<Gr&aacute;fica>>',
            paramName: 'grafica',
            columns: [
                {
                    header: "BD",
                    dataIndex: "datname",
                    sortable: false

                }, {
                    header: "Commits",
                    dataIndex: "xact_commit",
                    sortable: false

                },
                {
                    header: "Revertidas",
                    sortable: false,
                    dataIndex: "xact_rollback"
                },
                {
                    header: "Discos Lectura",
                    sortable: false,
                    dataIndex: "blks_read"
                },
                {
                    header: "Discos Cach&eacute;",
                    sortable: false,
                    dataIndex: "blks_hit"
                },
                {
                    header: "Filas Devueltas",
                    sortable: false,
                    dataIndex: "tup_returned"
                },
                {
                    header: "Filas Captadas",
                    sortable: false,
                    dataIndex: "tup_fetched"
                }, {
                    header: "Filas Insertadas",
                    sortable: false,
                    dataIndex: "tup_inserted"
                }, {
                    header: "Filas Actualizadas",
                    sortable: false,
                    dataIndex: "tup_updated"
                }, {
                    header: "Filas Eliminadas",
                    sortable: false,
                    dataIndex: "tup_deleted"
                }, {
                    header: "Canceladas por Conflicto",
                    sortable: false,
                    dataIndex: "conflicts"
                }, {
                    header: "Archivos Temporales",
                    sortable: false,
                    dataIndex: "temp_files"
                }, {
                    header: "Puntos Muertos",
                    sortable: false,
                    dataIndex: "deadlocks"
                }, {
                    header: "Fecha",
                    sortable: false,
                    dataIndex: "stats_reset"
                }

            ],
            bbar: this.pagerToolBar
        });




        Ext.apply(config, {
            layout: "anchor",
            frame: true,
            width: 800,
            height: 480,
            items: [this.graficaGrid],
            tbar: tbar,
            closable: true
        });

        js.Monitorear.ManageGraficas.superclass.constructor.call(this, config);

    },
    updateGraficas: function () {
        this.store.load({params: {start: 0, limit: 25}});

    },
    exportarPDF: function () {
        var data = [];
        this.store.each(function (rcd) {
            data.push(rcd.data);
        });
         var jsonE = Ext.util.JSON.encode(data);
          Ext.Ajax.request({
            method: "POST",
            params: {
                data: jsonE
            },
            url: "exportarPDF.htm",
            success: function (response) {
                
                var result = Ext.decode(response.responseText);
                if (result.success == "true") {                 
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
                    msg: result.mensaje
                });
            }
        });
    }
});
