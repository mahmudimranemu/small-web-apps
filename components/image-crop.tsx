import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import NextImage from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImagePlus } from "lucide-react";

const ImageCrop = () => {
  const [images, setImages] = useState<File[]>([]);
  const [maxFileSize, setMaxFileSize] = useState<number>(2); // Default max size in MB
  const [width, setWidth] = useState<number>(300); // Default crop width
  const [height, setHeight] = useState<number>(300); // Default crop height

  const onDrop = (acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  };

  const handleCropAndCompress = async () => {
    const zip = new JSZip();

    for (const image of images) {
      const croppedImage = await cropAndResizeImage(image);
      if (croppedImage) {
        zip.file(croppedImage.name, croppedImage);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "cropped-images.zip");
    });
  };

  const cropAndResizeImage = (file: File): Promise<File | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image(); // Correct way to create an image element
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            console.error("Failed to get canvas context");
            resolve(null);
            return;
          }

          // Set canvas size to the desired crop dimensions
          canvas.width = width;
          canvas.height = height;

          // Calculate cropping area (center crop)
          const aspectRatio = img.width / img.height;
          const targetAspectRatio = width / height;

          let cropWidth, cropHeight, cropX, cropY;

          if (aspectRatio > targetAspectRatio) {
            // Image is wider than target aspect ratio
            cropHeight = img.height;
            cropWidth = cropHeight * targetAspectRatio;
            cropX = (img.width - cropWidth) / 2;
            cropY = 0;
          } else {
            // Image is taller than target aspect ratio
            cropWidth = img.width;
            cropHeight = cropWidth / targetAspectRatio;
            cropX = 0;
            cropY = (img.height - cropHeight) / 2;
          }

          // Draw the cropped and resized image onto the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            width,
            height
          );

          // Convert the canvas to a Blob and create a new File
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                });

                // Check file size against maxFileSize
                if (resizedFile.size / 1024 / 1024 <= maxFileSize) {
                  resolve(resizedFile);
                } else {
                  alert(
                    `File ${file.name} exceeds the max file size of ${maxFileSize} MB.`
                  );
                  resolve(null);
                }
              } else {
                console.error("Failed to create Blob from canvas");
                resolve(null);
              }
            },
            file.type,
            0.8 // Adjust quality for compression
          );
        };

        img.onerror = () => {
          console.error("Failed to load image");
          resolve(null);
        };

        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };

      reader.onerror = () => {
        console.error("Failed to read file");
        resolve(null);
      };

      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept only image files
  });

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Upload Images</h3>
        <div className='flex flex-col gap-4'>
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #cccccc",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}>
            <input {...getInputProps()} />
            <ImagePlus className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
            <p>Drag & drop images here, or click to select files</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {images.map((image, index) => (
              <div
                key={index}
                style={{ textAlign: "center" }}>
                <NextImage
                  width={200}
                  height={200}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  style={{
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                {/* <p style={{ fontSize: "12px", wordBreak: "break-word" }}>
                  {image.name}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* <label>
          Max File Size (MB):
          <input
            type='number'
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(Number(e.target.value))}
          />
        </label> */}
      </div>
      <div className='flex flex-col gap-8'>
        <div className='flex gap-4'>
          <label>
            Width:
            <Input
              type='number'
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label>
            Height:
            <Input
              type='number'
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
        </div>

        <Button onClick={handleCropAndCompress}>Crop and Download</Button>
      </div>
    </div>
  );
};

export default ImageCrop;
