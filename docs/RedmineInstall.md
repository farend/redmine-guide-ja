Redmineのインストール
=====================

!!! note ""
    最終更新: 2017/09/06 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineInstall/282)]

[TOC]

動作環境 {: #Requirements }
--------

### OS

RedmineはUnix, Linux,
[macOS](http://www.redmine.org/projects/redmine/wiki/RedmineInstallOSX)
、 [macOS
Server](http://www.redmine.org/projects/redmine/wiki/RedmineInstallOSXServer)
、
[Windows](http://www.redmine.org/projects/redmine/wiki/RedmineInstall#Notes-on-Windows-installation)
など、Rubyが実行できるほとんどの環境で実行できます。さまざまなシステム向けの個別のインストール手順は
[こちらの一覧](http://www.redmine.org/projects/redmine/wiki/HowTos)
を参照してください。

### Rubyインタプリタ

Redmineの各バージョンで必要となるRubyのバージョンは以下の通りです。

|Redmineのバージョン | 対応しているRubyのバージョン     | Railsのバージョン  |
|:---------------:|:---------------------------------|:-------------------:|
| 4.0 (未リリース)| ruby 2.2(2.2.2以降), 2.3, 2.4[^ruby-2_4] | Rails 5.1      |
| 3.4             | ruby 1.9.3, 2.0.0, 2.1, 2.2, 2.3, 2.4[^ruby-2_4] | Rails 4.2           |
| 3.3             | ruby 1.9.3, 2.0.0, 2.1, 2.2, 2.3 | Rails 4.2           |
| 3.2             | ruby 1.9.3, 2.0.0, 2.1, 2.2      | Rails 4.2           |

!!! warning
    Ruby 1.9.3, 2.0 と 2.1のRubyコミュニティによる保守は終了しました。原則として使用しないでください。

[^ruby-2_4]: Ruby 2.4には [r16355](http://www.redmine.org/projects/redmine/repository/revisions/16355) で対応しています。

### データベース

- MySQL 5.0 - 5.5
    - MySQL 5.6以降とMariaDBは既知の問題があります ([#19344](http://www.redmine.org/issues/19344), [#19395](http://www.redmine.org/issues/19395), [#17460](http://www.redmine.org/issues/17460)).
- PostgreSQL 8.2以降
    - データベースの日付形式がISO(PostgreSQLのデフォルト)であることを確認してください。次のSQL文で設定できます: `ALTER DATABASE "redmine_db" SET datestyle="ISO,MDY";`
    - PostgreSQL 8.4.0 と 8.4.1に存在するバグに起因するRedmineの不具合が報告されています([#4259](http://www.redmine.org/issues/4259), [#4259](http://www.redmine.org/issues/4314))。それらのバグはPostgreSQL 8.4.2で修正済みです。
- Microsoft SQL Server 2012以降
- SQLite 3 (複数のユーザーがアクセスする実運用環境には向いていません!)

### オプション

- バージョン管理システム(svn等)のバイナリ（リポジトリ閲覧用、PATHが通っていなければなりません）。利用可能なバージョン管理システムや動作条件については
    [「リポジトリの設定」](RedmineRepositories) をご覧下さい。
- [ImageMagick](http://www.imagemagick.org/script/index.php) (ガントチャートのPNG形式でのエクスポートとサムネイル生成に使用)
- [Ruby OpenID Library](https://github.com/openid/ruby-openid)
    (OpenIDによる認証を使用する場合)。

Redmineのバージョン
-------------------

通常は最新のリリース版のRedmineをインストールしてください。Redmineは6ヶ月ごとに新しいバージョンがリリースされており、リリース版はたいへん実用的でかつ安定しています。リポジトリのtrunkからチェックアウトした開発版の利用は、Ruby on Railsに精通し、かつ最新の開発に追従する必要がない限りは **おすすめしません。**
trunkは正常に動作しないこともあります。

インストール手順
----------------

### Step 1 - Redmine本体のインストール

リリースパッケージを [ダウンロード](http://www.redmine.jp/download/)
するか、リポジトリからチェックアウトしてRedmineのソースコードを取得してください。

### Step 2 - 空のデータベースとユーザーの作成

ここではデータベース名とユーザー名を `redmine` としますが、それ以外の名前に変えることもできます。

#### MySQLの場合:

``` sql
CREATE DATABASE redmine CHARACTER SET utf8;
CREATE USER 'redmine'@'localhost' IDENTIFIED BY 'my_password';
GRANT ALL PRIVILEGES ON redmine.* TO 'redmine'@'localhost';
```

MySQL 5.0.2以前の場合 - `CREATE USER` の代わりに以下を実行してください:

``` sql
grant all privileges on redmine.* to 'redmine'@'localhost' identified by 'my_password';
```

#### PostgreSQLの場合

``` sql
CREATE ROLE redmine LOGIN ENCRYPTED PASSWORD 'my_password' NOINHERIT VALID UNTIL 'infinity';
CREATE DATABASE redmine WITH ENCODING='UTF8' OWNER=redmine;
```

#### SQL Serverの場合

「SQL Server Management Studio」を使えば数クリックで必要な設定が行えます。

もし SQLCMD によるコマンドラインでの操作のほうがよければ、以下の例を参考にしてください:

``` sql
USE [master]
GO

-- Very basic DB creation
CREATE DATABASE [REDMINE]
GO

-- Creation of a login with SQL Server login/password authentication and no password expiration policy
CREATE LOGIN [REDMINE] WITH PASSWORD=N'redminepassword', DEFAULT_DATABASE=[REDMINE], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

-- User creation using previously created login authentication
USE [REDMINE]
GO
CREATE USER [REDMINE] FOR LOGIN [REDMINE]
GO
-- User permissions set via roles
EXEC sp_addrolemember N'db_datareader', N'REDMINE'
GO
EXEC sp_addrolemember N'db_datawriter', N'REDMINE'
GO
```

### Step 3 - データベースに接続するための設定

`config/database.example.yml` をコピーして `config/database.yml`
を作成してください。そして `config/database.yml`
を編集し、"production" 環境用のデータベース設定を行ってください。

MySQLの例 (デフォルトのポートを使用):

``` yaml
production:
  adapter: mysql2
  database: redmine
  host: localhost
  username: redmine
  password: my_password
```

MySQLを標準のポート(3306)以外で実行している場合は以下のような設定となります:

``` yaml
production:
  adapter: mysql2
  database: redmine
  host: localhost
  port: 3307
  username: redmine
  password: my_password
```

PostgreSQLを使用する場合の例(デフォルトのポート):

``` yaml
production:
  adapter: postgresql
  database: <your_database_name>
  host: <postgres_host>
  username: <postgres_user>
  password: <postgres_user_password>
  encoding: utf8
  schema_search_path: <database_schema> (default - public)
```

SQL Serverを使用する場合の例(デフォルトホスト＝localhost、デフォルトポート＝1433):

``` yaml
production:
  adapter: sqlserver
  database: redmine
  username: redmine # should match the database user name
  password: redminepassword # should match the login password
```

### Step 4 - 依存するソフトウェアのインストール

RedmineはRubyGemの依存関係を管理するために [Bundler](http://gembundler.com/) を使用します。

まずはBundlerをインストールしてください:

``` bash
gem install bundler
```

Bundlerのインストール後は、以下のコマンドを実行することでRedmineを実行するために必要なすべてのgemをインストールすることができます:

``` bash
bundle install --without development test
```

#### 省略可能な依存関係

##### RMagick

(PDFとPNGのエクスポートのための画像を操作するためにImageMagickをRedmineから利用するためのツール)

もしRedmineをインストールしようとしている環境にImageMagickがインストールされていない場合、次のようにしてrmagickのインストールを省略してください:

``` bash
bundle install --without development test rmagick
```

もしWindows環境で `rmagick` のインストールがうまくいかない場合は [HowTo install rmagick gem on Windows](http://www.redmine.org/projects/redmine/wiki/HowTo_install_rmagick_gem_on_Windows) を参照してください。

##### データベースアダプタ

Redmineはデータベースの設定ファイル `config/database.yml` を読み取って、必要なデータベースアダプタを自動的にインストールします（例: `mysql2` のみを使用するように設定した場合は `mysql2` gemのみがインストールされます）。

もし `config/database.yml` を編集してデータベースアダプタの追加や削除を行ったら、必ず `bundle install --without development test ...` を実行してください。

#### 独自の依存関係の設定 (Gemfile.local)

もしRedmine本体は使用しないgem (例: puma, fcgi) もロードされるようにしたいときは `Gemfile.local` というファイルをRedmineのディレクトリに作成してください。

`bundle install` の実行時にインストールされます。

例:
``` ruby
  # Gemfile.local
  gem 'puma'
```

### Step 5 - セッションストア秘密鍵の生成

Railsはセッションハイジャックを防ぐために、セッション情報を格納するcookieをエンコードします。この処理で使われるランダムなキーを生成します。

``` bash
bundle exec rake generate_secret_token
```

秘密鍵は `config/secrets.yml` に格納することもできます:<br>
<http://guides.rubyonrails.org/upgrading_ruby_on_rails.html#config-secrets-yml
Edit>

### Step 6 - データベースのテーブル等の作成

データベース上にテーブルを作成してください。Redmineのインストールディレクトリで下記コマンドを実行します。

``` bash
RAILS_ENV=production bundle exec rake db:migrate
```

**Windowsの場合:**

``` bash
set RAILS_ENV=production
bundle exec rake db:migrate
```

これによりマイグレーションが一つずつ実行されてテーブルが作成され、さらに権限のデータ一式と感立社アカウント（`admin`）が作成されます。

### Step 7 - デフォルトデータ

下記コマンドを実行し、デフォルトデータをデータベースに登録してください:

``` bash
RAILS_ENV=production bundle exec rake redmine:load_default_data
```

コマンドを実行中、どの言語のデフォルトデータを登録するのか選択を求められます。なお、コマンドラインで `REDMINE_LANG` 環境変数を指定すると、言語の選択を求められることなく自動的に処理が勧められます。

例:

UNIX:

``` bash
RAILS_ENV=production REDMINE_LANG=fr bundle exec rake redmine:load_default_data
```

Windows:

``` bash
set RAILS_ENV=production
set REDMINE_LANG=fr
bundle exec rake redmine:load_default_data
```

### Step 8 - ファイルシステムのパーミッション

!!! note
    Windowsではこの手順は不要です。

Redmineを実行するOSのユーザーは、以下のディレクトリに対する書き込み権限が必要です:

1. `files` (添付ファイルの保存ディレクトリ)
2. `log` (Redmineのログファイル @production.log@)
3. `tmp` と `tmp/pdf` (もしこれらのディレクトリがなければ作成してください)
4. `public/plugin_assets` (プラグインが使用する画像やCSS)

例えば、ユーザーアカウント `redmine` でアプリケーションを実行する場合:

``` bash
mkdir -p tmp tmp/pdf public/plugin_assets
sudo chown -R redmine:redmine files log tmp public/plugin_assets
sudo chmod -R 755 files log tmp public/plugin_assets
```

### Step 9 - インストールの確認

WEBrickによるwebサーバを起動して、インストールができたかテストしてください:

``` bash
bundle exec rails server webrick -e production
```

WEBrickが起動したら、ブラウザで <http://localhost:3000/> を開いてください。Redmineのwelcomeページが表示されるはずです。

!!! note:
    Webrickは通常は開発時に使用すものであり、通常の運用には適していません。動作確認以外には使用しないでください。本番運用においてはPassenger(mod\_rails)、FCGI、またはRackサーバ(Unicorn, Thin, Puma,hellipなど)の利用を検討してください。

### Step 10 - ログイン

デフォルトのシステム管理者アカウントでログインしてください。:

* ログインID: admin
* パスワード: admin

「管理」→「設定」画面で、アプリケーションのほぼすべての設定を行えます。

設定
----

Redmineの設定は `config/configuration.yml` というファイルで定義されています。

もしデフォルトの設定を変更したい場合は、`config/configuration.yml.example` をコピーして `config/configuration.yml` を作成してそのファイルを編集してください。ファイル内には数多くのコメントがあるので参考にしてください。

`config/configuration.yml` 内の設定はRailsの実行環境(`production` / `development` / `test`)ごとに分けることもできます。

!!! warning "重要"
    設定変更後は必ずアプリケーションを再起動してください。


### メール・SMTPサーバの設定

メールに関する設定は [メールの設定](Email_Configuration.md) を参照してください。

### バージョン管理システムの設定 {: #SCM-settings }

以下の設定が行えます:

* `PATH`環境変数で示すディレクトリに配置されたバージョン管理システムのコマンド名が標準のものではないときに、デフォルトのコマンド名を変更 (Windowsの .bat/.cmd は利用できません)
* コマンドのフルパスを指定

例 (Subversion):

別のコマンド名を使用:

``` text
scm_subversion_command: "svn_replacement.exe"
```

フルパスを使用:

``` text
scm_subversion_command: "C:\Program Files\Subversion\bin\svn.exe"
```

### 添付ファイル保存ディレクトリ

`attachments_storage_path` の設定により、Redmineが添付ファイルを保存するディレクトリをデフォルトの `files` から変更することができます。

例:

``` text
 attachments_storage_path: /var/redmine/files

 attachments_storage_path: D:/redmine/files
```

ログの設定
----------

Redmineはデフォルトでは :info レベルのログを `log` ディレクトリに記録します。サイトの利用状況にもよりますがデータ量は非常に多くなるため、際限なくログのファイルサイズが大きくなるのを防ぐために、ログのローテーションをlogrotateのようなシステムユーティリティを使用するか `config/additional_environment.rb` の設定により行うことを検討してください。

後者の方法でローテーションを行うには、`config/additional_environment.rb.example` をコピーして `config/additional_environment.rb` を作成し、下記の行を追加してください。loggerのデフォルトのログレベルは `Logger::DEBUG` であり大量の情報が記録されるので、明示的に `Logger::INFO` レベルに設定してください。

``` ruby
#Logger.new(PATH,NUM_FILES_TO_ROTATE,FILE_SIZE)
config.logger = Logger.new(config.log_path, 2, 1000000)
config.logger.level = Logger::INFO
```

バックアップ
------------

以下をバックアップしてください:

- データ (Redmineのデータベースに蓄積されています)
- 添付ファイル
    (Redmineのインストールディレクトリの `files` ディレクトリ以下)

簡単なバックアップスクリプトの例を示します (MySQLを使用している場合):

``` bash
# Database
/usr/bin/mysqldump -u <username> -p<password> <redmine_database> | gzip > /path/to/backup/db/redmine_`date +%y_%m_%d`.gz

# Attachments
rsync -a /path/to/redmine/files /path/to/backup/files
```

Linux/UNIX環境でのインストールの補足
------------------------------------

インストール中にパーミッションに関係した不可解な問題が発生した場合は、セキュリティ強化のツールを無効化してください。これらの問題は拡張ACL、SELinux、AppArmorなどにより引き起こされます。


Windows環境でのインストールの補足
---------------------------------

ビルド済みのRubyの配布パッケージとして [RubyInstaller](http://rubyinstaller.org/) があります。RubyInstallerを使用する場合は、インストール後にスタートメニューから「Start Command Prompt with
Ruby」を実行してください。

<u>`RAILS_ENV` 環境変数の指定:</u>

このガイドに記述されているコマンドを実行するときは、`RAILS_ENV` 環境変数を指定するためのコマンドを実行しておく必要があります。

例えば、次のいずれかの形式でコマンドが記述されている場合:

``` text
RAILS_ENV=production <any commmand>
```

``` text
<any commmand> RAILS_ENV=production
```

Windowsのコマンドプロンプトにおいては次のように二つのコマンドに分けて実行する必要があります:

``` text
set RAILS_ENV=production
<any commmand>
```

<u>MySQL gemのインストールに関する問題:</u>

データベースにMySQLを使う場合は次のコマンドを実行してMySQLのgemを手作業でインストールしてください。

```
gem install mysql
```

場合によってはlibmysql.dllをruby/binディレクトリにコピーすることが必要です。libmysql.dllはどれでもよいわけではありません。次のURLのものは動作するようです。

<http://instantrails.rubyforge.org/svn/trunk/InstantRails-win/InstantRails/mysql/bin/libmySQL.dll>


**Windows 7以降を使用している場合(重要)**

Windows 7以降では `localhost`
がhostsファイルからコメントアウトされ[^win_localhost]、IPv6がデフォルトとなっています。mysql2のgemはIPv6をサポートしていない[^mysql2_ipv6] ため接続が確立されず
`"Can't connect to MySQL server on 'localhost' (10061)"`
というエラーが発生します。IPv6が使われているかどうか確認するにはコマンドラインで
`ping localhost`
を実行してください。pingの宛先として "::1:" と表示された場合、IPv6が使用されています。

[^win_localhost]: <http://serverfault.com/questions/4689/windows-7-localhost-name-resolution-is-handled-within-dns-itself-why>
[^mysql2_ipv6]: <https://github.com/brianmario/mysql2/issues/279>

<u>対処方法:</u><br>
`database.yml` 内の `localhost` を `127.0.0.1` に書き換えてください。

手作業でのインストール以外の方法
--------------------------------

インストール作業を簡略化できるサードパーティのAll-in-Oneインストーラも提供されています。
[ダウンロード](http://redmine.jp/download/) ページを参照してください。
