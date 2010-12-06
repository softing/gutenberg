package Inprint::Documents::Combos;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use base 'Inprint::BaseController';

sub managers {

    my $c = shift;
    
    my $i_term      = $c->param("term") || undef;
    my $i_workgroup = $c->param("workgroup") || undef;
    
    my $result;
    my @errors;
    my $success = $c->json->false;
    
    push @errors, { id => "workgroup", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_workgroup));
    
    push @errors, { id => "term", msg => "Access denide"}
        unless ($c->is_rule($i_term));
    
    unless (@errors) {
        
        my @params;
        my $sql = "
            SELECT DISTINCT
                t1.manager as id,
                t2.shortcut as title,
                t2.description as description,
                'user' as icon
            FROM documents t1, view_principals t2, map_member_to_catalog t3
            WHERE
                t2.id = t1.manager
                AND t3.member = t1.manager
                AND t2.type = 'member'
        ";

        my $bindings = $c->access->GetChildrens($i_term);
        $sql .= " AND t3.catalog = ANY(?) ";
        push @params, $bindings;
        
        if ($i_workgroup) {
            
            my $bindings = $c->sql->Q("
                SELECT id FROM catalog WHERE path ~ ('*.'|| replace(?, '-', '')::text ||'.*')::lquery
            ", [$i_workgroup])->Values;
            
            $sql .= " AND t3.catalog = ANY(?) ";
            push @params, $bindings;
        }
        
        $result = $c->sql->Q(" $sql ORDER BY icon, t2.shortcut; ", \@params)->Hashes;
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
                SELECT t1.id, t2.shortcut ||'/'|| t1.title as title, t1.description
                FROM fascicles t1, editions t2
                WHERE
                    t1.edition = t2.id
                    AND t1.is_system = false AND t1.is_enabled = true
        ";
        
        if ($i_term) {
            my $bindings = $c->access->GetChildrens($i_term);
            $sql .= " AND t1.edition = ANY(?) ";
            push @params, $bindings;
        }
        
        my $editions = $c->sql->Q(" SELECT id FROM editions WHERE path ~ ('*.' || replace(?, '-', '')::text || '.*')::lquery ", [$i_edition])->Values;
        $sql .= " AND t1.edition = ANY(?) ";
        push @params, $editions;
        
        $result = $c->sql->Q(" $sql ORDER BY t1.enddate DESC, t2.shortcut, t1.title ", \@params)->Hashes;
        
        if ($c->access->Check($i_term, $i_edition)) {
            unshift @$result, {
                id => "00000000-0000-0000-0000-000000000000",
                icon => "briefcase",
                bold => $c->json->true,
                title => $c->l("Briefcase"),
                description => $c->l("Briefcase for reserved documents")
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
    
    #push @errors, { id => "edition", msg => "Incorrectly filled field"}
    #    unless ($c->is_uuid($i_edition));
    
    push @errors, { id => "fascicle", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_fascicle));
    
    unless (@errors) {
        #$result = $c->sql->Q("
        #    SELECT DISTINCT t1.id, t1.shortcut as title FROM index t1, index_mapping t2
        #    WHERE t1.edition=? AND t2.parent=? AND t1.id = t2.child
        #    ORDER BY t1.shortcut
        #", [ $i_edition, $i_fascicle ])->Hashes;
        $result = $c->sql->Q("
            SELECT DISTINCT t1.id, t1.shortcut as title FROM index t1, index_mapping t2
            WHERE t2.parent=? AND t1.id = t2.child
            ORDER BY t1.shortcut
        ", [ $i_fascicle ])->Hashes;
    }
    
    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result || [] });
}

sub rubrics {
    my $c = shift;
    my $i_headline = $c->param("flt_headline") || undef;
    
    my $result;
    my @errors;
    my $success = $c->json->false;
    
    push @errors, { id => "headline", msg => "Incorrectly filled field"}
        unless ($c->is_uuid($i_headline));
    
    unless (@errors) {
        $result = $c->sql->Q("
            SELECT DISTINCT t1.id, t1.shortcut as title FROM index t1, index_mapping t2
            WHERE t2.parent=? AND t1.id = t2.child
            ORDER BY t1.shortcut
        ", [ $i_headline ])->Hashes;
    }
    
    $success = $c->json->true unless (@errors);
    $c->render_json({ success => $success, errors => \@errors, data => $result || [] });
}


1;
