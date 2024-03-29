Inprint.system.logs.Main = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.panels = {
            tree: new Inprint.panel.tree.Editions(),
            grid: new Inprint.system.logs.Grid(),
            help: new Inprint.panels.Help({ hid: this.xtype })
        };

        Ext.apply(this, {

            layout: "border",

            defaults: {
                collapsible: false,
                split: true
            },

            items: [
                {
                    region: "center",
                    layout:"fit",
                    margins: "3 0 3 0",
                    items: this.panels.grid
                },
                {
                    region:"west",
                    margins: "3 0 3 3",
                    width: 200,
                    minSize: 200,
                    maxSize: 600,
                    layout:"fit",
                    items: this.panels.tree
                },
                {
                    region:"east",
                    margins: "3 3 3 0",
                    width: 400,
                    minSize: 200,
                    maxSize: 600,
                    collapseMode: 'mini',
                    layout:"fit",
                    items: this.panels.help
                }
            ]
        });

        Inprint.system.logs.Main.superclass.initComponent.apply(this, arguments);
    },

    onRender: function() {
        Inprint.system.logs.Main.superclass.onRender.apply(this, arguments);
    }

});

Inprint.registry.register("system-logs", {
    icon: "quill",
    text: _("Logs"),
    description: _("Inprint logs"),
    xobject: Inprint.system.logs.Main
});
