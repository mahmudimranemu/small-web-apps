"use client";

import ImageCrop from "@/components/image-crop";
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

export default function BulkImageCrop() {
  return (
    <main className='container mx-auto py-8 px-4'>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-3xl'>Bulk Image Crop</CardTitle>
          <CardDescription>Upload bulk images and resize them</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageCrop />
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
