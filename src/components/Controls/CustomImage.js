import React from "react";
import Image from 'material-ui-image';

export const CustomImage = (props) => {
  const { src, aspectRatio, ...other } = props;
  return (
      <Image
        src={src}
        aspectRatio={aspectRatio}
        {...other}
      />
  );
};
