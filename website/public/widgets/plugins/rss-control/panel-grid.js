Inprint.plugins.rss.control.Grid = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {

        this.feed = null;
        this.components = {};

        this.urls = {
            'load': _url('/plugin/rss/control/list/'),
            'fill': _url('/plugin/rss/control/fill/'),
            'save': _url('/plugin/rss/control/save/')
        };

         var record = Ext.data.Record.create([
            {name: 'id'},
            {name: 'title'},
            {name: 'description'},
            {name: 'level'}
        ]);

        var store = new Ext.data.Store({
            url: this.urls.load,
            autoLoad:true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'data',
                successProperty: 'success'
            }, record )
        });

        this.tbar = [
            {
                disabled:false,
                icon: _ico("disk-black"),
                cls: "x-btn-text-icon",
                text: _("Save"),
                ref: "../btnSave",
                scope:this,
                handler: this.cmpSave
            }
        ];

        this.selModel = new Ext.grid.CheckboxSelectionModel();

        Ext.apply(this, {
            border:false,
            store: store,
            columns: [
                this.selModel,
                {id:'title',header: _("Title"), width: 160, sortable: true, dataIndex: 'title',
                    renderer: function(v, p, r) {

                        if (r.data.level == 1) return v ;

                        var ico = EXTJS_PATH +"/resources/images/default/tree/elbow-end.gif";
                        var padding = (r.data.level-1) * 10 - 10;

                        return "<div style=\"background: url("+ ico +") "+ (padding-7) +"px -2px no-repeat;padding-left:" + (padding+14) + "px;\">"+ v +"</div>";
                    }},
                {id:'description',header: _("Description"), width: 160, sortable: true, dataIndex: 'description'}
            ],
            stripeRows: true,
            autoExpandColumn: 'description'
        });

        Inprint.plugins.rss.control.Grid.superclass.initComponent.apply(this, arguments);
    },

    onRender: function() {
        Inprint.plugins.rss.control.Grid.superclass.onRender.apply(this, arguments);
    },

    cmpFill: function(feed) {

        this.feed = feed;

        this.getSelectionModel().clearSelections();
        this.getStore().rejectChanges();

        this.body.mask(_("Loading data..."));

        Ext.Ajax.request({
            url: this.urls.fill,
            scope:this,
            params: {
                feed: this.feed
            },
            callback: function() {
                this.body.unmask();
            },
            success: function(responce) {
                var result = Ext.util.JSON.decode(responce.responseText);
                var store = this.getStore();
                for (var i=0; i < result.data.length; i++) {
                    var record = store.getById( result.data[i] );
                    if (record) {
                        this.getSelectionModel().selectRecords([ record ], true);
                    }
                }
                store.commitChanges();
            }
        });
    },

    cmpSave: function() {

        var data = [];

        Ext.each(this.getSelectionModel().getSelections(), function(record) {
            data.push( record.get("id") );
        });

        Ext.Ajax.request({
            scope:this,
            url: this.urls.save,
            params: {
                rubrics: data,
                feed: this.feed
            },
            success: function() {
                AlertBox.show(" ", _("Changes have been saved"), "success", {timeout: 2});
                this.cmpReload();
            }
        });

    }

});
