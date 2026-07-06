interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

const JsonLd = ({ data }: JsonLdProps) => {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default JsonLd;
