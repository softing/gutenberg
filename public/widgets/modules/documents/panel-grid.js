Inprint.documents.Grid = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {

        this.components = {};

        this.urls = {
            list:    "/documents/list/"
        }

        this.store = Inprint.factory.Store.json(this.urls.list, {
            remoteSort: true,
            totalProperty: 'total',
            baseParams: {
                gridmode: this.gridmode
            }
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();

        this.columns = [
            this.sm,
            {
                id : 'viewed',
                fixed : true,
                menuDisabled : true,
                header : '&nbsp;',
                width : 26,
                sortable : true,
                renderer : this.renderers.viewed
            },
            {
                id:"title",
                dataIndex: "title",
                header: _("Title"),
                width: 210,
                sortable: true,
                renderer : this.renderers.title
                //filter: { xtype:"textfield", filterName:"flt_title" }
            },
            {
                id:"edition",
                dataIndex: "edition_shortcut",
                header: _("Edition"),
                width: 90,
                sortable: true
            },
            {
                id:"maingroup",
                dataIndex: "maingroup_shortcut",
                header: _("Group"),
                width: 90,
                sortable: true
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/groups",
                //    {
                //        xtype: "combo",
                //        stateful:true,
                //        //filterName:"flt_group",
                //        nocache: true
                //    }
                //)
            },
            {
                id:"fascicle",
                dataIndex: "fascicle_shortcut",
                header: _("Fascicle"),
                width: 90,
                sortable: true,
                renderer : this.renderers.fascicle
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/fascicles",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_fascicle",
                //        nocache: true,
                //        listeners:{
                //            beforeselect: {
                //                scope:this,
                //                fn: function(combo, record, indx) {
                //                    if (record.data.id) {
                //                        this.getHeaderFilterField("flt_headline").enable();
                //                    } else {
                //                        this.getHeaderFilterField("flt_headline").disable();
                //                        this.getHeaderFilterField("flt_rubric").disable();
                //                    }
                //                }
                //            },
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_group: this.getHeaderFilter("flt_group")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"headline",
                dataIndex: "headline_shortcut",
                header: _("Headline"),
                width: 90,
                sortable: true
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/headlines",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_headline",
                //        disabled:true,
                //        nocache: true,
                //        listeners:{
                //            beforeselect: {
                //                scope:this,
                //                fn: function(combo, record, indx) {
                //                    if (record.data.id) {
                //                        this.getHeaderFilterField("flt_rubric").enable();
                //                    } else {
                //                        this.getHeaderFilterField("flt_rubric").disable();
                //                    }
                //                }
                //            },
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_fascicle: this.getHeaderFilter("flt_fascicle")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"rubric",
                dataIndex: "rubric_shortcut",
                header: _("Rubric"),
                width: 90,
                sortable: true
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/rubrics",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_rubric",
                //        disabled:true,
                //        nocache: true,
                //        listeners:{
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_fascicle: this.getHeaderFilter("flt_fascicle"),
                //                        flt_headline: this.getHeaderFilter("flt_headline")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"pages",
                dataIndex: "pages",
                header: _("Pages"),
                width: 80,
                sortable: true
            },

            {
                id:"manager",
                dataIndex: "manager_shortcut",
                header: _("Manager"),
                width: 100,
                sortable: true
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/managers",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_manager",
                //        nocache: true,
                //        listeners:{
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_group: this.getHeaderFilter("flt_group")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"progress",
                dataIndex: "progress",
                header: _("Progress"),
                sortable: true,
                width: 80,
                renderer : this.renderers.progress
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/progress",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_progress",
                //        nocache: true,
                //        listeners:{
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_group: this.getHeaderFilter("flt_group")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"holder",
                dataIndex: "holder_shortcut",
                header: _("Holder"),
                width: 100,
                sortable: true
                //filter: Inprint.factory.Combo.getConfig(
                //    "/documents/combos/holders",
                //    {
                //        xtype: "xcombo",
                //        filterName:"flt_holder",
                //        nocache: true,
                //        listeners:{
                //            beforequery : {
                //                scope:this,
                //                fn: function(e) {
                //                    e.combo.getStore().baseParams = {
                //                        flt_group: this.getHeaderFilter("flt_group")
                //                    };
                //                }
                //            }
                //        }
                //    }
                //)
            },
            {
                id:"images",
                dataIndex: "images",
                header : '<img src="'+ _ico("camera") +'">',
                width:30,
                sortable: true
            },
            {
                id:"size",
                dataIndex: "rsize",
                header : '<img src="'+ _ico("edit") +'">',
                width:40,
                sortable: true,
                renderer : this.renderers.size
            }

        ];

        var xc = Inprint.factory.Combo;

        this.filter = new Ext.FormPanel({
            border:false,
            layout:'column',
            defaults: {
                nocache: true
            },
            items: [
                {
                    width:180,
                    xtype: 'textfield',
                    emptyText: _("Title") + "..."
                },
                xc.getConfig("/documents/combos/editions/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/groups/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/fascicles/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/headlines/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/rubrics/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/managers/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/progress/", { columnWidth:.125 }),
                xc.getConfig("/documents/combos/holders/", { columnWidth:.125 }),
                {
                    xtype: 'button',
                    icon: _ico('magnifier'),
                    cls: 'x-btn-icon'
                }
            ]
        });

        this.tbar = {
            xtype    : 'container',
            layout   : 'anchor',
            height   : 27 * 2,
            defaults : { height : 27, anchor : '100%' },
            items    : [
                {
                    xtype: "toolbar",
                    items : [
                        {
                            icon: _ico("plus-button"),
                            cls: "x-btn-text-icon",
                            text: _("Add"),
                            disabled:true,
                            ref: "../../btnCreate",
                            scope:this,
                            handler: this.cmpCreate
                        },
                        {
                            icon: _ico("pencil"),
                            cls: "x-btn-text-icon",
                            text: _("Edit"),
                            disabled:true,
                            ref: "../../btnUpdate",
                            scope:this,
                            handler: this.cmpCreate
                        },
                        '-',
                        {
                            icon: _ico("hand"),
                            cls: "x-btn-text-icon",
                            text: _("Capture"),
                            disabled:true,
                            ref: "../../btnCapture",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        {
                            icon: _ico("arrow"),
                            cls: "x-btn-text-icon",
                            text: _("Transfer"),
                            disabled:true,
                            ref: "../../btnTransfer",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        {
                            icon: _ico("briefcase"),
                            cls: "x-btn-text-icon",
                            text: _("Briefcase"),
                            disabled:true,
                            ref: "../../btnBriefcase",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        "-",
                        {
                            icon: _ico("document-copy"),
                            cls: "x-btn-text-icon",
                            text: _("Copy"),
                            disabled:true,
                            ref: "../../btnCopy",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        {
                            icon: _ico("documents"),
                            cls: "x-btn-text-icon",
                            text: _("Duplicate"),
                            disabled:true,
                            ref: "../../btnDuplicate",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        "-",
                        {
                            icon: _ico("bin--plus"),
                            cls: "x-btn-text-icon",
                            text: _("Recycle Bin"),
                            disabled:true,
                            ref: "../btnRecycle",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        {
                            icon: _ico("bin--arrow"),
                            cls: "x-btn-text-icon",
                            text: _("Restore"),
                            disabled:true,
                            ref: "../../btnRestore",
                            scope:this,
                            handler: this.cmpDelete
                        },
                        {
                            icon: _ico("minus-button"),
                            cls: "x-btn-text-icon",
                            text: _("Delete"),
                            disabled:true,
                            ref: "../../btnDelete",
                            scope:this,
                            handler: this.cmpDelete
                        }

                    ]
                },
                {
                    xtype: "toolbar",
                    items : this.filter
                }
            ]
        };

        //this.tbar = [
        //    {
        //        icon: _ico("plus-button"),
        //        cls: "x-btn-text-icon",
        //        text: _("Add"),
        //        disabled:true,
        //        ref: "../btnCreate",
        //        scope:this,
        //        handler: this.cmpCreate
        //    },
        //    {
        //        icon: _ico("pencil"),
        //        cls: "x-btn-text-icon",
        //        text: _("Edit"),
        //        disabled:true,
        //        ref: "../btnUpdate",
        //        scope:this,
        //        handler: this.cmpCreate
        //    },
        //    '-',
        //    {
        //        icon: _ico("hand"),
        //        cls: "x-btn-text-icon",
        //        text: _("Capture"),
        //        disabled:true,
        //        ref: "../btnCapture",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    {
        //        icon: _ico("arrow"),
        //        cls: "x-btn-text-icon",
        //        text: _("Transfer"),
        //        disabled:true,
        //        ref: "../btnTransfer",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    {
        //        icon: _ico("briefcase"),
        //        cls: "x-btn-text-icon",
        //        text: _("Briefcase"),
        //        disabled:true,
        //        ref: "../btnBriefcase",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    "-",
        //    {
        //        icon: _ico("document-copy"),
        //        cls: "x-btn-text-icon",
        //        text: _("Copy"),
        //        disabled:true,
        //        ref: "../btnCopy",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    {
        //        icon: _ico("documents"),
        //        cls: "x-btn-text-icon",
        //        text: _("Duplicate"),
        //        disabled:true,
        //        ref: "../btnDuplicate",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    "-",
        //    {
        //        icon: _ico("bin--plus"),
        //        cls: "x-btn-text-icon",
        //        text: _("Recycle Bin"),
        //        disabled:true,
        //        ref: "../btnRecycle",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    {
        //        icon: _ico("bin--arrow"),
        //        cls: "x-btn-text-icon",
        //        text: _("Restore"),
        //        disabled:true,
        //        ref: "../btnRestore",
        //        scope:this,
        //        handler: this.cmpDelete
        //    },
        //    {
        //        icon: _ico("minus-button"),
        //        cls: "x-btn-text-icon",
        //        text: _("Delete"),
        //        disabled:true,
        //        ref: "../btnDelete",
        //        scope:this,
        //        handler: this.cmpDelete
        //    }
        //];

        this.bbar = new Ext.PagingToolbar({
            pageSize: 60,
            store: this.store,
            displayInfo: true,
            displayMsg: _("Displaying documents {0} - {1} of {2}"),
            emptyMsg: _("No documents to display"),
            items:[
                '-',
                {
                    xtype:'slider',
                    stateful: true,
                    stateId: 'documents.grid.slider',
                    width: 214,
                    value:60,
                    increment: 30,
                    minValue: 60,
                    maxValue: 120,
                    listeners: {
                        scope:this,
                        statesave: function (field, state) {
                            alert(state);
                        },
                        changecomplete: function(field, value) {
                            this.store.load({params:{start:0, limit:value}});
                        }
                    }
                }
            ]
        });

        Ext.apply(this, {
            border:false,
            stripeRows: true,
            columnLines: true,
            autoExpandColumn: "title",
            sm: this.sm,
            tbar: this.tbar,
            columns: this.columns,
            bbar: this.bbar
            //plugins: [new Ext.ux.grid.GridHeaderFilters()]
        });

        Inprint.documents.Grid.superclass.initComponent.apply(this, arguments);

    },

    onRender: function() {

        Inprint.documents.Grid.superclass.onRender.apply(this, arguments);

        this.on("render", function() {

            //var flt_group    = this.getHeaderFilterField("flt_group");
            //var flt_fascicle = this.getHeaderFilterField("flt_fascicle");
            //var flt_headline = this.getHeaderFilterField("flt_headline");
            //var flt_rubric   = this.getHeaderFilterField("flt_rubric");
            //
            //if (!flt_group.getValue()) {
            //    flt_group.setValueById("00000000-0000-0000-0000-000000000000");
            //}
            //
            //if (flt_fascicle.getValue()) {
            //    flt_headline.enable();
            //}
            //
            //if (flt_headline.getValue()) {
            //    flt_rubric.enable();
            //}

        }, this);

        //this.store.on('load', function() {
        //    this.headerFilters.renderFilters(false)
        //}, this, { single:true });

        this.on("afterrender", function() {
            this.store.load({params:{start:0, limit:60}});
        }, this);

    },

    cmpCreate: function() {
        var win = this.components["create-window"];

        if (!win) {
            win = new Inprint.cmp.AddDocumentWindow();
            this.components["create-window"] = win;
        }

        win.show();
    },

    renderers: {
        viewed: function(value, p, record) {
           if (record.data.islooked)
               return '<img title="Материал был просмотрен текущим владельцем" src="'+ _ico("eye") +'">';
           return '';
        },

        title: function(value, p, record){

            var color = 'blue';

            if (!record.data.isopen)
                color = 'gray';

            value = String.format(
                '<a style="color:{2}" href="/?part=documents&page=formular&oid={0}&text={1}" '+
                    'onClick="Inprint.objResolver(\'documents\', \'formular\', { oid:\'{0}\', text:\'{1}\' });return false;">'+
                    '{1}'+
                '</a>',
                record.data.id, value, color
            );
            return value;
        },

        fascicle: function(value, p, record) {
           return value;
        },

        progress: function(v, p, record) {

            p.css += ' x-grid3-progresscol ';
            var string = '';

            if (record.data.pdate) {
                string = _fmtDate(record.data.pdate);
            }
            else if (record.data.rdate) {
                string = _fmtDate(record.data.rdate);
            }

            var style = '';
            var textClass = (v < 55) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE6 ? '-ie6' : '');


            // ugly hack to deal with IE6 issue
            var text = String.format('<div><div class="x-progress-text {0}" style="width:100%;" id="{1}">{2}</div></div>', textClass, Ext.id(), string);

            var bgcolor  = Color('#' + record.data.color).setSaturation(30);
            var fgcolor  = Color('#' + record.data.color);
            var txtcolor = Color('#' + inverse(record.data.color));

            return String.format(
                '<div class="x-progress-wrap">'+
                    '<div class="x-progress-inner" style="border:2px solid {4};background:{3}!important;">'+
                        '<div class="x-progress-bar{0}" style="width:{1}%;background:{4}!important;color:{5} !important;">{2}</div>'+
                '</div>',
                style, v, text, bgcolor.rgb(), fgcolor.rgb(), txtcolor);
        },

        size: function(value, p, record) {
            if (record.data.rsize)
                return record.data.rsize;
            if (record.data.psize)
                return String.format('<span style="color:silver">{0}</span>', record.data.psize);
            return '';
        }
    }

});
