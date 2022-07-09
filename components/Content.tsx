/** @jsx h */
import { h } from "preact";
import { tw } from "twind"
import { PostsType } from '../utils/locate.ts'

interface ContentProps {
  posts: PostsType;
}

export default function Content(props: ContentProps) {
  return (
    <section class={tw`px-36 py-32 space-y-4`}>
      <p class={tw`opacity-50 font-semibold`}>
        Total of{" "}
        {Object.values(props.posts).map((p) => p.length).reduce(
          (a: number, b: number) => a + b,
          0,
        )} posts
      </p>
      <div class={tw`flex flex-wrap items-center gap-5`}>
        {Object.entries(props.posts).map(([key, value]) =>
          value.map((post) => {
            return (
              <a
                href={`/${key}/${post?.url}`}
                class={tw
                  `bg-white w-80 h-96 rounded shadow-md overflow-hidden cursor-pointer relative`}
              >
                <img
                  class={tw`h-1/2 w-full cover`}
                  src={`${post?.url}.jpg`}
                  alt={post?.title}
                />
                <div class={tw`my-4 mx-3 space-y-4`}>
                  <span
                    class={tw
                      `border border-red-500 rounded-sm text-red-500 px-2 py-1 opacity-60 capitalize`}
                  >
                    {key}
                  </span>
                  <h3 class={tw`border-none capitalize`}>
                    {post?.title}
                  </h3>
                  <p
                    class={tw
                      `absolute bottom-1 left-0 mx-2 text-xs text-black opacity-40`}
                  >
                    By&nbsp;
                    <span class={tw`font-semibold`}>Guilherme Guerreiro</span>
                    <span class={tw`mx-2`}>•</span>
                    {post?.date?.toDateString()}
                  </p>
                </div>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
}
