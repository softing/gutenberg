Inprint.documents.all.Panel = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.panels = {};

        this.panels.grid    = new Inprint.documents.Grid({
            gridmode: 'all',
            stateful: true,
            stateId: 'documents.grid.all'
        });

        Ext.apply(this, {
            border:true,
            layout: "border",
            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                {   region: "center",
                    //margins: "3 0 3 3",
                    layout:"fit",
                    items: this.panels.grid
                }
            ]
        });

        Inprint.documents.all.Panel.superclass.initComponent.apply(this, arguments);
        
    },
    
    onRender: function() {
        Inprint.documents.all.Panel.superclass.onRender.apply(this, arguments);
        Inprint.documents.all.Access(this, this.panels);
        Inprint.documents.all.Interaction(this, this.panels);
    },
    
    cmpReload: function() {
        this.panels.grid.cmpReload();
    }
    
});

Inprint.registry.register("documents-all", {
    icon: "documents-stack",
    text:  _("All"),
    xobject: Inprint.documents.all.Panel
});
