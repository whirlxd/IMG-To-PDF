import {
  useState,
  ChangeEventHandler,
  useCallback,
  FC,
  useEffect,
} from "react";
import { CustomImage } from "../types/custom-image";
import getImageUrl from "../utils/getImageUrl";
import GithubCorner from "react-github-corner";
import "../css/App.css";
//@ts-ignore:next-line cuz pkg gae
import swal from "sweetalert2/dist/sweetalert2.all.min.js";

import pdf from "images-to-pdf-package"; /*--> yes my package */

const App: FC = () => {
  const [uploadedImages, setUploadedImages] = useState<CustomImage[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<String>("not empty at all");
  const [generated, setGenerated] = useState<Boolean>(false);

  const handleImageUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const fileList = event.target.files;

      const fileArray = fileList ? Array.from(fileList) : [];
      const fileToImagePromises = fileArray.map(getImageUrl);

      Promise.all(fileToImagePromises).then((newImages) =>
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
          'You can click <b><a href="' +
          downloadUrl +
          '" download>here</a></b> to download it or <b><a href="' +
          downloadUrl +
          '" target="_blank">here</a></b> to preview it :)',
        confirmButtonText: "Alright",
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
  }, [downloadUrl]);

  const generatePdf = useCallback(() => {
    setGenerated(true);
    const blb: string = pdf(
      // @ts-ignore:next-line

      uploadedImages,
      "bloburi",
      false
    );
    setDownloadUrl(blb);
  }, [uploadedImages]);

  return (
    <div>
      <GithubCorner
        href="https://whirl.codes"
        bannerColor="#FFFFFF"
        octoColor="#2a2e38"
      />
      {uploadedImages.length >= 1 ? (
        <h1 className="text-3xl font-bold text-center text-white md:text-4xl">
          Images Uploaded:
        </h1>
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
              <span className="px-6 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 md:mx-0 md:w-auto focus:outline-none">
                Upload More Images
              </span>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className="px-6 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 md:mx-0 md:w-auto focus:outline-none">
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
            className="text-center px-6 py-2 mt-6 text-sm font-medium leading-5  text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 md:mx-0 md:w-auto focus:outline-none"
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
 * Work on the PWA[android & ios version] => ❌
 */
export default App;
