+++
title = "Do Developers Still Care About Hardware Resources? Do their managers?"
date = 2014-05-14T13:25:00Z
# description = "" # Used by description meta tag, summary will be used instead if not set or empty.
featured = false
draft = true
comment = true
toc = true
reward = true
pinned = false
aliases = ["/2014/05/do-developers-still-care-about-hardware.html"]
categories = [
  "Performance",
  "Random Thoughts"
]
tags = [
  "Carelessness"
]
series = [
  ""
]
images = ["LowOnMemory.png"]
+++
A few minutes ago I was presented with this dialog box:

![Close programs to prevent information loss - low on memory](LowOnMemory.png#center "Scary dialog box that popped up.")


At first I thought it may have been one of those [adware](http://en.wikipedia.org/wiki/Adware) apps that makes some claim about the health of your computer in a thinly veiled attempt to extract some cash out of me. After a a moment of looking to see what spawned that dialog box and a bit of Googling, I determined [it was real](http://windows.microsoft.com/en-us/windows/preventing-low-memory-problems).

![Task Manager shows Maxed out RAM](MemoryUsage.png#floatright "Task Manager shows Maxed out RAM")]
This was most definitely not a false alarm!

I was a bit late to the game with regards to having a high memory ceiling. Prior to three years ago all of my workstations only had 8GB of RAM. I've since upgraded all of them to have 16GB of RAM and it's been really great. I've been loving it. I'm able to do so much more at once. Have hundreds of tabs open in Chrome. Everything just zips along nicely.

As you can imagine, not having had to deal with hardware resource constraints has been super awesome.

This event got me thinking about the way we build software. When I started writing code it was on a Toshiba Satellite Pro 420 CDS: 100 MHZ and 16 MB of RAM. Every byte and cycle counted. To put it into perspective of where we are today in terms of hardware, you could not play an MP3 file on that laptop while doing ANYTHING else. Today it seems most everyone is playing YouTube videos while they are "working".

In a perfect world, everyone wants to write code that is the model of efficiency and optimization, but there is a cost to it.

The Costs of Being Awesome
--------------------------

It takes a lot of effort to build software. It takes even more work to make that software [performant](http://en.wiktionary.org/wiki/performant). In my experience working with software developers with various backgrounds I was very shocked to find most of them have no idea how to profile the performance of their applications. A significant number of them didn't even know what a profiler is. **This is scary snapshot of our industry.**
What are some of the reasons for this? Well, I think it has to do with management of the organizations in which they have worked at throughout their careers.

I believe this to be a consequence of what I like to call the *hurry up and ship* approach to managing application development. This approach is spring-loaded with praise and reward for speeding up the development process in such infamous ways such as leaving documentation for "later", low balling estimates and making the team work overtime to meet deadlines that were committed to by project managers, skipping unit tests, trimming test cases out of the test plan, not performing regression tests, not profiling your product for performance issues and countless other anti-practices This topic alone warrants a post of it's own.

While the intentions aren't nefarious, they are detrimental both to the morale of the team and the health and success of your product. As ~~a development manager, team lead, team member, project manager, Scrum master, CTO, COO, CEO, investor, director~~ someone involved in software development **YOU** need to understand that if these practices are happening in your organization then you're doing it wrong.

The point is, you think you're saving time (and therefore money) by getting your product shipped faster, you're actually mortgaging your future. You'll be paying down the technical debt incurred by poor implementations of hastily designed solutions. You'll see your defects and enhancements start to cost more in terms of effort.

When it comes to *hurry up and ship*, the lowest priority is usually performance testing. Most applications built don't run in a high volume environment and their developers suffer from the "oh we don't need to test for load, we're a small app" mentality. In organizations like this, performance is an afterthought, as in, it's thought about when a performance issue is reported. Then it's forgotten again...until the next customer complains, or a server goes down, or your customers move on to a competitor's product.

I'm not specifically talking about load testing. That has it's own benefits, like identifying concurrency issues or knowing when you'll need to invest in additional hardware as your user base grows. I'm talking about identifying memory leaks from resources you forgot to release and just overall making your apps run faster by identifying where the bottlenecks in your code are.

> "Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We *should* forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%."
>
> -- [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth), [Structured Programming with Goto Statements](http://web.archive.org/web/20130731202547/http://pplab.snu.ac.kr/courses/adv_pl05/papers/p261-knuth.pdf)

I'm not advocating the optimization of everything, just find that 3% and fix it. Before you release and before it becomes an issue. The longer the issue is in your code base, the greater the chance more code will depend on it in one way or another. Ultimately, this will increase the costs associated with remediation.

At the end of the day, this stuff is expensive. The tooling, the time to identify the issues, the acquisition and retention resources with the skills to find and correct these issues all cost money. All of that money pales in comparison to the costs associated with cutting corners.

**What are some of the experiences you've had in places you've worked around (not) profiling and *hurry up and ship*?**