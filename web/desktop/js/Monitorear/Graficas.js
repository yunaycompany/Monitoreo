Ext.namespace('js.Monitorear.Graficas');

js.Monitorear.Graficas = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        config = config || {};
        this.Barras = new Ext.Action({
            text: "Gr&aacute;fico de Barras",
            scope: this
        });
        this.Pastel = new Ext.Action({
            text: "Gr&aacute;fico de Pastel",
            scope: this
        });

        this.btonTipoGrafico = new Ext.Action({
            text: "Cambiar Gr&aacute;fico",
            iconCls: 'add',
            disabled: true,
            tooltip: "Cambiar el tipo de Gr&aacute;fico",
            menu: {
                items: [this.Barras, this.Pastel]}
        });

        Ext.chart.Chart.CHART_URL = direccion;
        this.store = new Ext.data.JsonStore({
            fields: ['datname', 'tup_inserted', 'tup_deleted'],
            url: 'grafica1.htm'
        });
        var grafica = {
            xtype: 'columnchart',
            store: this.store,
            xField: 'datname',
            yAxis: new Ext.chart.NumericAxis({
                displayName: 'Insertadas',
                labelRenderer: Ext.util.Format.numberRenderer('0,0')
            }),
            tipRenderer: function (chart, record, index, series) {
                if (series.yField == 'tup_inserted') {
                    return Ext.util.Format.number(record.data.tup_inserted, '0,0') + ' Filas insertadas en ' + record.data.datname;
                } else {
                    return Ext.util.Format.number(record.data.tup_deleted, '0,0') + ' Filas eliminadas en ' + record.data.datname;
                }
            },
            chartStyle: {
                padding: 10,
                animationEnabled: true,
                font: {
                    name: 'Tahoma',
                    color: 0x444444,
                    size: 11
                },
                dataTip: {
                    padding: 5,
                    border: {
                        color: 0x99bbe8,
                        size: 1
                    },
                    background: {
                        color: 0xDAE7F6,
                        alpha: .9
                    },
                    font: {
                        name: 'Tahoma',
                        color: 0x15428B,
                        size: 10,
                        bold: true
                    }
                },
                xAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xeeeeee}
                },
                yAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xdfe8f6}
                }
            },
            series: [{
                    type: 'column',
                    displayName: 'Eliminadas',
                    yField: 'tup_deleted',
                    style: {
                        image: barra,
                        mode: 'stretch',
                        color: 0x99BBE8
                    }
                }, {
                    type: 'line',
                    displayName: 'Insertadas',
                    yField: 'tup_inserted',
                    style: {
                        color: 0x15428B
                    }
                }]
        };


        var tbar = ["->", this.btonTipoGrafico, ''];


        Ext.apply(config, {
            title: "Gr&aacute;ficas",
            width: 800,
            height: 480,
            frame: true,
            layout: 'fit',
            border: false,
            items: [grafica],
            bbar: tbar

        });

        js.Monitorear.Graficas.superclass.constructor.call(this, config);

    }
});
