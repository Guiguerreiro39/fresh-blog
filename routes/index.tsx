/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import Content from '../components/Content.tsx';
import { Posts, getPosts, createObj } from '../utils/locate.ts'

export default function Home() {
  const posts: Posts = createObj();
  for (const dir of Object.keys(posts)) {
    posts[dir] = getPosts(dir);
  }

  return (
    <main class={tw`mx-auto min-w-screen min-h-screen relative`}>
      <Navbar />
      <Content posts={posts} />
      <Footer />
    </main>
  );
}
