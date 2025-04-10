"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

export function ImageUploader() {
  const [images, setImages] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [frame, setFrame] = useState<File | null>(() => {
    const defaultImageUrl = "/default-frame.png"; // Replace with your default image path
    fetch(defaultImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const defaultFile = new File([blob], "default-image.png", {
          type: blob.type,
        });
        setFrame(defaultFile);
      })
      .catch((error) => console.error("Error loading default image:", error));
    return null;
  });
  const [processing, setProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrame(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeLogo = () => {
    setLogo(null);
  };

  const removeFrame = () => {
    setFrame(null);
  };

  const processImages = async () => {
    if (!frame || images.length === 0) return;
    setProcessing(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // const logoImg = await createImageBitmap(logo);
      // const logoWidth = 200; // Adjust logo size as needed
      // const logoHeight = (logoWidth * logoImg.height) / logoImg.width;

      const frameImg = await createImageBitmap(frame);
      const frameWidth = 1080; // Adjust frame size as needed
      const frameHeight = 1080;

      const zip = new JSZip(); // Create a new ZIP instance

      for (const image of images) {
        const img = await createImageBitmap(image);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw main image
        ctx.drawImage(img, 0, 0, 1080, 1080);

        // Draw frame
        ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);

        // Convert to blob and download
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        );

        // Add the blob to the ZIP file
        const arrayBuffer = await blob.arrayBuffer();
        zip.file(`PQT-${image.name}`, arrayBuffer);
      }
      // Generate the ZIP file and trigger download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "PQT-images.zip";
      a.click();
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Error processing images:", error);
    }

    setProcessing(false);
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Upload Images</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {images.map((image, index) => (
            <div
              key={index}
              className='relative group'>
              <div className='aspect-square rounded-lg border-2 border-dashed overflow-hidden'>
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className='object-cover'
                  fill
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
          <label className='aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors'>
            <div className='text-center'>
              <ImagePlus className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Add Images</span>
            </div>
            <Input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className='flex gap-4'>
        {/* <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Upload Logo</h3>
          {logo ? (
            <div className='relative inline-block group'>
              <div className='h-32 w-32 rounded-lg border-2 border-dashed overflow-hidden'>
                <Image
                  src={URL.createObjectURL(logo)}
                  alt='Logo'
                  className='object-contain'
                  fill
                />
              </div>
              <button
                onClick={removeLogo}
                className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                <X className='h-4 w-4' />
              </button>
            </div>
          ) : (
            <label className='h-32 w-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors'>
              <div className='text-center'>
                <ImagePlus className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Add Logo</span>
              </div>
              <Input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleLogoUpload}
              />
            </label>
          )}
        </div> */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Upload Frame</h3>
          {frame ? (
            <div className='relative inline-block group'>
              <div className='h-32 w-32 rounded-lg border-2 border-dashed overflow-hidden'>
                <Image
                  src={URL.createObjectURL(frame)}
                  alt='Frame'
                  className='object-contain'
                  fill
                />
              </div>
              <button
                onClick={removeFrame}
                className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                <X className='h-4 w-4' />
              </button>
            </div>
          ) : (
            <label className='h-32 w-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors'>
              <div className='text-center'>
                <ImagePlus className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Add Frame</span>
              </div>
              <Input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFrameUpload}
              />
            </label>
          )}
        </div>
      </div>

      <Button
        onClick={processImages}
        disabled={!frame || images.length === 0 || processing}
        className={cn("w-full", processing && "opacity-50 cursor-not-allowed")}>
        <Upload className='mr-2 h-4 w-4' />
        {processing ? "Processing..." : "Process Images"}
      </Button>
    </div>
  );
}
