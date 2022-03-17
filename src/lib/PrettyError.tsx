import React from "react";

export default function PrettyError({ error }: { error: Error }) {
  return (
    <article>
      <h2>{error.name}</h2>
      <aside>
        <pre>{error.message}</pre>
      </aside>
      <details>
        <summary>Stacktrace</summary>
        <pre>{error.stack}</pre>
      </details>
    </article>
  );
}
