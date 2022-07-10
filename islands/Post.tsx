/** @jsx h */
import { h } from "preact";
import { useRef, useLayoutEffect } from "preact/hooks";

interface PostProps {
  markup: string;
}

export default function Post(props: PostProps) {
  const el = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (el.current) {
      el.current.innerHTML = props.markup
    }
  })

  return (
    <div class="markdown-body" ref={el} ></div>
  );
}
