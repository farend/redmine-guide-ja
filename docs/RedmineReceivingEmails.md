メールによるチケット登録
========================

!!! note ""
    最終更新: 2011/01/06

Redmine 0.8.0以降では、電子メールによるチケットの作成・更新を行うよう設定できます。

[TOC]

設定
----

以下のいずれかの方法でRedmineがメールを受け取るよう設定できます:

-   メールサーバからメールを転送:
    -   利点: メールサーバがRedmineとは異なるサーバでもよい, メールが即座に処理される, 高速(アプリケーションのリロードが不要)
    -   欠点: needs some configuration on your mail transfer agent (eg. Postfix, Sendmail...)

<!-- -->

-   IMAPサーバからの受信:
    -   利点: 設定が容易、MTAの設定が不要, メールサーバがRedmineとは異なるサーバでもよい
    -   欠点: メールの処理が即座には行われない (定期的にメールの取得を行うためのcronのジョブを追加する必要がある)

<!-- -->

-   標準入力からのメール読み込み:
    -   利点: テスト用途に最適
    -   欠点: 遅い(メールが到着するごとにRedmineのアプリケーションのリロードが行われる), MTA上での設定が必要

### メールサーバからメールを転送

到着したメールをメールサーバから転送するためのスクリプトが利用できます。
このスクリプトはメールを標準入力から読み込み、HTTP経由でRedmineに転送します。
Redmineのディレクトリ以下にこのスクリプトがあります: `extra/mail_handler/rdm-mailhandler.rb`.

このスクリプトを利用するためには、メール受信のためのAPIを有効にする必要があります:
「設定」→「受信メール」に移動し、 **受信メール用のWeb Serviceを有効にする** のチェックボックスをonにして、APIキーを入力するか生成してください。

`rdm-mailhandler.rb` をメールサーバにコピーし、パーミッションが実行可能か確認した後にMTAの設定を行ってください。

使用方法:

``` text
rdm-mailhandler [options] --url=<Redmine URL> --key=<API key>

必須:
  -u, --url                      URL of the Redmine server
  -k, --key                      Redmine API key

汎用オプション:
  -h, --help                     show this help
  -v, --verbose                  show extra information
  -V, --version                  show version information and exit

チケット属性の制御用オプション:
  -p, --project=PROJECT          プロジェクトの識別子
  -t, --tracker=TRACKER          トラッカーの名称
      --category=CATEGORY        カテゴリの名称
      --priority=PRIORITY        優先度の名称
  -o, --allow-override=ATTRS     オプションで指定した属性をメール本文で
                                 上書きすることを許可
                                 ATTRSはコンマで区切って複数指定可能
```

例:
``` sh
# プロジェクトの指定無し。メール本文内に'Project'キーワードが必須:
rdm-mailhandler --url http://redmine.domain.foo --key secret

# プロジェクトは固定でトラッカーはデフォルト値が指定されているが、
# メール本文内ではトラッカー・優先度を指定可能:
rdm-mailhandler --url https://domain.foo/redmine --key secret \\
                --project foo \\
                --tracker bug \\
                --allow-override tracker,priority
```

以下にPostfixのaliasの例を示します:

``` sh
foo: "|/path/to/rdm-mailhandler.rb --url http://redmine.domain --key secret --project foo"
```

### IMAPサーバからの受信:

IMAPサーバからメールを取得するためにはrakeタスク(`redmine:email:receive_imap`)を使用します。cronからrakeコマンドを実行する際は、rakeコマンドのスイッチとして `-f /path/to/redmine/appdir/Rakefile` を指定してください。指定しなければrakefileが見つからずエラーとなります。以下は30分ごとにメールを取得するためのcronの記述の例です:

``` text
*/30 * * * * redmineuser rake -f /path/to/redmine/appdir/Rakefile redmine:email:receive_imap RAILS_ENV="production" host=imap.foo.bar username=redmine@somenet.foo password=xxx
```

コマンドはcrontabに1行で記述してください。また、以下に示した、-fオプションおよびcron固有がないrakeコマンドの例も併せてご覧ください。

Windowsをサーバとして使用している場合は、メール取得のタスクをスケジュール実行するために [pycron](http://www.kalab.com/freeware/pycron/pycron.htm) が利用できます。

環境によっては、スクリプトを実行するサーバ上のファイアウォールで外向けのTCP接続のポート143(IMAP)を開く必要があるかもしれません。

利用可能なIMAPオプション:

``` text
host=HOST                IMAPサーバのホスト名 (デフォルト: 127.0.0.1)
port=PORT                IMAPサーバのポート番号 (デフォルト: 143)
ssl=SSL                  SSLを使用するか? (デフォルト: false)
username=USERNAME        IMAPアカウント
password=PASSWORD        IMAPパスワード
folder=FOLDER            読み込むIMAPフォルダ (デフォルト: INBOX)

チケット属性の制御用オプション:
-p, --project=PROJECT          プロジェクトの識別子
-t, --tracker=TRACKER          トラッカーの名称
    --category=CATEGORY        カテゴリの名称
    --priority=PRIORITY        優先度の名称
-o, --allow-override=ATTRS     オプションで指定した属性をメール本文で
                               上書きすることを許可
                               ATTRSはコンマで区切って複数指定可能
```

These options are available on trunk or the upcoming 0.8.1

```
move_on_success=MAILBOX  処理が成功したメールを削除せずにMAILBOXに移動する
move_on_failure=MAILBOX  無視された(処理に失敗した)メールをMAILBOXに移動する
```

rakeコマンドの例:

``` sh
# プロジェクトの指定無し。メール本文内に'Project'キーワードが必須:

rake redmine:email:receive_imap RAILS_ENV="production" \\
  host=imap.foo.bar username=redmine@somenet.foo password=xxx


# プロジェクトは固定でトラッカーはデフォルト値が指定されているが、
# メール本文内ではトラッカー・優先度を指定可能:

rake redmine:email:receive_imap RAILS_ENV="production" \\
  host=imap.foo.bar username=redmine@somenet.foo password=xxx ssl=1 \\
  project=foo \\
  tracker=bug \\
  allow_override=tracker,priority

# 正常に処理されたメールをメールボックス'read'に移動し、失敗したメールを
# メールボックス'failed'に移動:

rake redmine:email:receive_imap RAILS_ENV="production" \\
  host=imap.foo.bar username=redmine@somenet.foo password=xxx \\
  move_on_success=read move_on_failure=failed
```

無視されたメール(存在しないユーザー、存在しないプロジェクト...)は既読になりますがサーバから削除されません。

`allow_override` オプションは、rakeの引数で指定したデフォルト値だけでなく、全ての属性の値をメール内で上書きすることができます。トラッカーをメール内で指定したい場合、引数で `allow_override=tracker` を指定します。

### 標準入力からのメール読み込み

rakeタスク(`redmine:email:receive`)は標準入力からメールを読み込むために利用できます。

``` text
チケット属性の制御用オプション:
  -p, --project=PROJECT          プロジェクトの識別子
  -t, --tracker=TRACKER          トラッカーの名称
      --category=CATEGORY        カテゴリの名称
      --priority=PRIORITY        優先度の名称
  -o, --allow-override=ATTRS     オプションで指定した属性をメール本文で
                                 上書きすることを許可
                                 ATTRSはコンマで区切って複数指定可能
```

例:
``` text
# プロジェクトの指定無し。メール本文内に'Project'キーワードが必須:
rake redmine:email:read RAILS_ENV="production" < raw_email

# プロジェクトは固定でトラッカーはデフォルト値が指定されているが、
# メール本文内ではトラッカー・優先度を指定可能:
rake redmine:email:read RAILS_ENV="production" \\
                project=foo \\
                tracker=bug \\
                allow_override=tracker,priority < raw_email
```

`allow_override` オプションは、rakeの引数で指定したデフォルト値だけでなく、全ての属性の値をメール内で上書きすることができます。トラッカーをメール内で指定したい場合、引数で `allow_override=tracker` を指定します。

動作の仕組み
------------

メールを受信すると、対応するRedmineのユーザーをメールのFromアドレスを使って検索します。不明なユーザーもしくはロックされたユーザーからのメールは無視されます。

メールの件名に "Re: **\[xxxxxxx \#123\]**" のような文字列が含まれていると、そのメールは返信として扱われ既存のチケット \#123 に注記が追加されます。それ以外の場合は新しいチケットが作成されます。

### 対象のプロジェクト

受信メールを処理する際、対象のプロジェクトは `project` オプションで指定します。

このオプションを指定しない場合、どのプロジェクトにチケットを追加すべきかメール本文内で指定する必要があります。これは、メール本文内に次のような行を記述することにより行います: `"Project: foo"`.

例(メール本文):

``` text
プロジェクトfooに追加される新規のチケットです。
チケットの説明を記述します。
[...]

Project: foo
```

`project` オプションでデフォルトプロジェクトを指定した上で、 `allow-override` オプションによりプロジェクトの指定を上書きすることができます。

``` text
# デフォルトではプロジェクト"foo"にチケットを作成
rake redmine:email:receive_imap [...] project=foo allow_override=project
```

もちろん、メールを送信したユーザーがプロジェクト"foo"にチケットを登録する権限がない場合はそのメールは無視されます。
対象のプロジェクトが、 **必須** と指定されかつデフォルト値がないカスタムフィールドを使用している場合、チケットの登録は失敗します。注意してください。

### チケットの属性

メール受信の設定で使用したオプションにより( `allow-override` オプションを参照)、チケットをメール送信する際にいくつかの属性を指定することができます。
これは、メールの本文内で下記のキーワードを使用することにより行うことができます(`Project` と同様): `Tracker`, `Category`, `Priority`, `Status`.

例(メール本文):

```
This is a new ticket that overrides a few attributes
[...]

Project: foo
Tracker: Bug
Priority: Urgent
Status: Resolved
```

### ウォッチャー

メールを送信したユーザーが'Add issue watchers'権限を持っている場合、メールのToまたはCcフィールドに入っているユーザーは新しく作成されたチケットのウォッチャーとして自動的に登録されます。

### メールの形式と添付ファイル

Redmineはメール内のPlain Textの部分をチケットの説明として利用します。
HTMLのみのメールを受信した場合、HTMLタグを除去します。

メールに添付されたファイルは、ファイルの大きさが「管理」→「設定」→「添付ファイルの最大サイズ」を超えない限り、自動的にチケットに添付されます。
