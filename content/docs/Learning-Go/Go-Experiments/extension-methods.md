---
title: "Extension Methods"
date: 2022-02-09T20:20:32Z
# description: "" # Used by description meta tag, summary will be used instead if not set or empty.
layout: docs
type: docs
featured: true
draft: false
comment: true
toc: true
reward: true
pinned: false
categories:
- Go
- Learning
- Experiments
tags:
- Go
series:
- Learning Go


---
C# has [Extension Methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods), which allow you to add methods to existing types, regardless of where they are defined by you or in a third-party assembly.

Go has [receiver methods](https://golangdocs.com/methods-in-golang), which are functions that are called on a value of a specific type. The type has to be defined within your package, and the receiver is the value that is being passed to the method.

I wanted to accomplish a similar behavior in Go. 

Check out the repo here: [https://github.com/ElanHasson/go-experiments-kinda-extension-methods](https://github.com/ElanHasson/go-experiments-kinda-extension-methods).

I figured out how to creating a `struct` of the `struct` I wanted to extend.

There is one caveat here: You must implement all methods the *base* `struct` has, even if they are empty, otherwise if you call it, you'll get a runtime panic.

```go {linenos=table, hl_lines=[],linenostart=1}
package main

import (
	"fmt"

	"github.com/ElanHasson/go-experiments/common"
)

type SomethingElse common.Something

func (m *SomethingElse) DoSomething() {
	fmt.Println("somethingElse.DoSomething()")
}

func (m *SomethingElse) DoNothing() {
	fmt.Println("somethingElse.DoNothing()")
}

func main() {
	something := common.Something{Name: "Hello"}

	somethingElse := SomethingElse(something)

	somethingElse.DoSomething()
	somethingElse.DoNothing()

	fmt.Printf("something: %v\n", something)
	fmt.Printf("somethingElse: %v\n", somethingElse)
}
```