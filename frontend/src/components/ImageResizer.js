import React, {useEffect, useState} from "react";
import Resizer from "react-image-file-resizer";

function ImageResize(props) {
    const {imageToResize, onImageResized, resizeAspect, resizeQuality} = props;

    const [imageToResizeUri, setImageToResizeUri] = useState();
    const [imageToResizeWidth, setImageToResizeWidth] = useState();
    const [imageToResizeHeight, setImageToResizeHeight] = useState();

    useEffect(() => {
        if (imageToResize) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                setImageToResizeUri(reader.result);
            });

            reader.readAsDataURL(imageToResize);
        }
    }, [imageToResize])

    useEffect(() => {
        if (imageToResize && imageToResizeWidth && imageToResizeHeight) {
            Resizer.imageFileResizer(
                imageToResize,
                100,
                100,
                "PNG",
                resizeQuality,
                0,
                (uri) => {
                    onImageResized(uri)
                },
                "base64"
            );
        }
    }, [
        imageToResize, imageToResizeWidth, imageToResizeHeight,
        onImageResized, resizeAspect, resizeQuality
    ]);
    
    return (
        <img
            src={imageToResizeUri} width="250px"
            onLoad= {(e) => {
                const img = e.target;
                console.log(img.width);
                setImageToResizeWidth(img.width);
                setImageToResizeHeight(img.height);  
            }}
            crossorigin="anonymous" // to avoid CORS-related problems
        />
    );
}

// ImageResize.defaultProps = {
//     onImageResized: () => {},
//     resizeAspect: 0.5,
//     resizeQuality: 100
// }

export default ImageResize;