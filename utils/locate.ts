export type Posts = {
  [key: string]: [string?];
};

export function createObj() {
  const obj: Posts = {};
  for (const dir of Deno.readDirSync("./posts")) {
    if (dir.isDirectory) obj[dir.name] = [];
  }

  return obj;
}

export function getPosts(dir: string) {
  const posts: [string?] = [];
  for (const post of Deno.readDirSync(`./posts/${dir}`)) {
    if (post.isFile) posts.push(post.name.split(".md")[0]);
  }

  return posts;
}