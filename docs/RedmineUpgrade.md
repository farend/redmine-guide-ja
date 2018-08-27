アップグレード
==============

!!! note ""
    最終更新: 2018/01/14 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineUpgrade/81)]

[TOC]

<a href="https://hosting.redmine.jp/lp-data-migration/"><img src="/redmine_jp/banner_data_migration-old-version.png" srcset="/redmine_jp/banner_data_migration-old-version.png 2x"></a>

Step 1 - 動作環境の確認
-----------------------

Redmineのアップグレードを行う場合は、 [動作環境](RedmineInstall#Requirements) を参照して、新しいバージョンが要求する動作環境を現在の環境が満たしていることを確認してください。

Step 2 - バックアップ
---------------------

データベースおよびアップロードされたファイルのバックアップをお勧めします。通常はアップグレードは安全に行えますが、万一の時に備えてバックアップをとっておくのが安全です。

Redmineのデータをバックアップする方法については [Redmineのバックアップとリストア](RedmineBackupRestore.md) を参照してください。

Step 3 - アップグレードの実行
-----------------------------

いよいよ実際にアップグレードを行います。アップグレード元のRedmineをどのようにダウンロードしたかによって手順が異なります。次に説明する手順のうち **いずれか一つだけ** を実行してください。

### Option 1 - リリースバージョンのダウンロード

1\. 新しいRedmineのtarballを [ダウンロード](http://www.redmine.org/projects/redmine/wiki/Download) して新しいディレクトリに展開してください。

アプリケーションサーバを実行しているユーザー/グループがファイルにアクセスできるよう、新たに展開したファイルとディレクトリのオーナーとグループが適切であることを確認してください。

さらに、`files`、`log`、`tmp`の各ディレクトリは書き込み権限も必要です。

2\. データベース設定ファイル `config/database.yml` を新しい `config` ディレクトリにコピーしてください。Redmine 1.4以上をMySQLとRuby 1.9で利用する場合、データベースアダプタの名称を `mysql2` に変更してください。

3a. 設定ファイル `config/configuration.yml` を新しい `config` ディレクトリにコピーしてください。

3b. もしくは、 **1.2.0より前のバージョンからアップグレードする場合、** `config/email.yml` を参照して `config/configuration.yml` にメールの設定を移行してください。このファイルは `configuration.yml.example` をコピーして作成できます。

4\. `files` ディレクトリを新しいRedmineのディレクトリにコピーしてください(このディレクトリにはRedmineにアップロードしたすべてのファイルが入っています)。

5\. `plugins` ディレクトリ内の独自に追加したプラグインを新しいRedmineのディレクトリにコピーしてください(1.xからのアップグレードの場合は `vendor/plugins` ディレクトリ)。Redmineに標準添付されていないプラグインのみをコピーするよう注意してください。

6\. Redmineのインストールディレクトリで以下のコマンドを実行してRedmineの実行に必要なgemをインストールしてください:

``` sh
bundle install --without development test
```

ImageMagickがインストールされていない場合は以下のように実行してrmagickのインストールを省略する必要があります:

``` sh
bundle install --without development test rmagick
```

データベース設定ファイルで指定したデータベースアダプタが必要とするgemのみがインストールされます(例えば、 `config/database.yml` 内で'mysql2'アダプタを指定した場合は、mysql2 gemのみがインストールされます)。別のデータベースを使うために config/database.yml を変更したら、忘れずに `'bundle install'` を実行してください。

もしRedmine本体では使用しないgem(例: fcgi)の読み込みが必要な場合、Redmineのインストールディレクトリに Gemfile.local というファイルを作成してください。このファイルは `'bundle install'` を実行したときに自動的に読み込まれます。

7\. 新しいRedmineのインストールディレクトリで以下のコマンドを実行してください:

もしRedmine 2.xからアップデートする場合、以下のファイルが存在すれば削除してください。

* `config/initializers/secret_token.rb` (2.x)
* `config/initializers/session_store.rb` (1.x)

そして、新しいセッション保護用の秘密鍵を生成してください。

``` sh
bundle exec rake generate_secret_token
```

あるいは、この秘密鍵を `config/secrets.yml` に保存することもできます。<br>
<http://guides.rubyonrails.org/upgrading_ruby_on_rails.html#config-secrets-yml>

8\. `public/themes` ディレクトリ内のテーマを確認してください。これらは新しい環境にコピーできますが、なるべくアップデートされたバージョンを使ってください。

!!! warning "重要"
    絶対に config/settings.yml を古いもので上書きしないでください。

### SVNチェックアウトのアップグレード

1\. Redmineのインストールディレクトリに移動して、以下のコマンドを実行してください:

``` sh
svn update
```

2\. 必要なgemをインストールするために以下のコマンドを実行してください。

``` sh
bundle update
```

Step 4 - データベースの更新
---------------------------

データベースの内容を更新します。新しいRedmineのインストールディレクトリに移動し、データベースのマイグレーションを行ってください。

``` bash
bundle exec rake db:migrate RAILS_ENV=production
```

なにかプラグインをインストールしている場合、プラグインについてもデータベースのマイグレーションを行う必要があります。

``` bash
bundle exec rake redmine:plugins:migrate RAILS_ENV=production
```

Step 5 - クリーンナップ
-----------------------

1\. キャッシュとセッションファイルのクリアを行ってください。

``` bash
bundle exec rake tmp:cache:clear tmp:sessions:clear RAILS_ENV=production
```

2\. アプリケーションサーバを再起動してください (例 puma, thin, passenger)

3\. 最後に「管理」→「ロールと権限」画面を開き、Redmineの新バージョンで新たに追加された機能に対する権限の確認・設定を行ってください。

よくある問題
------------

### リポジトリ管理に関するエラー

reposman.rb にはいくつかの新機能が追加されました。何か問題が発生したら、まずはリポジトリのUNIXグループを指定しているか確認してください(`--group=groupnamehere`)。また、もし単にRedmine.pmをコピーしただけであれば、 [ここ](http://www.redmine.org/projects/redmine/wiki/Repositories_access_control_with_apache_mod_dav_svn_and_mod_perl) に記載してある手順を再度確認するとともに、Apacheの推奨設定が変更されているためApacheの設定を更新してください。

###  secret\_token.rb の生成

Redmine 2.0.0より前のバージョンでは、cookieベースのセッション管理を利用するために `session_store.rb` を生成する必要がありました。

2.0.0以降では、 `session_store.rb` は存在してはなりません。代わりに以下のコマンドで `secret_token.rb` を生成します:

``` sh
bundle exec rake generate_secret_token
```

!!! note
    Redmineのリポジトリとtarballには config/initializers/session\_store.rb ファイルは含まれていません。上記のコマンドを実行することで生成されます。

### 関連情報

Redmineのアップグレードについて参考になる情報です。

-   [mod\_fcgid for Apache2](http://httpd.apache.org/mod_fcgid/) helped us get Rails 2.3.5 running on Apache 2
-   [Running Redmine on Apache](http://www.redmine.org/wiki/redmine/HowTo_configure_Apache_to_run_Redmine)
-   [Notes about our 0.8.6 to 0.9.3 upgrade issues and how to resolve them](http://web.archive.org/web/20111214022108/http://www.cybersprocket.com/2010/project-management/upgrading-redmine-from-8-6-to-9-3/) --cybersprocket (2010-04-25)
-   [Notes about our 0.9.6 to 1.0(RC) upgrade process](http://web.archive.org/web/20120610010521/http://www.cybersprocket.com/2010/tips-tricks/upgrading-redmine-from-0-9-6-to-1-0-0/) --cybersprocket (2010-08-14)

<a href="https://hosting.redmine.jp/lp-data-migration/"><img src="/redmine_jp/banner_data_migration-old-version.png" srcset="/redmine_jp/banner_data_migration-old-version.png 2x"></a>
