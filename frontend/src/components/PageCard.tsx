import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export default function PageCard({ title, description, children }: Props) {
  return (
    <div className="page-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <div style={{ marginTop: "18px" }}>{children}</div>
    </div>
  );
}