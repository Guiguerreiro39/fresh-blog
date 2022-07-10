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
    <div data-color-mode="light" data-light-theme="light" data-dark-theme="dark" class="markdown-body" ref={el} ></div>
  );
}
