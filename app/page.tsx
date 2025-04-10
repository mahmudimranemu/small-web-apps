import Link from "next/link";

export default function Home() {
  return (
    <main className='container mx-auto py-8 px-4'>
      <div className='flex gap-4'>
        <Link
          className='hover:bg-black hover:text-white py-2 px-4 rounded-md'
          href='/about'>
          About
        </Link>
        <Link
          className='hover:bg-black hover:text-white py-2 px-4 rounded-md'
          href='/propertybranding'>
          PQT Propety Branding
        </Link>
        <Link
          className='hover:bg-black hover:text-white py-2 px-4 rounded-md'
          href='/imagecrop'>
          Bulk Image Crop
        </Link>
      </div>
    </main>
  );
}
