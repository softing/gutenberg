package Inprint::Documents::Trees;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use Inprint::Check;

use base 'Inprint::BaseController';

sub editions {
    my $c = shift;

    my $i_term = $c->param("term");
    my $i_node = $c->param("node");

    my @result;
    my @errors;
    my $success = $c->json->false;

    Inprint::Check::uuid($c, \@errors, "node", $i_node);
    Inprint::Check::rule($c, \@errors, "term", $i_term);

    unless (@errors) {

        my $sql;
        my @data;

        my $bindings = $c->access->GetBindings($i_term);

        if ($i_node eq "00000000-0000-0000-0000-000000000000") {

            $sql = "
                SELECT t1.*,
                    ( SELECT count(*) FROM editions c2 WHERE c2.path ~ ('*.' || t1.path::text || '.*{1}')::lquery ) as have_childs
                FROM editions t1
                WHERE
                    t1.id <> '00000000-0000-0000-0000-000000000000'
                    AND t1.id = ANY(?)
            ";
            push @data, $bindings;

        }

        if ($i_node ne "00000000-0000-0000-0000-000000000000") {
            $sql .= "
                SELECT t1.*,
                    ( SELECT count(*) FROM editions c2 WHERE c2.path ~ ('*.' || t1.path::text || '.*{1}')::lquery ) as have_childs
                FROM editions t1
                WHERE
                    t1.id <> '00000000-0000-0000-0000-000000000000'
                    AND subpath(t1.path, nlevel(t1.path) - 2, 1)::text = replace(?, '-', '')::text
                    AND t1.id = ANY(?)
                ";
            push @data, $i_node;
            push @data, $bindings;
        }

        my $data = $c->sql->Q("$sql ORDER BY shortcut ", \@data)->Hashes;

        foreach my $item (@$data) {
            my $record = {
                id   => $item->{id},
                text => $item->{shortcut},
                leaf => $c->json->true,
                icon => "blue-folders",
                data => $item
            };
            if ( $item->{have_childs} ) {
                $record->{leaf} = $c->json->false;
            }
            push @result, $record;
        }
    }

    $success = $c->json->true unless (@errors);

    $c->render_json( \@result );
}

sub workgroups {
    my $c = shift;

    my $i_term = $c->param("term");
    my $i_node = $c->param("node");

    my @result;
    my @errors;
    my $success = $c->json->false;

    Inprint::Check::uuid($c, \@errors, "node", $i_node);
    Inprint::Check::rule($c, \@errors, "node", $i_term);

    my $bindings = $c->access->GetBindings($i_term);

    unless (@errors) {

        my $sql;
        my @data;

        if ($i_node eq "00000000-0000-0000-0000-000000000000") {
            $sql = "
                SELECT t1.*,
                    ( SELECT count(*) FROM catalog c2 WHERE c2.path ~ ('*.' || t1.path::text || '.*{1}')::lquery ) as have_childs
                FROM catalog t1
                WHERE
                    t1.id <> '00000000-0000-0000-0000-000000000000'
                    AND t1.id = ANY(?)
            ";
            push @data, $bindings;
        }

        if ($i_node ne "00000000-0000-0000-0000-000000000000") {
            $sql .= "
                SELECT t1.*,
                    ( SELECT count(*) FROM catalog c2 WHERE c2.path ~ ('*.' || t1.path::text || '.*{1}')::lquery ) as have_childs
                FROM catalog t1
                WHERE
                    t1.id <> '00000000-0000-0000-0000-000000000000'
                    AND subpath(t1.path, nlevel(t1.path) - 2, 1)::text = replace(?, '-', '')::text
                    AND t1.id = ANY(?)
                ";
            push @data, $i_node;
            push @data, $bindings;
        }

        my $data = $c->sql->Q("$sql ORDER BY shortcut", \@data)->Hashes;

        foreach my $item (@$data) {
            my $record = {
                id   => $item->{id},
                icon => "xfn-friend",
                text => $item->{shortcut},
                leaf => $c->json->true,
                data => $item
            };
            if ( $item->{have_childs} ) {
                $record->{leaf} = $c->json->false;
            }
            push @result, $record;
        }
    }

    $success = $c->json->true unless (@errors);

    $c->render_json( \@result );
}

sub fascicles {
    my $c = shift;

    my $i_node = $c->param("node");

    my @result;
    my @errors;
    my $success = $c->json->false;

    Inprint::Check::uuid($c, \@errors, "node", $i_node);

    unless (@errors) {

        my $sql;
        my @data;

        my $leaf = $c->json->false;

        $sql = "
            SELECT t1.id, t1.shortcut, t2.shortcut as edition_shortcut,
                ( SELECT count(*) FROM fascicles c2 WHERE c2.parent = t1.id ) as have_childs
            FROM fascicles t1, editions t2
            WHERE
                t1.enabled=true
                AND t1.id <> '00000000-0000-0000-0000-000000000000'
                AND t1.id <> '99999999-9999-9999-9999-999999999999'
                AND t1.deadline >= now()
                AND t2.id = t1.edition
        ";

        if ($i_node eq '00000000-0000-0000-0000-000000000000' ) {
            $sql .= " AND t1.parent=t1.edition ";
        }

        if ($i_node ne '00000000-0000-0000-0000-000000000000' ) {
            $sql .= " AND t1.parent=? ";
            push @data, $i_node;
            $leaf = $c->json->true;
        }

        my $data = $c->sql->Q("$sql ORDER BY t1.shortcut", \@data)->Hashes;

        foreach my $item (@$data) {
            my $record = {
                id   => $item->{id},
                icon => "blue-folder-open-document-text",
                text => $item->{edition_shortcut} .'/'. $item->{shortcut},
                leaf => $leaf
            };
            if ( $item->{have_childs} ) {
                $record->{leaf} = $c->json->false;
            }
            push @result, $record;
        }

        if ($i_node eq "00000000-0000-0000-0000-000000000000") {
            unshift @result, {
                id => "00000000-0000-0000-0000-000000000000",
                icon => "briefcase",
                text => $c->l("Briefcase"),
                leaf => $c->json->true
            };
        }

    }

    $success = $c->json->true unless (@errors);

    $c->render_json( \@result );
}

1;
