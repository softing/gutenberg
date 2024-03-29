package Inprint::Locale;

# Inprint Content 5.0
# Copyright(c) 2001-2011, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use utf8;
use strict;
use warnings;

use base 'Mojolicious::Controller';

sub index {

    my $c = shift;

    my $Strings = {};

    # Plugins localization
    my $plugs = $c->{app}->{sql}->Q(" SELECT l18n_original, l18n_translation FROM plugins.l18n WHERE l18n_language=? ", [ $c->stash->{i18n}->{_language} ])->Hashes;
    foreach my $item (@$plugs) {
        $Strings->{ $item->{l18n_original} } = $item->{l18n_translation};
    }

    my $json   = Mojo::JSON->new;

    unless ($c->stash->{i18n}->{handle}->can('getAll')) {
        $Strings->{failcode} = $c->stash->{i18n}->{handle}->{fail};
    } else {
        my $hash = $c->stash->{i18n}->{handle}->getAll;
        while (my ($k,$v) = each %$hash) {
            if ( $v or ! $Strings->{$k}) {
                $Strings->{$k} = $v;
            }
        }
    }

    my $jsonString = $json->encode($Strings);

    $jsonString = "
        var inprintLocalization = $jsonString;
        function _(arg, vals) {

            var string = inprintLocalization[arg.replace('...', '')] || arg;
            if (vals) {
                for (var i=0; i<vals.length;i++) {
                    string = string.replace('%'+ (i+1), vals[i]);
                }
            }
            return string;
        }
    ";

    $jsonString =~ s/\t//g;
    $jsonString =~ s/\n//g;
    $jsonString =~ s/\r//g;
    $jsonString =~ s/\s+/ /g;

    $c->tx->res->headers->header('Content-Type' => "text/javascript; charset=utf-8;");
    $c->render_data($jsonString);
}

1;
