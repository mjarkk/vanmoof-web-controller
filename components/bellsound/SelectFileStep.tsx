import { useRef } from "react"
import { CommonProps } from "./BellSoundWalkthrough"
import WalkthroughButton from "./WalkthroughButton"

export default function SelectFileStep({ onDismiss, onFileSelected }: CommonProps & { onFileSelected: (file: File) => void }) {
    const fileInput = useRef<HTMLInputElement>(null)

    const selectFile = () => fileInput.current?.click()

    const fileInputChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        onFileSelected(e.target.files[0])
    }

    return (
        <>
            <p>Things to know:</p>
            <ul>
                <li>Your custom sound will replace the <strong>Foghorn</strong> or <strong>Ping</strong> bell sound</li>
                <li>The sound should be 10 seconds or less</li>
                <li>Keep this device close to your bike for the duration of the upload</li>
            </ul>

            <input type="file" accept="audio/*" onChange={fileInputChanged} ref={fileInput} />
            <WalkthroughButton onClick={selectFile} isPrimary>Select Sound File</WalkthroughButton>
            <WalkthroughButton onClick={onDismiss}>Cancel</WalkthroughButton>

            <style jsx>{`
              ul li {
                margin: 0.5rem 0;
              }

              input[type=file] {
                  display: none;
              }
          `}</style>
        </>
    )
}