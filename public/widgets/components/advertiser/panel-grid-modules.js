Inprint.cmp.adverta.GridModules = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {
        
        this.pageId = null;
        this.pageW  = null;
        this.pageH  = null;
        
        this.params = {};
        this.components = {};
        
        this.urls = {
            "list":        "/fascicle/modules/list/",
            "create": _url("/fascicle/modules/create/"),
            "delete": _url("/fascicle/modules/delete/")
        }

        this.store = Inprint.factory.Store.json(this.urls["list"], {
            autoLoad:true,
            baseParams: {
                page: this.parent.selection
            }
        });
        
        this.selectionModel = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        
        this.columns = [
            this.selectionModel,
            {
                id:"place_shortcut",
                header: _("Place"),
                width: 80,
                sortable: true,
                dataIndex: "place_shortcut"
            },
            {
                id:"shortcut",
                header: _("Shortcut"),
                width: 120,
                sortable: true,
                dataIndex: "shortcut"
            }
        ];
        
        Ext.apply(this, {
            
            title: _("Modules"),
            
            enableDragDrop: true,
            ddGroup: 'principals-selector',
            
            layout:"fit",
            region: "center",
            
            viewConfig: {
                forceFit: true
            },
            
            stripeRows: true,
            columnLines: true,
            sm: this.selectionModel

        });

        Inprint.cmp.adverta.GridModules.superclass.initComponent.apply(this, arguments);

    },

    onRender: function() {
        Inprint.cmp.adverta.GridModules.superclass.onRender.apply(this, arguments);
    },
    
    
    //cmpCreate: function() {
    //    
    //    var win = this.components["create-window"];
    //    
    //    if (!win) {
    //        
    //        var grid = new Inprint.cmp.adverta.GridTemplates({
    //            parent: this.parent
    //        });
    //        
    //        win = new Ext.Window({
    //            width:700,
    //            height:500,
    //            modal:true,
    //            layout: "fit",
    //            closeAction: "hide",
    //            title: _("Adding a new category"),
    //            items: grid,
    //            buttons: [
    //                {
    //                    text: _("Add"),
    //                    scope:this,
    //                    handler: function() {
    //                        Ext.Ajax.request({
    //                            url: this.urls["create"],
    //                            scope:this,
    //                            success: function() {
    //                                this.components["create-window"].hide();
    //                                this.parent.panels["flash"].cmpInit();
    //                                this.cmpReload();
    //                            },
    //                            params: {
    //                                fascicle: this.parent.fascicle,
    //                                page: this.parent.selection,
    //                                module: grid.getValues("id")
    //                            }
    //                        });
    //                    }
    //                },
    //                _BTN_WNDW_CLOSE
    //            ]
    //            
    //        });
    //        
    //    }
    //    
    //    win.show(this);
    //    this.components["create-window"] = win;
    //},
    
    cmpDelete: function() {
        Ext.MessageBox.confirm(
            _("Warning"),
            _("You really wish to do this?"),
            function(btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: this.urls["delete"],
                        scope:this,
                        success: function() {
                            this.parent.panels["flash"].cmpInit();
                            this.cmpReload();
                        },
                        params: { id: this.getValues("id") }
                    });
                }
            }, this).setIcon(Ext.MessageBox.WARNING);
    }

});