package Inprint::Models::Fascicle::Headline;

use strict;
use warnings;

use Inprint::Models::Tag;

sub create {
    my $c = shift;

    my ($id, $edition, $fascicle, $bydefault, $title, $description ) = @_;

    my $tag = Inprint::Models::Tag::getByTitle($c, $title, $description);

    if ($tag->{id}) {

        $c->Do("
            INSERT INTO fascicles_indx_headlines (id, edition, fascicle, tag, title, description, created, updated)
                VALUES (?, ?, ?, ?, ?, ?, now(), now());
            ", [ $id, $edition, $fascicle, $tag->{id}, $tag->{title}, $tag->{description} || "" ]);

        if ($bydefault eq "on") {
            $c->Do("
                UPDATE fascicles_indx_headlines SET bydefault=false WHERE fascicle=?;
                ", [ $fascicle ]);
            $c->Do("
                UPDATE fascicles_indx_headlines SET bydefault=true WHERE id=?;
                ", [ $id ]);
        }

    }

    return $c;
}

sub read {
    my $c = shift;
    my $id = shift;
    my $result = $c->Q("
        SELECT id, edition, fascicle, tag, title, description, bydefault, created, updated
        FROM fascicles_indx_headlines WHERE id=? ",
        [ $id ])->Hash;
    return $result;
}

sub findByTag {
    my $c = shift;
    my ($fascicle, $tag) = shift;
    my $result = $c->Q("
        SELECT id, edition, fascicle, tag, title, description, bydefault, created, updated
        FROM fascicles_indx_headlines WHERE fascicle=? AND tag=? ",
        [ $fascicle, $tag ])->Hash;
    return $result;
}

sub update {
    my $c = shift;
    my ($id, $edition, $fascicle, $bydefault, $title, $description ) = @_;

    my $tag = Inprint::Models::Tag::getByTitle($c, $title, $description);

    if ($tag->{id}) {

        $c->Do(" UPDATE fascicles_indx_headlines SET tag=?, title=?, description=? WHERE id=? ",
            [ $tag->{id}, $tag->{title}, $tag->{description} || "", $id ]);

        if ($bydefault eq "on") {
            $c->Do("
                UPDATE fascicles_indx_headlines SET bydefault=false WHERE fascicle=?;
                ", [ $fascicle ]);
            $c->Do("
                UPDATE fascicles_indx_headlines SET bydefault=true WHERE id=?;
                ", [ $id ]);
        }

    }

    return $c;
}

sub delete {
    my $c  = shift;
    my $id = shift;

    # Delete rubrics
    $c->Do("
        DELETE FROM fascicles_indx_rubrics WHERE headline=? ", [ $id ]);

    # Delete headline
    $c->Do("
        DELETE FROM fascicles_indx_headlines WHERE id=?
            AND id <> '00000000-0000-0000-0000-000000000000' ", [ $id ]);

    return $c;
}


1;
