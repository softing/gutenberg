package Inprint::Documents::Downloads;

# Inprint Content 5.0
# Copyright(c) 2001-2011, Softing, LLC.
# licensing@softing.ru
# http://softing.ru/license

use utf8;
use strict;
use warnings;

use Encode;
use File::Path;
use File::Basename;
use File::stat;
use Text::Unidecode;

use Inprint::Utils::Files;

use base 'Mojolicious::Controller';

sub list {
    my $c = shift;

    my @result;
    my @errors;
    my @params;

    my $i_pictures  = $c->param("pictures");
    my $i_documents = $c->param("documents");

    my $i_edition   = $c->param("flt_edition");
    my $i_fascicle  = $c->param("flt_fascicle");

    my $currentMember = $c->getSessionValue("member.id");

    my $sql = "
        SELECT
            fls.id,
            dcm.id as document, dcm.title document_shortcut, dcm.edition,
            dcm.edition_shortcut, dcm.fascicle, dcm.fascicle_shortcut,
            fls.file_path, fls.file_name, fls.file_description, fls.file_mime,
            fls.file_extension, fls.file_published, fls.file_size, fls.file_length,

            EXISTS (
                SELECT id
                FROM cache_downloads cache
                WHERE cache.member = ? AND cache.file = fls.id
            ) as downloaded,

            to_char(fls.created, 'YYYY-MM-DD HH24:MI:SS') as created,
            to_char(fls.updated, 'YYYY-MM-DD HH24:MI:SS') as updated

        FROM
            documents dcm,
            cache_files fls,
            fascicles fsc

        WHERE 1=1
            AND dcm.fs_folder = fls.file_path
            AND dcm.fascicle = fsc.id
            AND fsc.id <> '99999999-9999-9999-9999-999999999999'
            AND fsc.enabled  = true
            AND fsc.archived = false
            AND fsc.deleted  = false
    ";

    push @params, $currentMember;

    if ($i_edition && $i_edition =~ m/^[a-z|0-9]{8}(-[a-z|0-9]{4}){3}-[a-z|0-9]{12}+$/) {
        $sql .= " AND dcm.edition=? ";
        push @params, $i_edition;
    }

    if ($i_fascicle && $i_fascicle =~ m/^[a-z|0-9]{8}(-[a-z|0-9]{4}){3}-[a-z|0-9]{12}+$/) {
        $sql .= " AND dcm.fascicle=? ";
        push @params, $i_fascicle;
    }

    my @filter;
    if ($i_pictures eq "true") {
        push @filter, " fls.file_extension = ANY(?) ";
        push @params, [ "png", "gif", "jpg", "jpeg", "tiff" ]
    }

    if ($i_documents eq "true") {
        push @filter, " fls.file_extension = ANY(?) ";
        push @params, [ "doc", "docx", "xls", "xlsx", "rtf" ]
    }

    if (@filter) {
        $sql.= " AND (". join(" OR ", @filter) .") ";
    }

    $sql .= " ORDER BY downloaded, fls.updated DESC, fls.file_path ";
    my $files = $c->Q($sql, \@params)->Hashes;

    my $rootPath    = $c->config->get("store.path");

    foreach my $file (@$files) {

        my $filePath = "$rootPath/" . $file->{file_path} ."/". $file->{file_name};
        $filePath = __FS_ProcessPath($c, $filePath);

        if (-e -r $filePath) {
            push @result, {
                id                => $file->{id},
                downloaded        => $file->{downloaded},
                document          => $file->{document},
                document_shortcut => $file->{document_shortcut},
                edition           => $file->{edition},
                edition_shortcut  => $file->{edition_shortcut},
                fascicle          => $file->{fascicle},
                fascicle_shortcut => $file->{fascicle_shortcut},
                filename          => $file->{file_name},
                description       => $file->{file_description},
                mime              => $file->{file_mime},
                extension         => $file->{file_extension},
                published         => $file->{file_published},
                size              => $file->{file_size},
                length            => $file->{file_length},
                created           => $file->{created},
                updated           => $file->{updated},
            }
        }
    }

    $c->smart_render(\@errors, \@result);
}

sub download {

    my $c = shift;

    my @i_files     = $c->param("file[]");
    my $i_safemode  = $c->param("safemode");

    my $temp        = $c->uuid;
    my $rootPath    = $c->config->get("store.path");

    my $tempPath    = $c->config->get("store.temp");
    my $tempFolder  = "$tempPath/inprint-$temp";
    my $tempArchive = "$tempPath/inprint-$temp.7z";

    mkdir $tempFolder;

    die "Can't create temporary folder $tempFolder" unless (-e -w $tempFolder);

    my $fileListString;

    my $currentMember = $c->getSessionValue("member.id");

    my @uniqueFileNames;
    
    foreach my $item (@i_files) {

        my ($docid, $fileid) = split "::", $item;

        next unless ($fileid);
        next unless ($docid);

        my $file = $c->Q(" SELECT id, file_path, file_name FROM cache_files WHERE id=?", $fileid)->Hash;
        my $document = $c->Q(" SELECT id, title FROM documents WHERE id=?", $docid)->Hash;

        next unless ($file->{id});
        next unless ($document->{id});

	my $symlinkFileName = $document->{title} ."__". $file->{file_name};

	$symlinkFileName =~ s/[*|?|\||\\|\/|\"|:|>|<]//g;
	$symlinkFileName =~ s/\s+/_/g;
	$symlinkFileName =~ s/\n+//g;
	
	if ($symlinkFileName ~~ @uniqueFileNames) {
	    next;
	}
	
	push @uniqueFileNames, $symlinkFileName;

        my $pathSource  = "$rootPath/" . $file->{file_path} ."/". $file->{file_name};
        my $pathSymlink = "$tempFolder/" . $symlinkFileName;

        if ($i_safemode eq 'true') {
            $pathSymlink = unidecode($pathSymlink);
            $pathSymlink =~ s/[^\w|\d|\\|\/|\.|-]//g;
            $pathSymlink =~ s/\s+/_/g;
        }

        $pathSource  = __FS_ProcessPath($c, $pathSource);
        $pathSymlink = __FS_ProcessPath($c, $pathSymlink);

        next unless (-e -r $pathSource);

        if ($^O eq "MSWin32") {
            system ("mklink", $pathSymlink, $pathSource);
        } else {
            symlink $pathSource, $pathSymlink;
        }

        die "Can't read symlink $pathSymlink" unless (-e -r $pathSymlink);

        $c->Do(" DELETE FROM cache_downloads WHERE member=? AND document=? AND file=? ", [ $currentMember, $document->{id}, $file->{id} ]);
        $c->Do(" INSERT INTO cache_downloads (member, document, file) VALUES (?,?,?) ", [ $currentMember, $document->{id}, $file->{id} ]);

        $fileListString .= ' "'. $pathSymlink .'" ';
    }

    __FS_CreateTempArchive($c, $tempArchive, $fileListString);

    my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
    $year += 1900; $mon++;
    my $archname = "Downloads_for_${year}_${mon}_${mday}_${hour}${min}${sec}";

    $c->res->headers->content_type("application/x-7z-compressed");
    $c->res->headers->content_disposition("attachment;filename=$archname.7z");
    $c->res->headers->content_length(-s $tempArchive);

    $c->res->content->asset(Mojo::Asset::File->new(path => $tempArchive));

    $c->on(finish => sub {
        rmtree($tempFolder);
        unlink $tempArchive;
    });

    $c->rendered;
}

1;
