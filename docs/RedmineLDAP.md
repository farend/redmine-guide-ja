LDAP認証
========

!!! note ""
    最終更新: 2017/05/07 [[原文](http://www.redmine.org/projects/redmine/wiki/RedmineLDAP/23)]

RedmineはLDAP認証に対応しています。複数のLDAPディレクトリを使用することもできます。

[TOC]

LDAPの設定
----------

「管理」画面で「LDAP認証」を開き、 **新しい認証方式** をクリックしてください。

下記項目の入力を行います:

-   **名称**: 任意の名前
-   **ホスト**: LDAPサーバのホスト名
-   **ポート**: LDAPポート番号(デフォルトは389)
-   **LDAPS**: ディレクトリにLDAPSでアクセスしたい、もしくはLDAPSが要求される場合はチェックしてください。
-   **アカウント**: LDAPの読み取りアクセスが可能なユーザーを入力してください。匿名アクセスが許可されている場合は、この欄は空白にします。
-   **パスワード**: アカウントのパスワード
-   **ベースDN**: LDAPディレクトリツリーの最上位のDN

設定後は、アカウントの設定で認証方式としてLDAPサーバが選択されているユーザーは、LDAPサーバのユーザー名とパスワードで認証が行われるようになります。

LDAPで認証が行われているかテストするには、ログインIDがLDAPアカウントと一致するRedmineのユーザーを作成し（通常はRedmineがLDAPの情報を参照し適切なアドバイスを行います）、 **認証方式** のドロップダウンリストから新しく追加したLDAP認証の設定を選択し（この項目はLDAP認証の設定が行われているときのみ表示されます）、そしてアカウントのパスワードは入力しないでください。そしてLDAPのユーザー名とパスワードを使ってRedmineへのログインを試みてください。

"On the fly"ユーザー作成
------------------------

**あわせてユーザーを作成** チェックボックスをONにすると、LDAP認証で初めてRedmineにログインする際に自動的にRedmineのユーザーアカウントが作成されます。そのためには、Redmineのアカウントの各項目（姓、名、メールアドレス）に対応するLDAPの属性名を設定しておく必要があります。

下記にActive Directoryを利用する場合の例を示します:

``` text
名前 = My Directory
ホスト = host.domain.org
ポート = 389
LDAPS = no
アカウント = MyDomain\UserName (ADサーバによっては UserName@MyDomain)
パスワード = <password>
ベースDN = CN=users,DC=host,DC=domain,DC=org

あわせてユーザーを作成 = yes
属性
  ログインIDの属性 = sAMAccountName
  名の属性 = givenName
  姓の属性 = sN
  メールアドレスの属性 = mail
```

注意: LDAP属性名は大文字・小文字を区別します。

### Dynamic Bind Account

The above setup would need a special account on the directory server which Redmine uses to pre-authenticate. It is possible to use the keyword **$login** in the account field which then would be replaced by the current login. The password can be left empty in this case, for example:

    Account: $login@COMPANY.DOMAIN.NAME

or

    Account: company\$login

### Base DN variants

Although it's quite possible that the Base DN above is standard for Active Directory, the Active Directory at my employer's site does not use the Users container for standard users, so those instructions sent me down a long and painful path. I recommend also trying just "DC=host,DC=domain,DC=org" if login fail swith the settings there.

Group based LDAP login
----------------------

If you want to just allow logins to users that belongs to a particular LDAP group you should follow below instructions. They are based on OpenLDAP LDAP server and redmine 2.3.0.

1. (OpenLDAP server) Enable memberof overlay

1.1. Create a file:

&gt;vim ~/memberof\_add.ldif

With below content:

&gt;dn: cn=module,cn=config
&gt;objectClass: olcModuleList
&gt;cn: module
&gt;olcModulePath: /usr/lib/ldap
&gt;olcModuleLoad: memberof

1.2. Create a file:

&gt;vim ~/memberof\_config.ldif

With below content:

&gt;dn: olcOverlay=memberof,olcDatabase={1}hdb,cn=config
&gt;objectClass: olcMemberOf
&gt;objectClass: olcOverlayConfig
&gt;objectClass: olcConfig
&gt;objectClass: top
&gt;olcOverlay: memberof
&gt;olcMemberOfDangling: ignore
&gt;olcMemberOfRefInt: TRUE
&gt;olcMemberOfGroupOC: groupOfNames
&gt;olcMemberOfMemberAD: member
&gt;olcMemberOfMemberOfAD: memberOf

1.3. Load them. It will depend on your OpenLDAP configuration, so we will propose some possibilities:

&gt;sudo ldapadd -c -Y EXTERNAL -H ldapi:/// -f memberof\_add.ldif
&gt;sudo ldapadd -c -Y EXTERNAL -H ldapi:/// -f memberof\_config.ldif

Or:

&gt;ldapadd -D cn=admin,cn=config -w "password" -H ldapi:/// -f memberof\_add.ldif
&gt;ldapadd -D cn=admin,cn=config -w "password" -H ldapi:/// -f memberof\_config.ldif

A restart is NOT needed if you use dynamic runtime configuration engine (slapd-config).

1.4. (Optional) Test it:

&gt;ldapsearch -D cn=admin,dc=example,dc=com -x -W -b 'dc=example,dc=com' -H 'ldap://127.0.0.1:389/' '(&(objectClass=posixAccount)(memberOf=cn=ldapredmine,ou=groups,dc=example,dc=com))'

2. (OpenLDAP server) Create the group. In this example the user is "ldap\_user\_1" and the group is "ldapredmine":

&gt;dn: cn=ldapredmine,ou=groups,dc=example,dc=com
&gt;cn: ldapredmine
&gt;description: Staff members allowed to login to redmine ticketing system
&gt;member: cn=ldap\_user\_1,ou=people,dc=example,dc=com
&gt;objectclass: groupOfNames
&gt;objectclass: top

Adjust "dn" and "cn"s to fit to your DIT structure

3. (Redmine) Edit the LDAP authentication mode. In my case "ldap\_user\_1" is a "posixAccount" objectclass:

&gt;Base DN: dc=example,dc=com
&gt;Filter: (&(objectClass=posixAccount)(memberOf=cn=ldapredmine,ou=groups,dc=example,dc=com))

トラブルシューティング
----------------------

If you want to use on-the-fly user creation, make sure that Redmine can fetch from your LDAP all the required information to create a valid user.
For example, on-the-fly user creation won't work if you don't have valid email adresses in your directory (you will get an 'Invalid username/password' error message when trying to log in).
(This is not true with newer Redmine versions; the user creation dialog is populated with everything it can find from the LDAP server, and asks the new user to fill in the rest.)

Also, make sure you don't have any custom field marked as **required** for user accounts. These custom fields would prevent user accounts from being created on the fly.

Errors in the login system are not reported with any real information in the Redmine logs, which makes troubleshooting difficult. However, you can found most of the information you need using Wireshark between your Redmine host and the LDAP server. Note that this only works if you have permissions to read network traffic between those two hosts.

You can also use the tool 'ldapsearch' to test if your settings are correct. Log into the Linux machine hosting your redmine (and possibly install ldaputils) and run this:

ldapsearch -x -b "dc=example,dc=com" -H ldap://hostname/ -D "DOMAIN\\USER" -w mypassword \[searchterm\]

If succesful, you will get a listing of the contents of the AD, matching your search query. Then, you will know what how to fill out the fields in the LDAP config in Redmine.

### Account value format

The username for the bind credentials might need to be specified as a DN (i.e. CN=user,OU=optional,DC=domain,DC=com) rather than as a UPN (user@domain.com) or as domain\\user, as pointed out by this comment in source:trunk/vendor/plugins/ruby-net-ldap-0.0.4/lib/net/ldap.rb:

      # As described under #bind, most LDAP servers require that you supply a complete DN
      # as a binding-credential, along with an authenticator such as a password.

Therefore user with MyDomain\\MyUserName or MyUserName@MyDomain.com username might enter only MyUserName as a Redmine login name.

### Slow LDAP authentification

If LDAP authentification is slow and you have an AD cluster, try to specify in Host field one of the AD physical servers (http://www.redmine.org/boards/2/topics/3056). It may help.

### OpenDS

If you are using the OpenDS server, you might have issues with the request control "Paged results" sent with the initial query searching for the user by the specified login attribute. This request control 1.2.840.113556.1.4.319 is not allowed for anonymous users by default, thus preventing redmine from finding the user in the directory even before the binding takes place.

Add a global ACI like this

    ./dsconfig -h SERVER_IP -p 4444 -D cn="Directory Manager" -w PASSWORD -n set-access-control-handler-prop --trustAll
    --add global-aci:\(targetcontrol=\"1.2.840.113556.1.4.319\"\)\ \(version\ 3.0\;\ acl\
    \"Anonymous\ control\ access\ to\ 1.2.840.113556.1.4.319\"\;\ allow\ \(read\)\ userdn=\"ldap:///anyone\"\;\)

Note: Enter the command on one line, use the escaping exactly as indicated (the \\ after "acl" is meant to be "\\ " for a space).
