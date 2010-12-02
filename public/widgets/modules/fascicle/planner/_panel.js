Inprint.fascicle.planner.Panel = Ext.extend(Ext.Panel, {

    initComponent: function() {
        
        this.manager;
        this.version;
        this.access = {};
        
        this.panels = {
            pages: new Inprint.fascicle.planner.Pages({
                parent: this,
                oid: this.oid
            }),
            documents: new Inprint.fascicle.planner.Documents({
                parent: this,
                oid: this.oid
            }),
            summary: new Inprint.fascicle.planner.Summary({
                parent: this,
                oid: this.oid
            })
        }
        
        this.tbar = [
            {
                ref: "../btnPageAdd",
                disabled:true,
                text: "Добавить полосу",
                tooltip: 'Добавить новые полосы в этот выпуск',
                icon: _ico("plus-button"),
                cls: 'x-btn-text-icon',
                scope: this,
                handler: this.panels["pages"].cmpAdd
            },
            {
                ref: "../btnPageEdit",
                disabled:true,
                text:'Редактировать',
                icon: _ico("pencil"),
                cls: 'x-btn-text-icon',
                scope: this,
                handler: this.panels["pages"].cmpEdit
            },
            {
                ref: "../btnPageRemove",
                disabled:true,
                text: 'Удалить',
                tooltip: 'Удалить полосы',
                icon: _ico("minus-button"),
                cls: 'x-btn-text-icon',
                scope:this,
                handler: this.panels["pages"].cmpRemove
            },
            {
                ref: "../btnPageMove",
                disabled:true,
                text:'Перенести',
                tooltip: 'Перенести отмеченные полосы',
                icon: _ico("navigation-000-button"),
                cls: 'x-btn-text-icon',
                scope:this,
                handler: this.panels["pages"].cmpMove
            },
            {
                ref: "../btnPageClean",
                disabled:true,
                text: 'Очистить',
                tooltip: 'Очистить содержимое полос',
                icon: _ico("eraser"),
                cls: 'x-btn-text-icon',
                scope:this,
                handler: this.panels["pages"].cmpErase
            },
            {
                ref: "../btnPageResize",
                disabled:true,
                text: 'Разверстать',
                tooltip: 'Добавить новые полосы скопировав содержимое',
                icon: _ico("arrow-resize-045"),
                cls: 'x-btn-text-icon',
                scope:this,
                handler: this.panels["pages"].cmpResize
            },
            '->',
            {
                ref: "../btnSave",
                disabled:true,
                text: 'Сохранить',
                tooltip: 'Сохранить изменения в компоновке выпуска',
                icon: _ico("disk-black"),
                cls: 'x-btn-text-icon',
                scope:this,
                handler: this.cmpSave
            },
            '-',
            {
                ref: "../btnBeginSession",
                icon: _ico("control"),
                cls: 'x-btn-text-icon',
                hidden:false,
                text: 'Открыть сеанс',
                tooltip: 'Открыть сеанс редактирования',
                scope: this,
                handler: this.beginEdit
            },
            {
                ref: "../btnCaptureSession",
                icon: _ico("hand"),
                cls: 'x-btn-text-icon',
                hidden:true,
                text: 'Захватить сеанс',
                tooltip: 'Захватить сеанс редактирования',
                scope: this,
                handler: this.captureSession
            },
            {
                ref: "../btnEndSession",
                icon: _ico("control-stop-square"),
                cls: 'x-btn-text-icon',
                hidden:true,
                text: 'Закрыть сеанс',
                tooltip: 'Закрыть сеанс редактирования',
                scope: this,
                handler: this.endEdit
            },
            "-",
            {
                text: 'Печать А4',
                icon: _ico("printer"),
                cls: 'x-btn-text-icon',
                scope:this, 
                handler: function() {
                    
                }
            },
            {
                text: 'Печать А3',
                icon: _ico("printer"),
                cls: 'x-btn-text-icon',
                scope:this, 
                handler: function() {
                    
                }
            }
        ];
        
        Ext.apply(this, {
            layout: "border",
            autoScroll:true,
            defaults: {
                collapsible: false,
                split: true
            },
            
            items: [
                {
                    border:false,
                    region: "center",
                    layout: "border",
                    margins: "3 0 3 3",
                    defaults: {
                        collapsible: false,
                        split: true
                    },
                    items: [
                        {
                            region: "center",
                            layout: "fit",
                            items: this.panels["pages"]
                        },
                        {
                            region:"south",
                            height: 200,
                            minSize: 100,
                            maxSize: 800,
                            layout:"fit",
                            collapseMode: 'mini',
                            items: this.panels["documents"]
                        }
                    ]
                },
                {
                    region:"east",
                    margins: "3 3 3 0",
                    width: 280,
                    minSize: 50,
                    maxSize: 800,
                    layout:"fit",
                    collapseMode: 'mini',
                    items: this.panels["summary"]
                }
            ]
        });
        
        Inprint.fascicle.planner.Panel.superclass.initComponent.apply(this, arguments);

    },

    onRender: function() {
        Inprint.fascicle.planner.Panel.superclass.onRender.apply(this, arguments);
        
        Inprint.fascicle.planner.Context(this, this.panels);
        Inprint.fascicle.planner.Interaction(this, this.panels);
        
        this.cmpInitSession();
        
    },
    
    cmpInitSession: function () {
        this.body.mask("Обновление данных...");
        Ext.Ajax.request({
            url: _url("/fascicle/seance/"),
            scope: this,
            params: {
                fascicle: this.oid
            },
            callback: function() {
                this.body.unmask();
            },
            success: function(response) {
                
                var rsp = Ext.util.JSON.decode(response.responseText)
                
                this.version = rsp.fascicle.version;
                this.manager = rsp.fascicle.manager;
                
                var shortcut = rsp.fascicle.shortcut;
                var description = "";
                
                if (rsp.fascicle.manager) {
                    description += '&nbsp;[<b>Работает '+ rsp.fascicle.manager_shortcut +'</b>]';
                }
                
                description += '&nbsp;[Полос&nbsp;'+ rsp.fascicle.pc +'='+ rsp.fascicle.dc +'+'+ rsp.fascicle.ac;
                description += '&nbsp;|&nbsp;'+ rsp.fascicle.dav +'%/'+ rsp.fascicle.aav +'%]';
                
                var title = Inprint.ObjectResolver.makeTitle(this.parent.oid, this.parent.aid, this.parent.icon, shortcut, description);
                this.parent.setTitle(title)
                
                this.panels["pages"].getStore().loadData({ data: rsp.pages });
                this.panels["documents"].getStore().loadData({ data: rsp.documents });
                this.panels["summary"].getStore().loadData({ data: rsp.summary });
                
                Inprint.fascicle.planner.Access(this, this.panels, rsp.fascicle.access);
                
                this.cmpCheckSession.defer( 10000, this);
            }
        });
    },
    
    cmpReload: function() {
        this.cmpInitSession();
    },

    cmpCheckSession: function () {
        Ext.Ajax.request({
            url: _url("/fascicle/check/"),
            scope: this,
            params: {
                fascicle: this.oid
            },
            success: function(response) {
                var rsp = Ext.util.JSON.decode(response.responseText);
                Inprint.fascicle.planner.Access(this, this.panels, rsp.fascicle.access);
                if (this.manager && this.manager != rsp.fascicle.manager) {
                    Ext.MessageBox.alert(_("Error"), _("Another employee %1 captured this issue!", [1]));
                } else {
                    this.cmpCheckSession.defer( 10000, this);
                }
            }
        });
    },

    captureSession: function() {
        this.body.mask("Попытка захвата редактирования...");
        Ext.Ajax.request({
            url: _url("/fascicle/capture/"),
            scope: this,
            params: {
                fascicle: this.oid
            },
            callback: function() { this.body.unmask() },
            success: function(response) {
                var rsp = Ext.util.JSON.decode(response.responseText)
                if (!rsp.success && rsp.errors[0]) {
                    Ext.MessageBox.alert(_("Error"), _(rsp.errors[0].msg));
                }
                this.cmpReload();
            }
        });
    },

    beginEdit: function() {
        
        this.body.mask("Открываем выпуск...");
        
        Ext.Ajax.request({
            url: _url("/fascicle/open/"),
            scope: this,
            params: {
                fascicle: this.oid
            },
            callback: function() { this.body.unmask() },
            success: function(response) {
                var rsp = Ext.util.JSON.decode(response.responseText)
                if (!rsp.success && rsp.errors[0]) {
                    Ext.MessageBox.alert(_("Error"), _(rsp.errors[0].msg));
                }
                this.cmpReload();
            }
        });
    },

    endEdit: function() {
        
        this.body.mask("Закрываем выпуск...");
        
        Ext.Ajax.request({
            url: _url("/fascicle/close/"),
            scope: this,
            params: {
                fascicle: this.oid
            },
            callback: function() { this.body.unmask() },
            success: function(response) {
                var rsp = Ext.util.JSON.decode(response.responseText)
                if (!rsp.success && rsp.errors[0]) {
                    Ext.MessageBox.alert(_("Error"), _(rsp.errors[0].msg));
                }
                this.cmpReload();
            }
        });
    },

    cmpSave: function() {
        
        //var panel1 = this.layout.east.panel; // advert
        //var panel2 = this.layout.center.panel.layout.center.panel; // pages
        //var panel3 = this.layout.center.panel.layout.south.panel; // documents
        //
        //var data1 = [];
        //var data2 = [];
        //
        //// get documents changes
        //
        //var records1 = panel3.getStore().getModifiedRecords();
        //if(records1.length) {
        //    Ext.each(records1, function(r, i) {
        //        var o = r.getChanges();
        //        if(r.data.newRecord) {
        //            o.newRecord = true;
        //        }
        //        o.uuid = r.get('uuid');
        //        data1.push(o.uuid +'::'+ o.page_str);
        //    }, this);
        //}
        //
        //// get advert changes
        //
        //var records2 = panel1.getStore().getModifiedRecords();
        //if(records2.length) { 
        //    Ext.each(records2, function(r, i) {
        //        var o = r.getChanges();
        //        if(r.data.newRecord) {
        //            o.newRecord = true;
        //        }
        //        o.uuid = r.get('uuid');
        //        data2.push(o.page+'::'+o.uuid);
        //    }, this);
        //}
        //
        //// save state
        //
        //this.body.mask("Сохранение данных");
        //
        //var o = {
        //    url:this.url.save,
        //    params:{
        //        fascicle: this.fascicle,
        //        documents: data1,
        //        advertising: data2
        //    },
        //    scope:this,
        //    success: function () {
        //        
        //        panel1.getStore().rejectChanges();
        //        panel3.getStore().rejectChanges();
        //        
        //        this.cmpReload();
        //    },
        //    failure: Inprint.ajax.failure
        //};
        //
        //Ext.Ajax.request(o);
        
    },

    cmpOnClose: function(inc) {

        if (inc == 'no') {
            return false;
        } else if ( inc == 'yes') {
            this.endEdit();
            Inprint.layout.remove(this);
            return true;
        }
        
        if (this.sessionIsActive) {
            var mbx = Ext.MessageBox.confirm(
                'Подтверждение',
                'Закрыть сессию перед закрытием вкладки?',
                this.cmpOnClose, this
            );
            return false;
        }
        
        return true;
    }

});

Inprint.registry.register("fascicle-planner", {
    icon: "clock",
    text: _("Planning"),
    xobject: Inprint.fascicle.planner.Panel
});