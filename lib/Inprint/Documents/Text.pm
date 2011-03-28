package Inprint::Documents::Text;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use Inprint::Check;
use Inprint::Documents::Access;
use Inprint::Store::Embedded;

use base 'Inprint::BaseController';

sub get {
    my $c = shift;

    my @errors;
    my $access;
    my $result;

    my $i_file = $c->param("file");
    my $i_document = $c->param("document");

    Inprint::Check::uuid($c, \@errors, "file", $i_file);
    Inprint::Check::uuid($c, \@errors, "file", $i_document);

    my $file = $c->sql->Q(" SELECT * FROM cache_files WHERE id=? ", $i_file)->Hash;
    my $document = $c->sql->Q(" SELECT * FROM documents WHERE id=? ", $i_document)->Hash;

    unless (@errors) {
        $result = Inprint::Store::Embedded::fileRead($c, $file->{id});
        $result->{access} = Inprint::Documents::Access::get($c, $document->{id});
    }

    $c->smart_render(\@errors, $result);

}

sub set {
    my $c = shift;

    my $html;
    my $access;

    my @errors;

    my $i_file = $c->param("file");
    my $i_text = $c->param("text");
    my $i_document = $c->param("document");

    Inprint::Check::uuid($c, \@errors, "file", $i_file);
    Inprint::Check::uuid($c, \@errors, "document", $i_document);

    my $file = Inprint::Check::dbrecord($c, \@errors, "cache_files", "file", $i_file);
    my $document = Inprint::Check::dbrecord($c, \@errors, "documents", "document", $i_document);

    unless (@errors) {
        $access = Inprint::Documents::Access::get($c, $document->{id});

        if ($access->{"fedit"}) {
            $html = Inprint::Store::Embedded::fileSave($c, $file->{id}, $i_text);
        } else {
            $html = $i_text;
            push @errors, { id => "access", msg => "Access denide" };
        }
    }

    my $result = {
        text => $html,
        access => $access
    };

    $c->smart_render(\@errors, $result);
}

1;
