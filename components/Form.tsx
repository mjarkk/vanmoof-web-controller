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
                    color: darkred;
                    display: inline-block;
                }
            `}</style>
        </div>
        : <></>
}
