Inprint.cmp.adverta.Request = Ext.extend(Ext.FormPanel, {

    initComponent: function() {
        
        var xc = Inprint.factory.Combo;
        
        this.items = [
            
            _FLD_HDN_ID,
            _FLD_HDN_FASCICLE,
            
            {
                xtype: "titlefield",
                value: "Заявка"
            },
            
            xc.getConfig("/advertising/combo/advertisers/", {
                hideLabel:true,
                editable:true,
                typeAhead: true,
                minChars: 2,
                allowBlank:false,
                listeners: {
                    scope: this,
                    beforequery: function(qe) {
                        delete qe.combo.lastQuery;
                    }
                }
            }),
            
            {
                xtype: "textfield",
                allowBlank:false,
                hideLabel:true,
                name: "shortcut",
                fieldLabel: _("Shortcut"),
                emptyText: _("Shortcut")
            },
            {
                xtype: "textarea",
                allowBlank:true,
                name: "description",
                hideLabel:true,
                fieldLabel: _("Description"),
                emptyText: _("Description")
            },
            
            {
                xtype: "titlefield",
                value: "Статусы"
            },
            
            {
                xtype: 'radiogroup',
                fieldLabel: _("Заявка"),
                style: "margin-bottom:10px",
                columns: 1,
                items: [
                    { name: "status", inputValue: "possible",    boxLabel: _("Possible") },
                    { name: "status", inputValue: "active",      boxLabel: _("Active") },
                    { name: "status", inputValue: "reservation", boxLabel: _("Reservation"), checked: true }
                ]
            },
            
            {
                xtype: 'radiogroup',
                fieldLabel: _("Оплачено"),
                style: "margin-bottom:10px",
                columns: 1,
                items: [
                    { name: "payment", inputValue: "yes", boxLabel: _("Yes") },
                    { name: "payment", inputValue: "no",  boxLabel: _("No"), checked: true }
                ]
            },
            
            {
                xtype: 'radiogroup',
                fieldLabel: _("Approved"),
                columns: 1,
                items: [
                    { name: "readiness", inputValue: "yes", boxLabel: _("Yes") },
                    { name: "readiness", inputValue: "no",  boxLabel: _("No"), checked: true }
                ]
            }
            
        ];
        
        Ext.apply(this, {
            flex:1,
            width: 180, 
            labelWidth: 90,
            defaults: {
                anchor: "100%",
                allowBlank:false
            },
            bodyStyle: "padding:5px 5px",
            url: _url("/fascicle/requests/process/")
        });
        
        Inprint.cmp.adverta.Request.superclass.initComponent.apply(this, arguments);
        
        this.getForm().url = this.url;
        
        
    },

    onRender: function() {
        Inprint.cmp.adverta.Request.superclass.onRender.apply(this, arguments);
    }
    
    
});
