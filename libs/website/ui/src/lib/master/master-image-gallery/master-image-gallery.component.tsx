import styles from './master-image-gallery.module.scss';
import { Image } from '@dark-rush-photography/website/types';
import { useImageIndex } from '@dark-rush-photography/website/util';
import ImageGallery from '../../common/image-gallery/image-gallery.component';

interface Props {
  images: Array<Image>;
  width: number;
  height: number;
}

export default function MasterImageGallery({
  images,
  width, //380; // 175   //TODO: Get correct width for this
  height, //300; // 215
}: Props): JSX.Element {
  const { imageIndex, displayImage } = useImageIndex();

  return (
    <div className={styles['container']}>
      <ImageGallery
        images={images}
        imageIndex={imageIndex}
        width={width}
        height={height}
        autoPlay={false}
        displayImage={displayImage}
      />
    </div>
  );
}