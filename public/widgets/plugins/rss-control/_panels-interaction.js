Inprint.plugins.rss.control.Interaction = function(parent, panels) {

    var tree = panels.tree;
    var grid = panels.grid;
    var help = panels.help;

    var managed = false;

    // Tree

    tree.getSelectionModel().on("selectionchange", function(sm, node) {
        if (node && node.id) {
            grid.enable();
            grid.cmpFill(node.id);
        } else {
            grid.disable();
        }
    });

    //tree.getSelectionModel().on("selectionchange", function(sm, node) {
    //    if (node && node.id) {
    //
    //        grid.enable();
    //        grid.currentEdition = node.id;
    //
    //        _disable(grid.btnCreate, grid.btnUpdate, grid.btnDelete);
    //
    //        _a(["editions.calendar.manage"], grid.currentEdition, function(access) {
    //
    //            if (access["editions.calendar.manage"] === true) {
    //                managed = true;
    //                _enable(grid.btnCreate);
    //            } else {
    //                managed = false;
    //                _disable(grid.btnCreate);
    //            }
    //
    //
    //            grid.getRootNode().reload();
    //
    //        });
    //
    //    } else {
    //        grid.disable();
    //    }
    //});
    //
    //// Grid
    //
    //grid.getSelectionModel().on("selectionchange", function(sm, node) {
    //
    //    _disable(grid.btnUpdate, grid.btnDelete, grid.btnEnable, grid.btnDisable);
    //    if (node && managed) {
    //        _enable(grid.btnUpdate, grid.btnDelete, grid.btnEnable, grid.btnDisable);
    //    }
    //
    //});

}
