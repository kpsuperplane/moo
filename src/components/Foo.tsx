import React from "react";

export default function Foo(props: { children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #000", padding: 5 }}>
      <strong>Foo Component</strong>
      <br />
      {props.children}
    </div>
  );
}
