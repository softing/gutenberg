package Inprint::Documents::Combos;

# Inprint Content 5.0
# Copyright(c) 2001-2011, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use base 'Mojolicious::Controller';

sub managers {

    my $c = shift;

    my $i_edition   = $c->param("edition") || undef;
    my $i_workgroup = $c->param("workgroup") || undef;

    my $result;
    my @errors;
    my $success = $c->json->false;

    unless (@errors) {

        my @params;
        my $sql = "
            SELECT
                t1.id,
                t1.shortcut as title,
                t3.shortcut || '/' || t1.description as description,
                'user' as icon
            FROM view_principals t1, map_member_to_catalog t2, catalog t3
            WHERE
                t1.type = 'member'
                AND t1.id = t2.member
                AND t3.id = t2.catalog
        ";

        # Filter by workgroup
        if ($i_workgroup) {
            $sql .= " AND t2.catalog = ? ";
            push @params, $i_workgroup;
        }

        $sql .= " AND ( 1=1 ";

        # Filter by rules
        my $create_bindings = $c->objectBindings("catalog.documents.create:*");
        $sql .= " OR t2.catalog = ANY(?) ";
        push @params, $create_bindings;

        my $assign_bindings = $c->objectBindings("catalog.documents.assign:*");
        $sql .= " OR  t2.catalog = ANY(?) ";
        push @params, $assign_bindings;

        $sql .= " ) ";
        $sql .= " ORDER BY icon, t1.shortcut; ";

        $result = $c->Q($sql, \@params)->Hashes;

        if ($i_workgroup) {
            if ($c->objectAccess("catalog.documents.assign:*", $i_workgroup)) {
                unshift @$result, {
                    "icon" => "users",
                    "title" => $c->l("Add to the department"),
                    "id" => $i_workgroup,
                    "description" => $c->l("Department")
                };
            }
        }
    }

    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result });

}

sub fascicles {

    my $c = shift;

    my $i_term     = $c->param("term") || undef;
    my $i_edition  = $c->param("flt_edition") || undef;

    my $result;
    my @errors;
    my $success = $c->json->false;

    push @errors, { id => "edition", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_edition));

    if ($i_term) {
        push @errors, { id => "term", msg => "Incorrectly filled field"}
            unless ($c->is_rule($i_term));
    }

    unless (@errors) {

        my @params;
        my $sql = "
                SELECT
                    t1.id,
                    'blue-folder' as icon,
                    t2.shortcut ||'/'|| t1.shortcut as title
                FROM fascicles t1, editions t2
                WHERE
                    t1.edition = t2.id
                    AND t1.enabled = true
                    AND t1.deleted = false
                    AND t1.archived = false
                    AND t1.id <> '99999999-9999-9999-9999-999999999999'
                    AND t1.id <> '00000000-0000-0000-0000-000000000000'
        ";

        if ($i_term) {
            my $bindings = $c->objectBindings($i_term);
            $sql .= " AND t1.edition = ANY(?) ";
            push @params, $bindings;
        }

        my $editions = $c->Q(" SELECT id FROM editions WHERE path ~ ('*.' || replace(?, '-', '')::text || '.*')::lquery ", [$i_edition])->Values;
        $sql .= " AND t1.edition = ANY(?) ";
        push @params, $editions;

        $result = $c->Q(" $sql ORDER BY t1.release_date ASC, t2.shortcut, t1.shortcut ", \@params)->Hashes;

        if ($c->objectAccess($i_term, $i_edition)) {
            unshift @$result, {
                id => "00000000-0000-0000-0000-000000000000",
                icon => "briefcase",
                bold => $c->json->true,
                title => $c->l("Briefcase")
            };
        }
    }

    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result || [] });
}

sub headlines {
    my $c = shift;

    my $i_edition  = $c->param("flt_edition") || undef;
    my $i_fascicle = $c->param("flt_fascicle") || undef;

    my $result;
    my @errors;
    my $success = $c->json->false;

    push @errors, { id => "edition", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_edition));

    push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_fascicle));

    my $edition; unless (@errors) {
        $edition = $c->Q(" SELECT * FROM editions WHERE id=? ", [ $i_edition ])->Hash;
        push @errors, { id => "edition", msg => "Incorrectly filled field"}
            unless ($edition->{id});
    }

    my $fascicle; unless (@errors) {
        $fascicle = $c->Q(" SELECT * FROM fascicles WHERE id=? ", [ $i_fascicle ])->Hash;
        push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
            unless ($fascicle->{id});
    }

    unless (@errors) {
        $result = $c->Q("
            SELECT DISTINCT tag as id, title FROM fascicles_indx_headlines
            WHERE fascicle=?
            ORDER BY title",
            [ $i_fascicle ])->Hashes;
    }

    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result || [] });
}

sub rubrics {
    my $c = shift;

    my $i_fascicle = $c->param("flt_fascicle") || undef;
    my $i_headline = $c->param("flt_headline") || undef;

    my $result;
    my @errors;
    my $success = $c->json->false;

    push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_fascicle));

    push @errors, { id => "headline", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_headline));

    my $fascicle; unless (@errors) {
        $fascicle = $c->Q(" SELECT * FROM fascicles WHERE id=? ", [ $i_fascicle ])->Hash;
        push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
            unless ($fascicle->{id});
    }

    my $headline; unless (@errors) {
        $headline = $c->Q(" SELECT * FROM fascicles_indx_headlines WHERE fascicle=? AND tag=? ", [ $i_fascicle, $i_headline ])->Hash;
        push @errors, { id => "headline", msg => "Incorrectly filled field"}
            unless ($headline->{id});
    }

    unless (@errors) {
        $result = $c->Q("
            SELECT DISTINCT tag as id, title FROM fascicles_indx_rubrics
            WHERE fascicle=? AND headline = ?
            ORDER BY title",
            [ $fascicle->{id}, $headline->{id} ])->Hashes;
    }

    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result || [] });
}


1;
