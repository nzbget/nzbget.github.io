---
redirect_from: /NZBGet_behind_other_web-server
---
### Contents
- [Apache](#apache)
- [Nginx](#nginx)
- [Lighttpd](#lighttpd)

## External web-server ##
NZBGet has a built-in web-server for web-interface purposes. To access it you type the address of computer running NZBGet and the port configured in the options:

    http://my-dns-address.com:6789/

If you already have a web-server you may want to integrate NZBGet into it:

    http://my-dns-address.com/nzbget/

You need a web-server with proxy capabilities to achieve this.

## Apache ##
Example configuration:
```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
...
<Location /nzbget>
  order deny,allow
  deny from all
  allow from all
  ProxyPass http://localhost:6789
  ProxyPassReverse http://localhost:6789
</Location>
```

In the fist line "\<Location /nzbget>" you can replace "/nzbget" with anything else and then use this string in web-address.

**NOTE:** when typing the URL in web-browser you must type the trailing slash "/":

    http://my-dns-address.com/nzbget/

If you omit it the web-interface will not load and will hang with "Loading... please wait..." message.

## Apache with mTLS and authentication delegation ##
Example configuration:
```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule headers_module modules/mod_headers.so
...
SSLVerifyClient require
...
<Location /nzbget>
  order deny,allow
  deny from all
  allow from all
  Header set HTTP_USER %{SSL_CLIENT_S_DN_CN}s
  ProxyPass http://localhost:6789
  ProxyPassReverse http://localhost:6789
</Location>
```

Apache SSL must be configured and running. `SSLVerifyClient` is configured to repuired a client's certificate on SSL connection estabishement.  

In Settings/SECURITY, the parameter should contain the header name value (here, `HTTP_USER`). Then, in this example, the CN part of the client certificate subject will be forwarded in the header to NZBget server and used as the user name.

## Nginx ##
Example configuration:
```
server {
   ...
         location ~ ^/nzbget($|./*) {
            rewrite /nzbget/(.*) /$1 break;
            proxy_pass http://127.0.0.1:6789;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         }
         location ~ ^/nzbget$ {
            return 302 $scheme://$host$request_uri/;
         }
   ...
}
```

You can replace "nzbget" (all three occurrences) with anything you like.

Attempts to upload large nzb-files to NZBGet running behing nginx may silently
fail due to packet limits set in nginx (explicitly or defaults). Check option `client_max_body_size` in nginx config.

## Lighttpd ##
Example configuration:
```
server.modules = (
     ...
     "mod_proxy",
     ...
     )
 
$HTTP["url" ] =~ "nzbget" {
   proxy.server = ( "" => (( "host" => "127.0.0.1", "port" => 6789 ) ) )
}
```

Lighttpd has limited proxy capabilities and cannot rewrite the URL. Because of this you can't change the path "nzbget" to anything else. For example "$HTTP["url" ] =~ "apps/nzbget" " wouldn't work.

## Hiawatha

Example configuration ([man page](https://www.hiawatha-webserver.org/manpages/hiawatha)):

```
VirtualHost {
    ...
    ReverseProxy ^/nzbget/ 1 127.0.0.1:6789
    ...
}
```
