/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'
import { Marked } from "markdown";
import { PageProps, Handlers } from "$fresh/server.ts";
import Post from "../../islands/Post.tsx";
import Navbar from '../../components/Navbar.tsx';
import Footer from '../../components/Footer.tsx';

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = req.url.split('/')
    const file = url[url.length - 1]
    const section = url[url.length - 2]

    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(await Deno.readFile(`./posts/${section}/${file}.md`));
    const markup = Marked.parse(markdown)

    const sections: string[] = []
    for await (const section of Deno.readDir("./posts")) {
      if (section.isDirectory) sections.push(section.name)
    }

    return ctx.render({ markup: markup?.content, sections: sections})
  },
};

export default function MarkdownPost(props: PageProps) {
  return (  
    <main class={tw`mx-auto w-min-screen min-h-screen relative`}>
      <Navbar sections={props.data.sections} />
      <article class={tw`p-36`}>
        <Post markup={props.data.markup} />
      </article>
      <Footer />
    </main>
  );
}
