Inprint.fascicle.indexes.Rubrics = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {

        this.components = {};

        this.urls = {
            "create":  _url("/fascicle/rubrics/create/"),
            "read":    _url("/fascicle/rubrics/read/"),
            "update":  _url("/fascicle/rubrics/update/"),
            "delete":  _url("/fascicle/rubrics/delete/")
        };

        this.store = Inprint.factory.Store.json("/fascicle/rubrics/list/");

        this.selectionModel = new Ext.grid.CheckboxSelectionModel();

        this.columns = [
            this.selectionModel,
            {
                id:"title",
                header: _("Title"),
                width: 160,
                sortable: true,
                dataIndex: "title"
            },
            {
                id:"description",
                header: _("Description"),
                dataIndex: "description"
            }
        ];

        this.tbar = [
            {
                icon: _ico("marker--plus"),
                cls: "x-btn-text-icon",
                text: _("Add"),
                disabled: true,
                ref: "../btnCreate",
                scope:this,
                handler: function() { this.cmpCreate(); }
            },
            {
                icon: _ico("marker--pencil"),
                cls: "x-btn-text-icon",
                text: _("Edit"),
                disabled: true,
                ref: "../btnUpdate",
                scope:this,
                handler: function() { this.cmpUpdate(); }
            },
            "-",
            {
                icon: _ico("marker--minus"),
                cls: "x-btn-text-icon",
                text: _("Delete"),
                disabled: true,
                ref: "../btnDelete",
                scope:this,
                handler: function() { this.cmpDelete(); }
            }
        ];

        Ext.apply(this, {
            border: false,
            stripeRows: true,
            columnLines: true,
            sm: this.selectionModel,
            autoExpandColumn: "description"
        });

        Inprint.fascicle.indexes.Rubrics.superclass.initComponent.apply(this, arguments);

    },

    onRender: function() {
        Inprint.fascicle.indexes.Rubrics.superclass.onRender.apply(this, arguments);
    },

    cmpCreate: function() {

        var win = this.components["add-window"];

        if (!win) {

            var form = new Ext.FormPanel({

                url: this.urls.create,

                frame:false,
                border:false,

                labelWidth: 75,
                defaults: {
                    anchor: "100%",
                    allowBlank:false
                },
                bodyStyle: "padding:5px 5px",
                items: [
                    _FLD_HDN_FASCICLE,
                    _FLD_HDN_HEADLINE,
                    _FLD_TITLE,
                    _FLD_DESCRIPTION,
                    {
                        xtype: "titlefield",
                        value: _("More options")
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: _(""),
                        labelSeparator: '',
                        boxLabel: _("Use by default"),
                        name: 'bydefault',
                        checked: false
                    }
                ],
                keys: [ _KEY_ENTER_SUBMIT ],
                buttons: [ _BTN_ADD,_BTN_CLOSE ]
            });

            win = new Ext.Window({
                title: _("Adding a new category"),
                layout: "fit",
                closeAction: "hide",
                width:400, height:260,
                items: form
            });

            form.on("actioncomplete", function (form, action) {
                if (action.type == "submit") {
                    win.hide();
                    this.cmpReload();
                }
            }, this);

        }

        var form = win.items.first().getForm();
        form.reset();

        form.findField("fascicle").setValue(this.parent.fascicle);
        form.findField("headline").setValue(this.parent.headline);

        win.show(this);
        this.components["add-window"] = win;
    },

    cmpUpdate: function() {

        var win = this.components["edit-window"];

        if (!win) {

            var form = new Ext.FormPanel({
                url: this.urls.update,
                frame:false,
                border:false,
                labelWidth: 75,
                defaults: {
                    anchor: "100%",
                    allowBlank:false
                },
                bodyStyle: "padding:5px 5px",
                items: [
                    _FLD_HDN_ID,
                    _FLD_TITLE,
                    _FLD_DESCRIPTION,
                    {
                        xtype: "titlefield",
                        value: _("More options")
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: _(""),
                        labelSeparator: '',
                        boxLabel: _("Use by default"),
                        name: 'bydefault',
                        checked: false
                    }
                ],
                keys: [ _KEY_ENTER_SUBMIT ],
                buttons: [ _BTN_SAVE,_BTN_CLOSE ]
            });

            win = new Ext.Window({
                title: _("Edit category"),
                layout: "fit",
                closeAction: "hide",
                width:400, height:260,
                items: form
            });

            form.on("actioncomplete", function (form, action) {
                if (action.type == "submit") {
                    win.hide();
                    this.cmpReload();
                }
            }, this);
        }

        win.show(this);
        win.body.mask(_("Loading..."));
        this.components["edit-window"] = win;

        var form = win.items.first().getForm();
        form.reset();

        form.load({
            url: this.urls.read,
            scope:this,
            params: {
                id: this.getValue("id")
            },
            success: function(form, action) {
                win.body.unmask();
                form.findField("id").setValue(action.result.data.id);
            }
        });
    },

    cmpDelete: function() {

        var title = _("Deleting a category");

        Ext.MessageBox.confirm(
            title,
            _("You really wish to do this?"),
            function(btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: this.urls["delete"],
                        scope:this,
                        success: this.cmpReload,
                        params: { id: this.getValues("id") }
                    });
                }
            }, this).setIcon(Ext.MessageBox.WARNING);
    }

});
