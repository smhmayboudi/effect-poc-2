# effect-poc

## Build

```shell
npm run build
```

## Run

```shell
node ./build/context-tag-express.js
node ./build/context-tag-hono.js
```

## Test

### Express

```shell
$ -v http://localhost:3001
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> GET / HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 12
< ETag: W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"
< Date: Wed, 03 Jul 2024 11:34:29 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
Hello World!%
```

### Hono

```shell
$ curl -v http://localhost:3001
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* connect to ::1 port 3001 from ::1 port 56670 failed: Connection refused
*   Trying 127.0.0.1:3001...
* Connected to localhost (127.0.0.1) port 3001
> GET / HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200 OK
< content-type: text/plain; charset=UTF-8
< Content-Length: 12
< Date: Wed, 03 Jul 2024 11:35:17 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
Hello World!%
```

## Issues

- There is a problem with `noEmit` flag on `tsconfig.json` which it should be considered.
- `context-tag-hono.ts:12` and `context-tag-hono.ts:15` may not needed, instead `context-tag-hono.ts:14` can be used. it should be investigated.
