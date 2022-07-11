/** @jsx h */
import { h } from "preact";
import { tw } from 'twind'

export default function Footer() {
  return (
    <footer
      class={tw`bottom-0 w-full h-14 lg:px-36 md:px-20 sm:px-16 px-10 bg-gray-900 absolute flex items-center justify-center text-white font-base sm:text-base text-sm`}
    >
      Made with ❤️‍🔥 by&nbsp; <a target="_blank" href="https://github.com/Guiguerreiro39" class={tw`hover:underline font-semibold`}>Guilherme Guerreiro</a>
    </footer>
  );
}
