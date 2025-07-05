import { ImageSource } from "@/types/utils";

const assetMap: { [key: string]: any } = {
  "espresso.jpg": require("@/assets/images/items-images/espresso.jpg"),
  "Cappuccino.jpg": require("@/assets/images/items-images/Cappuccino.jpg"),
  "Latte.jpg": require("@/assets/images/items-images/Latte.jpg"),
 "cake.jpg": require("@/assets/images/items-images/cake.jpg"),
};


/**
 * Helper function to get image source from different types of image paths
 * @param imagePath - The image path (can be local asset path, filename, or remote URL)
 * @returns Image source object or null if no valid source found
 */
export const getImageSource = (imagePath: string): ImageSource => {
  if (!imagePath) return null;

  // Check if it's a local asset path
  if (imagePath.includes("@/assets/images/")) {
    const filename = imagePath.split("/").pop() || "";
    return assetMap[filename] || null;
  }

  // Check if it's a direct filename
  if (assetMap[imagePath]) {
    return assetMap[imagePath];
  }

  // Check if it's a remote URL
  if (imagePath.startsWith("http")) {
    return { uri: imagePath };
  }

  return null;
};
