import React, { useState } from "react";
import Image from "next/image";

type Props = {
  images: File[];
};

const ImagePreview = ({ images }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      {images.length > 0 ? (
        <div className="relative w-[600px] h-[400px] border rounded-md overflow-hidden">
          <Image
            src={URL.createObjectURL(images[currentIndex])}
            alt={images[currentIndex]?.name || "Uploaded Image"}
            className="object-contain w-full h-full"
    width={600}
    height={400}
          />
          {/* Navigation Controls */}
          <div
            onClick={handlePrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2  text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
          >
            ◀
          </div>
          <div
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2  text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
          >
            ▶
          </div>
        </div>
      ) : (
        <p>No images to preview</p>
      )}
    </>
  );
};

export default ImagePreview;
