package Inprint::Documents;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use base 'Inprint::BaseController';

sub read {

    my $c = shift;

    my $i_id = $c->param("id");

    my @errors;
    my $success = $c->json->false;
    
    push @errors, { id => "id", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_id));

    my $document;
    unless (@errors) {
        $document = $c->sql->Q("
            SELECT
                dcm.id,
                dcm.edition, dcm.edition_shortcut,
                dcm.fascicle, dcm.fascicle_shortcut,
                dcm.headline, dcm.headline_shortcut,
                dcm.rubric, dcm.rubric_shortcut,
                dcm.workgroup, dcm.workgroup_shortcut,
                dcm.inworkgroups, dcm.copygroup,
                dcm.holder,  dcm.holder_shortcut,
                dcm.creator, dcm.creator_shortcut,
                dcm.manager, dcm.manager_shortcut,
                dcm.islooked, dcm.isopen,
                dcm.branch, dcm.branch_shortcut,
                dcm.stage, stage_shortcut,
                dcm.color, dcm.progress,
                dcm.title, dcm.author,
                to_char(dcm.pdate, 'YYYY-MM-DD HH24:MI:SS') as pdate,
                to_char(dcm.rdate, 'YYYY-MM-DD HH24:MI:SS') as rdate,
                dcm.psize, dcm.rsize,
                dcm.images, dcm.files,
                to_char(dcm.created, 'YYYY-MM-DD HH24:MI:SS') as created,
                to_char(dcm.updated, 'YYYY-MM-DD HH24:MI:SS') as updated
            FROM documents dcm WHERE dcm.id=?
        ", [ $i_id ])->Hash;
        
        
        $document->{access} = {};
        my @rules = qw(update capture move transfer briefcase delete recover);
        
        my $current_member = $c->QuerySessionGet("member.id");
        foreach (@rules) {
            if ($document->{manager} eq $current_member) {
                if ($c->access->Check(["catalog.documents.$_:*"], $document->{workgroup})) {
                    $document->{access}->{$_} = $c->json->true;
                }
            }
            if ($document->{manager} ne $current_member) {
                if ($c->access->Check("catalog.documents.$_:group", $document->{workgroup})) {
                    $document->{access}->{$_} = $c->json->true;
                }
            }
        }
        
    }

    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $document || {} });
}

sub list {

    my $c = shift;

    my @params;

    # Pagination
    my $start    = $c->param("start")        || 0;
    my $limit    = $c->param("limit")        || 60;

    # Grid mode
    my $mode     = $c->param("gridmode")     || "all";

    # Sorting
    my $dir      = $c->param("dir")          || "DESC";
    my $sort     = $c->param("sort")         || "created";

    # Filters
    my $edition  = $c->param("flt_edition")  || undef;
    my $group    = $c->param("flt_group")    || undef;
    my $title    = $c->param("flt_title")    || undef;
    my $fascicle = $c->param("flt_fascicle") || undef;
    my $headline = $c->param("flt_headline") || undef;
    my $rubric   = $c->param("flt_rubric")   || undef;
    my $manager  = $c->param("flt_manager")  || undef;
    my $holder   = $c->param("flt_holder")   || undef;
    my $progress = $c->param("flt_progress") || undef;

    # Query headers
    my $sql_query = "
        SELECT
            dcm.id,

            dcm.edition, dcm.edition_shortcut,
            dcm.fascicle, dcm.fascicle_shortcut,
            dcm.headline, dcm.headline_shortcut,
            dcm.rubric, dcm.rubric_shortcut,

            dcm.workgroup, dcm.workgroup_shortcut,
            dcm.inworkgroups, dcm.copygroup,

            dcm.holder,  dcm.holder_shortcut,
            dcm.creator, dcm.creator_shortcut,
            dcm.manager, dcm.manager_shortcut,

            dcm.islooked, dcm.isopen,
            dcm.branch, dcm.branch_shortcut,
            dcm.stage, stage_shortcut,
            dcm.color, dcm.progress,
            dcm.title, dcm.author,
            to_char(dcm.pdate, 'YYYY-MM-DD HH24:MI:SS') as pdate,
            to_char(dcm.rdate, 'YYYY-MM-DD HH24:MI:SS') as rdate,
            dcm.psize, dcm.rsize,
            dcm.images, dcm.files,
            to_char(dcm.created, 'YYYY-MM-DD HH24:MI:SS') as created,
            to_char(dcm.updated, 'YYYY-MM-DD HH24:MI:SS') as updated

        FROM documents dcm

    ";

    my $sql_total = "
        SELECT count(*)
        FROM documents dcm
    ";

    my $sql_filters = " WHERE 1=1 ";

    # Set Restrictions

    my $editions = $c->access->GetChildrens("editions.documents.work");
    $sql_filters .= " AND dcm.edition = ANY(?) ";
    push @params, $editions;
    
    my $departments = $c->access->GetChildrens("catalog.documents.view:*");
    $sql_filters .= " AND dcm.workgroup = ANY(?) ";
    push @params, $departments;
    
    # Set Filters
    
    if ($mode eq "todo") {
        $sql_filters .= " AND holder=? ";
        push @params, $c->QuerySessionGet("member.id");
        $sql_filters .= " AND isopen = true ";
        $sql_filters .= " AND fascicle <> '99999999-9999-9999-9999-999999999999' ";
    }
    
    if ($mode eq "all") {
        $sql_filters .= " AND isopen is true ";
        if ($fascicle && $fascicle ne '99999999-9999-9999-9999-999999999999') {
            $sql_filters .= " AND fascicle <> '99999999-9999-9999-9999-999999999999' ";
        }
        if ($fascicle && $fascicle ne '00000000-0000-0000-0000-000000000000') {
            $sql_filters .= " AND fascicle <> '00000000-0000-0000-0000-000000000000' ";
        }
    }
    
    if ($mode eq "archive") {
        $sql_filters .= " AND isopen = false ";
        $sql_filters .= " AND fascicle <> '99999999-9999-9999-9999-999999999999' ";
        $sql_filters .= " AND fascicle <> '00000000-0000-0000-0000-000000000000' ";
    }
    
    if ($mode eq "briefcase") {
        $sql_filters .= " AND fascicle = '00000000-0000-0000-0000-000000000000' ";
    }
    
    if ($mode eq "recycle") {
        $sql_filters .= " AND fascicle = '99999999-9999-9999-9999-999999999999' ";
    }

    # Set Filters
    
    if ($title) {
        $sql_filters .= " AND title LIKE ? ";
        push @params, "%$title%";
    }
    
    if ($edition && $edition ne "clear") {
        $sql_filters .= " AND ? = ANY(dcm.ineditions) ";
        push @params, $edition;
    }
    
    if ($group && $group ne "clear") {
        $sql_filters .= " AND ? = ANY(dcm.inworkgroups) ";
        push @params, $group;
    }
    
    if ($fascicle && $fascicle ne "clear") {
        $sql_filters .= " AND fascicle = ? ";
        push @params, $fascicle;
    }
    
    if ($headline && $headline ne "clear") {
        $sql_filters .= " AND headline = ? ";
        push @params, $headline;
    }
    
    if ($rubric && $rubric ne "clear") {
        $sql_filters .= " AND rubric = ? ";
        push @params, $rubric;
    }
    
    if ($manager && $manager ne "clear") {
        $sql_filters .= " AND manager=? ";
        push @params, $manager;
    }
    
    if ($holder && $holder ne "clear") {
        $sql_filters .= " AND holder=? ";
        push @params, $holder;
    }
    
    if ($progress && $progress ne "clear") {
        $sql_filters .= " AND readiness=? ";
        push @params, $progress;
    }

    $sql_total .= $sql_filters;
    $sql_query .= $sql_filters;

    # Calculate total param
    my $total = $c->sql->Q($sql_total, \@params)->Value || 0;

    if ($dir && $sort) {
        if ( $dir ~~ ["ASC", "DESC"] ) {
            if ( $sort ~~ ["title", "maingroup_shortcut", "fascicle_shortcut", "headline_shortcut", "created",
                           "rubric_shortcut", "pages", "manager_shortcut", "progress", "holder_shortcut", "images", "rsize" ] ) {
                $sql_query .= " ORDER BY $sort $dir ";
            }
        }
    }

    # Select rows with pagination
    $sql_query .= " LIMIT ? OFFSET ? ";
    push @params, $limit;
    push @params, $start;
    my $result = $c->sql->Q($sql_query, \@params)->Hashes;
    
    my $current_member = $c->QuerySessionGet("member.id");
    foreach my $document (@$result) {
        
        $document->{access} = {};
        my @rules = qw(update capture move transfer briefcase delete recover);
        
        foreach (@rules) {
            if ($document->{manager} eq $current_member) {
                if ($c->access->Check(["catalog.documents.$_:*"], $document->{workgroup})) {
                    $document->{access}->{$_} = $c->json->true;
                }
            }
            if ($document->{manager} ne $current_member) {
                if ($c->access->Check("catalog.documents.$_:group", $document->{workgroup})) {
                    $document->{access}->{$_} = $c->json->true;
                }
            }
        }
    }
    
    # Create result
    $c->render_json( { "data" => $result, "total" => $total } );
}

sub create {
    my $c = shift;

    my $sql;
    my @fields;
    my @data;
    
    my @errors;
    my $success = $c->json->false;

    my $id      = $c->uuid();
    my $copyid  = $id;
    
    my $current_member = $c->QuerySessionGet("member.id");

    my $i_edition    = $c->param("edition");
    my $i_workgroup  = $c->param("workgroup");
    my $i_manager    = $c->param("manager");

    my $i_enddate    = $c->param("enddate");
    my $i_fascicle   = $c->param("fascicle") || "00000000-0000-0000-0000-000000000000";
    my $i_headline   = $c->param("headline");
    my $i_rubric     = $c->param("rubric");

    my $i_title      = $c->param("title");
    my $i_author     = $c->param("author");
    my $i_size       = $c->param("size");
    my $i_comment    = $c->param("comment");

    push @errors, { id => "title", msg => "Incorrectly filled field"}
        unless ($c->is_text($i_title));
    
    push @errors, { id => "enddate", msg => "Incorrectly filled field"}
        unless ($c->is_date($i_enddate));
    
    push @errors, { id => "edition", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_edition));
    
    push @errors, { id => "workgroup", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_workgroup));
    
    push @errors, { id => "manager", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_manager));
    
    push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_fascicle));
    
    # Check user access to this function
    unless ( @errors ) {
        
        if ( $i_workgroup ) {
            push @errors, { id => "access", msg => "Access denied"}
                unless ($c->access->Check("catalog.documents.create:*",  $i_workgroup));
        }
        if ( $i_fascicle ) {
            push @errors, { id => "access", msg => "Access denied"}
                unless ($c->access->Check("editions.documents.assign", $i_edition));
        }
        if ($current_member ne $i_manager) {
            push @errors, { id => "access", msg => "Access denied"}
                unless ($c->access->Check("catalog.documents.assign:*",  $i_workgroup));
        }
    }
    
    unless ( @errors ) {

        push @fields, "id";
        push @data, $id;

        push @fields, "copygroup";
        push @data, $copyid;

        push @fields, "title";
        push @data, $i_title;

        push @fields, "pdate";
        push @data, $i_enddate;

        push @fields, "psize";
        push @data, $i_size || 0;

        push @fields, "isopen";
        push @data, 'true';

        push @fields, "islooked";
        push @data, 'false';

        push @fields, "files";
        push @data, 0;

        push @fields, "images";
        push @data, 0;

        push @fields, "rsize";
        push @data, 0;

        push @fields, "rdate";
        push @data, undef;

        # Set Author
        if ($i_author) {
            push @fields, "author";
            push @data, $i_author;
        }

        #filepath
        my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);

        $year += 1900;
        $mon += 1;

        push @fields, "filepath";
        push @data, "/$year/$mon/$id";

    }

    unless ( @errors ) {
        # Set edition
        my $edition = $c->sql->Q(" SELECT id, shortcut FROM editions WHERE id = ?", [ $i_edition ])->Hash;
        if ($edition->{id} && $edition->{shortcut}) {
            push @fields, "edition";
            push @data, $edition->{id};
            push @fields, "edition_shortcut";
            push @data, $edition->{shortcut};
            # Set ineditions[]
            my $editions = $c->sql->Q("
                SELECT ARRAY( select id from editions where path @> ( select path from editions where id = ? ) )
            ", [ $edition->{id} ])->Array;
            push @fields, "ineditions";
            push @data, $editions;
        }

        push @errors, { id => "edition", msg => "Object not found"}
            unless ($edition);
    }
    
    my $workgroup;
    unless ( @errors ) {
        # Set Workgroup
        $workgroup = $c->sql->Q(" SELECT id, shortcut FROM catalog WHERE id = ?", [ $i_workgroup ])->Hash;
        
        push @fields, "workgroup";
        push @data, $workgroup->{id};
        
        push @fields, "workgroup_shortcut";
        push @data, $workgroup->{shortcut};
        
        push @errors, { id => "workgroup", msg => "Object not found"}
            unless ($workgroup);
    }
    
    unless ( @errors ) {
        # Set Inworkgroups[]
        my $workgroups = $c->sql->Q(" SELECT ARRAY( select id from catalog where path @> ( select path from catalog where id = ? ) ) ", [ $workgroup->{id} ])->Array;
        push @fields, "inworkgroups";
        push @data, $workgroups;
        
        push @errors, { id => "workgroups", msg => "Object not found"}
            unless ($workgroups);
    }
    
    unless ( @errors ) {
        # Creator
        push @fields, "creator";
        push @fields, "creator_shortcut";
        push @data, $c->QuerySessionGet("member.id");
        push @data, $c->QuerySessionGet("member.shortcut");
    }
    
    my $manager;
    unless ( @errors ) {
        # Set manager
        $manager = $c->sql->Q(" SELECT id, shortcut FROM profiles WHERE id = ?", [ $i_manager ])->Hash;
        push @fields, "manager";
        push @fields, "manager_shortcut";
        push @data, $manager->{id};
        push @data, $manager->{shortcut};
        
        push @errors, { id => "manager", msg => "Object not found"}
            unless ($manager);
    }
    
    unless ( @errors ) {
        # Set Holder
        my $holder = $c->sql->Q(" SELECT id, shortcut FROM profiles WHERE id = ?", [ $manager->{id} || $current_member ])->Hash;
        push @fields, "holder";
        push @fields, "holder_shortcut";
        push @data, $holder->{id};
        push @data, $holder->{shortcut};
        
        push @errors, { id => "holder", msg => "Object not found"}
            unless ($holder);
    }
    
    unless ( @errors ) {
        my $stage = $c->sql->Q("
            SELECT
                t1.id as branch, t1.shortcut as branch_shortcut,
                t2.id as stage, t2.shortcut as stage_shortcut,
                t3.id as readiness, t3.shortcut as readiness_shortcut, t3.color, t3.weight as progress
                FROM branches t1, stages t2, readiness t3
            WHERE edition = ? AND t2.branch = t1.id AND t3.id = t2.readiness
            ORDER BY t2.weight LIMIT 1
        ", [ $i_edition ])->Hash;

        push @errors, { id => "stage", msg => "Object not found"}
            unless ($stage);
            
        if ($stage->{stage}) {

            # Set Branch
            push @fields, "branch";
            push @fields, "branch_shortcut";
            push @data, $stage->{branch};
            push @data, $stage->{branch_shortcut};
            
            # Set Stage
            push @fields, "stage";
            push @fields, "stage_shortcut";
            push @data, $stage->{stage};
            push @data, $stage->{stage_shortcut};

            # Set Readiness
            push @fields, "readiness";
            push @fields, "readiness_shortcut";
            push @data, $stage->{readiness};
            push @data, $stage->{readiness_shortcut};

            # Set Color
            push @fields, "color";
            push @data, $stage->{color};

            # Set Progress
            push @fields, "progress";
            push @data, $stage->{progress};
        }
    }
    
    # Fascicle, && Headline && Rubric
    unless ( @errors ) {

        my $fascicle = $c->sql->Q(" SELECT id, shortcut FROM fascicles WHERE id = ?", [ $i_fascicle ])->Hash;
        
        push @errors, { id => "fascicle", msg => "Object not found"}
            unless ($fascicle);
        
        if ($fascicle->{id} && $fascicle->{shortcut}) {

            push @fields, "fascicle";
            push @fields, "fascicle_shortcut";
            push @data, $fascicle->{id};
            push @data, $fascicle->{shortcut};

            if ($i_headline) {

                my $headline = $c->sql->Q("
                        SELECT DISTINCT t1.id, t1.shortcut
                        FROM index t1, index_mapping t2 WHERE t1.id=t2.child AND t1.id=? AND t2.entity=?
                        ORDER BY t1.shortcut ASC
                ", [ $i_headline, $i_edition ])->Hash;

                if ($headline->{id} && $headline->{shortcut}) {
                    
                    push @fields, "headline";
                    push @fields, "headline_shortcut";
                    push @data, $headline->{id};
                    push @data, $headline->{shortcut};
                    
                    if ($i_rubric) {
                        my $rubric = $c->sql->Q("
                            SELECT DISTINCT t1.id, t1.shortcut
                            FROM index t1, index_mapping t2 WHERE t1.id=t2.child AND t1.id=? AND t2.parent=?
                            ORDER BY t1.shortcut ASC
                        ", [ $i_rubric, $headline->{id} ])->Hash;
                        if ($rubric->{id} && $rubric->{shortcut}) {
                            push @fields, "rubric";
                            push @fields, "rubric_shortcut";
                            push @data, $rubric->{id};
                            push @data, $rubric->{shortcut};
                        }
                    }
                }
            }
        }
    }
    
    # Create document
    unless (@errors) {
        my @placeholders; foreach (@data) { push @placeholders, "?"; }
        $c->sql->Do(" INSERT INTO documents (" . ( join ",", @fields ) .") VALUES (". ( join ",", @placeholders ) .") ", \@data);
    }

    $success = $c->json->true unless (@errors);
    $c->render_json( { success => $success, errors => \@errors } );
}

sub update {
    my $c = shift;

    my $i_id      = $c->param("id");
    my $i_title   = $c->param("title");
    my $i_author  = $c->param("author");
    my $i_size    = $c->param("size") || 0;
    my $i_enddate = $c->param("enddate");

    my @errors;
    my $success = $c->json->false;

    push @errors, { id => "id", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_id));
    
    push @errors, { id => "title", msg => "Incorrectly filled field"}
        unless ($c->is_text($i_title));
    
    if ($i_author) {
        push @errors, { id => "author", msg => "Incorrectly filled field"}
            unless ($c->is_text($i_author));
    }
    
    if ($i_size) {
        push @errors, { id => "size", msg => "Incorrectly filled field"}
            unless ($c->is_int($i_size));
    }
    
    if ($i_enddate) {
        push @errors, { id => "enddate", msg => "Incorrectly filled field"}
            unless ($c->is_date($i_enddate));
    }
    
    unless (@errors) {
        my $document = $c->sql->Q(" SELECT id, workgroup FROM documents WHERE id=? ", [ $i_id ])->Hash;
    
        push @errors, { id => "access", msg => "Not enough permissions"}
            unless ($c->access->Check("catalog.documents.update:*", $document->{workgroup}));
    }
    
    unless (@errors) {
        $c->sql->Do(" UPDATE documents SET title=?, author=?, psize=?, pdate=? WHERE id=?; ",
            [ $i_title, $i_author, $i_size, $i_enddate, $i_id ]);
    }
    
    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors });
}

sub recycle {
    my $c = shift;
    my @ids = $c->param("id");
    foreach my $id (@ids) {
        if ($c->is_uuid($id)) {
            my $document = $c->sql->Q(" SELECT id, workgroup FROM documents WHERE id=? ", [ $id ])->Hash;
            if ($c->access->Check("catalog.documents.delete:*", $document->{workgroup})) {
                $c->sql->Do(" UPDATE documents SET fascicle='99999999-9999-9999-9999-999999999999' WHERE id=? ", [ $document->{id} ]);
            }
        }
    }
    $c->render_json( { success => $c->json->true } );
}

sub delete {
    my $c = shift;
    my @ids = $c->param("id");
    foreach my $id (@ids) {
        if ($c->is_uuid($id)) {
            my $document = $c->sql->Q(" SELECT id, workgroup FROM documents WHERE id=? ", [ $id ])->Hash;
            if ($c->access->Check("catalog.documents.delete:*", $document->{workgroup})) {
                $c->sql->Do(" UPDATE documents SET fascicle='99999999-9999-9999-9999-999999999999' WHERE id=? ", [ $document->{id} ]);
            }
        }
    }
    $c->render_json( { success => $c->json->true } );
}

sub capture {
    my $c = shift;
    my @ids = $c->param("id");

    my $success = $c->json->false;

    my $current_user      = $c->QuerySessionGet("member.id");
    my $default_edition   = $c->QuerySessionGet("options.default.edition");
    my $default_workgroup = $c->QuerySessionGet("options.default.workgroup");

    my $member    = $c->sql->Q(" SELECT id, shortcut FROM profiles WHERE id=? ", [ $current_user ])->Hash;
    my $edition   = $c->sql->Q(" SELECT id, shortcut FROM editions WHERE id=? ", [ $default_edition ])->Hash;
    my $workgroup = $c->sql->Q(" SELECT id, shortcut FROM catalog WHERE id=? ", [ $default_workgroup ])->Hash;

    if ($member->{id}, $edition->{id}, $workgroup->{id} ) {
        if ($member->{shortcut}, $edition->{shortcut}, $workgroup->{shortcut} ) {
            foreach my $id (@ids) {
                
                $success = $c->json->true;
                
                my $workgroups = $c->sql->Q("
                    SELECT ARRAY( select id from catalog where path @> ( select path from catalog where id = ? ) )
                ", [ $workgroup->{id} ])->Array;
                
                $c->sql->Do("
                    UPDATE documents SET
                        holder=?, holder_shortcut=?,
                        workgroup=?, workgroup_shortcut=?, inworkgroups=?,
                        rdate=now()
                    WHERE id=?
                ", [
                    $member->{id}, $member->{shortcut},
                    $workgroup->{id}, $workgroup->{shortcut}, $workgroups,
                    $id
                ]);
            }
        }
    }

    $c->render_json( { success => $success } );
}

sub transfer {
    my $c = shift;

    my @ids = $c->param("id");
    my $tid = $c->param("transfer");

    my $success = $c->json->false;

    my $assignment = $c->sql->Q("
        SELECT
            id,
            catalog, catalog_shortcut,
            principal_type, principal, principal_shortcut,
            branch, branch_shortcut,
            stage, stage_shortcut,
            readiness, readiness_shortcut,
            progress, color
        FROM view_assignments
        WHERE id = ?
    ", [ $tid ])->Hash;

    if ($assignment) {
        $success = $c->json->true;
        foreach my $id (@ids) {

            my $workgroups = $c->sql->Q("
                SELECT ARRAY( select id from catalog where path @> ( select path from catalog where id = ? ) )
            ", [ $assignment->{catalog} ])->Array;

            $c->sql->Do("
                UPDATE documents SET
                    holder=?, holder_shortcut=?,
                    workgroup=?, workgroup_shortcut=?, inworkgroups=?,
                    readiness=?, readiness_shortcut=?, color=?, progress=?, rdate=now()
                WHERE id=?
            ", [
                $assignment->{principal}, $assignment->{principal_shortcut},
                $assignment->{catalog}, $assignment->{catalog_shortcut}, $workgroups,
                $assignment->{readiness}, $assignment->{readiness_shortcut},
                $assignment->{color}, $assignment->{progress},
                $id
            ]);
        }
    }

    $c->render_json( { success => $success } );
}

sub briefcase {
    my $c = shift;

    my @ids = $c->param("id");

    my $success = $c->json->false;

    my $fascicle = $c->sql->Q(" SELECT id, shortcut FROM fascicles WHERE id='00000000-0000-0000-0000-000000000000' ")->Hash;

    if ($fascicle) {
        $success = $c->json->true;
        foreach my $id (@ids) {
            $c->sql->Do(" UPDATE documents SET fascicle=?, fascicle_shortcut=? WHERE id=? ", [ $fascicle->{id}, $fascicle->{shortcut}, $id ]);
        }
    }

    $c->render_json( { success => $success } );
}

1;
