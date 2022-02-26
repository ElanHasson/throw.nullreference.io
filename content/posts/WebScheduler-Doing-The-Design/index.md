+++
title = "WebScheduler Part II: Designing the Web Scheduler"
description = "In this installment of building a distributed task scheduler, we'll go over the system design and implementation details."
date = 2022-02-23T02:07:52Z
featured = true
viewer = false
draft = false
comment = true
toc = true
reward = true
categories = [
  "Microsoft Orleans",
  "DigitalOcean App Platform",
  ".NET",
  "Systems Design",
  "Microsoft Orleans"
]
tags = ["Microsoft Orleans"]
series = [
  "Building a Distributed Task Scheduler on DigitalOcean App Platform"
]

[[resources]]
name = 'thumbnail-logical-deployment-diagram.svg'
src = 'images/LogicalDeploymentDiagram.svg'

+++
This post covers the system design of the Web Scheduler and some of the decisions made during the design process.

## Planning

I plan to deploy to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/?refcode=0759a4937a7a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste), first let's figure out the structure we need.



## Deployment Overview


{{< svg "/images/LogicalDeploymentDiagram.svg" >}}

## Our Stack

* DigitalOcean App Platform
* Microsoft Orleans
* .NET ASP.Net Core
* MySQL
* Redis

