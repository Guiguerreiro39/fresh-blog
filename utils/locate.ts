export type PostsType = {
  [key: string]: [PostType?];
};

type PostType = {
  url: string, 
  title: string, 
  date: Date | null | string
}

export async function createObj() {
  const obj: PostsType = {};
  for await (const dir of Deno.readDir("./posts")) {
    if (dir.isDirectory) obj[dir.name] = [];
  }

  return obj;
}

export async function getPosts(dir: string) {
  const posts: [PostType?] = [];

  for await (const post of Deno.readDir(`./posts/${dir}`)) {
    const path = `./posts/${dir}/${post.name}`;
    const { birthtime } = await Deno.stat(path);
    const file = await Deno.readTextFile(path);
    const firstLine = file.split("\n")[0];

    if (post.isFile) {
      const payload = {url: post.name.split(".md")[0], title: firstLine.slice(2, firstLine.length), date: birthtime}
      posts.push(payload);
    }
  }

  return posts;
}