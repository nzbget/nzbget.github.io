---
redirect_from: /Choosing_a_cipher
---
## About ciphers ##
When an encrypted communication with news server (option **ServerX.Encryption**) is active NZBGet and the news server use TLS/SSL protocol to exchange data in a secure way.

TLS/SSL specification defines many possible ciphers which can be used to encrypt data. The ciphers distinguish in algorithms and key lengths.

NZBGet can use two TLS/SSL libraries: OpenSSL and GnuTLS. The library can be selected during configuration step of building NZBGet.

When a TLS/SSL connection is created the so called *TLS Handshake* process is performed. During TLS Handshake the client (NZBGet) and the server (news server) choose the cipher for communication. By default the most secure cipher is selected. This cipher however may not give the best performance on your particular computer.

NZBGet provides an option **ServerX.Cipher** to manually select a cipher.

**Example:** on my SAT Receiver Vu+ choosing cipher RC4 has increased the speed from 2500KB/s to 3800KB/s. This should give you an idea how important the option is.

## Summary ##
Many users have followed these instructions. All tests show that the encryption/hash combination **RC4/MD5** is the fastest on all machines. To use this cipher in NZBGet set option **ServerX.Cipher** to:
* If NZBGet was compiled to use **OpenSSL**:

 ```
Server1.Cipher=RC4-MD5
 ```
* If NZBGet was compiled to use **GnuTLS**:

 ```
Server1.Cipher=NONE:+VERS-TLS-ALL:+ARCFOUR-128:+RSA:+MD5:+COMP-ALL
```

If you want to learn more please read the whole article.

## OpenSSL ##
### What ciphers are available ###
In the terminal execute the command
```shell
openssl ciphers -v
```

it prints the list of supported ciphers. Example:
```
root@VUPLUSDUO:~# openssl ciphers -v
DHE-RSA-AES256-SHA      SSLv3 Kx=DH       Au=RSA  Enc=AES(256)  Mac=SHA1
DHE-DSS-AES256-SHA      SSLv3 Kx=DH       Au=DSS  Enc=AES(256)  Mac=SHA1
AES256-SHA              SSLv3 Kx=RSA      Au=RSA  Enc=AES(256)  Mac=SHA1
EDH-RSA-DES-CBC3-SHA    SSLv3 Kx=DH       Au=RSA  Enc=3DES(168) Mac=SHA1
EDH-DSS-DES-CBC3-SHA    SSLv3 Kx=DH       Au=DSS  Enc=3DES(168) Mac=SHA1
DES-CBC3-SHA            SSLv3 Kx=RSA      Au=RSA  Enc=3DES(168) Mac=SHA1
DES-CBC3-MD5            SSLv2 Kx=RSA      Au=RSA  Enc=3DES(168) Mac=MD5
DHE-RSA-AES128-SHA      SSLv3 Kx=DH       Au=RSA  Enc=AES(128)  Mac=SHA1
DHE-DSS-AES128-SHA      SSLv3 Kx=DH       Au=DSS  Enc=AES(128)  Mac=SHA1
AES128-SHA              SSLv3 Kx=RSA      Au=RSA  Enc=AES(128)  Mac=SHA1
RC2-CBC-MD5             SSLv2 Kx=RSA      Au=RSA  Enc=RC2(128)  Mac=MD5
RC4-SHA                 SSLv3 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=SHA1
RC4-MD5                 SSLv3 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=MD5
RC4-MD5                 SSLv2 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=MD5
EDH-RSA-DES-CBC-SHA     SSLv3 Kx=DH       Au=RSA  Enc=DES(56)   Mac=SHA1
EDH-DSS-DES-CBC-SHA     SSLv3 Kx=DH       Au=DSS  Enc=DES(56)   Mac=SHA1
DES-CBC-SHA             SSLv3 Kx=RSA      Au=RSA  Enc=DES(56)   Mac=SHA1
DES-CBC-MD5             SSLv2 Kx=RSA      Au=RSA  Enc=DES(56)   Mac=MD5
EXP-EDH-RSA-DES-CBC-SHA SSLv3 Kx=DH(512)  Au=RSA  Enc=DES(40)   Mac=SHA1 export
EXP-EDH-DSS-DES-CBC-SHA SSLv3 Kx=DH(512)  Au=DSS  Enc=DES(40)   Mac=SHA1 export
EXP-DES-CBC-SHA         SSLv3 Kx=RSA(512) Au=RSA  Enc=DES(40)   Mac=SHA1 export
EXP-RC2-CBC-MD5         SSLv3 Kx=RSA(512) Au=RSA  Enc=RC2(40)   Mac=MD5  export
EXP-RC2-CBC-MD5         SSLv2 Kx=RSA(512) Au=RSA  Enc=RC2(40)   Mac=MD5  export
EXP-RC4-MD5             SSLv3 Kx=RSA(512) Au=RSA  Enc=RC4(40)   Mac=MD5  export
EXP-RC4-MD5             SSLv2 Kx=RSA(512) Au=RSA  Enc=RC4(40)   Mac=MD5  export
```

First column is the cipher suite name. This name must be used in NZBGet in option **ServerX.Cipher**.

The second column indicates the SSL version (v2 or v3) where the cipher suite can be used. Some cipher suits can be used in both SSL versions and therefore have two rows in the list for the same cipher suite name.

Column **Kx** is the algorithm used for key exchange.

Column **Au** is the algorithm for authentication.

Column **Enc** is the bulk encryption algorithm used to encrypt the message stream.

Column **Mac** is the message authentication code (MAC) algorithm used to create the message digest, a cryptographic hash of each block of the message stream.

For example take a detailed look at the first row
 DHE-RSA-AES256-SHA      SSLv3 Kx=DH       Au=RSA  Enc=AES(256)  Mac=SHA1
This cipher suite name is **DHE-RSA-AES256-SHA**. It is for SSL version 3, the key exchange algorithm (**Kx**) is **DH**, the authentication algorithm (**Au**) is **RSA**, the encryption algorithm (**Enc**) is **AES(256)**, the message authentication code algorithm (**Mac**) is **SHA1**.

**Kx** (key exchange) and **Au** (authentication) are performed only during the establishing connection and are therefore not relevant for performance.

**Enc** (encryption algorithm) and **Mac** (message authentication code algorithm) are used to encrypt/decrypt the data stream and have direct impact on performance.

Now we must choose a cipher suite with the fastest **Enc** and **Mac** ciphers. Lets write down all **Enc** and **Mac** algorithms listed in the table:

**Enc**: AES(256), 3DES(168), AES(128), RC2(128), RC4(128). I intentionally skipped the ciphers with key length less than 128 bit (DES(56), RC2(40), etc.); they cannot be considered secure nowadays.

**Mac**: SHA1, MD5.

The next step is to test the speed of **Enc** ciphers AES(256), 3DES(168), AES(128), RC2(128), RC4(128) and **Mac** algorithms SHA1, MD5 and choose the fastest combination of both.

### Testing ciphers speed ###
In the terminal execute the command
```
openssl speed
```

**NOTE:** to get correct results make sure the computer is not used for any other tasks during testing.

The command tests all ciphers (this take several minutes), then prints the summary. Example from my SAT receiver:

```
root@VUPLUSDUO:~# openssl speed
<STRIPPED INDIVIDUAL TEST RESULTS, SHOWING ONLY THE SUMMARY>
The 'numbers' are in 1000s of bytes per second processed.
type             16 bytes     64 bytes    256 bytes   1024 bytes   8192 bytes
md2                202.16k      430.91k      594.79k      648.19k      666.28k
mdc2                 0.00         0.00         0.00         0.00         0.00
md4               1582.24k     5385.28k    14451.80k    24957.61k    31787.15k
md5               1102.43k     3746.60k    10390.36k    18673.66k    24117.25k
hmac(md5)         1505.20k     4865.69k    12335.87k    20036.61k    24545.86k
sha1              1187.80k     3436.65k     7509.85k    10738.99k    12416.34k
rmd160             991.07k     2762.05k     5750.44k     7885.14k     8863.74k
rc4              13628.26k    15201.09k    15710.89k    15851.86k    15867.90k
des cbc           2228.90k     2314.86k     2338.47k     2353.15k     2367.49k
des ede3           851.43k      863.81k      866.82k      867.33k      860.30k
idea cbc             0.00         0.00         0.00         0.00         0.00
seed cbc             0.00         0.00         0.00         0.00         0.00
rc2 cbc           2910.75k     3036.48k     3067.90k     3077.46k     3067.24k
rc5-32/12 cbc        0.00         0.00         0.00         0.00         0.00
blowfish cbc      5245.97k     5618.39k     5726.29k     5750.10k     5758.98k
cast cbc          5221.43k     5609.28k     5718.70k     5749.08k     5748.05k
aes-128 cbc       4438.49k     4791.91k     4902.49k     4932.95k     4931.58k
aes-192 cbc       3914.24k     4194.24k     4280.06k     4297.73k     4303.53k
aes-256 cbc       3501.63k     3730.43k     3793.24k     3810.99k     3796.62k
camellia-128 cbc        0.00         0.00         0.00         0.00         0.00
camellia-192 cbc        0.00         0.00         0.00         0.00         0.00
camellia-256 cbc        0.00         0.00         0.00         0.00         0.00
sha256             894.82k     2050.47k     3536.71k     4378.20k     4745.90k
sha512             258.83k     1033.47k     1493.79k     2049.37k     2299.22k
aes-128 ige       4502.86k     5114.15k     5349.89k     5418.67k     5428.57k
aes-192 ige       4006.06k     4482.37k     4586.50k     4627.80k     4628.48k
aes-256 ige       3550.93k     3919.27k     4038.83k     4066.65k     4071.42k
<STRIPPED TEST RESULTS FOR KEY EXCHANGE ALGORITHMS>
```

The table shows more algorithms than we are interested in. Just keep only the rows for algorithms we can use (AES(256), 3DES(168), AES(128), RC2(128), RC4(128) for **Enc** and SHA1, MD5 for **Mac**). The speed results table shrinks to:
```
The 'numbers' are in 1000s of bytes per second processed.
type             16 bytes     64 bytes    256 bytes   1024 bytes   8192 bytes
md5               1102.43k     3746.60k    10390.36k    18673.66k    24117.25k
sha1              1187.80k     3436.65k     7509.85k    10738.99k    12416.34k
rc4              13628.26k    15201.09k    15710.89k    15851.86k    15867.90k
des cbc           2228.90k     2314.86k     2338.47k     2353.15k     2367.49k
des ede3           851.43k      863.81k      866.82k      867.33k      860.30k
rc2 cbc           2910.75k     3036.48k     3067.90k     3077.46k     3067.24k
aes-128 cbc       4438.49k     4791.91k     4902.49k     4932.95k     4931.58k
aes-256 cbc       3501.63k     3730.43k     3793.24k     3810.99k     3796.62k
aes-128 ige       4502.86k     5114.15k     5349.89k     5418.67k     5428.57k
aes-256 ige       3550.93k     3919.27k     4038.83k     4066.65k     4071.42k
```

I don't really know the difference between **aes cbc** and **aes ige** so I kept both in the table. Another question is what column to look at. Some ciphers have better speeds for larger block sizes whereas other ciphers don't really care. I don't know actually what block size is more important, so I looked at the middle column **256 bytes** (not very scientifically I guess).

From all Enc-algorithms (AES(256), 3DES(168), AES(128), RC2(128), RC4(128)) we see that **RC4** provides by far the best speed.

From two Mac-algorithms (SHA1, MD5) **MD5** is the fastest.

Now take a look at the cipher list (first table) and find the rows where **Enc=RC4** and **Mac=MD5** (I ignored Enc-ciphers with less than 128 bits keys):
```
RC4-MD5                 SSLv3 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=MD5
RC4-MD5                 SSLv2 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=MD5
```

The first column is the cipher suite name - it's **RC4-MD5**. This is the cipher with best performance. Just test it in NZBGet. Set option **ServerX.Cipher**:
```
Server1.Cipher=RC4-MD5
```

Now test the download speed in NZBGet. On my SAT Receiver Vu+ choosing cipher "RC4-MD5" has increased the speed from 2500KB/s to 3800KB/s. Not bad, isn't it?

## GnuTLS ##
I have not made any performance tests using GnuTLS.

It has similar commands "gnutls-cli --list", "gnutls-cli --benchmark-ciphers" and "gnutls-cli --benchmark-tls-ciphers". Please note that the benchmark commands require at least version 3.0.13 of GnuTLS. Use "gnutls-cli --help" to print the list of supported options.

GnuTLS has a very different syntax to specify the ciphers to use. For example to select **RC4** as **Enc**-algorithm and **MD5** as **Mac**-algorithm you should set the option **ServerX.Cipher**as:
```
Server1.Cipher=NONE:+VERS-TLS-ALL:+ARCFOUR-128:+RSA:+MD5:+COMP-ALL
```

For detailed explanation what does it mean see [Priority strings](http://gnutls.org/manual/html_node/Priority-Strings.html) in GnuTLS documentation.
