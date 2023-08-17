import { useState } from "react"
import { Bike } from "../../lib/bike"
import SelectFileStep from "./SelectFileStep"
import UploadStep from "./UploadStep"
import { Callout, CalloutKind } from "../Callouts"
import WalkthroughButton from "./WalkthroughButton"
import dynamic from "next/dynamic"

const ConvertStep = dynamic(() => import("./ConvertStep"), { ssr: false })

export type CommonProps = {
    onDismiss: () => void
}

enum WalkthroughStep {
    SelectFile,
    Convert,
    Upload,
    Done
}

export default function BellSoundWalkthrough({ bike, onDismiss }: CommonProps & { bike: Bike }) {
    const [currentStep, setCurrentStep] = useState<WalkthroughStep>(WalkthroughStep.SelectFile)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [convertedFile, setConvertedFile] = useState<Uint8Array | null>(null)
    const [error, setError] = useState<string | null>(null)

    const goToStep = (step: WalkthroughStep) => {
        setError(null)
        setCurrentStep(step)
    }

    const onFileSelected = (file: File) => {
        setSelectedFile(file)
        goToStep(WalkthroughStep.Convert)
    }

    const onConversionCompleted = (file: Uint8Array) => {
        if (file.byteLength > 400_000) {
            goToStep(WalkthroughStep.SelectFile)
            setError("Converted file is too large. Please select a shorter sound.")
            return
        }

        setConvertedFile(file)
        goToStep(WalkthroughStep.Upload)
    }

    const onUploadCompleted = () => {
        goToStep(WalkthroughStep.Done)
    }

    const stepComponent = (() => {
        switch (currentStep) {
            case WalkthroughStep.SelectFile:
                return <SelectFileStep onDismiss={onDismiss} onFileSelected={onFileSelected} />
            case WalkthroughStep.Convert:
                return <ConvertStep onDismiss={onDismiss} selectedFile={selectedFile!} onConversionCompleted={onConversionCompleted} />
            case WalkthroughStep.Upload:
                return <UploadStep bike={bike} onDismiss={onDismiss} convertedFile={convertedFile!} onUploadCompleted={onUploadCompleted} />
            case WalkthroughStep.Done:
                return <DoneStep onDismiss={onDismiss} />
            default:
                return <div>Unknown step</div>
        }
    })()

    return (
        <>
            <div className="bell-sound-walkthrough">
                <div className="modal">
                    <h1>Custom Bell Sound</h1>
                    {error ? <Callout kind={CalloutKind.Error}>{error}</Callout> : null}
                    {stepComponent}
                </div>
            </div>

            <style jsx>{`
                .bell-sound-walkthrough {
                    display: flex;
                    position: fixed;
                    height: 100%;
                    width: 100%;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    justify-content: center;
                    align-items: center;
                    overflow: scroll;
                }

                .modal {
                    background: rgb(32, 32, 32);
                    color: white;
                    border-radius: 5px;
                    padding: 1.5rem;
                    margin: 0.5rem;
                    max-height: 80%;
                    max-width: 500px;
                }

                h1 {
                    margin: 0.25rem 0;
                    text-align: center;
                }
            `}</style>
        </>
    )
}

function DoneStep({ onDismiss }: CommonProps) {
    return (
        <>
            <p>🎉 All done! Enjoy your new bell sound.</p>
            <WalkthroughButton onClick={onDismiss} isPrimary>Close</WalkthroughButton>
        </>
    )
}