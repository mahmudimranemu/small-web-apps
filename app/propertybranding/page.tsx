"use client";

import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Undo2 } from "lucide-react";
import Link from "next/link";

export default function PropertyBranding() {
  return (
    <main className='container mx-auto py-8 px-4'>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-3xl'>
            PQT Property Image Branding
          </CardTitle>
          <CardDescription>
            Upload property images to resize them to 1080x1080px and add PQT
            branding frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader />
        </CardContent>
        <CardFooter>
          <Link href='/'>
            <Button
              variant='outline'
              className='w-full'>
              <Undo2 /> Back
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
