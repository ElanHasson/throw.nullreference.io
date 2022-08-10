---
title: Orleans 3.6 to 3.0 Migration Guid
date: 2022-08-09T17:01:47Z
# Used by description meta tag, summary will be used instead if not set or empty.
description: Orleans 4.0 brings lots of new functionality and performance gains along with many breaking changes. This guide is intended to document my journey of migrating several Orleans applications from 3.6 to 4.0.
layout: docs
type: docs
featured: true
draft: true
comment: true
toc: true
reward: true
pinned: false
categories:
- Microsoft Orleans
- Learning
tags:
- C#
- .NET
- Microsoft Orleans
series:

menu:
  main:
    weight: 10
    pre: '<i class="fas fa-fw fa-book"></i>'
  footer:
    weight: 10
    pre: '<i class="fas fa-fw fa-book"></i>'
resources:

---
# What has changed ?
- new NuGets 
- Poco grains 
- serialization  is way different 
- SiloHostBuilder is no longer used, HostBuilder is
- No more AddApplicationParts
- 

# Raw Notes 
In 3.6.x I have some client tests that resolve SerializationManager (eg. var mgr = client.ServiceProvider.GetRequiredService<SerializationManager>()) . Does 4.0 have an equivalent?

You can resolve Serializer or Serializer<T>

