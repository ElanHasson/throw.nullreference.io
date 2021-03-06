+++
title = "Adding IIS Features to an AWS Elastic Bean Stalk .Net Container"
date = 2014-09-08T08:26:00Z
# description = "" # Used by description meta tag, summary will be used instead if not set or empty.
featured = false
draft = false
comment = true
toc = true
reward = true
pinned = false
categories = [
  "Problems & Solutions"
]
tags = [
  "AWS",
  "Elastic Bean Stalk",
  ".NET"
]
aliases=["/2014/09/adding-features-to-aws-elastic-bean.html"]
series = [
  ""
]
images = []
+++
I use Amazon Web Services's [Elastic Bean Stalk](http://aws.amazon.com/elasticbeanstalk/) to _automagically_ scale my ASP.Net web applications. I'm using a Windows 2012 R2 based instance.

I also use [SignalR](http://signalr.net/) for real time communications within my app. While, I could use Ajax Long Polling, WebSockets are a tad bit faster.

### Problem

The default [AMI](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) has doesn't have the [IIS Feature for WebSockets](http://www.iis.net/learn/get-started/whats-new-in-iis-8/iis-80-websocket-protocol-support) installed.

### Solution

Create a folder in your project named `.ebextensions`.

If Visual Studio complains about not being allowed to add a folder with a leading dot, name the folder `.ebextensions.` and the period at the end will be removed for you.

Within the newly created `.ebextensions` folder, create a file, named whatever you want, ending in a `.config` extension. This is a YAML file, note that each level of indentation is two spaces.

I named mine `InstallWebSocketsFeature.config`.

```yaml
commands:
  installWebSocketsFeature:
    command: "%WINDIR%\\system32\\DISM.EXE /enable-feature /online /featureName:IIS-WebSockets"
```

Publish your package to EBS and you'll now get a machine with the IIS WebSockets feature installed on creation of the instance.

#### UPDATE

Here is a list of all (most?) of the features available to install: [The IIS 8.5 Module List](http://www.iis.net/learn/install/installing-iis-85/installing-iis-85-on-windows-server-2012-r2#ModulesinIIS85)