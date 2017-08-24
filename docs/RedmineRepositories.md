リポジトリ
==========

!!! note ""
    最終更新: 2017/08/24 [[原文](http://www.redmine.org/wiki/redmine/RedmineRepositories/32)]

[TOC]

概要
----

Redmineは5種類のバージョン管理システムとの連係に対応しています。

|*SCM*|*Supported versions*|*Comments*|
|:----|:------------------:|:---------|
|[Bazaar](http://bazaar.canonical.com/en/)|1.0.0.candidate.1 to 2.7.0||
|[CVS](http://www.nongnu.org/cvs/)|1.12.12, 1.12.13|1.12が必要。CVSNTは動作しない|
|[Git](https://git-scm.com/)|1.5.4.2 to 2.11.0||
|[Mercurial](http://www.selenic.com/mercurial/)|1.2 to 4.3.1|1.6以降推奨 ([#9465](http://www.redmine.org/issues/9465))|
|[Subversion](http://subversion.apache.org/)|1.3 to 1.9.7|1.3以降が必要。Ruby Bindings for Subversionには非対応。1.7.0と1.7.1には問題あり ([#9541](http://www.redmine.org/issues/9541))|

**注1**: バージョン管理システムの適切なコマンドが**Redmineと同じサーバ**にインストールされている必要があります。

例えばRedmineからSubversionリポジトリにアクセスする場合、svnバイナリをRedmineが稼働するホストにインストールする必要があります。

*注2 : バージョン管理システムのコマンドはRedmineから実行できるようパスが取っているなどしている必要があります。

以下のいずれかの方法があります。

-   コマンドにが置かれているディレクトリにPATHが通っている:
    -   もしコマンド名がデフォルトのものとは異なる場合は、Redmineの[設定ファイル](RedmineInstall.md#SCM-settings)で呼び出すコマンド名を変更できます
-   Redmineの[設定ファイル](RedmineInstall.md#SCM-settings)でフルパスを指定することもできます。

最後に、「管理」→「設定」画面の「リポジトリ」タブ内「使用するバージョン管理システム」で、バージョン管理システムを有効にするのを忘れないでください。

既存リポジトリをプロジェクトで利用する
--------------------------------------

プロジェクトの設定で「リポジトリ」モジュールが有効であることを確認した上で「リポジトリ」タブを開いてください。
正しいバージョン管理システムを選択しリポジトリのURLを入力してください。

!!! warning "重要"
    最初にリポジトリを閲覧するときは、Redmineはすべてのコミットの情報を取得しデータベースに格納します。これはリポジトリごとに一回だけ行われますが、非常に時間がかかります。リポジトリに数百のコミットがある場合はタイムアウトすることもあります。

この問題を避けるために、リポジトリからの情報の取得をオフラインで行うことができます。リポジトリの設定をRedmineで行った後、下記コマンドを入力してください:


/script/rails runner "Repository.fetch_changesets" -e production

すべてのコミットの情報がRedmineのデータベースに格納されます。

また、Redmine 0.9以降では `fetch_changesets` を実行するための特別なURLも利用できます:

``` bash
 # すべての有効なプロジェクトのチェンジセットを取得
http://redmine.example.com/sys/fetch_changesets?key=<WS key>

 # 指定したプロジェクト(例:foo)のみチェンジセットを取得
http://redmine.example.com/sys/fetch_changesets?key=<WS key>&id=foo
```

`WS Key` を必ず指定してください。これは、最後に、「管理」→「設定」画面の「リポジトリ」タブ内で設定したAPIキーです。

下記ページの設定例もご覧ください。
[HowTo setup automatic refresh of repositories in Redmine on commit](http://www.redmine.org/projects/redmine/wiki/HowTo_setup_automatic_refresh_of_repositories_in_Redmine_on_commit)

### Subversionリポジトリ

一般的に使われるプロトコルに対応しています(例: `http:`, `svn:`, `file:`)。そのままリポジトリのURLを入力してください。

例:

    http://host/path/to/the/repository

リポジトリが認証を要求する場合は、ユーザー名とパスワードを指定してください。

注意: `svn+ssh://` を使用しているリポジトリにアクセスする場合、,svn+sshをnon-interactiveに設定する必要があります。
そのためにはsshで鍵認証を行うよう設定が必要です。

### CVSリポジトリ

下記を入力してください:

-   リポジトリのURL (path名または接続文字列, 例: `:pserver`).
-   モジュール名

例:

    :pserver:login:password@host:/path/to/the/repository

### Gitリポジトリ

#### ローカル環境の設定

RedmineのリポジトリブラウザでGitリポジトリの内容を参照するためには、ローカルのbareリポジトリが必要です。

例えば、"Donebox"という名前のTODO管理アプリのリポジトリをRedmineから参照するとします。クローンURLは git://github.com/ook/donebox.git とします。
Redmineが稼働しているサーバ上で、Redmineを実行しているユーザーからアクセス可能なディレクトリを作成してください。:

    $ sudo mkdir -p /var/redmine/git_repositories
    $ sudo chown rails:rails /var/redmine/git_repositories
    $ cd /var/redmine/git_repositories

上記2行目についての注意: これは新しく作成されたディレクトリのオーナーとグループを `rails` に変更しています。サーバの設定にあわせてユーザー名・グループ名は変更する必要があります（サーバの設定によっては `apache` や `www-data` とすべき場合もあります）。ユーザーはgitコマンドを実行する権限が必要であることにも注意してください。

#### bareリポジトリの作成

前述の手順が完了したら、bareリポジトリを作成します:

    $ pwd
    /var/redmine/git_repositories
    $ git clone --bare git://github.com/ook/donebox.git donebox.git
    Initialized empty Git repository in /var/redmine/git_repositories/donebox.git/
    remote: Counting objects: 401, done.
    remote: Compressing objects: 100% (246/246), done.
    remote: Total 401 (delta 134), reused 401 (delta 134)
    Receiving objects: 100% (401/401), 179.55 KiB | 185 KiB/s, done.
    Resolving deltas: 100% (134/134), done.
    $ cd donebox.git
    $ git remote add origin git://github.com/ook/donebox.git

bareリポジトリを作成したら、Redmineでプロジェクトの「設定」画面を開き、「リポジトリ」タブの項目「バージョン管理システム」で Git を選択してください。そして、項目「リポジトリのパス」にbareリポジトリへのパスを入力してください (ここでの例では `/var/redmine/git_repositories/donebox.git/` )。入力が終わったら「作成」ボタンをクリックして設定内容を保存します。「リポジトリ」タブを開くと、gitリポジトリの内容が閲覧できるようになっているはずです。

注意: このgitリポジトリは自動的には更新されません。 `git fetch` コマンドを自動的に実行するcronジョブを登録するか、post-receiveフックを使用してfetchコマンドが自動的に実行されるよう設定する必要があります。以下に例を示します。:

    echo "Post receive-hook => updating Redmine repository"
    sudo -u my_redmine_user -p secret perl -we '`cd /redmine/repositories/my_repo.git && git fetch && git reset --soft refs/remotes/origin/master`'

Note the git reset, you'll **need it** to update the git tree and see your changes in the Repository view. The 'soft' option is required since it is a bare repository and the default option (mixed) will fail since there is no working tree.

If you are using github, you can use the [Github Hook Plugin](http://www.redmine.org/wiki/redmine/Plugin_List#Github-Hook-plugin)

#### Windows上でのbareリポジトリの作成

bareリポジトリをWindows上で作成する場合、PATH環境変数の末尾に以下の内容を追加してください:

    ;%GIT_PATH%\cmd;%GIT_PATH%\bin;

GIT\_PATH はGitをインストールしたディレクトリです(例: C:\\Git)

#### Setting up a mirror repository (shortcut, tracking branches)

The method above works fine under most circumstances but it can take a lot of tweaking to get certain things working if you have more than just a master branch. More information on the problem and the solution can be found on this [Stack Overflow question](http://stackoverflow.com/questions/4698649/how-do-i-get-a-remote-tracking-branch-to-stay-up-to-date-with-remote-origin-in-a).

This method will help to keep branches from the repository's origin updated and visible in Redmine's repository browser. This is really only relevant if the local copy of the repository is only being used as a read-only copy specifically for Redmine's use. For example, the project is hosted on GitHub but Redmine is being used for issue tracking.

    $ pwd
    /var/redmine/git_repositories
    $ git clone --mirror git://github.com/ook/donebox.git donebox.git
    Initialized empty Git repository in /var/redmine/git_repositories/donebox.git/
    remote: Counting objects: 717, done.
    remote: Compressing objects: 100% (561/561), done.
    remote: Total 717 (delta 320), reused 371 (delta 134)
    Receiving objects: 100% (717/717), 211.35 KiB | 86 KiB/s, done.
    Resolving deltas: 100% (320/320), done.
    $ cd donebox.git
    $ git branch
      WW
      asap
      bugcat
      comeback
    * master

This method relies on the `--mirror` option available for the git clone command. This option may not be available to older versions of git. In that case, please reference the [Stack Overflow question](http://stackoverflow.com/questions/4698649/how-do-i-get-a-remote-tracking-branch-to-stay-up-to-date-with-remote-origin-in-a) for some ideas on how to setup this type of mirror functionality without using the `--mirror` option.

### Mercurialリポジトリ

Mercurialリポジトリと同期するためには、Redmineを実行しているサーバ上にリポジトリのローカルクローンが必要です。仮にRedmineがインストールされているパスが /var/www/redmine.example.com/www でMercurialのリポジトリが /var/www/sources.example.com/repo/example にあるとします。このときは、プロジェクトの設定画面のリポジトリタブ内でSCMとしてMercurialを選択して、テキストボックスには /var/www/sources.example.com/repo/example を入力してください。

設定を保存するとRedmineがMercurialのリポジトリのチェックを始めます。数秒あるいは数分後、「リポジトリ」画面を開くとリポジトリ内が閲覧できます。

### Bazaarリポジトリ

リポジトリの設定画面内の"Root directory"にリポジトリのフルパスを入力してください。
例: /home/username/bzr/repo/trunk

bzrおよびbzrlibが環境変数PATHおよびPYTHONPATHで指定したパスになければなりません。
例えば、config/environment.rbに以下のような行を追加します:

    ENV['PYTHONPATH'] = '/path/to/pythonlib'
    ENV['PATH'] = "#{ENV['PATH']}:/path/to/bzr/bin"

Repository user-mapping
-----------------------

In the project -&gt; settings -&gt; repository there is a link called users (on the lower right).

That allows you to map users that have commits to the users in redmine. If the login name / email matches the mapping is automatic, otherwise you need to establish the map of repository users to redmine users.

This is required for time tracking to work.
