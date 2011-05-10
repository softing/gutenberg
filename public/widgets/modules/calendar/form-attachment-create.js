Inprint.calendar.attachments.Create = Ext.extend( Ext.form.FormPanel,
{

    initComponent: function()
    {

        this.items = [

            _FLD_HDN_EDITION,

            {
                xtype: "titlefield",
                value: _("Basic parameters")
            },

            Inprint.factory.Combo.create(
                "/calendar/combos/parents/",
                {
                    name: "parent",
                    title: _("Issue"),
                    allowBlank:false,
                    listeners: {
                        scope: this,
                        beforequery: function(qe) {
                            delete qe.combo.lastQuery;
                        }
                    }
                }
            ),

            Inprint.factory.Combo.create(
                    "/calendar/combos/sources/", {
                        fieldLabel: _("Template"),
                        name: "source",
                        listeners: {
                            render: function(combo) {
                                combo.setValue("00000000-0000-0000-0000-000000000000", _("Defaults"));
                            },
                            beforequery: function(qe) {
                                delete qe.combo.lastQuery;
                            }
                        }
                }),

            {
                xtype: "numberfield",
                name: "circulation",
                fieldLabel: _("Circulation"),
                value: 0
            }

        ];

        Ext.apply(this,  {
            xtype: "form",
            border:false,
            layout: 'form',
            bodyStyle:'padding:10px',
            defaults:{
                anchor:'100%'
            }
        });

        Inprint.calendar.attachments.Create.superclass.initComponent.apply(this, arguments);
        this.getForm().url = _source("attachment.create");
    },

    onRender: function() {
        Inprint.calendar.attachments.Create.superclass.onRender.apply(this, arguments);
    },

    cmpInit: function(node) {

        return this;
    }

});