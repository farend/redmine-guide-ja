メールの設定例
==============

!!! note ""
    最終更新: 2015/01/12 [[原文](http://www.redmine.org/projects/redmine/wiki/EmailConfiguration/43)]

設定ディレクティブ
------------------

このページは作業中のため、下記の設定ディレクティブの一覧は完全なものではありません。

### 認証

送信に使用するメールサーバが要求する認証方法を指定します。

有効な設定:

-   nil (または入力を省略する)
-   :plain
-   :login
-   :cram\_md5

(注意: `nil` に設定する場合、 `user_name` および `password`
は設定してはなりません)

### 送信方法

メールの送信方法の指定です。

有効な設定:

-   :smtp
-   :async\_smtp
-   :sendmail
-   :async\_sendmail

#### 非同期送信

`:async_smtp` と `:async_sendmail`
は非同期送信を行います。これによりRedmineはメールの送信を待たずに次の画面を表示します。詳細については
[Asynchronous Email
Delivery](http://redmineblog.com/articles/asynchronous-email-delivery/)
をご覧ください。

ただし、これら二つの送信方法を指定すると、rakeタスク
`redmine:send_reminders` で送信される
[リマインダメール](RedmineReminderEmails)
が正しく送ることができなくなります([#5058](http://www.redmine.org/issues/5058))

configuration.ymlの設定例
-------------------------

### LOGIN認証 (デフォルト)

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

**GMail、Google Apps、そのほかTLSを要求するSMTPサーバを利用する場合**
、TLS関係の設定を追加する必要があります:

    production:
      email_delivery:
        delivery_method: :smtp
        smtp_settings:
          tls: true
          enable_starttls_auto: true
          address: "smtp.gmail.com" 
          port: '587'
          domain: "smtp.gmail.com" 
          authentication: :plain
          user_name: "your_email@gmail.com" 
          password: "your_password" 

上記設定は最近のバージョンのRubyおよびRails(1.8.7 patchset 2xx and
2.3.5)でのみ可能です。([http://www.redmine.org/issues/5814](#5814))

### 認証無し

認証を使用しないSMTPサービスプロバイダを利用する場合の例です。"none"の前にはコロンが必要です。注意してください。

    production:
      email_delivery:
        delivery_method: :smtp
        smtp_settings:
          address: smtp.knology.net
          port: 25
          domain: cybersprocket.com

### sendmailコマンドを利用

`/usr/sbin/sendmail` コマンドが利用できるUNIXシステムの例です。

    production:
      email_delivery:
        delivery_method: :sendmail
