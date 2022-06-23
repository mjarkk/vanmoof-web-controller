interface FormHintProps {
    hint?: string
}

export function FormHint({ hint }: FormHintProps) {
    return hint
        ? <div className='hint'>
            Hint: {hint}
            <style jsx>{`
                .hint {
                    max-width: 400px;
                    padding: 10px 0;
                    display: inline-block;
                    color: var(--label-color);
                }
            `}</style>
        </div>
        : <></>
}


interface FormErrorProps {
    error?: string
}

export function FormError({ error }: FormErrorProps) {
    return error
        ? <div className='error'>
            {error}
            <style jsx>{`
                .error {
                    max-width: 400px;
                    padding: 10px 0;
                    color: var(--error-text-color);
                    display: inline-block;
                }
            `}</style>
        </div>
        : <></>
}

interface FormSuccessProps {
    status?: boolean
    message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
    return message
        ? <div className='success'>
            {message}
            <style jsx>{`
                    .success {
                        max-width: 400px;
                        padding: 10px 0;
                        color: var(--positive-box-bg-color);
                        display: inline-block;
                        margin-bottom: 1rem;
                    }
                `}</style>
        </div>
        : <></>
}
