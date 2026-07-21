'use client';

import { Button, Image } from 'antd';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UploadWidget = ({ imageUrl }: { imageUrl: (url: string) => void }) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const { t } = useTranslation();

  return (
    <div className="p-4 border rounded-lg w-full">
      <CldUploadWidget
        options={{
          maxFiles: 1,
          publicId: imgUrl || undefined,
          resourceType: 'image',
          clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        onSuccess={(result: any) => {
          const secureUrl = result?.info?.secure_url;
          setImgUrl(secureUrl);
          imageUrl(secureUrl);
        }}
      >
        {({ open }) => {
          return (
            <Button
              onClick={() => open()}
              type={imgUrl ? 'primary' : 'dashed'}
              className="w-full h-full flex items-center justify-center"
            >
              {imgUrl ? t('Change Image') : t('Upload Image')}
            </Button>
          );
        }}
      </CldUploadWidget>

      {imgUrl && (
        <div className="mt-4 w-full">
          <Image src={imgUrl} style={{ objectFit: 'contain' }} alt="Preview" className="!w-full h-auto rounded" />
        </div>
      )}
    </div>
  );
}