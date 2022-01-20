+++
title = "Part 1: Building a Distributed Task Scheduler on DigitalOcean's App Platform"
description = "A multi-part series on building a complex application on DigitalOcean's App Platform"
date = 2022-01-19T02:07:52Z
featured = true
draft = false
comment = true
toc = true
reward = true
categories = [
  "Microsoft Orleans",
  "DigitalOcean App Platform",
  ".NET"
]
tags = []
series = [
  "Building a Distributed Task Scheduler on DigitalOcean App Platform"
]
images = [
  "scheduled-25134.svg"
]
+++

## New Beginnings

I'm a new engineer on the [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/?refcode=0759a4937a7a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste) team. I've spent the last 20 years writing C# code full-time. I've made the switch to [Go](https://go.dev/) and to be perfectly honest, I miss writing C#. You know that itch you have for doing something you love so much? Well, I've got to scratch that [.NET](https://dot.net) itch somehow while learning Golang and the amazingly capable App Platform product.

I figured I'd kill two birds with one stone and build a complex distributed system on top of App Platform.

This [series](/series/building-a-distributed-task-scheduler-on-digitalocean-app-platform) is going to document my journey of building a highly-available Task Scheduling system hosted on App Platform.

I've selected a very fancy name for the project: *Web Scheduler*. It's 100% open source, and can be found in the [repository](https://github.com/ElanHasson/web-scheduler) at GitHub.



## Scope

The Web Scheduler will be a highly-available, distributed, task-scheduling system allowing users to schedule tasks, one time, or recurring, that will use a variety of delivery mechanisms to send a signal and trigger *something* in a remote application.

### Scheduling Options

- **One-Time**: A task that will be executed once, at a specific time.
- **Recurring**: A task that will be executed at a specific interval (think [`crontab`](https://en.wikipedia.org/wiki/Cron) capabilities).
  - Limit the recurrences to a specific number of times or run indefinitely.

### Delivery Mechanisms

I've listed a few below that were top of mind.
- **Web Hook**: A simple HTTP request to a URL.
- **Event Publishing**:
  - [Azure Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/overview)
  - [RabbitMQ](https://rabbitmq.com/)
  - [Kafka](https://kafka.apache.org/)
  - [Amazon SNS](https://aws.amazon.com/sns/)
  - [Google PubSub](https://cloud.google.com/pubsub/)
  - [Amazon SQS](https://aws.amazon.com/sqs/)
  - [Redis](https://redis.io/)
  - *Suggest more in the comments below!*

### Delivery Guarantees

The delivery of a message is guaranteed to be received by the destination, *at least once*. This will help keep complexity of the system low versus *at most once* delivery.

As for timeliness of the delivery, there are many factors involved, such as:
* How busy the system is delivering other tasks across all users
* Per-User Rate Limits
* System-Level Rate Limits

Sub-second delivery guarantees would be great :smile:

The next post will cover the design details of the system, so stay tuned!

{{<svg-alert icon="check-circle-fill" type="success">}}
In the meantime, head over to DigitalOcean and [sign-up and give App Platform a try](https://m.do.co/c/0759a4937a7a) and get a $100 credit to use over 60 days.
{{</svg-alert>}}
