Redmineのバックアップとリストア
===============================

!!! note ""
    最終更新: 2018/01/14 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineBackupRestore/4)]

[TOC]

バックアップ {: #Backup}
------------

バックアップに含めるべきものは以下の通りです。

* データベース
* 添付ファイル (デフォルトではRedmineのインストールディレクトリ直下の `files` ディレクトリに保存されています)

### データベースのバックアップ

#### MySQL

`mysqldump` コマンドを使うとMySQLのデータベースの内容をテキストファイルに出力できます。

``` text
/usr/bin/mysqldump -u ユーザー名 -pパスワード -hホスト名 データベース名 > /path/to/backup/db/redmine.sql
```

`ユーザー名`、`パスワード`、`ホスト名`、`データベース名` は `config/database.yml` を見て調べることができます。MySQLのインストールの形態によっては `ホスト名` は不要なことがあります。

#### PostgreSQL

`pg_dump` コマンドを使うとPostgreSQLのデータベースの内容をファイルに出力できます。

``` text
/usr/bin/pg_dump -U <username> -h <hostname> -Fc --file=redmine.sqlc <redmine_database>
```

`ユーザー名`、`パスワード`、`ホスト名`、`データベース名` は `config/database.yml` を見て調べることができます。MySQLのインストールの形態によっては `ホスト名` は不要なことがあります。データベースのパスワードは `pg_dump` コマンドを実行したときに入力を求められます。

#### SQLite

SQLiteはすべてのデータが一つのファイルに格納されているので、そのファイルを別の場所にコピーすればバックアップとすることができます。

SQLiteデータベースのファイル名は `config/database.yml` を参照すれば特定できます。

### 添付ファイルのバックアップ

Redmineにアップロードされたファイルは `attachments_storage_path` （デフォルトは `files/` ディレクトリ）に格納されています。このディレクトリを別の場所に丸ごとコピーすることでバックアップできます。

!!! warning
    `attachments_storage_path` は `files/` ディレクトリ以外の場所を指している場合があります。正しいディレクトリのバックアップを行うために、必ず `config/configuration.yml` 内の設定を確認してください。

### バックアップスクリプトのサンプル

日次バックアップのためのスクリプトの例です（MySQLを使用していることを想定しています）:

``` bash
# Database
/usr/bin/mysqldump -u <username> -p<password> <redmine_database> | gzip > /path/to/backup/db/redmine_`date +%Y-%m-%d`.gz

# Attachments
rsync -a /path/to/redmine/files /path/to/backup/files
```


リストア
--------

TODO
