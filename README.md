# **Triggered Browser Animations**

Configure and trigger HTML/CSS/JS based animations in the browser, e.g. for a browser source in streaming software.## **Table of contents**

<hr>

## **Table of contents**

- [**Triggered Browser Animations**](#triggered-browser-animations)
    - [**Table of contents**](#table-of-contents)
    - [**Installation**](#installation)
    - [**Example**](#example)
        - [**index.js**](#indexjs)
        - [**animations/scripts/main.js**](#animationsscriptsmainjs)
        - [**animations/index.html**](#animationsindexhtml)
        - [**animations/html/text.html**](#animationshtmltexthtml)
        - [**Run it**](#run-it)
    - [**FAQ**](#faq)
        - [**How can I add CSS and videos?**](#how-can-i-add-css-and-videos)
        - [**How can I autoplay a video?**](#how-can-i-autoplay-a-video)
        - [**How can I hide the animation after the video is over?**](#how-can-i-hide-the-animation-after-the-video-is-over)
        - [**How to have the animation fullscreen?**](#how-to-have-the-animation-fullscreen)
        - [**My audio/video works fine in the browser but not in OBS as browser source. What can I do?**](#my-audiovideo-works-fine-in-the-browser-but-not-in-obs-as-browser-source-what-can-i-do)

<hr>

## **Installation**

Be sure to have Node.js 12.0.0 or higher installed on your system.

Installation is done using the npm install command:

`$ npm install triggered-browser-animations`

Furthermore, you need express and socket.io installed:

`$ npm install express`
`$ npm install socket.io`

<hr>

## **Example**

In the following there is a minimal example shown to trigger an animation.

### **index.js**

In the index.js the server is started and we configure to trigger a simple animation three seconds after the client connects.

```javascript
// Create the express/http/socket.io stack:
const express = require('express')();
const http = require('http').createServer(express);
const io = require('socket.io')(http);

// Instanciate an Animator with the created express and socket.io instances:
const Animator = require('triggered-browser-animations');
const animator = new Animator(express, io);

// Start the server:
http.listen(8080);

// On a connection, wait three seconds, then play the animation:
io.on(
    'connect',
    () =>
    {
        setTimeout(
            () =>
            {
                animator.play(
                    {
                        html: '/animations/html/text.html', // The URL to the animations's HTML file.
                        tokens: {
                            text: 'It works!', // This is the text that will be displayed in the animation.
                        }
                    }
                );
            },
            3000
        );
    }
);
```

### **animations/scripts/main.js**

This is the client script. It simply instantiates the AnimationClient and runs it after the document has been loaded. \
The parameter given to the client is the container element (here: the document body) the animation will be played in.

```javascript
document.addEventListener('DOMContentLoaded', onDocumentLoaded, false);

const animationClient = new AnimationClient();

function onDocumentLoaded ()
{
    animationClient.run(document.body);
}
```

### **animations/index.html**

This is the main HTML file that loads all needed scripts and provides the body as a container for the animations.

```html
<html>
    <head>
        <meta charset="utf-8">

        <title>My Animations</title>

	    <script src="/socket.io/socket.io.js"></script> <!-- The socket.io dependency -->
	    <script src="/animations/client/animationClient.js"></script> <!-- The client script for the AnimationClient class -->
        <script src="scripts/main.js"></script> <!-- Our main script in that the animation client is instantiated. -->
    </head>
    <body>
    </body>
</html>
```

### **animations/html/text.html**

At last, the simplest animation possible: A configurable text. \
Tokens are names surrounded by two courly braces on each side. They will be automatically replaced with the given strings in the
animation object as shown in the index.js above.

```html
<p>{{text}}</p>
```

### **Run it**

Run the application with `node .` inside your project folder. \
Now navigate to `http://localhost:8080/animations` with your browser. After three seconds you should see the text "It works!" appear.

<hr>

## **FAQ**

### **How can I add CSS and videos?**

Simply put them in your animations folder and link them in your HTML.

For example:

```html
<link rel="stylesheet" href="/animations/css/video.css">
<video src="{{video}}" autoplay="true"></video>
```

### **How can I autoplay a video?**

Use the autplay attribute of the video tag:

```html
<video src="{{video}}" autoplay="true" onended="document.body.innerHTML = '';"></video>
```

### **How can I hide the animation after the video is over?**

You can embed Javascript via events and there empty the animation container:

```html
<video src="{{video}}" autoplay="true" onended="document.body.innerHTML = '';"></video>
```

If you need more Javascript, you can write your own library in Javascript files, link them in your index.html and call its functions
inside the element events.

### **How to have the animation fullscreen?**

Add this to the head of your index.html:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">

<link rel="stylesheet" type="text/css" href="css/index.css">
```

And put this into animations/css/index.css:
```css
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
}
```

### **My audio/video works fine in the browser but not in OBS as browser source. What can I do?**

Browsers sometimes support more encodings than the rendering library used in OBS. Try to use supported formats. These are typically free
ones like OGG (for audio) and webm (for video).
