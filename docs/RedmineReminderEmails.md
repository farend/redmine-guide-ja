リマインダメールの送信
======================

!!! note ""
    最終更新: 2017/11/25 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineReminderEmails/15)]

Redmineは、担当しているチケットのうち、期日が超過しているか指定した日数以内に期日が到来するものの一覧をメールで通知するためのrakeタスクを提供しています。

利用可能なオプション:

* `days`: 期日の何日前から通知するか (デフォルト: 7)
* `tracker`: 通知対象トラッカーのid (デフォルト: すべてのトラッカー)
* `project`: 通知対象プロジェクトのidまたは識別子 (デフォルト: すべてのプロジェクト)
* `users`: リマインダ送信対象のユーザーの、コンマ区切りのid番号
* `version`: 通知対象の対象バージョン (デフォルト: 指定なし)

以下の例は、期日まで7日以内か期日を過ぎたチケットを担当しているユーザーに対してメールを送信します:

``` sh
bundle exec rake redmine:send_reminders days=7 RAILS_ENV="production"
```

以下の例は、id番号が  *1* と *23* と *56* のユーザーが期日まで7日以内か期日を過ぎたチケットを担当している場合にメールを送信します:

``` sh
bundle exec rake redmine:send_reminders days=7 users="1,23,56" RAILS_ENV="production"
```

これらの設定をcrontaに追加するときは、以下のようにrakeタスクを記述したシェルスクリプトを作成してください:

``` sh
#!/bin/bash
cd /usr/local/share/redmine
bundle exec rake redmine:send_reminders days=7 RAILS_ENV="production"
```
