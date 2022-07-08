/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'
import { Marked } from "markdown";
import { PageProps } from "$fresh/server.ts";
import Post from "../../islands/Post.tsx";
import Navbar from '../../components/Navbar.tsx';
import Footer from '../../components/Footer.tsx';

export default function MarkdownPost(props: PageProps) {
  const decoder = new TextDecoder("utf-8");
  const markdown = decoder.decode(Deno.readFileSync(`./posts/${props.params.section}/${props.params.title}.md`));
  const markup = Marked.parse(markdown)

  return (  
    <main class={tw`mx-auto w-min-screen min-h-screen relative`}>
      <Navbar />
      <article class={tw`p-36`}>
        <Post markup={markup?.content} />
      </article>
      <Footer />
    </main>
  );
}
