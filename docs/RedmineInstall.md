Redmineのインストール
=====================

!!! note ""
    最終更新: 2015/01/12 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineInstall/229)]

必要な環境
----------

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

|Redmine version | Supported Ruby versions          | Rails version used  |
|:--------------:|:--------------------------------:|:-------------------:|
| 3.3            | ruby 1.9.3, 2.0.0, 2.1, 2.2, 2.3 | Rails 4.2           |
| 3.2            | ruby 1.9.3, 2.0.0, 2.1, 2.2      | Rails 4.2           |

!!! warning
    Ruby 1.9.3, 2.0 と 2.1のRubyコミュニティによる保守は終了しました。原則として使用しないでください。

### データベース

- MySQL 5.0以上 (推奨)
    - MySQLのC bindingをインストールしてください。劇的にパフォーマンスが改善します。`gem install mysql2` を実行すればインストールできます。インストール中に問題が発生した場合は [Rails Wiki pages](http://wiki.rubyonrails.org/database-support/mysql) を参照してください。
    - Redmine2.xはmysql5.7.3と互換性がありません。Redmine 3でサポートされる予定です。
- PostgreSQL 8.2以上
    - データベースの日付形式がISO(PostgreSQLのデフォルト)であることを確認してください。次のSQL文で設定できます: `ALTER DATABASE "redmine_db" SET datestyle="ISO,MDY";`
    - PostgreSQL 8.4.0 と 8.4.1に存在するバグがRedmineの動作に影響を及ぼします。([#4259](http://www.redmine.org/issues/4259), [#4259](http://www.redmine.org/issues/4314)) PostgreSQL 8.4.2では修正されています。
- Microsoft SQL Server 2008以上(要Redmine2.3.0以上)
- SQLite 3

### オプション

- バージョン管理システム(svn等)のバイナリ（リポジトリ閲覧用、PATHが通っていなければなりません）。利用可能なバージョン管理システムや動作条件については
    [「リポジトリの設定」](RedmineRepositories) をご覧下さい。
- RMagick (ガントチャートのPNG形式でのエクスポートで使用)
- [Ruby OpenID Library](http://openidenabled.com/ruby-openid/)
    (OpenIDによる認証を使用する場合)
    \[OpenIDはtrunkと0.9-devのみで利用可能\] バージョン2以降

Redmineのバージョン
-------------------

通常は最新のリリース版のRedmineをインストールしてください。Redmineは現在6ヶ月ごとに新しいバージョンがリリースされており、リリース版はたいへん実用的でかつ安定しています。RubyおよびRailsに精通しているのでなければ、trunkバージョンのRedmineの利用は
**おすすめできません。**
trunkバージョンは正常に動作しないこともあります。

インストール手順
----------------

1\. リリースパッケージを [ダウンロード](http://www.redmine.jp/download/)
し展開するか、svnリポジトリからチェックアウトし、Redmineのソースコードを取得してください。

2.空のデータベースとそのデータベースに接続するためのユーザー（例:
`redmine` )を作成してください。

MySQLの場合:

``` sql
create database redmine character set utf8;
create user 'redmine'@'localhost' identified by 'my_password';
grant all privileges on redmine.* to 'redmine'@'localhost';
```

MySQL 5.0.2より前のバージョンを使用する場合create
userの手順をスキップし以下で代用します。

```
grant all privileges on redmine.* to 'redmine'@'localhost' identified by 'my_password';
```

PostgreSQLの場合:

```
CREATE ROLE redmine LOGIN ENCRYPTED PASSWORD 'my_password' NOINHERIT VALID UNTIL 'infinity';
CREATE DATABASE redmine WITH ENCODING='UTF8' OWNER=redmine;
```

3\. `config/database.example.yml` をコピーして `config/database.yml`
を作成してください。 `config/database.yml`
を編集し、"production"環境用のデータベース設定を行ってください。

MySQLをRuby 1.8またはjrubyで使用するの場合の例:

```
production:
  adapter: mysql
  database: redmine
  host: localhost
  username: redmine
  password: my_password
```

MySQLをRuby 1.9で使用するの場合の例 (データベースアダプタは `mysql2`
でなければなりません):

```
production:
  adapter: mysql2
  database: redmine
  host: localhost
  username: redmine
  password: my_password
```

MySQLを標準のポート(3306)以外で実行している場合は以下のような設定となります:

```
production:
  adapter: mysql
  database: redmine
  host: localhost
  port: 3307
  username: redmine
  password: my_password
```

PostgreSQLを使用する場合の例(デフォルトのポート):

```
production:
  adapter: postgresql
  database: <your_database_name>
  host: <postgres_host>
  username: <postgres_user>
  password: <postgres_user_password>
  encoding: utf8
  schema_search_path: <database_schema> (デフォルト: public)
```

4\. 1.4.0以降では、Redmineはgemの依存関係を管理するために
[Bundler](http://gembundler.com/)
を使っています。まずはBundlerをインストールしてください:

`gem install bundler`

その後、以下のコマンドを実行することで、Redmineを実行するために必要なすべてのgemをインストールすることができます:

`bundle install --without development test`

もしRedmineをインストールしようとしている環境にImageMagickがインストールされていない場合、次のようにしてrmagickのインストールを省略する必要があります:

`bundle install --without development test rmagick`.

使用しないデータベースアダプタのインストールを省略することもできます。たとえばMySQLを使用する場合、
`` `bundle install --without development test postgresql sqlite` ``
とすることでpostgresqlとsqliteのgemのインストールを省略できます。

もしRedmine本体は使用しないgem(例: puma, fcgi)もロードしたい場合、
`Gemfile.local`
というファイルをRedmineのディレクトリに作成してください。
`bundle install` 実行時に読み込まれます。 例:

```
  # Gemfile.local
  gem 'puma'
```

5\. セッションストア秘密鍵を生成してください。

Redmine 1.4.xの場合:

```
rake generate_session_store
```

Redmine 2.xの場合:

```
rake generate_secret_token
```

6.
データベース上にテーブルを作成してください。Redmineのインストールディレクトリで下記コマンドを実行します。

```
RAILS_ENV=production rake db:migrate
```

これによりテーブルとRedmineの管理者アカウントが作成されます。

もし次のエラーが発生した場合、libopenssl-ruby1.8が必要です。

```
Rake aborted!
no such file to load -- net/https
```

Ubuntuの場合、以下のコマンドを実行してください。

```
apt-get install libopenssl-ruby1.8
```

7.
下記コマンドを実行し、デフォルトデータをデータベースに登録してください:

```
RAILS_ENV=production rake redmine:load_default_data
```

この手順の実行は任意ですが **強く推奨されます。**
デフォルトのロール、トラッカー、ステータス、ワークフロー、列挙項目がロードされます。

8\. パーミッションの設定

*Windows上で実行する場合はこの手順は省略してください。*

Redmineを実行するユーザーは次のディレクトリに対して書き込み権限が必要です:
files, log, public/plugin\_assets, tmp
(tmpが無ければ作成してください。PDFファイルなどを作成する際に使用されます)。

```
mkdir tmp public/plugin_assets
sudo chown -R redmine:redmine files log tmp public/plugin_assets
sudo chmod -R 755 files log tmp public/plugin_assets
```

9.
WEBrickによるwebサーバを起動して、インストールができたかテストしてください:

Redmine 1.4.xの場合:

```
ruby script/server webrick -e production
```

redmine 2.xの場合:

```
ruby script/rails server webrick -e production
```

WEBrickが起動したら、ブラウザで http://localhost:3000/
を開いてください。Redmineのwelcomeページが表示されるはずです。

注意:
Webrickは通常は開発時に使用すものであり、通常の運用には適していません。動作確認以外には使用しないでください。本番運用においてはPassenger
(mod\_rails)、FCGI、またはRackサーバ(Unicorn, Thin, Puma,
hellipなど)の利用を検討してください。

10\. デフォルトの管理者アカウントでログインしてください。:

\* login: admin\
\* password: admin

「管理」画面でアプリケーションの設定を変更できます。

ログの設定
----------

Redmineはデフォルトでは:infoレベルのログをlogディレクトリに記録します。サイトの利用状況によってはファイルサイズが大きくなるので、ログファイルが無制限に大きくならないようログのローテーションを行うことを検討してください。logrotateのようなシステムユーティリティを使用するか、config/additional\_environment.rbによりローテーションが行えます。

後者の方法でローテーションを行うには、config/additional\_environment.rb.exampleファイルをコピーしてconfig/additional\_environment.rbファイルを作成し、下記の行を追加してください。loggerのデフォルトのログレベルはLogger::DEBUGであり大量の情報が記録されるので、明示的にLogger::INFOレベルに設定する必要があるので注意してください。

```
#Logger.new(PATH,NUM_FILES_TO_ROTATE,FILE_SIZE)
config.logger = Logger.new(config.log_path, 2, 1000000)
config.logger.level = Logger::INFO
```

SMTPサーバの設定
----------------

config/email.yml.example をコピーして config/email.yml
を作成して編集を行い、SMTP設定を適宜調整してください。

設定例は [メールの設定](/guide/Email_Configuration/)
を参照してください。

設定変更後は必ずサーバを再起動してください。

バックアップ
------------

以下をバックアップしてください:

- データ (Redmineのデータベースに蓄積されています)
- 添付ファイル
    (Redmineのインストールディレクトリのfilesディレクトリ以下)

簡単なバックアップスクリプトの例を示します (mysqlを使用している場合):

```
# Database
/usr/bin/mysqldump -u <username> -p <password> <redmine_database> | gzip > /path/to/backup/db/redmine_`date +%y_%m_%d`.gz

# Attachments
rsync -a /path/to/redmine/files /path/to/backup/files
```

Windows環境でのインストール
---------------------------

[RubyInstaller](http://rubyinstaller.org/)
をインストール後、スタートメニューから「Start Command Prompt with
Ruby」を実行してください。

開いたコマンドプロンプト内で、前述の手順を実行してください。

ただし、一部のコマンドはそのままではWindows上では実行できませんので次のように変更してください。

変更前:

```
RAILS_ENV=production rake db:migrate
RAILS_ENV=production rake redmine:load_default_data
```

変更後:

```
set RAILS_ENV=production
rake db:migrate
rake redmine:load_default_data
```

データベースにMySQLを使う場合は次のコマンドを実行してMySQLのgemをインストールしてください。

```
gem install mysql
```

場合によってはlibmysql.dllをruby/binディレクトリにコピーすることが必要です。libmysql.dllはどれでもよいわけではありません。次のURLのものが動作するようです。

<http://instantrails.rubyforge.org/svn/trunk/InstantRails-win/InstantRails/mysql/bin/libmySQL.dll>

### MySQL 5.1とRails 2.2以上の組み合わせにおける問題

最新のバージョンのMySQLを使っている場合、次のようなエラーが発生することがあります。

```
!!! The bundled mysql.rb driver has been removed from Ruby 2.2
```

そして `"gem install mysql"`
を実行すると大量のエラーが発生します。rakeタスクの実行もすぐに失敗します。

この問題を解決するにはInstantRails
projectから以下のDLLをダウンロードし、\\Ruby\\bunディレクトリにコピーしてから再度rakeコマンドを実行してみてください。

<http://instantrails.rubyforge.org/svn/trunk/InstantRails-win/InstantRails/mysql/bin/libmySQL.dll>

### Windows 7以降を使用している場合(重要)

Windows 7以降では `localhost`
がhostsファイルからコメントアウトされ、IPv6がデフォルトとなっています。mysql2のgemはIPv6をサポートしていないため接続が確立されず
`"Can't connect to MySQL2 server on 'localhost'(10061)"`
というエラーが発生します。IPv6が使われているかどうか確認するにはコマンドラインで
`ping localhost`
を実行してください。ターゲット名が"::1:"と表示された場合、IPv6が使用されています。

手作業でのインストール以外の方法
--------------------------------

インストール作業を簡略化できるサードパーティのAll-in-Oneインストーラも提供されています。
[ダウンロード](http://redmine.jp/download/) ページを参照してください。
