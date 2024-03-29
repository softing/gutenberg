// Inprint Content 5.0
// Copyright(c) 2001-2011, Softing, LLC.
// licensing@softing.ru
// http://softing.ru/license

Inprint.documents.GridActions = function() {

    return {

        // Create new document
        Create: function() {
            var panel = new Inprint.cmp.CreateDocument();
            panel.show();
            panel.on("complete", function() { this.cmpReload(); }, this);
        },

        // Update document's short profile
        Update: function() {
            var panel = new Inprint.cmp.UpdateDocument({
                document: this.getValue("id")
            });
            panel.show();
            panel.on("complete", function() {
                this.cmpReload();
            }, this);
        },

        // Capture document from another user
        Capture: function() {
            Ext.MessageBox.confirm(
                _("Document capture"),
                _("You really want to do this?"),
                function(btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: _url("/documents/capture/"),
                            scope:this,
                            success: this.cmpReload,
                            params: { id: this.getValues("id") }
                        });
                    }
                }, this).setIcon(Ext.MessageBox.WARNING);
        },

        // Move document(s) to another user
        Transfer: function() {

            var params = {};

            var editions = this.getValues("edition");
            var stages   = this.getValues("stage");

            for (var c=0; c < editions.length; c++) {
                if (params.edition && params.edition != editions[c]) {
                    params.edition = null;
                    break;
                }
                params.edition = editions[c];
            }

            for (var c=0; c < stages.length; c++) {
                if (params.stage && params.stage != stages[c]) {
                    params.stage = null;
                    break;
                }
                params.stage = stages[c];
            }

            var panel = new Inprint.cmp.ExcahngeBrowser(params).show();

            panel.on("complete", function(id){

                Ext.Ajax.request({
                    url: _url("/documents/transfer/"),
                    scope:this,
                    success: this.cmpReload,
                    params: {
                        id: this.getValues("id"),
                        transfer: id
                    }
                });

            }, this);

        },

        // Move document(s) to briefcase
        Briefcase: function() {
            Ext.MessageBox.confirm(
                _("Moving to the briefcase"),
                _("You really want to do this?"),
                function(btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: _url("/documents/briefcase/"),
                            scope:this,
                            success: this.cmpReload,
                            params: {
                                id: this.getValues("id")
                            }
                        });
                    }
                }, this).setIcon(Ext.MessageBox.WARNING);
        },

        // Move document(s) to another fascicle
        Move: function() {
            var cmp = new Inprint.cmp.MoveDocument();
            cmp.setId(this.getValues("id"));
            cmp.show();
            cmp.on("actioncomplete", function() {
                this.cmpReload();
            }, this);
        },

        // Copy document(s) to another fascicle(s)
        Copy: function() {
            var cmp = new Inprint.cmp.CopyDocument();
            cmp.setId(this.getValues("id"));
            cmp.show();
            cmp.on("actioncomplete", function() {
                this.cmpReload();
            }, this);
        },

        // Duplicate document(s) to another fascicle(s)
        Duplicate: function() {
            var cmp = new Inprint.cmp.DuplicateDocument();
            cmp.setId(this.getValues("id"));
            cmp.show();
            cmp.on("actioncomplete", function() {
                this.cmpReload();
            }, this);
        },

        // Move document(s) to Recycle Bin
        Recycle: function() {
            Ext.MessageBox.confirm(
                _("Moving to the recycle bin"),
                _("You really want to do this?"),
                function(btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: _url("/documents/recycle/"),
                            scope:this,
                            success: this.cmpReload,
                            params: { id: this.getValues("id") }
                        });
                    }
                }, this).setIcon(Ext.MessageBox.WARNING);
        },

        // Restore documents from Recycle Bin
        Restore: function() {
            Ext.MessageBox.confirm(
                _("Document restoration"),
                _("You really want to do this?"),
                function(btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: _url("/documents/restore/"),
                            scope:this,
                            success: this.cmpReload,
                            params: { id: this.getValues("id") }
                        });
                    }
                }, this).setIcon(Ext.MessageBox.WARNING);
        },

        // Delete document from DB and Filesystem
        Delete: function() {
            Ext.MessageBox.confirm(
                _("Irreversible removal"),
                _("You can't cancel this action!"),
                function(btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: _url("/documents/delete/"),
                            scope:this,
                            success: this.cmpReload,
                            params: { id: this.getValues("id") }
                        });
                    }
                }, this).setIcon(Ext.MessageBox.WARNING);
        }
    };

};
