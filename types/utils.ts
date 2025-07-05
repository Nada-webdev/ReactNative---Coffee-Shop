// Image source types for the getImageSource utility function
export type ImageSource =
  | {
      uri: string;
    }
  | number
  | null;

// Utility function return type
export type GetImageSourceFunction = (imagePath: string) => ImageSource;
