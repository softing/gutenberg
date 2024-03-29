Inprint.cmp.memberRulesForm.Organization.Tree = Ext.extend(Ext.tree.TreePanel, {

    initComponent: function() {

        this.components = {};

        this.urls = {
            "tree":    _url("/catalog/organization/tree/")
        };

        Ext.apply(this, {
            autoScroll:true,
            dataUrl: this.urls.tree,
            border:false,
            root: {
                id:'00000000-0000-0000-0000-000000000000',
                nodeType: 'async',
                expanded: true,
                draggable: false,
                icon: _ico("folders"),
                text: _("All departments")
            }
        });

        Inprint.cmp.memberRulesForm.Organization.Tree.superclass.initComponent.apply(this, arguments);

        this.on("beforeappend", function(tree, parent, node) {
            node.attributes.icon = _ico(node.attributes.icon);
        });

    },

    onRender: function() {
        Inprint.cmp.memberRulesForm.Organization.Tree.superclass.onRender.apply(this, arguments);

        this.getLoader().on("load", function() { this.body.unmask(); }, this);
        this.getLoader().on("beforeload", function() { this.body.mask(_("Loading")); }, this);

        this.getRootNode().expand();
    }

});
