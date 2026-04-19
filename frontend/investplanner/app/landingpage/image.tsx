import Image from "next/image";

export default function LandingImage() {
  return (
    <Image
      className="rounded-md shadow-black-2000 w-[85%] md:w-full h-auto"
      src="/image.png"
      alt="Landing Page Image"
      width={1200}
      height={600}
    />
  );
}