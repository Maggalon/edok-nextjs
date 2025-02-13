import QRCodeStyling, { Options } from "qr-code-styling";
import { useState, useRef, useEffect } from "react";


export const QRCode: React.FC<{data: string}> = ({ data }) => {

    const [options, setOptions] = useState<Options>({
        width: 300,
        height: 300,
        type: 'svg',
        data: data,
        // image: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        // imageOptions: {
        //   hideBackgroundDots: true,
        //   imageSize: 0.4,
        //   margin: 20,
        //   crossOrigin: 'anonymous',
        //   saveAsBlob: true,
        // },
        dotsOptions: {
          color: '#7c3aed',
          type: 'rounded'
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#7c3aed'
        }
    });

    const [qrCode, setQrCode] = useState<QRCodeStyling>();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQrCode(new QRCodeStyling(options));
    }, [])

    useEffect(() => {
        if (ref.current) {
        qrCode?.append(ref.current);
        }
    }, [qrCode, ref]);

    useEffect(() => {
        if (!qrCode) return;
        qrCode?.update(options);
    }, [qrCode, options]);

    return (
        <div ref={ref} />
    )
}