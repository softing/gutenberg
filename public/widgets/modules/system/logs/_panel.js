Inprint.system.logs.Panel = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {

        this.store = Inprint.factory.Store.json("/system/logservice/");

        //        this.filterEdition = Inprint.factory.Combo.create("editions");
        //        this.filterEmployee = Inprint.factory.Combo.create("members");

        Ext.apply(this, {
            stripeRows: true,
            autoExpandColumn: 'message',
            columns: [
                {   id:'edition',
                    header: _("Edition"),
                    width: 160,
                    dataIndex: 'edition',
                    renderer: function(value) {
                        if (value == null) return _("Not defined");
                        return value;
                    }
                },
                {   id:'initiator',
                    header: _("Employee"),
                    width: 160,
                    dataIndex: 'initiator',
                    renderer: function(value) {
                        if (value == null) return _("Not defined");
                        return value;
                    }
                },

                {   id:'group',
                    header: _("Event type"),
                    width: 160,
                    dataIndex: 'event'
                },

                {   id:'date',
                    header: _("Record date"),
                    width: 140,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('<b>D j M Y</b> H:i'),
                    dataIndex: 'created'
                },
                {   id:'message',
                    header: _("Event"),
                    width: 75,
                    sortable: true,
                    dataIndex: 'message'
                }
            ],

            //            tbar: [
            //                this.filterEdition, " ", this.filterEmployee,
            //                new Ext.Button({ text:_("Find"), cls: 'x-btn-text-icon', icon: _ico("control.png") })
            //            ],

            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: this.store
            })
        });

        Inprint.system.logs.Panel.superclass.initComponent.apply(this, arguments);

    },

    onRender: function() {
        Inprint.system.logs.Panel.superclass.onRender.apply(this, arguments);
        this.store.load();
    },

    reload: function() {
        this.store.reload();
    }

});