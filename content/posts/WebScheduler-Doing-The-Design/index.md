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

![Microsoft Orleans Logo](images/orleans.png?height=100px#floatleft "Microsoft Orleans Logo")[Microsoft Orleans](https://github.com/dotnet/orleans) is an open-source, cross-platform framework for building robust, scalable distributed applications in .NET. When I discovered Orleans sometime around 2015 I fell in love with it. It is the type of technology that one can get really excited about, the kind that changes mental model of problems and solutions. I've built a few solutions over the years with Orleans but have recently begun making real contributions (*non-docs* :sweat_smile:) to the project.

If you're interested, join the [Official Orleans Discord chat](https://aka.ms/orleans-discord):tm:, it's by far the most welcoming project community I've ever been a part of!

I don't think there is a better explanation of what Orleans is than what has already been written in the [Orleans documentation](https://docs.microsoft.com/en-us/dotnet/orleans/overview):

> Orleans is a cross-platform framework for building robust, scalable distributed applications. It builds on the developer productivity of .NET and brings it to the world of distributed applications, such as cloud services. Orleans scales from a single on-premises server to globally distributed, highly-available applications in the cloud.
>
> Orleans extends familiar concepts like objects, interfaces, `async` and `await`, and try/catch to multi-server environments. Accordingly, it helps developers experienced with single-server applications transition to building resilient, scalable cloud services and other distributed applications. For this reason, Orleans has often been referred to as "Distributed .NET".
>
> It was created by [Microsoft Research](https://research.microsoft.com/projects/orleans/) and introduced the [Virtual Actor Model](https://research.microsoft.com/apps/pubs/default.aspx?id=210931) as a novel approach to building a new generation of distributed systems for the Cloud era. The core contribution of Orleans is its programming model which tames the complexity inherent to highly-parallel distributed systems without restricting capabilities or imposing onerous constraints on the developer.

#### Orleans History 
*Note: this section was pieced together from various Orleans blog posts and other sources. If there is more to it, or any inaccuracies, let me know and I'll amend this section.*

Orleans started out in Microsoft Research in 2008 and was quickly moved into the Xbox organization where it lived most of it's life. It is being used for games such as 343's Halo and Gears of War. Orleans is also being used by a number of internal teams at Microsoft, such as Azure, using Orleans for various components of their systems.

More recently, Orleans [has moved into the Microsoft Development Division](https://devblogs.microsoft.com/dotnet/asp-net-core-updates-in-net-7-preview-1/#:~:text=Orleans%3A%20The%20ASP,version%2Dtolerant%20serializer.) (DevDiv). DevDiv is the division in Microsoft which is responsible for developer tooling, languages, frameworks, and some cloud services. This [is an exciting time for Orleans](https://github.com/dotnet/aspnetcore/issues/39504#:~:text=1583%20(gRPC/HTTP)-,Orleans,-Implement%20POCO%20Grains) and I'm super excited to see what this move means for the growing Orleans ecosystem, especially since it'll be closer aligned with other .NET open-source technologies.


### ASP.NET Core Blazor
![Blazor Logo](images/Blazor.png?height=100px#floatright "ASP.NET Core Blazor Logo")
ASP.NET Core Blazor is a framework for building interactive client-side web UI using .NET instead of JavaScript. Blazor has two flavors ([soon three with Blazor Hybrid](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-hybrid)), [Blazor WebAssembly](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-webassembly) and [Blazor Server](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-server). 

Blazor WebAssembly is a client-side framework that uses the HTML, CSS, and JavaScript APIs of the browser to render the UI and executes as Web WebAssembly directly in a .NET framework runtime in the browser. 

Blazor Server is a client and server-side framework where UI updates are processed server-side and handled over a [SignalR](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-6.0) connection.

For this project, I wanted to keep the UI relatively simple without a backend-host so I could leverage App Platform's [Static Site component](https://docs.digitalocean.com/products/app-platform/concepts/static-site/). To meet this objective, I chose Blazor WebAssembly.

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

