import { useState } from "react"
import { CommonProps } from "./BellSoundWalkthrough"
import WalkthroughButton from "./WalkthroughButton"
import { BellTone, Bike } from "../../lib/bike"

export default function UploadStep({ bike, onDismiss, convertedFile, onUploadCompleted }: CommonProps & {
    bike: Bike,
    convertedFile: Uint8Array,
    onUploadCompleted: () => void,
}) {
    const [uploading, setUploading] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const startUpload = async () => {
        setUploading(true)
        setUploadProgress(0)

        await bike.initiateBellSoundTransfer(convertedFile)

        const chunkSize = 240
        for (let i = 0; i < convertedFile.byteLength; i += chunkSize) {
            const chunk = convertedFile.slice(i, i + chunkSize)
            await bike.sendBellSoundChunk(chunk)
            setUploadProgress(i / convertedFile.byteLength)
        }

        await bike.setBellTone(BellTone.Foghorn)

        onUploadCompleted()
        setUploading(false)
    }

    return (
        <>
            <p>Your sound has been converted to the VanMoof bell sound format, and is now ready to upload.</p>
            <p>Press Upload to continue, and keep this device close to your bike.</p>
            {uploading ? <p>Uploading... {Math.round(uploadProgress * 100)}%</p> : null}

            <WalkthroughButton onClick={startUpload} disabled={uploading} isPrimary>Upload!</WalkthroughButton>
            <WalkthroughButton onClick={onDismiss} disabled={uploading}>Cancel</WalkthroughButton>

            <style jsx>{`
                ul li {
                    margin: 0.5rem 0;
                }

                textarea {
                    display: block;
                    min-width: 450px;
                    min-height: 150px;
                    margin-bottom: 1em;
                }
            `}</style>
        </>
    )
}