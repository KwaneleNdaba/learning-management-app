declare module "react-filepond" {
    import * as React from "react";
  
    export interface FilePondProps {
      // You can add more specific prop types if needed.
      [key: string]: any;
    }
  
    export const FilePond: React.FC<FilePondProps>;
  
    export function registerPlugin(...args: any[]): void;
  }
  