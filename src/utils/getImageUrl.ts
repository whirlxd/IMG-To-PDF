import { CustomImage } from "../types/custom-image";
/**
 * @description takes the file and generates a url for it to be used in the frontend
 */
const url = (file: File): Promise<CustomImage> => {
  return new Promise((resolve, reject) => {
    const image = new CustomImage(file.type);

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Error"));
    };

    image.src = URL.createObjectURL(file);
  });
};
export default url;
