Redmineのカスタムテーマの作成
=============================

!!! note ""
    最終更新: 2018/01/07
    [[原文](http://www.redmine.org/projects/redmine/wiki/HowTo_create_a_custom_Redmine_theme/9)]

Redmineはテーマ機能を備えています。テーマはスタイルシート(application.css)の置き換え・部分的な上書きとJavascriptの追加ができます。

[TOC]

新しいテーマの作成
------------------

`public/themes` 以下にディレクトリを作成してください。ディレクトリ名はテーマの名称として使用されます。

例: `public/themes/my_theme`

独自の `application.css` を作成し、サブディレクトリ `stylesheets` 以下に保存してください:

``` text
public/themes/my_theme/stylesheets/application.css
```

以下はデフォルトのスタイル定義の一部を上書きする例です:

``` css
/* load the default Redmine stylesheet */
@import url(../../../stylesheets/application.css);

/* add a logo in the header */
#header {
    background: #507AAA url(../images/logo.png) no-repeat 2px;
    padding-left: 86px;
}

/* move the project menu to the right */
#main-menu {
    left: auto;
    right: 0px;
}
```

この例では、 `my_theme/images/logo.png` というファイル名で画像ファイルが保存されていることを想定しています。

このテーマをダウンロードして新しいテーマを作成する際の雛形とすることができます。Redmineの `public/themes` ディレクトリに保存してください。

独自のjavascriptの追加
----------------------

`javascripts/theme.js` というファイルにJavascirptを記述しておくと、Redmineの各画面で自動的に読み込まれます(Redmine 1.1.0以上で対応)。

faviconの追加
-------------

`favicon` ディレクトリ内に独自のfaviconを置くと、Redmineの各画面でデフォルトのfaviconの代わりに自動的に読み込まれます。faviconのファイル名は任意の名前でかまいません。

テーマの適用
------------

「管理」→「設定」画面の「表示」タブを開き、「テーマ」ドロップダウンリストボックスで新しく作成したテーマを選択後、設定を保存してください。
新しいテーマが適用された状態でRedmineの画面が表示されます。

もしRedmine 1.1.0未満のバージョンを利用している場合、インストールしたテーマはRedmineを再起動するまでテーマの一覧に表示されません。
