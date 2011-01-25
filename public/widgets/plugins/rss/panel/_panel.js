Inprint.plugins.rss.Profile = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.initialized = false;

        this.urls = {
            "read":   _url("/rss/read/"),
            "update": _url("/rss/update/")
        }

        this.children = {
            "form": new Inprint.plugins.rss.profile.Form({
                parent: this
            }),
            "grid": new Inprint.plugins.rss.profile.Grid({
                parent: this
            })
        }

        this.tbar = [
            {
                icon: _ico("disk-black"),
                cls: "x-btn-text-icon",
                text: _("Save"),
                disabled:true,
                ref: "../btnSave",
                scope:this,
                handler: this.cmpSave
            },

            {
                icon: _ico("document-globe"),
                cls: "x-btn-text-icon",
                text: _("Upload"),
                disabled:true,
                ref: "../btnUpload",
                scope:this,
                handler: this.cmpUpload
            },

            //"|",
            //{
            //    icon: _ico("printer"),
            //    cls: "x-btn-text-icon",
            //    text: _("Published"),
            //    disabled:true,
            //    ref: "../btnPublish",
            //    scope:this,
            //    pressed: false,
            //    enableToggle: true,
            //    toggleHandler: this.cmpPublish
            //},

            "->",
            {
                icon: _ico("arrow-circle-double"),
                cls: "x-btn-text-icon",
                text: _("Reload"),
                scope:this,
                handler: this.cmpFill
            }
        ];

        this.layout = 'hbox';
        this.layoutConfig = {
            align : 'stretch',
            pack  : 'start'
        };

        this.items = [
            this.children["form"],
            this.children["grid"]
        ];

        Ext.apply(this, {
            border:false
        });

        // Call parent (required)
        Inprint.plugins.rss.Profile.superclass.initComponent.apply(this, arguments);
    },

    onRender: function() {
        Inprint.plugins.rss.Profile.superclass.onRender.apply(this, arguments);

        this.grid = this.children["grid"];
        this.form = this.children["form"].getForm();
        this.form.url = this.urls["update"];

        this.children["form"].on("actioncomplete", function (form, action) {
            if (action.type == "submit") {
                //this.children["grid"].getStore().reload();
            }
        }, this);

    },

    cmpFill: function(id) {

        this.oid = id;

        this.form.reset();
        this.form.baseParams = {
            document: id
        };

        this.cmpAccess();
        this.getEl().mask(_("Loading") + "...");

        this.form.load({
            url: this.urls["read"],
            scope:this,
            params: {
                document: id
            },
            success: function(form, action) {
                this.initialized = true;
                this.cmpAccess(action.result.data.access);
                //if (action.result.data.published) {
                //    this.btnPublish.toggle(true);
                //} else {
                //    this.btnPublish.toggle(false);
                //}
            }
        });

        this.grid.getStore().baseParams = { oid: id };
        this.grid.getStore().reload();

    },

    cmpAccess: function(access) {
        _disable(this.btnSave, this.btnUpload, this.btnPublish);
        if (access && access["rss"] == true) {
            _enable(this.btnSave, this.btnUpload, this.btnPublish);
            this.getEl().unmask();
        } else {
            this.getEl().mask(_("Access denide"));
        }
    },

    cmpSave: function() {
        this.getEl().mask(_("Saving")+"...");
        this.form.submit();
        this.getEl().unmask();
    },

    cmpUpload: function() {

        var cookies = document.cookie.split(";");
        var Session;

        Ext.each(cookies, function(cookie) {
            var nvp = cookie.split("=");
            if (nvp[0].trim() == 'sid')
            {
                Session = nvp[1];
            }
        });

        var UploadPanel = {
            xtype:'awesomeuploader',
            border:false,
            gridWidth:470,
            gridHeight:120,
            height:180,
            extraPostData: {
                sid: Session,
                document: this.oid
            },
            xhrUploadUrl: _url("/rss/upload/"),
            flashUploadUrl: _url("/rss/upload/"),
            standardUploadUrl: _url("/rss/upload/"),
            awesomeUploaderRoot: _url("/rss/uploader/"),
            listeners:{
                scope:this,
                fileupload:function(uploader, success, result){
                    if(success){
                        alert("success");
                    }
                }
            }
        }

        var Uploader = new Ext.Window({
            title: _('Download files'),
            modal:true,
            layout:"fit",
            width: 500,
            height: 200,
            bodyBorder:false,
            border:false,
            items: UploadPanel
        });

        Uploader.show();

    },

    cmpPublish: function(btn, tgl) {

        var url = _url("/rss/publish/");
        if (tgl == false) {
            url = _url("/rss/unpublish/");
        }

        Ext.Ajax.request({
            url: url,
            scope:this,
            success: this.cmpReload,
            params: { id: this.oid }
        });

    }

});
