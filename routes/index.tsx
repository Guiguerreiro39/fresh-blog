/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { config } from 'dotenv'
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import Content from '../components/Content.tsx';
import { PostsType, getPosts, createObj } from '../utils/locate.ts'

export const handler: Handlers = {
  async GET(_, ctx) {
    const posts: PostsType = await createObj();

    for (const dir of Object.keys(posts)) {
      posts[dir] = await getPosts(dir);

      for (const post of posts[dir]) {
        if(post && !post.date)
          try {
            const res = await fetch(`${config()['GITHUB_API_URL']}?path=posts/${dir}/${post?.url}.md`)
            const payload = await res.json()
            post.date = payload[0].commit.author.date
          } catch(err) {
            console.error(err)
          }
        }
      
    }

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
