アップグレード
==============

!!! note ""
    最終更新: 2015/01/15 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineUpgrade/71)]

Step 1 - 必要な環境の確認
-------------------------

Redmineのアップグレードを行う場合は、 [Redmineのインストール](/guide/RedmineInstall/) を参照して、インストールしようとしているバージョンが要求する環境を満たしていることを確認してください。

Step 2 - バックアップ
---------------------

データベースおよびアップロードしたファイルのバックアップを取得することが推奨されます。多くの場合アップグレードは安全に行えますが、万一の時に備えてバックアップをとっておくのが安全です。

### filesディレクトリのバックアップ

Redmineにアップロードしたファイルはすべて `files/` ディレクトリに保存されています。このディレクトリの内容を他の場所にコピーすることでバックアップとすることができます。

### MySQLデータベース

`mysqldump` コマンドでMySQLデータベースの内容をテキストファイルにバックアップすることができます。

例:

    /usr/bin/mysqldump -u <username> -p<password> <redmine_database> | gzip > /path/to/backup/db/redmine_`date +%y_%m_%d`.gz

### SQLiteデータベース

SQLiteのデータベースは単一のファイルに全ての内容が格納されているので、そのファイルを別の場所にコピーすることでバックアップとすることができます。

### PostgreSQL

`pg_dump` コマンドでPostgreSQLデータベースの内容をテキストファイルにバックアップすることができます。

例:

    /usr/bin/pg_dump -U <username> -Fc --file=redmine.sqlc <redmine_database>

PostgreSQLのバックアップについての解説は次のページでも確認できます: <http://www.commandprompt.com/blogs/joshua_drake/2010/07/a_better_backup_with_postgresql_using_pg_dump/>

Step 3 - アップグレードの実行
-----------------------------

これより実際にアップグレードを実施します。アップグレード手順はRedmineをどのようにダウンロードしたかによって異なります。次に述べる手順のうち **いずれか一つだけ** を実行してください。

### Option 1 - リリースバージョンのダウンロード

1. 新しいRedmineのtarballを [ダウンロード](http://www.redmine.org/projects/redmine/wiki/Download) して新しいディレクトリに展開してください。

2. データベース設定ファイル `config/database.yml` を新しい `config` ディレクトリにコピーしてください。Redmine 1.4以上をMySQLとRuby 1.9で利用する場合、データベースアダプタの名称を `mysql2` に変更してください。

3a. 設定ファイル `config/configuration.yml` を新しい `config` ディレクトリにコピーしてください。

3b. もしくは、 **1.2.0より前のバージョンからアップグレードする場合、** `config/email.yml` を参照して `config/configuration.yml` にメールの設定を移行してください。このファイルは `configuration.yml.example` をコピーして作成できます。

4. `files` ディレクトリを新しいRedmineのディレクトリにコピーしてください(このディレクトリにはRedmineにアップロードしたすべてのファイルが入っています)。

5. `plugins` ディレクトリ内の独自に追加したプラグインを新しいRedmineのディレクトリにコピーしてください(1.xからのアップグレードの場合は `vendor/plugins` ディレクトリ)。Redmineに標準添付されていないプラグインのみをコピーするよう注意してください。

6. Redmineのインストールディレクトリで以下のコマンドを実行してRedmineの実行に必要なgemをインストールしてください:

``` sh
bundle install --without development test
```

ImageMagickがインストールされていない場合は以下のように実行してrmagickのインストールを省略する必要があります:

``` sh
bundle install --without development test rmagick
```

データベース設定ファイルで指定したデータベースアダプタが必要とするgemのみがインストールされます(例えば、 `config/database.yml` 内で'mysql2'アダプタを指定した場合は、mysql2 gemのみがインストールされます)。別のデータベースを使うために config/database.yml を変更したら、忘れずに `'bundle install'` を実行してください。

もしRedmine本体では使用しないgem(例: fcgi)の読み込みが必要な場合、Redmineのインストールディレクトリに Gemfile.local というファイルを作成してください。このファイルは `'bundle install'` を実行したときに自動的に読み込まれます。

7. 新しいRedmineのインストールディレクトリで以下のコマンドを実行してください:

    bundle exec rake generate_secret_token

セッションデータを安全に扱うためのランダムな秘密鍵が含まれる `config/initializers/session_store.rb` ファイルが生成されます。

8. `public/themes` ディレクトリ内のテーマを確認してください。これらは新しい環境にコピーできますが、なるべくアップデートされたバージョンを使ってください。

重要: 絶対に config/settings.yml を古いもので上書きしないでください。

### SVNチェックアウトのアップグレード

1. Redmineのインストールディレクトリに移動して、以下のコマンドを実行してください:

    svn update

2. 必要なgemをインストールするために以下のコマンドを実行してください。

    bundle update

Step 4 - データベースの更新
---------------------------

この手順ではデータベースの内容を更新します。新しいRedmineのインストールディレクトリに移動し、データベースのマイグレーションを行ってください。

     bundle exec rake db:migrate RAILS_ENV=production

なにかプラグインをインストールしている場合、プラグインについてもデータベースのマイグレーションを行う必要があります。

    bundle exec rake redmine:plugins:migrate RAILS_ENV=production

Step 5 - クリーンナップ
-----------------------

1. キャッシュとセッションファイルのクリアを行ってください。

    bundle exec rake tmp:cache:clear tmp:sessions:clear

2. アプリケーションサーバを再起動してください (例 mongrel, thin, passenger)

3. 最後に、 *"管理 -&gt; ロールと権限"* 画面で、Redmineの新バージョンで新たに追加された機能に対する権限の確認・設定を行ってください。

よくある問題
------------

### リポジトリ管理に関するエラー

reposman.rb にはいくつかの新機能が追加されました。何か問題が発生したら、まずはリポジトリのUNIXグループを指定しているか確認してください(--group=groupnamehere)。また、もし単にRedmine.pmをコピーしただけであれば、 [ここ](http://www.redmine.org/projects/redmine/wiki/Repositories_access_control_with_apache_mod_dav_svn_and_mod_perl) に記載してある手順を再度確認するとともに、Apacheの推奨設定が変更されているためApacheの設定を更新してください。

### session\_store.rbの生成

cookieベースのセッションを利用するために、固有の `session_store.rb` ファイルを生成する必要があります。この操作はRedmine 2.0.0以前で必要です。以下のコマンドを実行してください。

    bundle exec rake generate_secret_token

*注意: Redmineには config/initializers/session\_store.rb ファイルは含まれていません。このファイルは上記のコマンドを実行することにより生成されます。*

### 関連情報

Redmineのアップグレードについて参考になる情報です。

-   [mod\_fcgid for Apache2](http://httpd.apache.org/mod_fcgid/) helped us get Rails 2.3.5 running on Apache 2
-   [Running Redmine on Apache](http://www.redmine.org/wiki/redmine/HowTo_configure_Apache_to_run_Redmine)
-   [Notes about our 0.8.6 to 0.9.3 upgrade issues and how to resolve them](http://www.cybersprocket.com/2010/project-management/upgrading-redmine-from-8-6-to-9-3/) --cybersprocket (2010-04-25)
-   [Notes about our 0.9.6 to 1.0(RC) upgrade process](http://www.cybersprocket.com/2010/tips-tricks/upgrading-redmine-from-0-9-6-to-1-0-0/) --cybersprocket (2010-08-14)
