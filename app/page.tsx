import FileUploadForm from "@/components/FileUploadForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex min-h-full m-8">
        <FileUploadForm />
      </div>
      <Footer />
    </>
  );
}
