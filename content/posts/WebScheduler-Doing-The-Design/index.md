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
  "Microsoft Orleans",
  "Blazor",
  "WebScheduler",
  "ASP.NET Core"
]
tags = []
series = [
  "Building a Distributed Task Scheduler on DigitalOcean App Platform"
]

[[resources]]
name = 'thumbnail'
src = 'images/PhysicalDeploymentDiagram.svg'

+++
This is the second post in the series, if you haven't read the first, you should stop here and [read the first part]({{< ref  "Building-a-Distributed-Task-Scheduler-on-DigitalOcean-App-Platform" >}}) before continuing. 

This post covers the system design of the Web Scheduler and some of the decisions made during the design process.

I plan to deploy to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/?refcode=0759a4937a7a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste) and leveraging their managed PaaS offerings.

### Microsoft Orleans

[Microsoft Orleans](https://github.com/dotnet/orleans)



## Deployment Overview

### Physical Deployment

{{< svg "/images/PhysicalDeploymentDiagram.svg" "PhysicalDeploymentDiagram" "0 0 10 20" "xMidYMid meet" >}}

### Logical Deployment
  
{{< svg "/images/LogicalDeploymentDiagram.svg" "LogicalDeploymentDiagram" "0 0 10 20" "xMidYMid meet" >}}

## Our Stack

* DigitalOcean App Platform 
* Microsoft Orleans
* .NET ASP.Net Core
* MySQL
* Redis

