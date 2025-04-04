import Link from "next/link";

export default function Home() {
  return (
    <main className='container mx-auto py-8 px-4'>
      <Link href='/about'>About</Link>
      <Link href='/propertybranding'>
        PQT Propety Image Branding and Resized
      </Link>
    </main>
  );
}
