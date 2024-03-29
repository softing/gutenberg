package Inprint::Menu;

# Inprint Content 5.0
# Copyright(c) 2001-2011, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use utf8;
use strict;
use warnings;

use base 'Mojolicious::Controller';

sub index
{
    my $c = shift;

    ############################################################################
    # About menu items
    ############################################################################

    my $AboutSection = {
        id => "core",
        menu => [
            #{ id=> "core-help" },
            { id=> "core-about" }
        ]
    };

    ############################################################################
    # Documents menu items
    ############################################################################

    my $accessViewDocuments   = $c->objectAccess(["catalog.documents.view:*"]);
    my $accessCreateDocuments = $c->objectAccess(["catalog.documents.create:*"]);

    my $DocumentsSection = {
        id => "documents"
    };
    if ($accessViewDocuments) {
        if ($accessCreateDocuments) {
            push @{ $DocumentsSection->{menu} }, { id => "documents-create" };
            push @{ $DocumentsSection->{menu} }, '-';
        }
        push @{ $DocumentsSection->{menu} }, { id => "documents-todo" };
        push @{ $DocumentsSection->{menu} }, '-';
        push @{ $DocumentsSection->{menu} }, { id => "documents-all" };
        push @{ $DocumentsSection->{menu} }, { id => "documents-archive" };
        push @{ $DocumentsSection->{menu} }, { id => "documents-briefcase" };
        push @{ $DocumentsSection->{menu} }, { id => "documents-recycle" };

        push @{ $DocumentsSection->{menu} }, '-';

        push @{ $DocumentsSection->{menu} }, { id => "document-downloads" };
    }

    ############################################################################
    # Advertising
    ############################################################################

    my @advertMenu;

    my $accessAdvertDomains  = $c->objectAccess("domain.editions.manage");
    my $accessAdvertEditions = $c->objectAccess("editions.advert.manage:*");

    if ($accessAdvertEditions) {
        push @advertMenu, { id => "advert-advertisers" };
        push @advertMenu, { id => "advert-downloads" };
    }

    if ($accessAdvertDomains) {

        if ( @advertMenu ) {
            push @advertMenu, "-";
        }

        push @advertMenu, { id => "advert-modules" };
        push @advertMenu, { id => "advert-index" };
    }

    my $AdvertisingSection = {
        id => "advertising",
        menu => \@advertMenu
    };

    ############################################################################
    # Calendar
    ############################################################################

    my $accessCalendarEditions = $c->objectAccess("editions.calendar.view:*");
    my $CalendarSection = {
        id => "calendar"
    };
    if ( $accessCalendarEditions ) {
        push @{ $CalendarSection->{menu} }, { id => "calendar-issues" };
        push @{ $CalendarSection->{menu} }, { id => "calendar-archive" };
        push @{ $CalendarSection->{menu} }, { id => "calendar-templates" };
        push @{ $CalendarSection->{menu} }, "-";
        push @{ $CalendarSection->{menu} }, { id => "briefcase-index", oid  => "00000000-0000-0000-0000-000000000000" };
    }

    ############################################################################
    # Fascicles
    ############################################################################

    my @FasciclesSection;

    my $fascicles = $c->Q("
        SELECT
            t1.id, t1.shortcut, t2.id as edition, t2.shortcut as edition_shortcut
        FROM fascicles t1, editions t2
        WHERE
            t1.edition = t2.id
            AND t1.fastype = 'issue'
            AND t1.enabled = true
            AND t1.archived = false
            AND deleted = false

            -- and t1.id = '24994dfa-5393-427c-8d89-02d315d38e0a'

        ORDER BY t1.release_date, t2.shortcut, t1.shortcut
    ")->Hashes;

    foreach my $item (@$fascicles) {
        $item->{attachments} = $c->Q("
            SELECT
                t1.id, t1.shortcut, t2.id as edition, t2.shortcut as edition_shortcut
            FROM fascicles t1, editions t2
            WHERE
                t1.edition = t2.id
                AND t1.fastype = 'attachment'
                AND t1.enabled = true
                AND t1.archived = false
                AND deleted = false
                AND t1.parent = ?
            ORDER BY t1.release_date, t2.shortcut, t1.shortcut
        ", [ $item->{id} ])->Hashes;
    }

    foreach my $fascicle (@$fascicles) {

        my $accessLayoutView   = $c->objectAccess("editions.fascicle.view:*",   $fascicle->{edition});
        my $accessLayoutManage = $c->objectAccess("editions.fascicle.manage:*", $fascicle->{edition});
        my $accessAdvertManage = $c->objectAccess("editions.advert.manage:*",   $fascicle->{edition});

        my $oid = $fascicle->{id};
        my $edition = $fascicle->{edition};

        my $menuItem = {
            id   => "fascicle",
            text => $fascicle->{edition_shortcut} . '/'. $fascicle->{shortcut},
            menu => []
        };

        unless (@{ $fascicle->{attachments} }) {
            if ($accessLayoutView) {
                push @{ $menuItem->{menu} }, {
                    oid => $oid,
                    id  => "fascicle-plan",
                    description => $fascicle->{shortcut} };
            }
            if ($accessLayoutManage) {
                push @{ $menuItem->{menu} }, {
                    oid => $oid,
                    id  => "fascicle-planner",
                    description => $fascicle->{shortcut} };
                push @{ $menuItem->{menu} }, "-";
                push @{ $menuItem->{menu} }, {
                    oid => $oid,
                    id  => "fascicle-index",
                    description => $fascicle->{shortcut} };
                push @{ $menuItem->{menu} }, {
                    oid => $oid,
                    id  => "fascicle-modules",
                    description => $fascicle->{shortcut} };
                push @{ $menuItem->{menu} }, {
                    oid => $oid,
                    id  => "fascicle-places",
                    description => $fascicle->{shortcut} };
            }
        }

        foreach my $attachment (@{ $fascicle->{attachments} }) {

            my $menuSubitem = $c->fascicleHadler($attachment, "attachment");
            my $accessAttachmentView = $c->objectAccess("editions.attachment.view:*", $attachment->{edition});

            if ($accessAttachmentView) {
                #$accessFascicleView = 1;
                push @{ $menuItem->{menu} }, $menuSubitem;
            }
        }

        if ($accessLayoutView) {
            push @FasciclesSection, $menuItem;
        }
    }

    ############################################################################
    # Employee
    ############################################################################

    my $EmployeeSection = {
        id => "employee",
        text => $c->getSessionValue("member.shortcut")
    };
    push @{ $EmployeeSection->{menu} }, { id => "employee-card" };
    push @{ $EmployeeSection->{menu} }, { id => "employee-settings" };
    push @{ $EmployeeSection->{menu} }, "-";
    push @{ $EmployeeSection->{menu} }, { id => "employee-access" };
    #push @{ $EmployeeSection->{menu} }, { id => "employee-logs" };
    push @{ $EmployeeSection->{menu} }, "-";
    push @{ $EmployeeSection->{menu} }, { id => "employee-logout" };

    ############################################################################
    # Settings
    ############################################################################

    my $SettingsSection = {
        id => "settings"
    };
    my $accessViewSettings = $c->objectAccess("domain.configuration.view");
    if ($accessViewSettings) {
        push @{ $SettingsSection->{menu} }, { id => "settings-organization" };
        push @{ $SettingsSection->{menu} }, { id => "settings-editions" };
        push @{ $SettingsSection->{menu} }, { id => "settings-readiness" };
        push @{ $SettingsSection->{menu} }, { id => "settings-index" };

        #push @{ $SettingsSection->{menu} }, "-";
        #push @{ $SettingsSection->{menu} }, { id => "system-settings" };
        #push @{ $SettingsSection->{menu} }, { id => "system-logs" };
    }

    ############################################################################
    # Plugins
    ############################################################################

    my $plugs = $c->Q("SELECT * FROM plugins.menu WHERE menu_enabled=true ORDER BY menu_section, menu_sortorder")->Hashes;
    foreach my $item (@$plugs) {
        my $exists = {};
        if ($item->{menu_section} eq "about") {
            unless ($exists->{about}) {
                $exists->{about} = 1;
                push @{ $AboutSection->{menu} }, "-";
            }
            push @{ $AboutSection->{menu} }, { id => $item->{menu_id} };
        }
        if ($item->{menu_section} eq "documents") {
            unless ($exists->{documents}) {
                $exists->{documents} = 1;
                push @{ $DocumentsSection->{menu} }, "-";
            }
            push @{ $DocumentsSection->{menu} }, { id => $item->{menu_id} };
        }
        if ($item->{menu_section} eq "advertisig") {
            unless ($exists->{advertisig}) {
                $exists->{advertisig} = 1;
                push @{ $AdvertisingSection->{menu} }, "-";
            }
            push @{ $AdvertisingSection->{menu} }, { id => $item->{menu_id} };
        }
        if ($item->{menu_section} eq "calendar") {
            unless ($exists->{calendar}) {
                $exists->{calendar} = 1;
                push @{ $CalendarSection->{menu} }, "-";
            }
            push @{ $CalendarSection->{menu} }, { id => $item->{menu_id} };
        }
        if ($item->{menu_section} eq "employee") {
            unless ($exists->{employee}) {
                $exists->{employee} = 1;
                push @{ $EmployeeSection->{menu} }, "-";
            }
            push @{ $EmployeeSection->{menu} }, { id => $item->{menu_id} };
        }
        if ($item->{menu_section} eq "settings") {
            unless ($exists->{settings}) {
                $exists->{settings} = 1;
                push @{ $SettingsSection->{menu} }, "-";
            }
            push @{ $SettingsSection->{menu} }, { id => $item->{menu_id} };
        }
    }

    ############################################################################
    # Render Menu
    ############################################################################

    my @result;

    push @result, $AboutSection;
    push @result, "-";

    push @result, $DocumentsSection;
    push @result, "-";

    if ( $accessAdvertDomains || $accessAdvertEditions ) {
        push @result, $AdvertisingSection;
        push @result, "-";
    }

    if ( $accessCalendarEditions ) {

        push @result, $CalendarSection;
        push @result, "-";
    }

    foreach my $item (@FasciclesSection) {
        push @result, $item;
    }

    push @result, '->';

    push @result, $EmployeeSection;

    if ( $accessViewSettings ) {
        push @result, $SettingsSection;
    }

    $c->smart_render([], \@result);
}

sub fascicleHadler {

    my ($c, $fascicle, $fastype) = @_;

    my $accessLayoutView   = $c->objectAccess("editions.$fastype.view:*",   $fascicle->{edition});
    my $accessLayoutManage = $c->objectAccess("editions.$fastype.manage:*", $fascicle->{edition});
    my $accessAdvertManage = $c->objectAccess("editions.advert.manage:*",   $fascicle->{edition});

    my $oid = $fascicle->{id};
    my $edition = $fascicle->{edition};

    my $fascicle_menu = {
        id   => $fastype,
        text => $fascicle->{edition_shortcut} . '/'. $fascicle->{shortcut},
        menu => []
    };

    if ($accessLayoutView) {
        push @{ $fascicle_menu->{menu} }, {
            oid => $oid,
            id  => "fascicle-plan",
            description => $fascicle->{shortcut}
        };
    }

    if ($accessLayoutManage) {

        push @{ $fascicle_menu->{menu} },
            {
                oid => $oid,
                id  => "fascicle-planner",
                description => $fascicle->{shortcut}
            };

        push @{ $fascicle_menu->{menu} }, "-";

        push @{ $fascicle_menu->{menu} },
            {
                oid => $oid,
                id  => "fascicle-index",
                description => $fascicle->{shortcut}
            };

        push @{ $fascicle_menu->{menu} },
            {
                oid => $oid,
                id  => "fascicle-modules",
                description => $fascicle->{shortcut}
            };

        push @{ $fascicle_menu->{menu} },
            {
                oid => $oid,
                id  => "fascicle-places",
                description => $fascicle->{shortcut}
            };

    }

    return $fascicle_menu;

}

1;
