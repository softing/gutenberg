Inprint.calendar.fascicles.Grid = Ext.extend(Ext.ux.tree.TreeGrid, {

    initComponent: function() {

        this.access = {};

        this.tbar = Inprint.calendar.fascicles.Toolbar(this);

        this.columns = [
            Inprint.calendar.GridColumns.shortcut,
            Inprint.calendar.GridColumns.num,
            Inprint.calendar.GridColumns.circulation,
            Inprint.calendar.GridColumns.template,
            Inprint.calendar.GridColumns.docdate,
            Inprint.calendar.GridColumns.advdate,
            Inprint.calendar.GridColumns.printdate,
            Inprint.calendar.GridColumns.releasedate
        ];

        Ext.apply(this, {
            border:false,
            disabled:true,
            dataUrl: _source("fascicle.list")
        });

        Inprint.calendar.fascicles.Grid.superclass.initComponent.apply(this, arguments);
    },

    onRender: function() {
        Inprint.calendar.fascicles.Grid.superclass.onRender.apply(this, arguments);
    },

    /* Getters */

    getAccess: function(id) {
        return this.access[id];
    },
    setAccess: function(id, value) {
        this.access[id] = value;
    },

    /* Functions */
    cmpGetSelectedNode: function() {
        return this.getSelectionModel().getSelectedNode();
    },

    cmpLoad: function(params) {
        Ext.apply(this.getLoader().baseParams, params);
        this.getRootNode().reload();
    },

    cmpReload: function() {
        this.getRootNode().reload();
    },

    cmpReloadWithMenu: function() {
        this.getRootNode().reload();
        Inprint.layout.getMenu().CmpQuery();
    },

    /* -------------- */

    cmpCreateWindow: function(width, height, form, title, btns) {
        return new Ext.Window({
            modal: true,
            layout: "fit",
            closeAction: "hide",
            width: width,
            height: height,
            title: title,
            items: form,
            buttons: btns,
            plain: true,
            bodyStyle:'padding:5px 5px 5px 5px'
        });
    },

    /* -------------- */

    cmpCreateFascicle: function() {

        var form = new Inprint.calendar.fascicles.Create({
            parent: this,
            url: _source("fascicle.create")
        });

        form.cmpSetValue("edition", this.currentEdition);

        var wndw = this.cmpCreateWindow(
            600, 300,
            form, _("New issue"),
            [ _BTN_WNDW_ADD, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReloadWithMenu();
            }
        }, this);

    },

    cmpUpdateFascicle: function(id) {

        if (!id) id = this.cmpGetSelectedNode().id;

        var form = new Inprint.calendar.fascicles.Update();
        form.cmpFill(id);

        var wndw = this.cmpCreateWindow(
            700, 350,
            form, _("Issue parameters"),
            [ _BTN_WNDW_SAVE, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReload();
            }
        }, this);

    },

    cmpCreateAttachment: function() {

        var form = new Inprint.calendar.attachments.Create();

        form.cmpSetValue("edition", this.currentEdition);

        var wndw = this.cmpCreateWindow(
            360, 180,
            form, _("New attachment"),
            [ _BTN_WNDW_ADD, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReloadWithMenu();
            }
        }, this);

    },

    cmpUpdateAttachment: function(id) {

        if (!id) id = this.cmpGetSelectedNode().id;

        var form = new Inprint.calendar.attachments.Update();
        form.cmpFill(id);

        var wndw = this.cmpCreateWindow(
            360,320,
            form, _("Attachment parameters"),
            [ _BTN_WNDW_SAVE, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReload();
            }
        }, this);

    },

    cmpDeadline: function() {

        var node    = this.cmpGetSelectedNode();
        var id      = this.cmpGetSelectedNode().id;
        var fastype = this.cmpGetSelectedNode().fastype;

        var form = new Inprint.calendar.Deadline().cmpInit(node);

        var wndw = this.cmpCreateWindow(
            360,320, form, _("Editing deadline"), [ _BTN_WNDW_SAVE, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReload();
            }
        }, this);

    },

    /* -------------- */

    cmpTemplate: function(btn) {

        if (btn != 'yes' && btn != 'no') {
            Ext.MessageBox.show({
                scope: this,
                title: _("Important event"),
                msg: _("Save as template?"),
                fn: this.cmpTemplate,
                buttons: Ext.Msg.YESNO,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        if (btn == 'yes') {
            Ext.Ajax.request({
                url: _source("fascicle.template"),
                params: {
                    id: this.cmpGetSelectedNode().id
                },
                scope: this,
                success: this.cmpReloadWithMenu
            });
        }

    },

    cmpFormat: function() {

        var form = new Inprint.calendar.fascicles.Format({
            parent: this
        });

        var wndw = this.cmpCreateWindow(
            400, 160,
            form, _("Format issue"),
            [ _BTN_WNDW_OK, _BTN_WNDW_CLOSE ]
        ).show();

        form.on('actioncomplete', function(form, action) {
            if (action.type == "submit") {
                wndw.close();
                this.cmpReload();
            }
        }, this);

    },

    cmpArchive: function(btn) {

        if (btn != 'yes' && btn != 'no') {
            Ext.MessageBox.show({
                scope: this,
                title: _("Important event"),
                msg: _("Archive the specified item?"),
                fn: this.cmpArchive,
                buttons: Ext.Msg.YESNO,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        if (btn == 'yes') {
            Ext.Ajax.request({
                url: _source("fascicle.archive"),
                params: {
                    id: this.cmpGetSelectedNode().id
                },
                scope: this,
                success: this.cmpReloadWithMenu
            });
        }

    },

    cmpEnable: function(btn) {
        Ext.Ajax.request({
            url: _source("fascicle.enable"),
            params: {
                id: this.cmpGetSelectedNode().id
            },
            scope: this,
            success: this.cmpReloadWithMenu
        });
    },

    cmpDisable: function(btn) {
        Ext.Ajax.request({
            url: _source("fascicle.disable"),
            params: {
                id: this.cmpGetSelectedNode().id
            },
            scope: this,
            success: this.cmpReloadWithMenu
        });
    },

    cmpRemove: function(id) {
        Ext.MessageBox.show({
            scope: this,
            title: _("Important event"),
            msg: _("Delete the specified item?"),
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: _source("fascicle.remove"),
                        params: { id: id },
                        scope: this,
                        success: this.cmpReloadWithMenu
                    });
                }
            },
            buttons: Ext.Msg.YESNO,
            icon: Ext.MessageBox.WARNING
        });
    }

});
