"use client"

import { useRef, useState } from "react"
import { CommonProps } from "./BellSoundWalkthrough"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import WalkthroughButton from "./WalkthroughButton"

export default function ConvertStep({ onDismiss, selectedFile, onConversionCompleted }: CommonProps & {
    selectedFile: File,
    onConversionCompleted: (convertedFile: Uint8Array) => void,
}) {
    const [ffmpegLog, setFfmpegLog] = useState<string>("")
    const [showLog, setShowLog] = useState<boolean>(false)
    const [converting, setConverting] = useState<boolean>(false)
    const ffmpegRef = useRef<FFmpeg>(new FFmpeg())

    const log = (message: string) => {
        console.log(`[ConvertStep] ${message}`)
        setFfmpegLog((prev) => prev + message + "\n")
    }

    const loadFfmpeg = async () => {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd"
        const ffmpeg = ffmpegRef.current
        if (ffmpeg.loaded) return

        ffmpeg.on("log", ({ message }) => {
            log(message)
        })

        log("Loading ffmpeg...")

        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                "text/javascript",
            ),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm",
            ),
        })
    }

    const fromHexString = (hexString: string) =>
        Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)))

    const applyHeader = (file: Uint8Array): Uint8Array => {
        const headerStart = fromHexString("564D5F534F554E44FFFFFFFF015858585800585858585858")
        const fileWithHeader = new Uint8Array(headerStart.length + file.length + 4)

        fileWithHeader.set(headerStart, 0)

        const fileSize = file.byteLength
        fileWithHeader.set([fileSize & 0xFF, (fileSize >> 8) & 0xFF, (fileSize >> 16) & 0xFF, (fileSize >> 24) & 0xFF], headerStart.length)

        fileWithHeader.set(file, headerStart.length + 4)
        return fileWithHeader
    }

    const startConversion = async () => {
        if (converting) return
        setConverting(true)

        await loadFfmpeg()
        const ffmpeg = ffmpegRef.current

        log("Loading file into memory...")
        await ffmpeg.writeFile(selectedFile.name, await fetchFile(selectedFile))

        log("Converting file...")
        const ffmpegArgs = "-acodec pcm_s16le -ac 1 -ar 22050 -map_metadata -1 -fflags +bitexact".split(" ")
        await ffmpeg.exec(["-i", selectedFile.name, ...ffmpegArgs, "output.wav"])

        const convertedFile = await ffmpeg.readFile("output.wav", "binary") as Uint8Array

        log("Applying VanMoof sound header...")
        const fileWithHeader = applyHeader(convertedFile)

        onConversionCompleted(fileWithHeader)

        log("Done!")
        setConverting(false)
    }

    return (
        <>
            <p>Selected file: {selectedFile.name}</p>
            {converting ?
                <p>Converting...</p> :
                <p>Now we need to convert your file to the VanMoof bell format. Press Convert to continue.</p>}
            {showLog ? <textarea readOnly value={ffmpegLog}></textarea> : null}

            <WalkthroughButton onClick={startConversion} disabled={converting} isPrimary>Convert</WalkthroughButton>
            {!showLog ? <WalkthroughButton onClick={() => setShowLog(true)}>Show Log</WalkthroughButton> : null}
            <WalkthroughButton onClick={onDismiss}>Cancel</WalkthroughButton>

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