import Link from "next/link";

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const CTACard = ({
  title,
  description,
  buttonText,
  buttonLink,
}: CTACardProps) => {
  return (
    <div className="not-prose my-20 w-full border border-gray-500 rounded-md p-6 flex flex-col items-center">
      <div className="text-center text-blue-500 text-3xl font-bold mb-2">
        {title}
      </div>

      <div className="text-center text-muted-foreground mb-8">
        {description}
      </div>

      <Link
        href={buttonLink}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        {buttonText}
      </Link>
    </div>
  );
};
