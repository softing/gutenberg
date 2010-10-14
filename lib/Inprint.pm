package Inprint;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use strict;
use warnings;

use Devel::SimpleTrace;
use DBIx::Connector;

use base 'Mojolicious';

use Inprint::Frameworks::Config;
use Inprint::Frameworks::SQL;

__PACKAGE__->attr('dbh');
__PACKAGE__->attr('config');
__PACKAGE__->attr('locale');
__PACKAGE__->attr('sql');

sub startup {

    my $self = shift;

    $self->log->level('debug');
    $self->secret('passw0rd');

    $self->session->cookie_name("inprint");
    $self->session->default_expiration(864000);

    $self->types->type(json => 'application/json; charset=utf-8;');

    # Load configuration
    my $config = new Inprint::Frameworks::Config();
    $self->{config} = $config->load( $self->home->to_string );

    my $name     = $config->get("db.name");
    my $host     = $config->get("db.host");
    my $port     = $config->get("db.port");
    my $username = $config->get("db.user");
    my $password = $config->get("db.user");

    my $dsn = 'dbi:Pg:dbname='. $name .';host='. $host .';port='. $port .';';
    my $atr = { AutoCommit=>1, RaiseError=>1, PrintError=>1, pg_enable_utf8=>1 };

    # Create a connection.
    my $conn = DBIx::Connector->new($dsn, $username, $password, $atr );

    # Create SQL mappings
    my $sql = new Inprint::Frameworks::SQL();
    $sql->SetConnection($conn);

    $self->{sql} = $sql;

    # Load Plugins
    $self->plugin('i18n');

    # Create Routes
    $self->routes->route('/setup/database/')->to('setup#database');
    #$self->routes->route('/setup/store/')->to('setup#store');
    $self->routes->route('/setup/import/')->to('setup#import');
    $self->routes->route('/setup/success/')->to('setup#success');

    $self->routes->route('/errors/database/')->to('errors#database');

    my $preinitBridge  = $self->routes->bridge->to('selftest#preinit');
    my $storeBridge    = $preinitBridge->bridge->to('selftest#store');
    my $postinitBridge = $storeBridge->bridge->to('selftest#postinit');

    # Add routes
    $postinitBridge->route('/login/')->to('session#login');
    $postinitBridge->route('/logout/')->to('session#logout');
    $postinitBridge->route('/locale/')->to('locale#index');

    # Add sessionable routes
    my $sessionBridge  = $postinitBridge->bridge->to('filters#mysession');

    # Calendar routes
    $self->createRoutes($sessionBridge, "calendar", [ "create", "read", "update", "delete", "list", "enable", "disable", "combogroups" ]);

    # Documents routes
    $self->createRoutes($sessionBridge, "documents", [ "create", "read", "update", "delete", "list" ]);
    $self->createRoutes($sessionBridge, "documents/combos", [ "groups", "fascicles", "headlines", "rubrics", "holders", "managers", "progress" ]);

    # Catalog routes
    $self->createRoutes($sessionBridge, "catalog/combos",       [ "editions", "groups", "fascicles", "roles", "readiness" ]);
    $self->createRoutes($sessionBridge, "catalog/editions",     [ "create", "read", "update", "delete", "tree" ]);
    $self->createRoutes($sessionBridge, "catalog/organization", [ "create", "read", "update", "delete", "tree", "map", "unmap" ]);
    $self->createRoutes($sessionBridge, "catalog/readiness",    [ "create", "read", "update", "delete", "list" ]);
    $self->createRoutes($sessionBridge, "catalog/roles",        [ "create", "read", "update", "delete", "list", "map", "mapping" ]);
    $self->createRoutes($sessionBridge, "catalog/rules",        [ "list" ]);
    $self->createRoutes($sessionBridge, "catalog/members",      [ "create", "delete", "list", "map", "mapping" ]);
    $self->createRoutes($sessionBridge, "catalog/stages",       [ "create", "read", "update", "delete", "list", "map-principals", "unmap-principals", "principals-mapping" ]);
    $self->createRoutes($sessionBridge, "catalog/principals",   [ "list" ]);

    # Profile routes
    $self->createRoutes($sessionBridge, "profile", [ "read", "update" ]);
    $sessionBridge->route('/profile/image/:id')->to('profile#image', id => "00000000-0000-0000-0000-000000000000");

    # State route
    $self->createRoutes($sessionBridge, "state", [ "index", "read", "update" ]);

    # Workspace routess
    $self->createRoutes($sessionBridge, "workspace", [ "index", "menu", "state", "online", "appsession" ]);

    # Main route
    $sessionBridge->route('/')->to('workspace#index');

    return $self;
}

sub createRoutes {
    my $c = shift;
    my $bridge = shift;
    my $prefix = shift;
    my $routes = shift;

    foreach my $route (@$routes) {
        my $cprefix = "/$prefix/$route/";
        if ($route eq "index") {
            $cprefix = "/$prefix/";
        }

        my $croute  = $prefix;
        $croute =~ s/\//-/g;

        my @routes = split('-', $route);
        for (my $i=1; $i <= $#routes; $i++) {
            $routes[$i] = ucfirst($routes[$i]);
        }
        $route = join("", @routes);
        $croute = "$croute#$route";

        $bridge->route($cprefix)->to( $croute );
        #say STDERR "$bridge->route($cprefix)->to( $croute );";
    }

    return 1;
}

1;
