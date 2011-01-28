package Inprint::Plugins::Rss;

# Inprint Content 4.5
# Copyright(c) 2001-2010, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use utf8;
use strict;
use warnings;

use Inprint::Store::Embedded;

use base 'Inprint::BaseController';

sub feeds {
    my $c = shift;

    my $feeds = $c->sql->Q("
        SELECT id, url, title, description, published, created, updated
        FROM rss_feeds
        ")->Hashes;

    my $html;

    $html .= '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
    $html .= '<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml">';
    $html .= '<head>';
    $html .= '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<h1>RSS Feeds</h1>';
    $html .= "<ul>";
    foreach (@$feeds) {
        $html .= "<li><a href=\"$$_{url}\">$$_{url}</li>";
    }
    $html .= "</ul>";
    $html .= '</body>';
    $html .= '</html>';

    $c->render(inline => $html);
}

sub feed {

    my $c = shift;

    my $i_feed = $c->param("feed");

    my $url = $c->config->get("public.url");

    my $feed = $c->sql->Q("
        SELECT id, url, title, description, published, created, updated
        FROM rss_feeds WHERE url=?
        ", [ $i_feed ])->Hash;

    $c->render(status => 404) unless $feed->{id};

    my $index = $c->sql->Q("
            SELECT tag, nature
            FROM rss_feeds_mapping t1
            WHERE feed=?
        ", [ $feed->{id} ])->Hashes;

    $c->render(status => 404) unless @$index;

    my (@headlines, @rubrics);
    foreach my $item (@$index) {
        if ($item->{nature} eq "headline") {
            push @headlines, $item->{tag};
        }
        if ($item->{nature} eq "rubric") {
            push @rubrics, $item->{tag};
        }
    }

    unless ( @headlines ) {
        unless ( @rubrics ) {
            $c->render(status => 404);
        }
    }

    my $rss_feed;
    $rss_feed .= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    $rss_feed .= "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:media=\"http://search.yahoo.com/mrss/\" xmlns:blogChannel=\"http://backend.userland.com/blogChannelModule\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\">";
    $rss_feed .= "<channel>";
    $rss_feed .= "<link>". $url ."</link>";
    $rss_feed .= "<title>". $feed->{title} ."</title>";
    $rss_feed .= "<atom:link href=\"". $url ."\" rel=\"self\" type=\"application/rss+xml\" />";
    $rss_feed .= "<description>". $feed->{description} ."</description>";

    my @params; my $sql = "
        SELECT
            t1.id, t1.document, t1.link, t1.title, t1.description, t1.fulltext, t1.published, t1.created,
            to_char(t1.updated, 'Dy, DD Mon YYYY HH:MI:SS +0300') as updated,
            t2.headline, t2, rubric, t2.author
        FROM rss t1, documents t2 WHERE t2.id=t1.document
    ";

    $sql .= " AND (";
    if (@headlines) {
        $sql .= " t2.headline = ANY(?) ";
        push @params, \@headlines;
    }
    if (@rubrics) {
        if (@headlines) {
            $sql .= " OR "
        }
        $sql .= " t2.rubric = ANY(?) ";
        push @params, \@rubrics;
    }
    $sql .= ")";

    my $rss_data = $c->sql->Q($sql, \@params)->Hashes;

    foreach my $item (@$rss_data) {

        $rss_feed .= "<item>";

            $rss_feed .= "<title>". $item->{title} ."</title>";
            $rss_feed .= "<link>".  $url ."/". $item->{url} ."</link>";
            $rss_feed .= "<guid>".  $url ."/". $item->{url} ."</guid>";
            $rss_feed .= "<description>". $item->{description} ."</description>";
            $rss_feed .= "<category>Экономика</category>";
            $rss_feed .= "<pubDate>". $item->{updated} ."</pubDate>";#Sun, 28 Nov 2010 12:50:00 +0300
            $rss_feed .= "<author>".  $item->{author} ."</author>";
            $rss_feed .= "<content:encoded><![CDATA[". $item->{text} ."]]></content:encoded>";

            my $folder = Inprint::Store::Embedded::getFolderPath($c, "rss-plugin", $item->{created}, $item->{id}, 1);
            my $files = Inprint::Store::Embedded::list($c, $folder, ['png', 'jpg', 'gif']);

            foreach my $file (@$files) {
                $rss_feed .= "<media:content url=\"$url/files/download/". $file->{filemask} ."\" type=\"". $file->{mime} ."\" expression=\"full\">";
                if ($file->{description}) {
                    $rss_feed .= "<media:description type=\"plain\">" . $file->{description} . "</media:description>";
                }
                $rss_feed .= "</media:content>";
            }

        $rss_feed .= "</item>";

    }

    $rss_feed .= "</channel>";
    $rss_feed .= "</rss>";

    $c->render(text => $rss_feed, format => 'rss');
}

1;
