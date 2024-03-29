package Inprint::Settings::Editions;

# Inprint Content 5.0
# Copyright(c) 2001-2011, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use base 'Mojolicious::Controller';

sub list {
    my $c = shift;
    
    my $result = $c->Q("SELECT * FROM edition.edition ")->Hashes;
    
    $c->render_json({ data => $result });
}

1;
