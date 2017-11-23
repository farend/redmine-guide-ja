Redmine Guide 日本語訳
======================

「Redmine Guide 日本語訳」  <http://guide.redmine.jp/> のWebサイトのソースコードです。ドキュメント生成ツール [MkDocs](http://www.mkdocs.org/) を使っています。

MkDocsのインストール
--------------------

Pythonがインストールされている環境で、Pythonのパッケージ管理システム `pip` を使ってインストールしてください。

```
sudo pip install mkdocs
```

ローカル環境での閲覧
--------------------

`redmine-guide-ja` のディレクトリに移動して `mkdocs serve` を実行するとWebサーバが立ち上がります。Webブラウザで <http://localhost:8000> にアクセスすればドキュメントを閲覧できます。

```
mkdocs serve
```

ソースコードを更新すると、Webブラウザで閲覧中のドキュメントも自動的に更新されます。

HTMLの生成
----------

`mkdocs build` コマンドを実行すると `sites` ディレクトリ以下に公開用のHTMLが生成されます。

```
mkdocs build
```

関連情報
--------

* [ドキュメント生成ツール「MkDocs」でRedmine Guide日本語訳のWebサイトを作ってみた](https://www.farend.co.jp/blog/2017/10/redmine-guide-migration-to-mkdocs/)

---

Copyright (C) [ファーエンドテクノロジー株式会社](https://www.farend.co.jp/)

[クリエイティブ・コモンズ・ライセンス 表示 - 継承 4.0 国際 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.ja)
