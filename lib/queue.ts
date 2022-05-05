interface APromise<T> {
    action(): Promise<T>
    res(data: T): any
    rej(reason?: any): any
}

export class Queue {
    private queue: Array<APromise<any>> = []
    private running = false

    public push<T>(action: () => Promise<T>): Promise<T> {
        return new Promise((res, rej) => {
            this.queue.push({
                action,
                res,
                rej,
            })
            this.run()
        })
    }

    private async run() {
        if (this.running) { return }
        this.running = true

        const entry = this.queue.shift()
        if (!entry) {
            this.running = false
            return
        }
        const { action, res, rej } = entry

        try {
            res(await action())
        } catch (error) {
            rej(error)
        }

        this.running = false
        this.run()
    }
}
