/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'

type NavbarProps = {
  sections: string[]
}

export default function Navbar(props: NavbarProps) {
  return (
    <nav
      class={tw`top-0 w-full h-20 lg:px-36 md:px-20 sm:px-16 px-10 bg-gray-900 absolute flex items-center gap-10`}
    >
      <a href="/" class={tw`text-white border-none my-0 mr-10 text-2xl hover:text-red-400`}>
        <img src="/title.png" alt="GG'Blog" class={tw`h-8 w-auto`}/>
      </a>
      {props.sections.map((section) => (
        <a href={`/${section}`} class={tw`text-white my-0 capitalize text-lg hover:text-red-400 hidden md:block`}>
          {section}
        </a>
      ))}
    </nav>
  );
}
