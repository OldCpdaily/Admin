###Maven###
Build and run a deployable jar:
```
mvn clean package

java -Djava.net.preferIPv4Stack=true -jar target/api-1.0.jar -http.port=:8888 -admin.port=:9999
-local.doc.root=/root/asserts/ -dsc.hosts=172.16.2.131 -mysql.host=172.16.2.131 -dsc.keyspace=cpdailyspace
-ex.host=zhibo.cpdaily.com -com.twitter.server.resolverMap=ex=zhibo.cpdaily.com:80,jpush=api.jpush.cn:443
```
