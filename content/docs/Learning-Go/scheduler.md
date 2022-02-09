+++
title = "The Scheduler"
date = 2022-01-27T14:03:53Z
# description = "" # Used by description meta tag, summary will be used instead if not set or empty.
featured = false
draft = false
comment = true
toc=true  
reward = true
pinned = false
categories = [
  "Go",
  "Learning",
]
tags = [
  "Go", 
  "Go Scheduler"
]
series = [
  "Learning Go"
]
images = []

+++

Go scheduler’s job is to distribute runnable `goroutines` over multiple worker OS threads that runs on one or more processors.

# Links
* [Scheduling In Go](https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part1.html) by [William Kennedy](https://twitter.com/goinggodotnet), a Three-part Series covering the OS and Go schedulers, and Concurrency.
* [Go's work-stealing scheduler](https://rakyll.org/scheduler/) by [JBD](https://twitter.com/rakyll)


# Videos

{{< youtube id="YHRO5WQGh0k" title="GopherCon 2018: Kavya Joshi - The Scheduler Saga" >}}
