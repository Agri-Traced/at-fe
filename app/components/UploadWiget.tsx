'use client';
import { Image } from 'antd';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UploadWidget = ({ imageUrl }: { imageUrl: (url: string) => void }) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const { t } = useTranslation();

  return (
    <div className="p-4 border rounded-lg">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        onSuccess={(result: any) => {
          const secureUrl = result?.info?.secure_url;
          setImgUrl(secureUrl);
          imageUrl(secureUrl);
        }}
      >
        {({ open }) => {
          return (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => open()}
            >
              {t('Upload Image')}
            </button>
          );
        }}
      </CldUploadWidget>

      {imgUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">{t('Uploaded Image')}</p>
          <Image src={imgUrl} alt="Preview" className="w-48 h-auto rounded" />
        </div>
      )}
    </div>
  );
}