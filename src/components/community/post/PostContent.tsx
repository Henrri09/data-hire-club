interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
  );
}