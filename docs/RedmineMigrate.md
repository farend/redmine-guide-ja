他システムからの移行
====================

!!! note ""
    最終更新: 2015/01/15 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineMigrate/30)]

[TOC]

Trac
----

Trac importerで移行できる内容:

* ユーザー
* コンポーネント
* マイルストーン
* チケット
* チケットのコメント、変更(status and resolution)
* Trac固有のフィールド(例: Resolution)はカスタムフィールドとして移行される
* チケットのファイルとカスタムフィールド
* Wikiページと履歴

注意:

1.  ユーザーのパスワードはすべて `trac` に設定されます。
2.  チケットのidは、Redmineデータベースにチケットが全く登録されていない場合に限り保持されます。
3.  カスタムフィールドはRedmine上ではすべてtext型で作成されます。

Tracのデータベースにアクセスするにはsqlite-ruby gemが必要です。

- sqlite: `gem install sqlite-ruby`
- sqlite3: `gem install sqlite3-ruby`

作業を開始する前に、デフォルトデータがロードされたRedmineデータベースが必要です。 [Redmineのインストール](/guide/RedmineInstall/) を参照してください。

移行スクリプトはTrac 0.10および0.11のsqliteデータベースでの動作確認を行いました。

1. 下記コマンドを実行してください。なお、'test'は移行先のRedmine環境です（通常はproductionなど）:

``` sh
rake redmine:migrate_from_trac RAILS_ENV="test"
```

2. スクリプトがTracの設定について問い合わせを行います:

``` text
Trac directory []: /var/trac/myproject
Trac database adapter (sqlite, sqlite3, mysql, postgresql) [sqlite]:
Database encoding [UTF-8]:
Target project identifier []: myproject
```

Trac directoryは、移行対象のTrac environmentのディレクトリです。Redmineはこのディレクトリ以下の `db/trac.db` (sqlite/sqlite3の場合) と `attachments` ディレクトリを参照します。
Tracのデータベースとしてmysqlまたはpostgresqlを使用している場合、DBへ接続するためのパラメータ入力が要求されます(ホスト, データベース名, ユーザー名, パスワード)。
Target project identifierは、移行先となるRedmineプロジェクトの識別子です(プロジェクトが存在しない場合は新規に作成されます)。

4. スクリプトによりデータ移行が行われます:

    Deleting data
    Migrating components..............................
    Migrating milestones..............
    Migrating custom fields.......
    Migrating tickets.................................
    Migrating wiki...........

    Components: 29/30
    Milestones: 14/14
    Tickets: 1275/1275
    Ticket files: 106/106
    Custom values: 4409/4409
    Wiki edits: 102/102

移行されたオブジェクトの合計数が表示されます。
これで、Redmine上にMyprojectという、Tracから移行されたプロジェクトが作成されているはずです。

Mantis
------

Mantis importerで移行できる内容:

\* ユーザー
\* プロジェクト
\* プロジェクトのバージョン, カテゴリーとニュース
\* プロジェクトの参加者
\* バグ
\* バグのメモ, ファイル, 関連, 監視
\* カスタムフィールド

ユーザーのパスワードはすべて"mantis"になります。

添付ファイルの移行は、ファイルがMantisのデータベースに格納されている場合(Mantisのデフォルト)のみ可能です。

このスクリプトは異なるMantis 1.0.xのデータベースでテストされています。それ以降の最新のバージョンでも動作するはずです。

作業を開始する前に、デフォルトデータがロードされただけのRedmineデータベースが必要です。 [Redmineのインストール](/guide/RedmineInstall/) を参照してください。
すでにデータが投入されているRedmineのデータベースに移行するには、Ulrichsによる [Non-destructive migration Script](http://foaa.de/old-blog/2010/04/non-destructive-migration-from-mantis-to-redmine/) が利用できます。

[\#10504](http://www.redmine.org/issues/10504) のパッチを適用するのも忘れないでください。

1. Redmineの環境テストを行うディレクトリで以下のコマンドを入力してください:
1. 以下のコマンドを実行してください。 "test" はデータの移行先のRedmineの環境です:

    rake redmine:migrate_from_mantis RAILS_ENV="test"

2. Mantisのデータベース設定についての質問が表示されます:

    Please enter settings for your Mantis database
    adapter [mysql]:
    host [localhost]:
    database [bugtracker]: mantis
    username [root]:
    password []:
    encoding [UTF-8]:

アダプタ名、ホスト名、データベース名、ユーザ名、パスワード、Mantis データベースのエンコードを入力するか、デフォルト値のままとしてください。

アダプタ名には mysql (デフォルト)か postgresql が使用できます。

3. スクリプトによりデータ移行が行われます:

    Migrating users...............
    Migrating projects.............
    Migrating bugs........................................
    Migrating news...
    Migrating custom fields..

    Users: 15/15
    Projects: 13/13
    Memberships: 10/10
    Versions: 33/33
    Categories: 4/4
    Bugs: 180/180
    Bug notes: 336/336
    Bug files: 46/46
    Bug relations: 11/11
    Bug monitors: 8/8
    News: 3/3
    Custom fields: 2/2

移行されたオブジェクトの合計数が表示さxれます。

その他のシステムからの移行とサードパーティーのスクリプト
--------------------------------------------------------

Redmineユーザーにより作成された移行スクリプトを利用することもできます。

-   [Non-destructive migration from Mantis to Redmine](http://blog.foaa.de/2010/04/non-destructive-migration-from-mantis-to-redmine/)
-   Jira importer: [\#1385](http://www.redmine.org/issues/1385)
-   Bugzilla importer: [\#989](http://www.redmine.org/issues/989) There are currently two bugzilla importers. bz2redmine [http://www.redmine.org/issues/2928](http://github.com/ralli/bz2redmine) and migrate\_from\_bugzilla <http://github.com/ralli/migrate_from_bugzilla>. The bz2redmine preserves the original bugzilla bug numbers and the migrate\_from\_bugzilla rake task uses the ActiveRecord framework and may be used to migrate from and to postgresql databases.
-   Scarab importer: [\#2928](http://www.redmine.org/issues/2928)
-   Mantis 1.2.0rc1: [http://www.redmine.org/issues/2928](http://www.webismymind.be/page/fr/17/migrate-mantis-120rc1-to-redmine.html)

これらのスクリプトはテストもサポートもしていません。
