import React from "react";

interface ImageZoomModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}



const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageSrc}
          alt="Zoomed Image"
          className="object-contain max-w-full max-h-full"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl bg-black rounded-full p-2"
        >
          X
        </button>
       
      </div>
    </div>
  );
};

export default ImageZoomModal;
