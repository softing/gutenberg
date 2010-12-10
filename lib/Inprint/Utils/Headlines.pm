package Inprint::Utils::Headlines;
use strict;
use warnings;

sub Create {
    
    my $c = shift;
    
    my $edition     = shift;
    my $fascicle    = shift;
    my $title       = shift;
    my $shortcut    = shift;
    my $description = shift;
    
    return unless $edition;
    return unless $fascicle;
    return unless $title;
    return unless $shortcut;
    
    my $errors = [];
    my $id = $c->uuid();
    
    my $exists_title = $c->sql->Q("
        SELECT count(*)
        FROM index_fascicles
        WHERE fascicle=? AND nature=? AND lower(title) = lower(?)
    ", [ $fascicle, "headline", $title ])->Value;
    
    push @$errors, { id => "title", msg => "Already exists"}
        if ($exists_title);
    
    my $exists_shortcut = $c->sql->Q("
            SELECT count(*)
            FROM index_fascicles
            WHERE fascicle=? AND nature=? AND lower(shortcut) = lower(?)
        ", [ $fascicle, "headline", $shortcut ])->Value;
    
    push @$errors, { id => "shortcut", msg => "Already exists"}
        if ($exists_shortcut);
    
    my $headline_origin = $c->sql->Q("
            SELECT id FROM index WHERE nature = 'headline' AND edition=ANY(
                SELECT id FROM editions WHERE path @> (SELECT path FROM editions WHERE id=?)
            ) AND lower(shortcut)=lower(?)
        ", [ $edition, $shortcut ])->Value;
    
    unless (@$errors) {
        $c->sql->Do("
            INSERT INTO index_fascicles(id, edition, fascicle, origin, nature, parent, title, shortcut, description, created, updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now());
        ", [ $id, $edition, $fascicle, $headline_origin || $id, "headline", $id, $title, $shortcut, $description ]);
    }
    
    my $headline = $c->sql->Q("
            SELECT * FROM index_fascicles
            WHERE fascicle = ? AND lower(shortcut) = lower(?) ",
        [ $fascicle, $shortcut])->Hash();
    
    return $headline;
}

1;