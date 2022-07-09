/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps, Handlers } from "$fresh/server.ts";
import Navbar from '../../components/Navbar.tsx';
import Footer from '../../components/Footer.tsx';
import Content from '../../components/Content.tsx';
import { PostsType, getPosts, createObj } from '../../utils/locate.ts'

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = req.url.split('/')
    const section = url[url.length - 1]

    const posts: PostsType = await createObj()
    posts[section] = await getPosts(section);
    
    return ctx.render({ posts })
  },
};

export default function Home(props: PageProps) {
  return (
    <main class={tw`mx-auto min-w-screen min-h-screen relative`}>
      <Navbar sections={Object.keys(props.data.posts)} />
      <Content posts={props.data.posts} />
      <Footer />
    </main>
  );
}
