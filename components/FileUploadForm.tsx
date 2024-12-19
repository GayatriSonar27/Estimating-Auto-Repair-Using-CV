"use client";
import React, { FormEvent, useState } from "react";
import CustomFileSelector from "./CustomFileSelector";
import ImagePreview from "./ImagePreview";
import axios from "axios";
import classNames from "classnames";
import ImageZoomModal from "./ImageZoomModal"; // Import the modal component

const API_BASE_URL = "http://192.168.30.132:8000/detect-defects";

const FileUploadForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState<string>("");

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = Array.from(e.target.files);
      setImages(_files);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("files", image);
    });

    try {
      setUploading(true);
      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setUploading(false);
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
      setApiResponse({ error: "Failed to detect defects." });
    } finally {
      setUploading(false);
    }
  };

  const handleProcessedPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? apiResponse.image_details.length - 1 : prevIndex - 1
    );
  };

  const handleProcessedNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === apiResponse.image_details.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = () => {
    const imageSrc = `data:image/jpeg;base64,${apiResponse.image_details[currentIndex]?.processed_image_base64}`;
    setZoomedImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <form className="w-full mb-4" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <CustomFileSelector
              accept="image/png, image/jpeg"
              onChange={handleFileSelected}
            />
            <button
              type="submit"
              className={classNames({
                "bg-sky-50 text-sky-500 hover:bg-sky-100 px-4 py-2 ml-4 rounded-md": true,
                "disabled pointer-events-none opacity-40": uploading,
              })}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        <div className="flex gap-20">
          <div className="flex-1 space-y-4">
            <div className="border p-4 rounded-md w-fit">
              <h3 className="font-semibold mb-2">Preview Images</h3>
              <ImagePreview images={images} />
            </div>

            {apiResponse && !apiResponse.error && (
              <div className="border p-4 rounded-md w-fit">
                <h3 className="font-semibold mb-2">Processed Images</h3>
                <div className="relative w-[600px] h-[400px] border rounded-md overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${apiResponse.image_details[currentIndex]?.processed_image_base64}`}
                    alt={`Processed Image ${currentIndex + 1}`}
                    className="object-contain w-full h-full cursor-pointer"
                    width={600}
                    height={400}
                    onClick={handleImageClick} // Open modal on image click
                  />
                  <div
                    onClick={handleProcessedPrev}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
                  >
                    ◀
                  </div>
                  <div
                    onClick={handleProcessedNext}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
                  >
                    ▶
                  </div>
                </div>
              </div>
            )}
          </div>

          {apiResponse && !apiResponse.error && (
            <div className="border p-4 rounded-md flex-1 h-fit">
              <h3 className="font-semibold text-lg text-gray-700 mb-2">
                Repair Summary
              </h3>
              <p>
                Total Repair Cost:{" "}
                <span className="font-bold">{apiResponse.total_repair_cost}</span>
              </p>
              <p>
                Total Defects Detected:{" "}
                <span className="font-bold">{apiResponse.total_defects}</span>
              </p>

              <h3 className="font-semibold mb-2 mt-4">Defects Table</h3>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border">Image Index</th>
                    <th className="px-4 py-2 text-left border">Part</th>
                    <th className="px-4 py-2 text-left border">Defect Type</th>
                    <th className="px-4 py-2 text-left border">Severity</th>
                    <th className="px-4 py-2 text-left border">Repair Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {apiResponse.defects.map((defect: any, index: number) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{defect.image_index}</td>
                      <td className="border px-4 py-2">{defect.part}</td>
                      <td className="border px-4 py-2">{defect.defect_type}</td>
                      <td className="border px-4 py-2">{defect.severity}</td>
                      <td className="border px-4 py-2">{defect.repair_cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Image Zoom */}
      <ImageZoomModal
        isOpen={isModalOpen}
        imageSrc={zoomedImageSrc}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FileUploadForm;



// "use client";
// import React, { FormEvent, useState } from "react";
// import CustomFileSelector from "./CustomFileSelector";
// import ImagePreview from "./ImagePreview";
// import axios from "axios";
// import classNames from "classnames";

// const API_BASE_URL = "http://192.168.30.132:8000/detect-defects";

// const FileUploadForm = () => {
//   const [images, setImages] = useState<File[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [apiResponse, setApiResponse] = useState<any>(null);

//   const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const _files = Array.from(e.target.files);
//       setImages(_files);
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData();
//     images.forEach((image) => {
//       formData.append("files", image);
//     });

//     try {
//       setUploading(true);
//       const response = await axios.post(`${API_BASE_URL}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log(response.data);
//       setUploading(false);
//       setApiResponse(response.data);
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       setApiResponse({ error: "Failed to detect defects." });
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Carousel logic for processed images
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleProcessedPrev = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? apiResponse.image_details.length - 1 : prevIndex - 1
//     );
//   };

//   const handleProcessedNext = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === apiResponse.image_details.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <>
//       <div className="flex flex-col space-y-4">
//         <form className="w-full" onSubmit={handleSubmit}>
//           <div className="flex justify-between">
//             <CustomFileSelector
//               accept="image/png, image/jpeg"
//               onChange={handleFileSelected}
//             />
//             <button
//               type="submit"
//               className={classNames({
//                 "bg-sky-50 text-sky-500 hover:bg-sky-100 px-4 py-2 ml-4 rounded-md":
//                   true,
//                 "disabled pointer-events-none opacity-40": uploading,
//               })}
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </form>

//         <div className="flex space-x-4 mt-4">
//           {/* Image Preview Section */}
//           <div className="flex-1  max-w-md">
//             <h3 className="font-semibold mb-2">Preview Images</h3>
//             <div className="border p-4 rounded-md">
//               <ImagePreview images={images} />
//             </div>
//           </div>

//           {/* API Response Section */}
//           <div className="flex-1">
//             {apiResponse && !apiResponse.error && (
//               <>
//                 {/* Statement for Total Repair Cost and Defects */}
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-lg text-gray-700">
//                     Repair Summary
//                   </h3>
//                   <p>
//                     Total Repair Cost:{" "}
//                     <span className="font-bold">
//                       {apiResponse.total_repair_cost}
//                     </span>
//                   </p>
//                   <p>
//                     Total Defects Detected:{" "}
//                     <span className="font-bold">
//                       {apiResponse.total_defects}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Defects Table */}
//                 <div className="border p-4 rounded-md">
//                   <h3 className="font-semibold mb-2">Defects Table</h3>
//                   <table className="min-w-full table-auto border-collapse">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 text-left border">
//                           Image Index
//                         </th>
//                         <th className="px-4 py-2 text-left border">Part</th>
//                         <th className="px-4 py-2 text-left border">
//                           Defect Type
//                         </th>
//                         <th className="px-4 py-2 text-left border">Severity</th>
//                         <th className="px-4 py-2 text-left border">
//                           Repair Cost
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {apiResponse.defects.map((defect: any, index: number) => (
//                         <tr key={index}>
//                           <td className="border px-4 py-2">
//                             {defect.image_index}
//                           </td>
//                           <td className="border px-4 py-2">{defect.part}</td>
//                           <td className="border px-4 py-2">
//                             {defect.defect_type}
//                           </td>
//                           <td className="border px-4 py-2">
//                             {defect.severity}
//                           </td>
//                           <td className="border px-4 py-2">
//                             {defect.repair_cost}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Processed Images */}
//                 <div className="mt-4">
//                   <div className="flex-1  max-w-md">
//                     <h3 className="font-semibold mb-2">Processed Images</h3>
//                     <div className="relative w-96 h-60 border rounded-md overflow-hidden">
//                       <img
//                         src={`data:image/jpeg;base64,${apiResponse.image_details[currentIndex]?.processed_image_base64}`}
//                         alt={`Processed Image ${currentIndex + 1}`}
//                         className="object-contain w-full h-full"
//                         width={400}
//                         height={400}
//                       />
//                       {/* Navigation Controls for Processed Images */}
//                       <div
//                         onClick={handleProcessedPrev}
//                         className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
//                       >
//                         ◀
//                       </div>
//                       <div
//                         onClick={handleProcessedNext}
//                         className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white rounded-full p-2 cursor-pointer hover:bg-gray-700"
//                       >
//                         ▶
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {apiResponse && apiResponse.error && (
//               <p className="text-red-500">{apiResponse.error}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FileUploadForm;
