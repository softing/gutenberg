// Ext Tree

Ext.tree.TreePanel.prototype.cmpCurrentNode = function () {
    return this.getSelectionModel().getSelectedNode();
};

Ext.tree.TreePanel.prototype.cmpReload = function() {
    if (! this.selection.leaf ) {
        this.selection.reload();
    }
}
