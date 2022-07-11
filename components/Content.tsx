/** @jsx h */
import { h } from "preact";
import { tw } from "twind"
import { PostsType } from '../utils/locate.ts'

interface ContentProps {
  posts: PostsType;
}

export default function Content(props: ContentProps) {
  return (
    <section class={tw`lg:px-36 lg:py-32 px-20 py-28 space-y-4`}>
      <p class={tw`opacity-50 font-semibold`}>
        Total of{" "}
        {Object.values(props.posts).map((p) => p.length).reduce(
          (a: number, b: number) => a + b,
          0,
        )} posts
      </p>
      <div class={tw`flex flex-wrap items-center lg:justify-start justify-center gap-5`}>
        {Object.entries(props.posts).map(([key, value]) =>
          value.map((post) => {
            return (
              <a
                href={`/${key}/${post?.url}`}
                class={tw
                  `bg-white lg:w-80 w-full h-96 rounded shadow-md overflow-hidden cursor-pointer relative flex lg:block`}
              >
                <img
                  class={tw`lg:h-1/2 h-full lg:w-full w-1/2 bg-cover bg-center`}
                  src={`/thumbnails/${post?.url}.jpg`}
                  alt={post?.title}
                />
                <div class={tw`my-4 mx-3 space-y-4`}>
                  <span
                    class={tw
                      `border border-red-500 rounded-sm text-red-500 px-2 py-1 opacity-60 capitalize`}
                  >
                    {key}
                  </span>
                  <h3 class={tw`lg:text-lg xs:text-3xl text-2xl capitalize`}>
                    {post?.title}
                  </h3>
                  <p
                    class={tw
                      `absolute bottom-1 lg:left-0 right-0 mx-2 text-xs text-black opacity-40`}
                  >
                    By&nbsp;
                    <span class={tw`font-semibold`}>Guilherme Guerreiro</span>
                    <span class={tw`mx-2`}>•</span>
                    {
                      typeof(post?.date) === "string" ?  new Date(post.date).toDateString() : post?.date?.toDateString()
                    }
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
