import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { socket } from '../App';

export function Login() {
    const [qrCode, setQrCode] = useState<string | null>(null);

    useEffect(() => {
        function onQr(qr: string) {
            setQrCode(qr);
        }

        socket.on('qr', onQr);

        return () => {
            socket.off('qr', onQr);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Connect WhatsApp</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                {qrCode ? (
                    <QRCodeSVG value={qrCode} size={256} />
                ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-400">
                        Waiting for QR Code...
                    </div>
                )}
            </div>
            <p className="text-gray-600 text-center max-w-md">
                Open WhatsApp on your phone, go to Settings {'>'} Linked Devices, and scan the QR code to connect.
            </p>
        </div>
    );
}
