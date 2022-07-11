/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'
import { render } from 'gfm' 
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import { PageProps, Handlers } from "$fresh/server.ts";
import Post from "../../islands/Post.tsx";
import Navbar from '../../components/Navbar.tsx';
import Footer from '../../components/Footer.tsx';

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url).pathname.split('/')
    const file = url[2]
    const section = url[1]

    const decoder = new TextDecoder("utf-8");
    const markdown = decoder.decode(await Deno.readFile(`./posts/${section}/${file}.md`));
    const markup = render(markdown)

    const sections: string[] = []
    for await (const section of Deno.readDir("./posts")) {
      if (section.isDirectory) sections.push(section.name)
    }

    return ctx.render({ markup: markup, sections: sections})
  },
};

export default function MarkdownPost(props: PageProps) {
  return (
    <main class={tw`mx-auto w-min-screen min-h-screen relative`}>
      <Navbar sections={props.data.sections} />
      <article class={tw`lg:p-36 md:px-20 sm:px-16 px-10 py-28`}>
        <Post markup={props.data.markup} />
      </article>
      <Footer />
    </main>
  );
}
