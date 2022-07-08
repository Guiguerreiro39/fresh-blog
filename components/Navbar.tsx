/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'
import { createObj } from '../utils/locate.ts'

export default function Navbar() {
  const posts = createObj()

  return (
    <nav
      class={tw`top-0 w-full h-20 px-36 bg-gray-900 absolute flex items-center gap-10`}
    >
      <a href="/" class={tw`text-white border-none my-0 mr-10 text-2xl hover:text-red-400`}>GG's Blog</a>
      {Object.keys(posts).map((section) => (
        <a href={`/${section}`} class={tw`text-white my-0 capitalize text-lg hover:text-red-400`}>
          {section}
        </a>
      ))}
    </nav>
  );
}
