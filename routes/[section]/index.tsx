/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import Navbar from '../../components/Navbar.tsx';
import Footer from '../../components/Footer.tsx';
import Content from '../../components/Content.tsx';
import { Posts, getPosts } from '../../utils/locate.ts'

export default function Home(props: PageProps) {
  const posts: Posts = {}
  posts[props.params.section] = getPosts(props.params.section);

  return (
    <main class={tw`mx-auto min-w-screen min-h-screen relative`}>
      <Navbar />
      <Content posts={posts} />
      <Footer />
    </main>
  );
}
