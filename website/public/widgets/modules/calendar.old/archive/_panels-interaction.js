//Inprint.calendar.archive.Interaction = function(parent, panels) {
//
//    var tree = panels.tree;
//    var grid = panels.grid;
//
//    // Open issues Tree
//    tree.getSelectionModel().on("selectionchange", function(sm, node) {
//        if (node && node.id) {
//
//            grid.enable();
//            grid.currentEdition = node.id;
//
//            _a(["editions.fascicle.manage:*"], grid.currentEdition, function(access) {
//
//                if (access["editions.fascicle.manage"] === true) {
//                    _enable(grid.btnUnarchive);
//                } else {
//                    _disable(grid.btnUnarchive);
//                }
//
//                grid.cmpLoad({
//                    archive: "true",
//                    fastype: "issue",
//                    edition: grid.currentEdition
//                });
//
//            });
//
//        } else {
//            grid.disable();
//        }
//    });
//
//    // Grid
//    grid.getSelectionModel().on("selectionchange", function(sm, node) {
//        _disable(grid.btnDoApproval, grid.btnDoWorking, grid.btnDoArchive);
//        if (node && node.attributes.fastype == "issue") {
//            _enable(grid.btnDoApproval, grid.btnDoWorking);
//        }
//    });
//
//};
