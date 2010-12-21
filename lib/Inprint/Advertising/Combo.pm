package Inprint::Advertising::Combo;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use utf8;
use strict;
use warnings;

use base 'Inprint::BaseController';

sub managers {
    my $c = shift;
    
    my $i_edition  = $c->param("edition") || undef;
    my $i_fascicle = $c->param("fascicle") || undef;
    
    my $i_query = $c->param("query") || undef;
    
    my @errors;
    my $success = $c->json->false;

    push @errors, { id => "query", msg => "Incorrectly filled field"}
        if (length $i_query < 2);
    
    my $result;
    
    unless(@errors){
        $result = $c->sql->Q("
            SELECT DISTINCT
                t1.id, t1.shortcut as title, t1.description as description, 'user' as icon
            FROM view_principals t1, map_member_to_catalog t2
            WHERE
                t2.member = t1.id
                AND t1.type = 'member'
                AND t1.shortcut ILIKE ?
        ",[ "%$i_query%" ])->Hashes;
    }

    $c->render_json( { data => $result || [] } );
}

sub advertisers {
    my $c = shift;
    
    my $i_edition  = $c->param("edition") || undef;
    my $i_fascicle = $c->param("fascicle") || undef;
    
    my $i_query = $c->param("query") || undef;
    
    my @errors;
    my $success = $c->json->false;
    
    if ($i_query) {
        push @errors, { id => "query", msg => "Incorrectly filled field"}
            if (length $i_query < 2);
    }
    
    my @data;
    my $sql = " SELECT id, shortcut as title FROM ad_advertisers  WHERE 1=1 ";
    
    if ($i_edition) {
        my $editions = $c->sql->Q(" SELECT id FROM editions WHERE path ~ ('*.' || replace(?, '-', '')::text || '.*')::lquery ", [$i_edition])->Values;
        $sql .= " AND edition = ANY(?)";
        push @data, $editions;
    }
    
    if ($i_query) {
        $sql .= " AND title ILIKE ? ";
        push @data, "%$i_query%";
    }
    
    my $result;
    unless(@errors){
        $result = $c->sql->Q(" $sql ORDER BY title", \@data)->Hashes;
    }
    $c->render_json( { errors => \@errors, data => $result || [] } );
}

sub fascicles {
    my $c = shift;
    
    my $i_edition  = $c->param("edition") || undef;
    my $i_fascicle = $c->param("fascicle") || undef;
    my $i_term = $c->param("term") || undef;
    
    my @errors;
    my $success = $c->json->false;
    
    my @data;
    my $sql = "
        SELECT t1.id, t2.shortcut || '/' || t1.shortcut as title, t1.shortcut, t1.description, 'blue-folder' as icon
        FROM fascicles t1, editions t2
        WHERE t2.id = t1.edition AND is_system = false AND is_enabled = true
    ";
    
    if ($i_term) {
        my $access = $c->access->GetBindingsByTerm($i_term);
        $sql .= " AND edition = ANY(?) ";
        push @data, $access;
    }
    
    if ($i_edition) {
        my $editions = $c->sql->Q(" SELECT id FROM editions WHERE path ~ ('*.' || replace(?, '-', '')::text || '.*')::lquery ", [$i_edition])->Values;
        $sql .= " AND edition = ANY(?)";
        push @data, $editions;
    }
    
    my $result = $c->sql->Q("
        $sql
        ORDER BY is_enabled DESC, t2.shortcut, t1.shortcut
    ", \@data)->Hashes;
    $c->render_json( { data => $result } );
}

sub places {
    my $c = shift;
    
    my $i_fascicle = $c->param("fascicle") || undef;
    
    my $result = $c->sql->Q("
        SELECT id, title
        FROM fascicles_tmpl_places WHERE fascicle=?
        ORDER BY title
    ", [ $i_fascicle ])->Hashes;
    $c->render_json( { data => $result } );
}

sub modules {
    my $c = shift;
    
    my $i_place = $c->param("place") || undef;
    
    my $result = $c->sql->Q("
        SELECT t1.id, t1.shortcut as title
        FROM fascicles_tmpl_modules t1, fascicles_tmpl_index t2
        WHERE t2.entity=t1.id AND t2.nature='module' AND t2.place=?
        ORDER BY title
    ", [ $i_place ])->Hashes;
    
    $c->render_json( { data => $result } );
}

1;
