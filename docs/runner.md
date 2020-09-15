# How to start runner

Halation为了使代码的运行尽可能的可控，加入了'Runner'的概念；这个的话，在Parcel, Rollup以及webpack中都有很好的实践；其实如果查看unified的话，它其实也是在潜移默化phrase的概念，比如`parse -> transform`的切换

在Halation中它的时间轴大致如下

```
     LoadRunner
+-------------------+
+                   +
+  load register    +
+                   +
+-------------------+

+-------------------+
+                   +
+ Perform getModule +
+                   +
+-------------------+
```