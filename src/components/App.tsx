import {
  useState,
  ChangeEventHandler,
  useCallback,
  FC,
  useEffect,
  useReducer,
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
      //@ts-ignore:next-line
      if (files?.length < 30) {
        const fileArray = files ? Array.from(files) : [];
        const finalFiles = fileArray.map(getImageUrl);

        Promise.all(finalFiles).then((newImages) =>
          setUploadedImages((oldImages) => [...oldImages, ...newImages])
        );
      } else {
        swal.fire({
          icon: "info",
          title: "Oops...",
          text: "You can only make a pdf out of 30 images at a time!\n Next time select less than 30 images.",
          showCancelButton: false,
          confirmButtonText: "Aight!",
        });
      }
    },
    [setUploadedImages]
  );

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
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
    if (uploadedImages.length > 30) {
      let extraImages = uploadedImages.length - 30;
      return swal.fire({
        icon: "info",
        title: "Oops...",
        text:
          "You can only make a pdf out of 30 images at a time!\nPlease remove " +
          extraImages +
          " image(s) to proceed.",
        showCancelButton: false,
        confirmButtonText: "Aight!",
      });
    }

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
        if (result.value !== undefined) {
          setPdfName(result.value);
          setGenerated(true);
          const blb: string = pdf(
            // @ts-ignore:next-line
            uploadedImages,
            "bloburl",
            false
          );
          setDownloadUrl(blb);
        }
      });
  }, [uploadedImages]);
  const removeImages = useCallback(
    (img: any) => {
      const localCopyOfUI = uploadedImages;
      const index = localCopyOfUI.indexOf(img);
      if (index > -1) {
        return localCopyOfUI.splice(index, 1);
      }
      setUploadedImages(localCopyOfUI);
      return forceUpdate();
    },
    [uploadedImages, setUploadedImages]
  );

  return (
    <div className="">
      {uploadedImages.length >= 1 ? (
        <>
          <h1 className="text-3xl font-bold text-center text-white md:text-4xl">
            Images Uploaded:
          </h1>
        </>
      ) : (
        <></>
      )}

      <div className="">
        <section className="container content-center  mx-auto bg-2a2e38 dark:bg-gray-800">
          <div className="flex justify-evenly items-right ">
            <div className="grid grid-flow-cols grid-cols-0 grid-rows-auto   mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {uploadedImages.length >= 1 ? (
                uploadedImages.map((image) => (
                  <div className="w-full content-start  items-center text-center image">
                    <img
                      className="object-cover object-center  hover:opacity-75 rounded-lg  m-2 mx-2"
                      src={image.src}
                      key={image.src.toUpperCase()}
                      alt={"image"}
                      width={170}
                      height={170}
                    />

                    <button
                      className="font-black text-2xl tracking-wide text-teal-900 transition duration-200  shadow-md hover:text-deep-purple-900 bg-red-accent-200 hover:bg-deep-purple-accent-200 focus:shadow-outline focus:outline-none px-6 py-2 mt-6  leading-5 text-center  capitalize  rounded-lg  md:mx-0 md:w-auto"
                      onClick={() => removeImages(image)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </section>
      </div>
      {uploadedImages.length == 0 ? (
        <>
          <h1 className="text-3xl font-bold text-center text-white md:text-4xl ">
            No image selected
          </h1>{" "}
          <br></br>
          <br></br>
        </>
      ) : (
        <></>
      )}

      <div className="flex justify-center items-center ">
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
