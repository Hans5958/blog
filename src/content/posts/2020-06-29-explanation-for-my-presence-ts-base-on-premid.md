---
title: Explanation for my presence.ts base on PreMiD
date: 2020-06-29 09:26 +0000
category: Article
tags: en programming project
slug: explanation-for-my-presence-ts-base-on-premid
description: Hello, and welcome to my explanation for my base/template on presence.ts. You might be wondering either how this works or why this thing complicated. In this explanation text, I will guide you how I came with the base that I made, and consequently, solve this systematic problem that a lot of developers do, as I could say.
excerpt: In this text, I will guide you how I came with the base that I made, and consequently, solve this systematic problem that a lot of developers do, as I could say.
redirectFrom: 
  - /2020/06/29/explanation-for-my-presence-ts-base-on-premid
---
This was originally written for someone on an open source project, PreMiD, and it was published [here](https://github.com/Hans5958/PreMiD-Presences-Personal/blob/master/%23%20Docs/explanation-for-base.md). Context probably not needed, but if you want, check out [this repository](https://github.com/PreMiD/Presences) and check the ``presence.ts`` files, and [this documentation](https://docs.premid.app/en/dev/).

----

Hello, and welcome to my explanation for my base/template on ``presence.ts``. You might be wondering either how this works or why this thing complicated. In this explanation text, I will guide you how I came with the base that I made, and consequently, solve this systematic problem that a lot of developers do, as I could say.

Now, keep in mind, the problem is not quite a big deal, as the overhead will be small (in fact, it could be tiny), but I just wanted to see if I could make an optimized code, because I wanted to avoid having those small overhead makes my poor laptop laggy, and because I genuinely bored and wanted to do something. 

## Initial problem

So, as I said, there's a "systematic" problem on some ``presence.ts`` that a lot of developers made. But, to know the problem, we need to see how the aforementioned developers did it.

Here's the "average" base that some developers do on ``presence.ts``. Let's assume that we're only checking two pages.
1. A dynamic page, which includes a video, and when changing into a new video, the page won't reload, but the contents and the URL changed.
2. A static page, which includes a login page.

```ts
var presence = new Presence({
	clientId: "000000000000000000",
})

var browsingStamp = Math.floor(Date.now() / 1000)

presence.on("UpdateData", async () => {
	
	var presenceData: presenceData = {
			details: <string> "Viewing an unsupported page",
			state: <string> undefined,
			largeImageKey: <string> "lg",
			startTimestamp: <number> browsingStamp,
			endTimestamp: <number> undefined
		}

	if (// it is a dynamic page) {
		presenceData.details = "Viewing a video"
		presenceData.state = document.getQuerySelector(".videoTitle").textContent
	} else if (// it is a static page) {
		presenceData.details = "Logging in"
	} // and so on...

})

```

Now, there are some problems. The ``presenceData`` keeps being declared/resetted. 

This is fine for the dynamic page, because having the script overwrites the old ``presenceData`` values is not a good idea, but it's not fine for the static page, because it needs to set the ``presenceData`` value, even nothing has changed. 

There must be a way so only the dynamic page script runs every time, but not the static page script.

That being said, we need to make a "handler" that does two different script, for the static pages and for the dynamic pages. Also, the "handler" needs to know if the script is for the dynamic pages or not. Hence, another "handler".

## Part 1: The Update Function Handler

Firstly, we need to make a handler for functions that needs to run recursively. Perfect for dynamic pages that needs to do something more than once.

Here's the handler that I come with. It's not exactly a callback, but that's what I made few months ago.

```ts
var updateCallback = {
	_function: null,
	get function() {
		return this._function;
	},
	set function(parameter){
		this._function = parameter
	},
	get present() {
		return this._function !== null
	}
}
```

This handler does three things.
1. ``updateCallback.function = () => {}`` sets the function to be updated recursively
2. ``updateCallback.function()`` executes the defined function.
3. ``updateCallback.present()`` returns a boolean if there is a update function that defined. This is to differentiate the dynamic pages and the static pages.

On the main script, let's put our dynamic function into the handler.

```ts
if (// it is a dynamic page) {
	updateCallback.function = () => {
		presenceData.details = "Viewing a video"
		presenceData.state = document.getQuerySelector(".videoTitle").textContent
	}
} else if (// it is a static page) {
	presenceData.details = "Logging in"
} // and so on...
```

All set, now let's move into the the second part.

## Part 2: Handler for ``presence.on("UpdateData")``

Next, let's make the handler that runs recursively for every moment PreMiD asks for a data update.

Here's what I come up with.

```ts
if (updateCallback.present) {
	presence.on("UpdateData", async () => {
		currentURL = new URL(document.location.href),
		currentPath = currentURL.pathname.slice(1).split("/"),
		presenceData = {
			details: <string> "Viewing an unsupported page",
			state: <string> undefined,
			largeImageKey: <string> "lg",
			startTimestamp: <number> browsingStamp,
			endTimestamp: <number> undefined
		};
		updateCallback.function()
		presence.setActivity(presenceData)
	})
} else {
	presence.on("UpdateData", async () => {
		presence.setActivity(presenceData)
	})
}
```

The way this handler works is as follows.

1. If the update function is present, which is going to be true if it's a dynamic page, reset ``presenceData`` values and some others, run the update function (which writes the new values to the resetted ``presenceData``), and finally set the activity using the updated ``presenceData`` values.
2. If it returns false, which is for the static pages, just set activity to the already configured  ``presenceData`` values every single time.

Now, I could do that as it is, but I will seperate the lines that related to resetting values into a single function, ``resetData()``.

```ts
if (updateCallback.present) {
	presence.on("UpdateData", async () => {
		resetData()
		updateCallback.function()
		presence.setActivity(presenceData)
	})
} else {
	presence.on("UpdateData", async () => {
		presence.setActivity(presenceData)
	})
}

function resetData() {
	currentURL = new URL(document.location.href),
	currentPath = currentURL.pathname.slice(1).split("/"),
	presenceData = {
		details: <string> "Viewing an unsupported page",
		state: <string> undefined,
		largeImageKey: <string> "lg",
		startTimestamp: <number> browsingStamp,
		endTimestamp: <number> undefined
	}
}
```

## Finish it up

After having both handlers, let's merge both of them into our ``presence.ts`` template. Note that I put declared ``presenceData`` once, on the top.

```ts
var presence = new Presence({
	clientId: "000000000000000000",
})

var presenceData: presenceData = {
		details: <string> "Viewing an unsupported page",
		state: <string> undefined,
		largeImageKey: <string> "lg",
		startTimestamp: <number> browsingStamp,
		endTimestamp: <number> undefined
	},
	updateCallback = {
		_function: null,
		get function() {
			return this._function;
		},
		set function(parameter){
			this._function = parameter
		},
		get present() {
			return this._function !== null
		}
	};

if (// it is a dynamic page) {
	updateCallback.function = () => {
		presenceData.details = "Viewing a video"
		presenceData.state = document.getQuerySelector(".videoTitle").textContent
	}
} else if (// it is a static page) {
	presenceData.details = "Logging in"
} // and so on...

if (updateCallback.present) {
	presence.on("UpdateData", async () => {
		resetData()
		updateCallback.function()
		presence.setActivity(presenceData)
	})
} else {
	presence.on("UpdateData", async () => {
		presence.setActivity(presenceData)
	})
}

function resetData() {
	currentURL = new URL(document.location.href),
	currentPath = currentURL.pathname.slice(1).split("/"),
	presenceData = {
		details: <string> "Viewing an unsupported page",
		state: <string> undefined,
		largeImageKey: <string> "lg",
		startTimestamp: <number> browsingStamp,
		endTimestamp: <number> undefined
	}
}
```

As we can see, the problems that we found has been solved. The ``presenceData`` values is being resetted the only time that we need (which is for dynamic pages), and the static page script only run once and the handler *handles* the rest, by setting the same values again and again.

Tidy up some things, such as adding some variables such as ``currentURL`` and ``currentPath``, informations regarding to our functions, here's the final template.

```ts
var presence = new Presence({
	clientId: "000000000000000000",
})

var currentURL = new URL(document.location.href),
	currentPath = currentURL.pathname.slice(1).split("/"),
	browsingStamp = Math.floor(Date.now() / 1000), 
	presenceData: presenceData = {
		details: <string> "Viewing an unsupported page",
		state: <string> undefined,
		largeImageKey: <string> "lg",
		startTimestamp: <number> browsingStamp,
		endTimestamp: <number> undefined
	},
	updateCallback = {
		_function: null,
		get function() {
			return this._function;
		},
		set function(parameter){
			this._function = parameter
		},
		get present() {
			return this._function !== null
		}
	};

(() => { 

	if (// it is a dynamic page) {
		updateCallback.function = () => {
			presenceData.details = "Viewing a video"
			presenceData.state = document.getQuerySelector(".videoTitle").textContent
		}
	} else if (// it is a static page) {
		presenceData.details = "Logging in"
	} // and so on...

})()

if (updateCallback.present) {
	presence.on("UpdateData", async () => {
		resetData()
		updateCallback.function()
		presence.setActivity(presenceData)
	})
} else {
	presence.on("UpdateData", async () => {
		presence.setActivity(presenceData)
	})
}

/**
 * Initialize/reset presenceData.
 */
function resetData() {
	currentURL = new URL(document.location.href),
	currentPath = currentURL.pathname.slice(1).split("/"),
	presenceData = {
		details: <string> "Viewing an unsupported page",
		state: <string> undefined,
		largeImageKey: <string> "lg",
		startTimestamp: <number> browsingStamp,
		endTimestamp: <number> undefined
	}
}
```

So, there we have it. that's how I made my base/template script, that is optimized and systematically made. Hope you can learn something related to coding, especially optimizing code, or problem solving in general.
