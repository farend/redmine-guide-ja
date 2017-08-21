メールの設定
============

!!! note ""
    最終更新: 2017/08/21 [[原文](http://www.redmine.org/projects/redmine/wiki/EmailConfiguration/50)]

設定ディレクティブ
------------------

このページは作業中であり、以下で紹介している設定ディレクティブは一部のもののみです。より詳しい情報は [Action Mailer Configuration](http://guides.rubyonrails.org/action_mailer_basics.html#action-mailer-configuration) を参照してください。

### authentication

送信に使用するメールサーバが要求する認証方法を指定します。

有効な設定:

-   `nil` (または入力を省略する)
-   `:plain`
-   `:login`
-   `:cram_md5`

!!! note:
    `nil` に設定した場合は user_name` および `password` は設定しないでください。

### delivery_method

メールの送信方法の指定です。

有効な設定:

-   `:smtp`
-   `:async_smtp`
-   `:sendmail`
-   `:async_sendmail`

#### 非同期送信

`:async_smtp` と `:async_sendmail`
は非同期送信を行います。これによりRedmineはメールの送信を待たずに次の画面を表示します。詳しくは
[Asynchronous Email
Delivery](http://redmineblog.com/articles/asynchronous-email-delivery/)
をご覧ください。SMTPサーバによってはspam対策として処理開始前に待ち時間を設定している場合があり、非同期送信を設定していない場合はRedmineの処理も待たされてしまいます（[10秒](https://community.bitnami.com/t/updating-an-issue-in-redmine-takes-10-seconds/4421)がよくある値です。詳しくは [#11376](http://www.redmine.org/issues/11376) を参照してください）。

非同期送信を利用する場合は、SMTPの設定は `async_smtp_settings` を使用します:

``` yaml
development:
  email_delivery:
    delivery_method: :async_smtp
    async_smtp_settings:
    ...
```

configuration.ymlの設定例
-------------------------

### LOGIN認証 (デフォルト)

``` yaml
# Outgoing email settings

production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      address: smtp.example.net
      port: 25
      domain: example.net
      authentication: :login
      user_name: redmine@example.net
      password: redmine

development:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      address: 127.0.0.1
      port: 25
      domain: example.net
      authentication: :login
      user_name: redmine@example.net
      password: redmine
```

### GMail, Google Apps

GMail/Google App やそのほかのTLSを要求するSMTPサーバを使用する場合は、TLS関係の設定を記述する必要があります:

If you want to use GMail/Google Apps and other TLS-requiring SMTP servers, you'll have to add some TLS-related settings:

、TLS関係の設定を追加する必要があります:

```
production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      enable_starttls_auto: true
      address: "smtp.gmail.com"
      port: '587'
      domain: "smtp.gmail.com"
      authentication: :plain
      user_name: "your_email@gmail.com"
      password: "your_password"
```

G Suite (旧 Google Apps) を使用する場合、メール送信量の制限が緩和されている「SMTPリレー」を使った方がよいでしょう。SMTPリレーの詳細はGoogleのWebサイトを参照してください: <https://support.google.com/a/answer/2956491>

SMTPリレーサービスの設定例です。

* Name: Redmine
    * 1 許可する送信者:
        * 「ドメイン内の登録済み Apps ユーザーのみ」 - Redmine専用の G Suite のユーザーを作成済みの場合
    * 2 認証:
        * [✓] 指定した IP アドレスからのみメールを受信する - RedmineサーバのIPアドレス
        * [✓] SMTP 認証を求める
    * 3 暗号化:
        * [✓] TLS 暗号化を必須とする

Redmineの設定はシンプルです。

``` yaml
production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      address: smtp-relay.gmail.com
      port: 587
      domain: smtp-relay.gmail.com
      authentication: :plain
      user_name: your_email@gmail.com
      password: your_password
```

### Office 365, Exchange Online

Office 365 (Exchange Online) での設定例です。送信者はOffice 365のアカウントが必要です。もしくは、共有メールボックスから送信する場合、下記のアカウント（Redmineの「管理」→「設定」→「メール通知」の「送信元メールアドレス」に設定されているもの）は、Office 365の「Send As」で認証されている必要があります。

``` yaml
production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      enable_starttls_auto: true
      address: "smtp.office365.com"
      port: '587'
      domain: "your_domain.com"
      authentication: :login
      user_name: "email@your_domain.com"
      password: "password"
```

### 認証無し

認証を使用しないSMTPサービスプロバイダを利用する場合の例です。

``` yaml
production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      address: smtp.knology.net
      port: 25
      domain: cybersprocket.com
```

### sendmailコマンドを利用

`/usr/sbin/sendmail` コマンドが利用できるUNIXシステムの例です。

``` yaml
production:
  email_delivery:
    delivery_method: :sendmail
```

トラブルシューティング
----------------------

### エラー: "hostname was not match with the server certificate"

メールのリレーサーバーのSSL証明書の確認で問題が発生していると考えられます。取り急ぎの対処として、対応する `email_delivery` セクションに以下の設定を追加してください。

``` text
    enable_starttls_auto: false
```

### エラー: "Error: "Mail failure - no recipient addresses"

このエラーが発生したときは、メール通知は宛先のアドレスに届いていません。おそらくRedmineの「送信元メールアドレス」宛にエラーメールが届いていると思いますが、そのメールに書かれている元のメールのヘッダの情報を見ると、"From:"フィールドはあるのに"To:"フィールドが全く含まれないと思います。

このエラーはDebianでよく発生します。原因は、MTA「exim4」のデフォルトのオプションが `-i -t` であることです。この設定はメールの宛先をメッセージヘッダから読み取るよう指示するものです。Redmineにおいては宛先をコマンドラインから取得するよう指示する必要があります。

そのためには `config/configuration.yml` を編集して引数に "-i" のみを含むよう設定してください:

``` yaml
# default configuration options for all environments
default:
  email_delivery:
    delivery_method: :sendmail
    sendmail_settings:
      arguments: "-i"
```

上記の設定例は送信方法として `:sendmail` を指定しているため `sendmail_settings` の設定が使われています。もし `:smtp` または `:async_smtp` を指定している場合は `:smtp_setting` を使用してください。


### エラー: "Timeout:Error" due to SSL SMTP server connection

`ssl` オプションを `configuration.yml` に追加してください([#17239](http://www.redmine.org/issues/17239))。


### さらに詳しい情報

* [Action Mailer Configuration](http://guides.rubyonrails.org/action_mailer_basics.html#action-mailer-configuration)
