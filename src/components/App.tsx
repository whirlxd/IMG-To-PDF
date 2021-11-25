import {
  useState,
  ChangeEventHandler,
  useCallback,
  FC,
  useEffect,
} from "react";
import { CustomImage } from "../types/custom-image";
import getImageUrl from "../utils/getImageUrl";
import { saveAs } from "file-saver";

import "../css/App.css";
//@ts-ignore:next-line cuz pkg gae
import swal from "sweetalert2/dist/sweetalert2.all.min.js";

import pdf from "images-to-pdf-package";

const App: FC = () => {
  const [uploadedImages, setUploadedImages] = useState<CustomImage[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("not empty at all");
  const [generated, setGenerated] = useState<Boolean>(false);
  const [pdfName, setPdfName] = useState<String>("generated-with-itp");
  const handleImageUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const files = e.target.files;

      const fileArray = files ? Array.from(files) : [];
      const finalFiles = fileArray.map(getImageUrl);

      Promise.all(finalFiles).then((newImages) =>
        setUploadedImages((oldImages) => [...oldImages, ...newImages])
      );
    },
    [setUploadedImages]
  );

  const cleanUpUploadedImages = useCallback(() => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
    setTimeout(() => {
      setDownloadUrl("");
    }, 700);
  }, [setUploadedImages, uploadedImages, setDownloadUrl]);
  useEffect(() => {
    if (!downloadUrl.includes("blob")) {
      return;
    }

    swal
      .fire({
        title: "Generated The PDF",
        icon: "success",
        html:
          '(just click outside to proceed)<br><br><b> <a class="inline-flex items-center justify-center h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded shadow-md hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-deep-purple-accent-100  focus:outline-none" href="' +
          downloadUrl +
          '" download="' +
          pdfName +
          '" target="_blank"">Download</a></b>  <b><a class="inline-flex items-center justify-center h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded shadow-md hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-deep-purple-accent-100  focus:outline-none" href="' +
          downloadUrl +
          '" target="_blank">Preview</a></b>',
        confirmButtonText: "Alright",
        showConfirmButton: false,
      })
      .then(() => {
        swal
          .fire({
            title: "Clear Uploaded Images?",
            text: "You won't be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yeah, delete them!",
            cancelButtonText: "Nah, i'd like to keep em!",
          })
          .then((result: any) => {
            if (result.isConfirmed) {
              swal.fire(
                "Cleared!",
                "Your uploaded images have been cleared!",
                "success"
              );
              cleanUpUploadedImages();
              setGenerated(false);
            } else if (result.dismiss === swal.DismissReason.cancel) {
              swal.fire(
                "Cancelled",
                "Your files have <b>not</b> been deleted!",
                "error"
              );
              setGenerated(false);
            }
          });
      });
    setGenerated(false);
  }, [downloadUrl, pdfName]);

  const generatePdf = useCallback(() => {
    swal
      .fire({
        title: "What should be the file name?",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Yeah That's Fine!",
        showLoaderOnConfirm: true,
        preConfirm: (res: any) => {
          if (res.length == 0 || res.length > 20) {
            swal.showValidationMessage(
              "File Name must be between 1 and 20 characters long"
            );
          }
        },
      })
      .then((result: any) => {
        setPdfName(result.value);
        setGenerated(true);
        const blb: string = pdf(
          // @ts-ignore:next-line
          uploadedImages,
          "bloburl",
          false
        );
        setDownloadUrl(blb);
      });
  }, [uploadedImages]);

  return (
    <div>
      {uploadedImages.length >= 1 ? (
        <>
          <br></br>
          <h1 className="text-3xl font-bold text-center text-white md:text-4xl">
            Images Uploaded:
          </h1>
        </>
      ) : (
        <></>
      )}

      <div className="flex justify-center items-center ">
        {uploadedImages.length >= 1 ? (
          uploadedImages.map((image) => (
            <section className="container content-center  mx-auto bg-2a2e38 dark:bg-gray-800">
              <div className="flex items-center content-center justify-center">
                <div className="grid place-items-center  grid-flow-col grid-cols-auto mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <div className="w-full content-start max-w-xs text-center">
                    <img
                      className="object-cover object-center  mx-auto rounded-lg"
                      src={image.src}
                      key={image.src.toUpperCase()}
                      alt={"image"}
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))
        ) : (
          <></>
        )}
      </div>
      {uploadedImages.length == 0 ? (
        <>
          <br></br>
          <h1 className="text-3xl font-bold text-center text-white md:text-4xl">
            No image selected
          </h1>{" "}
          <br></br>
          <br></br>
        </>
      ) : (
        <></>
      )}
      <div>
        <label htmlFor="file-input">
          {uploadedImages.length >= 1 ? (
            <div className="flex justify-center items-center">
              <span className="tracking-wide text-teal-900 transition duration-200  shadow-md hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-deep-purple-accent-100 focus:shadow-outline focus:outline-none px-6 py-2 mt-6 text-sm font-medium leading-5 text-center  capitalize  rounded-lg  md:mx-0 md:w-auto ">
                Upload More Images
              </span>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className="tracking-wide text-teal-900 transition duration-200  shadow-md hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-deep-purple-accent-100 focus:shadow-outline focus:outline-none px-6 py-2 mt-6 text-sm font-medium leading-5 text-center  capitalize  rounded-lg  md:mx-0 md:w-auto ">
                Upload Images
              </span>
            </div>
          )}
          <input
            style={{ opacity: 0 }}
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {uploadedImages.length >= 1 && !generated ? (
        <div className="flex justify-center items-center">
          <button
            className="text-center px-6 hover:text-deep-purple-900 hover:bg-deep-purple-accent-100 py-2 mt-6 text-sm font-medium leading-5  text-white capitalize bg-blue-600 rounded-lg  md:mx-0 md:w-auto focus:outline-none"
            onClick={generatePdf}
          >
            Generate Pdf
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
/**
 * @ROADMAP -
 * Work on consuming the images => ✔️
 * Work on generating the pdf => ✔️
 * Work on downloading and previewing the pdf => ✔️
 * Work on the Visual Styles ( CSS ) => ✔️
 * Work on the PWA[android & ios version] => ✔️
 */
export default App;
