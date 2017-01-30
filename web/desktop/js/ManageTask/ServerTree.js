Ext.namespace('js.ManageTask.ServerTree');

js.ManageTask.ServerTree = Ext.extend(Ext.tree.TreePanel, {
    constructor: function(config) {
        config = config || {};
        this.task = config.task;
        Ext.apply(config, {
            useArrows: true,
            autoScroll: true,
            animate: true,
            enableDD: true,
            containerScroll: true,
            border: false,
            dataUrl: 'findAllServerTree.htm',
            root: {
                nodeType: 'async',
                text: 'Servidores',
                draggable: false
            },
            listeners: {
                scope: this,
                click: function(nodo) {
                    if (nodo.text != 'Servidores') {
                        var idServer = nodo.attributes.idS;
                        this.task.idServer = idServer;
                        if (this.ventana == "graficas") {
                            this.task.store.load({params: {start: 0, limit: 25, idServer: idServer}});
                            this.task.btonTipoGrafico.setDisabled(false)
                        } else {
                            this.task.btonEjecutarTask ? this.task.btonEjecutarTask.setDisabled(false) : ""
                            this.task.store.load({params: {start: 0, limit: 25, idServer: idServer}});
                            this.task.btonAdd ? this.task.btonAdd.setDisabled(false) : this.task.btonExportar.setDisabled(false);
                        }
//                        st.baseParams.idServidor = nodo.attributes.idServidor;
//                        st.load();
//                        var stGrafica = grafica.items.items[0].store;
//                        var stGrafica2 = grafica2.items.items[0].store;
//                        stGrafica.baseParams.host = nodo.attributes.host;
//                        stGrafica.baseParams.pass = nodo.attributes.pass;
//                        stGrafica.baseParams.dbase = nodo.attributes.dbase;
//                        stGrafica.baseParams.port = nodo.attributes.puerto;
//                        stGrafica.baseParams.usser = nodo.attributes.usser;
//
//                        stGrafica2.baseParams.host = nodo.attributes.host;
//                        stGrafica2.baseParams.pass = nodo.attributes.pass;
//                        stGrafica2.baseParams.dbase = nodo.attributes.dbase;
//                        stGrafica2.baseParams.port = nodo.attributes.puerto;
//                        stGrafica2.baseParams.usser = nodo.attributes.usser;
//
//                        stGrafica.load();
//                        stGrafica2.load();
                    }
                }
            }
        });

        js.ManageTask.ServerTree.superclass.constructor.call(this, config);

    }
});
