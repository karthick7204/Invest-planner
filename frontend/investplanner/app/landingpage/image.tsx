import Image from "next/image";

export default function LandingImage() {
  return (
    <Image
      className="rounded-2xl shadow-black-2000"
      src="/landingImage.png"
      alt="Landing Page Image"
      width={1200}
      height={600}
    />
  );
}