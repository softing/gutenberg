#!/usr/bin/perl

use utf8;
use strict;

use Data::UUID;
use Data::Dump qw /dump/;
use DBIx::Connector;

use lib "../../lib";
use Inprint::Frameworks::Config;
use Inprint::Frameworks::SQL;

my $ug = new Data::UUID;

my $config = new Inprint::Frameworks::Config();
$config->load("../../");

my $dbname     = $config->get("db.name");
my $dbhost     = $config->get("db.host");
my $dbport     = $config->get("db.port");
my $dbusername = $config->get("db.user");
my $dbpassword = $config->get("db.password");

my $atr = { AutoCommit=>1, RaiseError=>1, PrintError=>1, pg_enable_utf8=>1 };

my $dsn  = 'dbi:Pg:dbname='. $dbname .';host='. $dbhost .';port='. $dbport .';';
my $dsn2 = 'dbi:Pg:dbname=inprint-4.3;host='. $dbhost .';port='. $dbport .';';

# Create a connection.
my $conn  = DBIx::Connector->new($dsn,  $dbusername, $dbpassword, $atr );
my $conn2 = DBIx::Connector->new($dsn2, $dbusername, $dbpassword, $atr );

# Create SQL mappings
my $sql = new Inprint::Frameworks::SQL();
$sql->SetConnection($conn);

my $sql2 = new Inprint::Frameworks::SQL();
$sql2->SetConnection($conn2);

my $rootnode = '00000000-0000-0000-0000-000000000000';

$sql->Do(" DELETE FROM catalog  WHERE id <> '00000000-0000-0000-0000-000000000000' ");
$sql->Do(" DELETE FROM editions WHERE id <> '00000000-0000-0000-0000-000000000000' ");
$sql->Do(" DELETE FROM migration WHERE mtype = 'edition' OR mtype='catalog' ");

# Import Editions

my $editions = $sql2->Q("
    SELECT id, name, sname, description, uuid, deleted
    FROM edition.edition WHERE deleted=false
")->Hashes();

foreach my $item( @{ $editions } ) {

    my $idEdition = $ug->create_str();
    my $idCatalog = $ug->create_str();

    $sql->Do("
        INSERT INTO migration(mtype, oldid, newid) VALUES (?, ?, ?);
    ", [ "edition", $item->{uuid}, $idEdition ]);

    $sql->Do("
        INSERT INTO migration(mtype, oldid, newid) VALUES (?, ?, ?);
    ", [ "catalog", $item->{uuid}, $idCatalog ]);

    $sql->Do("
        INSERT INTO editions (id, path, title, shortcut, description)
        VALUES (?, ?, ?, ?, ?)
    ", [ $idEdition, cleanUUID($rootnode), $item->{name}, $item->{sname}, $item->{description} ]);
    
    $sql->Do("
        INSERT INTO catalog (id, path, title, shortcut, description, type, capables)
        VALUES (?, ?, ?, ?, ?, 'ou', '{default}')
    ", [ $idCatalog, cleanUUID($rootnode), $item->{name}, $item->{sname}, $item->{description} ]);
    
    # Import Departments
    
    my $path = $sql->Q(" SELECT path FROM catalog WHERE id = ? ", [ $idCatalog ])->Value;
    my $departments = $sql2->Q(" SELECT * FROM passport.department WHERE edition = ? ", [ $item->{uuid} ])->Hashes();
    foreach my $item2 ( @{ $departments } ) {
        $sql->Do("
            INSERT INTO catalog (id, path, title, shortcut, description, type, capables)
            VALUES (?, ?, ?, ?, ?, 'ou', '{default}')
        ", [ $item2->{uuid}, $path, $item2->{title}, $item->{sname}."/".$item2->{title}, $item2->{description} ]);
    }

}

sub cleanUUID {
    my $uuid = shift;
    $uuid =~ s/\-//sg;
    return $uuid;
}
