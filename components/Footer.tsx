/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'

export default function Footer() {
  return (
    <footer
      class={tw`bottom-0 w-full h-14 px-36 bg-gray-900 absolute flex items-center justify-center text-white`}
    >
      Made with ❤️‍🔥 by&nbsp; <a target="_blank" href="https://github.com/Guiguerreiro39" class={tw`hover:underline`}>Guilherme Guerreiro</a>
    </footer>
  );
}
