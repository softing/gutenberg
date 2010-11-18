Inprint.catalog.roles.Panel = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.panels = {};
        this.panels.grid    = new Inprint.catalog.roles.Grid();
        this.panels.help    = new Inprint.catalog.roles.HelpPanel({ oid: "Inprint.catalog.roles" });

        Ext.apply(this, {
            layout: "border",
            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                {   region: "center",
                    margins: "3 0 3 3",
                    layout:"fit",
                    items: this.panels.grid
                },
                {   region:"east",
                    margins: "3 3 3 0",
                    width: 380,
                    minSize: 200,
                    maxSize: 600,
                    layout:"fit",
                    collapseMode: 'mini',
                    items: this.panels.help
                }
            ]
        });

        Inprint.catalog.roles.Panel.superclass.initComponent.apply(this, arguments);
        
    },

    onRender: function() {
        Inprint.catalog.roles.Panel.superclass.onRender.apply(this, arguments);
        Inprint.catalog.roles.Access(this, this.panels);
        Inprint.catalog.roles.Interaction(this, this.panels);
    },

    cmpReload:function() {
        this.panels.grid.cmpReload();
    }

});

Inprint.registry.register("settings-roles", {
    icon: "user-silhouette",
    text: _("Roles"),
    xobject: Inprint.catalog.roles.Panel
});