!!! hint "Redmineニュース"
    <div id="news">
      <script src="http://blog.redmine.jp/items.js"></script>
      <ul id="blog_articles">
        <script>
          <!--
          var target = $("#blog_articles");
          for (i = 0, disp_count = 0 ; i < blog_redmine_jp_items.length && disp_count < 3 ; i++) {
            article = blog_redmine_jp_items[i];
            ymd = new Date(article.published).toLocaleString("ja-JP").replace(/ .*/, "");
            target.append("<li><a href='" + article.link + "' target='_blank'>" + article.title + '</a> (' + ymd + ')');
            disp_count++;
          }
          //-->
        </script>
      </ul>
      <a href="http://blog.redmine.jp/">過去のニュース</a> |
      <a href="http://redmine.jp/overview/">Redmineとは</a> |
      <a href="http://redmine.jp/faq/">FAQ</a> |
      <a href="http://redmine.jp/community/">コミュニティ</a>
    </div>

# Redmine Guide 日本語訳

Redmineオフィシャルサイトで公開されている [Redmine Guide](http://www.redmine.org/projects/redmine/wiki/Guide) の日本語訳です。

[TOC]

インストールガイド
------------------

-   [Redmineのインストール](RedmineInstall)
    -   [メールの設定](Email_Configuration)
-   [アップグレード](RedmineUpgrade)
-   [他システムからの移行](RedmineMigrate)

!!! tip "My Redmine — Redmineのクラウドサービス"
    <a href="http://hosting.redmine.jp/">サポート・日々の運用・バージョンアップはすべてお任せ!<br>
    200人で使っても月額7,600円〜 <strong>【▶詳細を見る】</strong></a>

システム管理者向けガイド
------------------------

以下の設定はシステム管理者のみが参照・変更できます。システム管理者とは、ユーザーの設定画面で「システム管理者」のチェックがONのユーザーです。

### 一般的な設定

-   [プロジェクトに対する管理操作](RedmineProjects)
-   [ユーザーに対する管理操作](RedmineUsers)
-   [グループに対する管理操作](RedmineGroups)
-   [ロールと権限](RedmineRoles)
-   [課題管理システム](RedmineIssueTrackingSetup)
-   [カスタムフィールド](RedmineCustomFields)
-   [選択肢の値](RedmineEnumerations)
-   [アプリケーションの設定](RedmineSettings)

### 高度な設定

-   [リポジトリの設定](RedmineRepositories)
-   [メールによるチケットの登録](RedmineReceivingEmails)
-   [リマインダメールの送信](RedmineReminderEmails)
-   [LDAP認証](RedmineLDAP)

### メンテナンス操作

-   Rakeタスク

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- レスポンシブ (redmine-guide-ja) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-0963697622686458"
     data-ad-slot="6981876139"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>

ユーザーガイド
--------------

-   [始めましょう](Getting_Started)
-   [アカウント](RedmineAccounts)
-   [ログイン](RedmineLogin)
-   [登録](RedmineRegister)
-   [検索](RedmineSearch)
-   [マイページ](RedmineMyPage)

<!-- -->

-   [概要](RedmineProjectOverview)
-   [活動](RedmineProjectActivity)
-   [チケット](RedmineIssues)
    -   [チケット一覧](RedmineIssueList)
        -   [チケットのサマリー](RedmineIssueSummary)
    -   ロードマップ
        -   バージョンの概要
-   [時間管理 (工数管理)](RedmineTimeTracking)
    -   [作業時間: 詳細](RedmineTimelogDetails)
    -   [作業時間: レポート](RedmineTimelogReport)
-   [ガントチャート](RedmineGantt)
-   [カレンダー](RedmineCalendar)
-   [ニュース](RedmineNews)
-   [文書](RedmineDocuments)
-   [ファイル](RedmineFiles)
-   [フォーラム](RedmineForums)
-   [Wiki](RedmineWikis)
-   [リポジトリ](RedmineRepository)
    -   [リポジトリの統計](RedmineRepositoryStatistics)
-   [プロジェクトの設定](RedmineProjectSettings)

<!-- -->

-   [添付ファイル](RedmineAttachedFiles)

<!-- -->

-   [Redmineにおけるwiki記法](http://redmine.jp/tech_note/RedmineWikiFormatting)

!!! tip "解説書 「入門Redmine」"
    <div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798048259/redmine-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/51NQmIINI7L._SL160_.jpg" alt="入門Redmine 第5版" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798048259/redmine-22/ref=nosim/" name="amazletlink" target="_blank">入門Redmine 第5版</a></div><div class="amazlet-detail">前田 剛 <br />秀和システム <br />2016年12月発売<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798048259/redmine-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

開発者ガイド
------------

### 全般

-   Redmine REST API
-   Code related topics
-   Creating and applying patches
-   An explanation of what changes may be in future Redmine releases

### プラグイン

-   [Redmineプラグイン開発のためのステップ・バイ・ステップ チュートリアル](Plugin_Tutorial)
-   A description of the internal handling of Redmine plugins
-   A description of the Redmine plugin hooks API
-   An incomplete list of available Redmine plugin hooks
-   A list of frequently asked questions about Redmine plugins

### テーマ

-   [Redmineのカスタムテーマの作成](HowTo_create_a_custom_Redmine_theme)

### Alternative/Custom Authentication

-   A howto (Alternative/custom authentication HowTo) for implementing authentication against a different database.

!!! tip "解説書 「Redmine実践ガイド」"
    <div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/488337968X/redmine-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/51yBVTM6orL._SL160_.jpg" alt="Redmine実践ガイド 理論と実践、事例で学ぶ新しいプロジェクトマネジメント" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/488337968X/redmine-22/ref=nosim/" name="amazletlink" target="_blank">Redmine実践ガイド 理論と実践、事例で学ぶ新しいプロジェクトマネジメント</a></div><div class="amazlet-detail">株式会社アジャイルウェア <br />ソシム <br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/488337968X/redmine-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

Redmine Guide 日本語訳について
------------------------------

- この文書は、Redmineの公式サイトで公開されているマニュアル「[Redmine Guide](http://www.redmine.org/projects/redmine/wiki/Guide)」の日本語訳です。
- クリエイティブ・コモンズ・ライセンス 表示 - 継承 4.0 国際 (CC BY-SA 4.0) に従う限り、自由に共有・翻案できます。
- 修正の提案等は [GitHub](https://github.com/farend/redmine-guide-ja) でお願いします。
