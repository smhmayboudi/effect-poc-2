# effect-poc

## Build

```shell
npm run build
```

## Run

```shell
npm run run
```

## Test

```shell
$ curl -v http://localhost:8888/todo
* Host localhost:8888 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8888...
* connect to ::1 port 8888 from ::1 port 57538 failed: Connection refused
*   Trying 127.0.0.1:8888...
* Connected to localhost (127.0.0.1) port 8888
> GET /todo HTTP/1.1
> Host: localhost:8888
> User-Agent: curl/8.6.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 2
< ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
< Date: Thu, 04 Jul 2024 15:47:56 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
[]%                                                                                    ```

## Issues

- There is a problem with `noEmit` flag on `tsconfig.json` which it should be considered.
