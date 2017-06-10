---
---
## What is certificate verification
When connecting to news servers (for downloading) or web servers (for fetching of rss feeds and nzb-files) the authenticity of servers must be validated using server security certificates. If the check fails that means the connection cannot be trusted and must be closed with an error message explaining the security issue.

Older versions of NZBGet did not check server certificates and security was reduced. Starting from v19 NZBGet checks server certificates when option **CertCheck** is activated. Official NZBGet installation packages offered on NZBGet download page (for Windows, Mac OS X, Linux and FreeBSD) all have certificate verification enabled by default. If you update from older NZBGet version the verification will be automatically activated after you go to settings page and save settings (the new option **CertCheck** will be written into your config file).

## CA root certificate store
Each certificate is digitally signed by a certificate authority. There is a global list of trusted authorities. In order to perform certificate verification the program needs access to the certificates of trusted authorities -  **CA root certificate store**. In NZBGet it's location is set via option **CertStore**.

Official NZBGet installation packages include the certificate store file and do not require additional configuration.

When compiling NZBGet from sources you need to set option **CertStore** appropriately.

Many Linux distributions have certificate store in file "/etc/ssl/certs/ca-certificates.crt".

Mozilla maintains an up-to-date list of root certificates but in their own format not suitable for direct use with OpenSSL or GnuTLS libraries (which NZBGet relies on). Luckily [curl](https://curl.haxx.se) project has a convertor and offers already prepared files in suitable format, which can be download from https://curl.haxx.se/docs/caextract.html (click on "cacert.pem" link). Download that file onto your machine running NZBGet and set the option, for example:

    CertStore=/user/me/nzbget/cacert.pem

## Dealing with certificate verification failures
When certificate verification is enabled an invalid server certificate produces an error message in NZBGet such as:

> TLS certificate verification failed for secure.eu.thundernews.com: certificate hostname mismatch (*.sslusenet.com)

or

> TLS certificate verification failed for news.eternal-september.org: self signed certificate in certificate chain

The connection to server will be closed and download will not work. This is to protect you from hacker attacks.

### Quick "fix" (merely a workaround)
Unfortunately many Usenet providers have improper configuration on their servers and the errors like shown above are not that uncommon, even if there is no hacker attack in place. You should inform the server owner about the issue.

A quick "fix" on your side is to disable certificate verification ("CertCheck=no"). This restores the old NZBGet behaviour (v18 and older) but you should know that your connection is insecure and you might be connecting to attacker's server without your awareness. Certain failures can be fixed in a better way, read on.

### Hostname mismatch
Each certificate is issued for a certain host and the hostname is embedded into the certificate. It's easy for an attacker to obtain a valid certificate for a host he has admin access to (for example some web server) and then send it to the client. To detect this the client (NZBGet) must check if the hostname of the certificate matches the hostname the client wants to connect to.

Many Highwinds resellers don't have their own certificates and the verification often fails with message like:

> TLS certificate verification failed for secure.eu.thundernews.com: certificate hostname mismatch (*.sslusenet.com)

The message reveals that you are actually connecting to sslusenet.com server. Let's discover how it pings:

    $ ping secure.eu.thundernews.com
    PING de.sslusenet.com (81.171.118.147) 56(84) bytes of data.

You see, ping knows that "secure.eu.thundernews.com" (hostname obtained from the reseller's documentation) is just an alias to "de.sslusenet.com".

Instead of disabling certificate check completely we can configure NZBGet to connect to "de.sslusenet.com" directly instead of using hostname provided in reseller's documentation. The certificate hostname check will succeed and we can keep high level of security.

You can try the following hosts: news.sslusenet.com, us.sslusenet.com, de.sslusenet.com, nl.sslusenet.com, iad.sslusenet.com, usenetnow-eu.sslusenet.com, usenetnow-fr.sslusenet.com, wwwspace-eu.sslusenet.com, wwwspace-us.sslusenet.com, fastusenet-us.sslusenet.com, frugalusenet-eu.sslusenet.com, frugalusenet-us.sslusenet.com, blocknews-eu.sslusenet.com, blocknews-fr.sslusenet.com, blocknews-us.sslusenet.com. Not all of them may work with your login though.

**NOTE:** Changing of host in server settings resets downloaded volume statistics for that news server. The total downloaded volumes (for all servers) remains preserved.

### Self signed certificate
As was explained above each certificate is digitally signed by a certificate authority. There is a global list of trusted authorities. Obtaining a certificate signed by a trusted authority costs money and some (small) Usenet providers or web sites may sign their certificates themselves. When NZBGet detects such a certificate the connection fails with a message similar to:

> TLS certificate verification failed for usenet.argeweb.nl: self signed certificate

or 

> TLS certificate verification failed for news.eternal-september.org: self signed certificate in certificate chain

In first case the server certificate was signed by itself and in the second case the certificate was signed by another certificate which is not in your root certificate store.

To force NZBGet to trust the server certificate you can add the certificate into **CA certificate store**. That's how you can do this:
- make a copy of the file set in option **CertStore** and save it under a new name, for example *mycacert.pem*;
- open terminal (command prompt on Windows) and use **OpenSSL** (you may need to install it first) to get the server certificate in a text format:

    ```shell
    $ openssl s_client -showcerts -connect usenet.argeweb.nl:563
    ...
    -----BEGIN CERTIFICATE-----
    MIID3TCCA0agAwIBAgIJAJQXLqS1YcDqMA0GCSqGSIb3DQEBBQUAMIGmMQswCQYD
    ...
    Xypv2+chvcuTTnUa/dyTOzlHOoHn6wMHQTkLo7ENiv4t
    -----END CERTIFICATE-----
    ...
    -----BEGIN CERTIFICATE-----
    MIIHPTCCBSWgAwIBAgIBADANBgkqhkiG9w0BAQQFADB5MRAwDgYDVQQKEwdSb290
    ...
    omTxJBzcoTWcFbLUvFUufQb1nA5V9FrWk9p2rSVzTMVD
    -----END CERTIFICATE-----
    ...
    ```

- That command prints a lot of the info. The parts starting with `-----BEGIN CERTIFICATE-----` and ending with `-----END CERTIFICATE-----` are certificates. If more then one certificates were printed we need only the last one. Copy the text content of the certificate (including the BEGIN and END signature lines) and add it to file *mycacert.pem* at the end of the file. Use a text editor to edit the file.
- save *mycacert.pem* and change option **CertStore** in NZBGet to point to that new file.

Now NZBGet should be able to connect to the server without error complaining about self signed certificate.

**NOTE:** It's OK to fix self signed certificate issue when you setup a news server in NZBGet or when you just have updated NZBGet from a version which did not have certificate verification (v18 or older). If however you were using the news server in the past and then all of a sudden NZBGet reports an error regarding self signed certificate you should be very careful as you might be under attack. If in doubt - contact the server owner about the certificate issue.

**NOTE:** You should make a copy of **cacert.pem** because NZBGet updates will override the file. When you make a copy and modify it and use it in the future you will not get updates to the file. That's not good as the list of trusted certificate may change. Therefore you should contact the server owner and ask to fix the issue with the certificate. When this happens you can restore option **CertStore** to use the default certificate store.