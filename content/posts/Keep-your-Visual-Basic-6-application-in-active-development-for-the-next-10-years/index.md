+++
title = "Keep Your Visual Basic 6 Application in Active Development, for the Next 10 Years"
date = 2014-05-02T23:00:00Z
# description = "" # Used by description meta tag, summary will be used instead if not set or empty.
featured = false
draft = false
comment = true
toc = true
reward = true
pinned = false
categories = [
  "Random Thoughts"
]
tags = [
  "COM Interop", 
  "Visual Basic 6",
  ".NET"
]
aliases =["/2014/05/keep-your-visual-basic-6-application-in.html"]
series = [
  ""
]

[[resources]]
name = 'thumbnail-Form_vide_VB.JPG'
src = 'Form_vide_VB.JPG'
+++

VB6 Form
A blast from the past.
If you still have a Visual Basic 6 application in active development, you can keep servicing it for the next ten years.

[Microsoft's official stance on Visual Basic 6.0](http://msdn.microsoft.com/en-us/vstudio/ms788708) is:![A Blast from the past: VB6 Form](thumbnail-Form_vide_VB.JPG#floatright)
The Visual Basic team is committed to “It Just Works” compatibility for Visual Basic 6.0 applications on Windows Vista, Windows Server 2008 including R2, Windows 7, and Windows 8.
The Visual Basic team’s goal is that Visual Basic 6.0 applications that run on Windows XP will also run on Windows Vista, Windows Server 2008, Windows 7, and Windows 8. As detailed in this document, the core Visual Basic 6.0 runtime will be supported for the full lifetime of Windows Vista, Windows Server 2008, Windows 7, and Windows 8, which is five years of mainstream support followed [by five years of extended support](http://support.microsoft.com/gp/lifepolicy).

Yeah...I was shocked by that statement too.

Why would Microsoft want to prolong the life of of a set of development tools that were released in 1998? Are they crazy? Nope.

There are many large applications out there written in VB6 that are simply too big to take a big bang approach to porting to the C# (the only real choice for a Microsoft shop). I've personally dealt with several projects which fit into this size category. The only logical way to solve this problem while still maintaining active development is to change the tires on a moving car. Meaning add new features and fix bugs during the migration process.

Yeah, so it isn't the best approach, but new features and bug fixes are what keep the lights on in a software company.

During my experiences modernizing existing legacy applications, I've run into various types of features that would be a cinch to implement in C# but needed to be implemented today, not after the migration is complete.

Visual Basic 6 was great back in 1999, but today's applications require functionality such as localization, internationalization, parallel task processing, and stunning user experiences. Guess what? VB6 doesn't do those things very well, if at all.

No you're not screwed, not in the least bit. What is the solution? It's rather simple actually. Microsoft has spent a great deal of time implementing backwards (or depending on you perspective, forwards) compatibility via COM making sure that newer applications can still talk to legacy applications.

What we don't see too often is older applications talking to new applications.

Wait a minute. Why would anyone want to this? I thought the goal was to ditch my legacy app? Yes it is, but we still have a ton of functionality we'd like to maintain and remember, we can't halt development. The customer doesn't care that we need to migrate to C#. They care that the application gets the features and functionality they require to run their business.

## Business Objectives vs. Developer Objectives

One thing that is almost always at odds in any organization are the objectives of the business and the objectives of the development team.

Developers almost always want to use new technologies, but they usually just can't find a supporting business case to implement them.

I've heard a pitch to convert an entire ASP.Net Web Forms application to ASP.Net MVC 5.  While the argument can be made that we want to lower development costs over time by organizing our application better and removing significant amounts of technical debt, the business and it's customer base won't recognize any immediate value from the change.

A more drastic change would be rewriting your VB6 desktop application to be a modern web application. Sorry buddy, it just ain't gonna happen that way. Most applications are simply too large to migrate in a week.

From a technical perspective all of these changes make sense. Perhaps even marketing would be on board as they can now say your flagship product is written in .Net and is modern! Maybe sales would buy into the change as they can sell those paid enhancements for 20% less due to the faster time to market ushered in by lowering development complexities and overhead. The key issue is going to come from executive management. The cost associated with the above mentioned types of changes would be crazy if there wasn't a way to deliver a real value proposition to the customer.

Management's objective is to increase sales of revenue generating products and keep costs to deliver low. A migration doesn't generate revenue until you ship. Even after you ship, you'll have to deal with the headaches that exist around maintaining two separate products that essentially do the same thing. You'll have to end-of-life your legacy product and keep it alive for, uh...well, maybe a decade.

The objective of a developer is very different. Developers want to stay on the cutting edge. They want to use new technologies that make their lives easier. They want to be able to write real unit tests. They want to use a modern IDE. The developer's mind atrophies when they aren't able to put new things they learn into practice in the day to day activities. When developer brains start to deteriorate, you get crappy code, low morale, and all of your good developers **WILL** go elsewhere.

## Striking a Balance
What do you do to make both sides happy? Well, you let them implement the new features in modern technologies and weave them back into the legacy application of course.

**How have you handled migrations in your organization? Let me know in the comments.**