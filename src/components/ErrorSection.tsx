interface Props {
  readonly title?: string;
  readonly text?: string;
}

export default function ErrorSection(props: Props) {
  return (
    <section className="w-full bg-red-50">
      <h1>{props.title}</h1>
      <p>{props.text}</p>
    </section>
  );
}
