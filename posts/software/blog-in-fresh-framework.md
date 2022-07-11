# I've made a Blog using the Fresh Framework
Web development frameworks have been around for a while now, and they help solve many difficulties that would be hard to surpass if we were to make web applications using nothing but HTML templates or vanilla javascript but, it also seems that a new framework appears every week which promises the world and more. Well, **Fresh framework** is something like that, but with a tiny twiste which makes it interesting to try out.

In a nutshell, **Fresh framework** is a full-stack web framework that considers itself *"The next-gen web framework"* with some neat features:

- Just-in-time rendering
- Island based client hydration
- Zero runtime overhead
- No build step
- No configuration
- TypeScript support

What makes it even more interesting is that it was made by **Deno** so, obviously, is running on top of it. I'm not going too much in detail about what **Deno** is but consider it the faster replacement for **Node.js** which also promises a bunch of stuff.

If you're interested in finding more about these two I'll leave you with some links you can check out later:
- **Fresh Framework**: https://fresh.deno.dev/
- **Deno**: https://deno.land/

## Creating the Blog
I've decided to take up the challenge and build a markdown blog using this new framework. In order to make such blog, I had two things in mind right from the start:

1. I must be able to read markdown files directly from my filesystem.
2. I must be able to parse the markdown text into HTML elements.

To start the project I've followed the standard procedure shown in the **Fresh** website. Simply have **Deno CLI** installed and run `deno run -A -r https://fresh.deno.dev my-blog`, choose your configuration and... *puff!* a project is created. Now navigate to the root folder of the project and run `deno task start`. You have now a **Fresh Framework** project up and running! 

This comes with some code examples you can go through but, essentially, you must be aware of two folders it creates: *routes* and *islands*. These folders are the essence of **Fresh** and you should know what they do:

- ***routes***: this is where you structure your code and create your routes. Basically, the name of every file you create in this folder is going to be a route path. So, if you create a file called *"blog.tsx"*, the code displayed in there will the accessible through the path *https://localhost:8000/blog*. The same happens with the folders inside, if you have a folder called *api* and a file named *jokes.ts* inside of it, you can access it through the path *https://localhost:8000/api/jokes*. To make dynamic routes simply have your file or folder name inside *[]* and access the parameter using *props.params.[name]*.
- ***islands***: this is where you store your code that requires javascript to run. So, all code that must be changed or manipulated during the usage of your page must go in here. What **Fresh** does special is that it only uses javascript when compiling your project for the code you have inside of this folder, the rest of it that is inside of the *routes* folder is rendered as a pure HTML template.

Ok, let's get ready for some coding shall we?

### Folder structure
You can make your blog anyway you want, as long as you can read files and parse markdown you are good to go! But, if you want to follow my example, you can have your folders structure. There are more files on my project but I just want to display the most important ones:

```
├── routes
│   ├── [section]
│   │   ├── [title].tsx
|   |   ├── index.tsx
│   ├── index.tsx
├── islands
│   ├── Post.tsx
├── components
│   ├── Content.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
├── styles
│   ├── main.css
├── posts
│   ├── section
│   ├── ├── post.md
├── utils
│   ├── locate.ts
│   ├── twind.ts
```

### Reading files
**Deno** does not use your typical **Node.js** modules so, obviously, reading files will be a bit different as well. Fortunately, **Deno** makes it easy by providing these functions straight out of the box using the built-in module `Deno`.

Since I created sections for my posts, I must first know the sections and, afterwards, read the files inside each one. My idea was to create an object with all the information I needed and pass it through the *props* directly into my page. The object looks something like this:

```
{
  <section>: [
    {
      url: <string>
      title: <string>
      date: <Date | string>
    },
    ...
  ],
  ...
}
```
Where *section* is the name of my folders, *url* the name of my files, *title* the first *h1* tag of the file and *date* the creation date of the file. I use this object to display all my posts in my home page.

To read the directories inside of my *posts* folder I've used the `Deno.readDir` function and created a function to store them in an object and initialize each of them with an empty array.

```ts
/* locate.ts */

export async function createObj() {
  const obj: PostsType = {};
  for await (const dir of Deno.readDir("./posts")) {
    if (dir.isDirectory) obj[dir.name] = [];
  }

  return obj;
}
```

Afterwards, I must go through each of these sections and actually store the file information in the array. To do this I've used the previous function to scafold the directory but also `Deno.readFile` to read the file and `Deno.stat` to get some of the file's information such as *birthtime*. I've created a function that returns an object array for each of the sections.

```ts
/* locate.ts */

export async function getPosts(dir: string) {
  const posts: [PostType?] = [];

  for await (const post of Deno.readDir(`./posts/${dir}`)) {
    const path = `./posts/${dir}/${post.name}`;
    const { birthtime } = await Deno.stat(path);
    const file = await Deno.readTextFile(path);
    const firstLine = file.split("\n")[0];

    if (post.isFile) {
      const payload = {url: post.name.split(".md")[0], title: firstLine.slice(2, firstLine.length), date: birthtime}
      posts.push(payload);
    }
  }

  return posts;
}
```

You must use *async await* with these functions because, although **Deno** provides a synchrousnous way for each of these, when deploying it complains about them.

### Parse the markdown
First objective accomplished! Now it's time for the final one which is parsing the markdown text into HTML elements. To do this, **Deno** has a nice module library called *gfm*. To use it, change your *import_map.json* file and add an extra line `"gfm": "https://deno.land/x/gfm@0.1.22/mod.ts"`. You can now import this module on any file with `import * as gfm from "gfm"`.

I must parse the markdown before the page renders so, I've used a *middleware handler* for this. 

```ts
/* [title].tsx */

/** @jsx h */
import { h } from "preact";
import { PageProps, Handlers } from "$fresh/server.ts";
import { render } from "gfm";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url).pathname.split('/')
    const file = url[2]
    const section = url[1]

    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(await Deno.readFile(`./posts/${section}/${file}.md`));
    const markup = render(markdown)

    return ctx.render({ markup: markup })
  },
};
```

In essence, I fetch my section and file name through my url, read the file which is located in the path `./posts/${section}/${file}.md` and decode it using the `TextDecoder`. I then parse the markdown into HTML string using the `render` function. I then render the page using `ctx.render` with the generated string inside as an object `{ markup: markup }`. You can then retrieve this content in your page by using `props.data.markup`.

```ts
/* [title].tsx */

export default function MarkdownPost(props: PageProps) {
  return (  
    <main>
      <article>
        <Post markup={props.data.markup} />
      </article>
    </main>
  );
}
```

You can see in the code above that I'm using a component inside of the *article* tag. Well, this is my only *island* component and I must do this because, unfortunately, **Fresh** does not provide (or at least does not explain how to do it) a way to insert HTML elements into my page before rendering, so I must use some DOM manipulation to change my HTML string into actual elements.

```ts
/* Post.tsx */

/** @jsx h */
import { h } from "preact";
import { useRef, useLayoutEffect } from "preact/hooks";

interface PostProps {
  markup: string;
}

export default function Post(props: PostProps) {
  const el = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (el.current) {
      el.current.innerHTML = props.markup
    }
  })

  return (
    <div data-color-mode="light" data-light-theme="light" data-dark-theme="dark" class="markdown-body" ref={el} ></div>
  );
}
```

In this file, I'm using the `useRef` hook to get the *div* element and the `useLayoutEffect` to manipulate that element before the page renders and insert my HTML string inside of the element's *innerHTML* which, luckely, takes a string. This will insert all of my markdown generated HTML inside of the *div* element I have my *ref* on.

### Displaying all of my posts in the Home page
I now have my posts being shown on their specific url but how about selecting which post to go? In your `index.tsx` file, create a new handler to run some code before rendering the page. In here, we will create our *posts* object using the functions we previously coded inside our `locate.ts` file.

```ts
/* index.tsx */

/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { PostsType, getPosts, createObj } from '../utils/locate.ts'

export const handler: Handlers = {
  async GET(_, ctx) {
    const posts: PostsType = await createObj();

    for (const dir of Object.keys(posts)) {
      posts[dir] = await getPosts(dir);
    }

    return ctx.render({ posts });
  },
};
```

We created our object with our sections using the `createObj` function and then, for each section, we fetched the posts using the `getPosts` function. We send this newly created object to our page using the `ctx.render`. Now we want to go through every post and display it on the screen.

```
/* index.tsx */

export default function Home(props: PageProps) {
  return (
    <main>
      <Content posts={props.data.posts} />
    </main>
  );
}
```

```ts
/* Content.tsx */

/** @jsx h */
import { h } from "preact";
import { tw } from "twind"
import { PostsType } from '../utils/locate.ts'

interface ContentProps {
  posts: PostsType;
}

export default function Content(props: ContentProps) {
  return (
    <section>
      <div>
        {Object.entries(props.posts).map(([key, value]) =>
          value.map((post) => {
            return (
              <a href={`/${key}/${post?.url}`}>
                <div>
                  <span>{key}</span>
                  <h3>{post?.title}</h3>
                </div>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
}
```

We go through every entry on our object, and map through the *value* array to display the section and title of the post. We then use an *a* tag to navigate to the desired post by giving it the path `/${key}/${post?.url}`.

All done! Now you have your home page displaying all posts and a page for each post displaying the content of your markdown!

### Styling
I won't go through how I've styled my blog (you can check it out in my source code if you want) but I must go through a basic thing among web frameworks that **Fresh** made a bit harder to find which is: importing a *.css* file into our pages. I wanted to style my markdown background color and other useful content so I got a stylesheet. But, unfortunately, you can't just do `import "./styles/markdown.css"` in your code. The easiest way I found was to change the `main.ts` file and add a few extra lines to it. Note that I'm using the `twin` module but you could do this without it as well.

In here, I'm also importing `CSS` from `gfm` module to style my markdown elements. This loads the necessary styles into my page.

```ts
/* main.ts */

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { InnerRenderFunction, RenderContext, start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import { config, setup } from "@twind";
import { CSS } from 'gfm'
import { virtualSheet } from "twind/sheets";

const sheet = virtualSheet();
sheet.reset();
setup({ ...config, sheet });

const stylesheet = await Deno.readTextFile("./styles/markdown.css");

function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target, CSS, stylesheet);
  const newSnapshot = sheet.reset();
  ctx.state.set("twind", newSnapshot);
}
```

First I must read the file as text using `Deno.readTextFile` and store it in a constant. Afterwards, I must send it in the `ctx.styles` alongside the rest of the styles.

## Performance
What **Fresh** really does well it's boosting performance and I've checked that through Google's Lighthouse extension which generates a report with all these metrics tested.

![image](https://user-images.githubusercontent.com/11543544/178141264-d00becaa-f5a1-404a-a0b6-42acf33cee2f.png)

As you can see, the performance is at 100%, which is pretty good if you ask me!

## Final review of Fresh
This framework provides some cool concepts that are definetely interesting and aim to solve some of the performance issues other frameworks have but it lacks in other aspects:

- **Poor documentation**: I know it's a very new framework and therefore we should not expect it to have as much of a documentation and community guidance as other more popular frameworks but the official documentation lacks information in several aspects, making the developer search by itself or just randomly trying out things without any knowledge of the outcome.
- **Reuse of components**: I'm sure there must be a way to do this but, sometimes we want to have a template loaded for everypage which can contain things like a *navbar* or *footer* but **Fresh** does not provide us this and, if it does, is very well hidden and, again, not documented.
- **Deno modules**: some people might hate me for this but **Deno** modules are definetely not as strong, at the moment, as **Node.js** ones which makes it harder to develop a web applications with them.
- **Styles**: not being able to import a stylesheet is a big downside. I had to go through some search before I could figure out how to actually do this an, even so, I don't think I'm doing a really good job with it but, *hey!*, it works!
- **Page Refresh**: because it compiles your code into pure HTML, it also means your pages must reload when switching url. Although one-page web applications are slower in terms of performance, the flow it provides afterwards is *refreshing*. 

Overall, **Fresh framework** has a long way to go in order to fight against more popular full-stack frameworks and definetely needs some improvements in the above issues or, at least, give us the documentation to know how to surpass them!

1. Would I use it to build big web applications? - **No**
2. Is it easy to pick-up? - **Yes**
3. Would I use it to build simple websites? - **Depends on the dependencies**

If you want to explore more, check out my source code: https://github.com/Guiguerreiro39/fresh-blog

The blog is deployed with **Deno Deploy** at https://gg-blog.deno.dev/ but proxied to my own domain at https://blog.guilhermegr.com.

That's all for now! ***See ya!***
