+++
title = "WebScheduler Part II: Designing the Web Scheduler"
description = "In this installment of building a distributed task scheduler, we'll go over the system design and implementation details."
date = 2022-03-19T02:07:52Z
featured = true
viewer = false
draft = true
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


This post covers the system design of the Web Scheduler and the decisions made during the design process.

The code for the project can be found here [in these repositories](https://github.com/web-scheduler).

## The Tech Stack

- Hosting Platform: [DigitalOcean's App Platform](#digitaloceans-app-platform)
- Web Frontend Application: [ASP.NET Core Blazor](#aspnet-core-blazor)
- Frontend API: ASP.NET Core Web API
- Backend: [Microsoft Orleans](#microsoft-orleans)
- Durable Data Persistence: [MySQL](#mysql)
- Caching: [Redis](#redis)
- Claims-based Identity: [Duende IdentityServer with ASP.NET Core Identity](#duende-identityserver-with-aspnet-core-identity)
- Build, Test, Package, and Containerize: [GitHub Actions](#github-actions)
- Observability: [OpenTelemetry and Jaegar](#opentelemetry-and-jaeger)

## DigitalOcean's App Platform

The WebScheduler will be deployed to [DigitalOcean's App Platform](https://www.digitalocean.com/products/app-platform/?refcode=0759a4937a7a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste) and leveraging their managed PaaS offerings for support services.

App Platform is a fully-managed solution that allows you to build, deploy, and scale your apps so you can focus on what you do best: building great software!

The WebScheduler will be deployed as an App Platform App using different *component types*: [Database](https://docs.digitalocean.com/products/app-platform/concepts/database/), [Service](https://docs.digitalocean.com/products/app-platform/concepts/service/), and [Static Site](https://docs.digitalocean.com/products/app-platform/concepts/static-site/).

Our WebScheduler App will be deployed as depicted below. You can click each component to jump to the relevant portion of the [App Spec](https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/).
{{< svg "/images/PhysicalDeploymentDiagram.svg" "PhysicalDeploymentDiagram" "0 0 10 20" "xMidYMid meet" >}}

Below are the details about each one of the components that make up the WebScheduler App.

## Microsoft Orleans

![Microsoft Orleans Logo](images/orleans.png?height=100px#floatleft "Microsoft Orleans Logo")[Microsoft Orleans](https://github.com/dotnet/orleans) is an open-source, cross-platform framework for building robust, scalable distributed applications in .NET. When I discovered Orleans sometime around 2015 I fell in love with it. It is the type of technology that one can get really excited about, the kind that changes mental model of problems and solutions. I've built a few solutions over the years with Orleans but have recently begun making real contributions (*non-docs* :sweat_smile:) to the project.

If you're interested, join the [Official Orleans Discord chat](https://aka.ms/orleans-discord):tm:, it's by far the most welcoming project community I've ever been a part of!

I don't think there is a better explanation of what Orleans is than what has already been written in the [Orleans documentation](https://docs.microsoft.com/en-us/dotnet/orleans/overview):

> Orleans is a cross-platform framework for building robust, scalable distributed applications. It builds on the developer productivity of .NET and brings it to the world of distributed applications, such as cloud services. Orleans scales from a single on-premises server to globally distributed, highly-available applications in the cloud.
>
> Orleans extends familiar concepts like objects, interfaces, `async` and `await`, and try/catch to multi-server environments. Accordingly, it helps developers experienced with single-server applications transition to building resilient, scalable cloud services and other distributed applications. For this reason, Orleans has often been referred to as "Distributed .NET".
>
> It was created by [Microsoft Research](https://research.microsoft.com/projects/orleans/) and introduced the [Virtual Actor Model](https://research.microsoft.com/apps/pubs/default.aspx?id=210931) as a novel approach to building a new generation of distributed systems for the Cloud era. The core contribution of Orleans is its programming model which tames the complexity inherent to highly-parallel distributed systems without restricting capabilities or imposing onerous constraints on the developer.

Check out [An Introduction to Orleans](https://docs.microsoft.com/en-us/shows/reactor/an-introduction-to-orleans) from Microsoft Reactor for a great primer.

### Orleans History 
*Note: this section was pieced together from various Orleans blog posts and other sources. If there is more to it, or any inaccuracies, let me know and I'll amend this section.*

Orleans started out in Microsoft Research in 2008 and was quickly moved into the Xbox organization where it lived most of it's life. It is being used for games such as [343 Industries](https://www.343industries.com/)'s [Halo](https://en.wikipedia.org/wiki/Halo_(franchise)) and Epic Games' [Gears of War](https://gearsofwar.com/) series. Orleans is also being used by a number of internal teams at Microsoft to build [Azure ML](https://azure.microsoft.com/en-us/services/machine-learning/), [Azure IoT Digital Twins](https://azure.microsoft.com/en-us/services/digital-twins/), [Microsoft Mesh](https://www.microsoft.com/en-us/mesh), [Azure Quantum](https://azure.microsoft.com/en-us/services/quantum/), [Microsoft Dynamics 365 Fraud Protection](https://dynamics.microsoft.com/en-us/ai/fraud-protection/), [Azure PlayFab](https://azure.microsoft.com/en-us/services/playfab/) (part of Xbox), just to name a few. For more details, check out the [Orleans at Microsoft](https://www.youtube.com/watch?v=KhgYlvGLv9c) video, where [Reuben Bond](https://twitter.com/reubenbond) talks about how Orleans is used at Microsoft.

More recently, Orleans [has moved into the Microsoft Development Division](https://devblogs.microsoft.com/dotnet/asp-net-core-updates-in-net-7-preview-1/#:~:text=Orleans%3A%20The%20ASP,version%2Dtolerant%20serializer.) (DevDiv). DevDiv is the division in Microsoft which is responsible for developer tooling, languages, frameworks, and some cloud services. This [is an exciting time for Orleans](https://github.com/dotnet/aspnetcore/issues/39504#:~:text=1583%20(gRPC/HTTP)-,Orleans,-Implement%20POCO%20Grains) and I'm super excited to see what this move means for the growing Orleans ecosystem, especially since it'll be closer aligned with other .NET open-source technologies.

## Implementation Details

Orleans manages our concurrency and [load balancing](https://docs.microsoft.com/en-us/dotnet/orleans/implementation/load-balancing) across [Grains](https://docs.microsoft.com/en-us/dotnet/orleans/overview#grains) for us. These are attractive features for us as we want to eliminate the need to manage these seemingly simple, but very complex and nuanced concerns ourselves.


We'll be modeling our Scheduled Tasks as a Grain running on the Orleans cluster. Each `ScheduledTaskGrain` will have a unique ID and will be responsible for executing the task at a specified time. The [grain state](https://docs.microsoft.com/en-us/dotnet/orleans/grains/grain-persistence) is modeled in `ScheduledTaskMetadata`, which is a [POCO](https://stackoverflow.com/a/250006/103302). Scheduled tasks will leverage the [Orleans Reminders](https://docs.microsoft.com/en-us/dotnet/orleans/grains/timers-and-reminders) feature to schedule their execution.


{{< svg "/images/ScheduledTaskClassDiagram.svg" "ScheduledTaskClassDiagram" "0 0 10 20" "xMidYMid meet" >}}

### The ScheduledTaskGrain

The `ScheduledTaskGrain` is the workhorse of the Scheduler. It is responsible for managing the state of the `ScheduledTaskGrain` and for triggering the executing of the scheduled task per the desired schedule..

The grain acts as a CRUD interface for the `ScheduledTaskMetadata` state. The `ScheduledTaskMetadata', as the name implies, holds all of the information required to schedule and execute the task.

#### Scheduling the Task

Orleans has a mechanism called [Reminders](https://docs.microsoft.com/en-us/dotnet/orleans/grains/timers-and-reminders) which enable you to specify periodic tasks that are executed by a grain. Reminders are durable and the Orleans runtime guarantees reminders will *always* be fired. This is a great way to implement a cron-like scheduling system, except they don't exactly allow for [cron-like scheduling...yet](https://github.com/dotnet/orleans/issues/7573)!

The primary reason for selecting Orleans is because of the durable reminders that scale near-linearly when adding new Silos to the cluster.

Reminders do have some limitations:
* Reminders can only scheduled \\(\leq\\)49 days (`0xfffffffe` milliseconds) in the future
* Reminders can only tick at an interval of \\(\leq\\)49 days (`0xfffffffe` milliseconds)
* They don't speak [*crontab*](https://codebeautify.org/crontab-format)
* There is no way to have a task run only once. It'll keep *ticking* at the specified interval until you [unregister the reminder](https://docs.microsoft.com/en-us/dotnet/orleans/grains/timers-and-reminders#reminder-usage).

We'll be working around all of these limitations as part of the implementation.

#### Executing the Task

The type of trigger is determined by the `TriggerType` enum value stored in in `ScheduledTaskMetadata.TaskTriggerType`. For now, we're going implement a simple trigger, the `TaskTriggerType.HttpTrigger`, supporting only HTTP `GET` requests. The `ScheduledTaskMetadata.HttpTriggerProperties` holds information to use for the actual HTTP Request.

In the future, we'll be adding support for all other HTTP verbs and message queueing systems such as RabbitMQ or Kafka. configuration for HTTP request task types. 


## Observability

For the Orleans Silo Cluster, we'll be using [OrleansDashboard](https://github.com/OrleansContrib/OrleansDashboard) to monitor our silos.

![OrleansDashboard](images/OrleansDashboard.png?height=440px#floatright "The OrleansDashboard")

### OpenTelemetry and Jaeger

We'll be using [OpenTelemetry](https://opentelemetry.io/docs/instrumentation/net/) and [Jaeger](https://www.jaegertracing.io/) to implement distributed tracing, so we can see what's happening in our services.


## ASP.NET Core Blazor
![Blazor Logo](images/Blazor.png?height=100px#floatright "ASP.NET Core Blazor Logo")
ASP.NET Core Blazor is a framework for building interactive client-side web UI using .NET instead of JavaScript. Blazor has two flavors ([soon three with Blazor Hybrid](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-hybrid)), [Blazor WebAssembly](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-webassembly) and [Blazor Server](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-server). 

Blazor WebAssembly is a client-side framework that uses the HTML, CSS, and JavaScript APIs of the browser to render the UI and executes as Web WebAssembly directly in a .NET framework runtime in the browser. 

Blazor Server is a client and server-side framework where UI updates are processed server-side and handled over a [SignalR](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-6.0) connection.

For this project, I wanted to keep the UI relatively simple without a backend-host so I could leverage App Platform's [Static Site component](https://docs.digitalocean.com/products/app-platform/concepts/static-site/). To meet this objective, I chose Blazor WebAssembly.

For a UI Component library, We'll be using [Blazorise](https://blazorise.com/) with the [Bootstrap5 theme](https://bootstrap5demo.blazorise.com/).

## MySQL

For grain storage and other orleans data persistence, We'll be using [MySQL](https://www.mysql.com/), see [ADO.NET grain persistence](https://docs.microsoft.com/en-us/dotnet/orleans/grains/grain-persistence/relational-storage).

## Redis

[Redis](https://redis.com) will be used for request distributed caching for API requests.

## Duende IdentityServer with ASP.NET Core Identity

We'll be supporting both Social logins and local logins. To do so, be implementing [Duende IdentityServer](https://duendesoftware.com/products/identityserver) to handle our authentication with JWT with claims-based authorization to secure our ASP.NET Web APIs and Frontend Blazor App.

## GitHub Actions

We'll be using GitHub Actions to build, test, package, and deploy our services as container images to DigitalOcean's App Platform.

## Tying it All Together

The components of the WebScheduler system.

{{< svg "/images/LogicalDeploymentDiagram.svg" "LogicalDeploymentDiagram" "0 0 10 20" "xMidYMid meet" >}}


{{<svg-alert type="info" icon="code-square">}}
The code for the project can be found here [in these repositories](https://github.com/web-scheduler).
{{</svg-alert>}}


{{<svg-alert icon="check-circle-fill" type="success">}}
Head over to DigitalOcean and [sign-up and give App Platform a try](https://m.do.co/c/0759a4937a7a) and get a $100 credit to use over 60 days.
{{</svg-alert>}}

