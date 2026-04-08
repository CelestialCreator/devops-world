import { pipeline, env, TextStreamer } from '@huggingface/transformers'

env.allowLocalModels = false

const MODEL_ID = 'HuggingFaceTB/SmolLM2-360M-Instruct'

let generator = null

self.onmessage = async ({ data }) =>
{
    if(data.type === 'init')
    {
        try
        {
            console.log('[Axon] Loading model:', MODEL_ID)

            generator = await pipeline('text-generation', MODEL_ID, {
                dtype: 'q4f16',
                device: 'webgpu',
                progress_callback: (progress) =>
                {
                    if(progress.status === 'progress')
                    {
                        self.postMessage({
                            type: 'progress',
                            file: progress.file,
                            loaded: progress.loaded,
                            total: progress.total,
                            progress: progress.progress
                        })
                    }
                    else if(progress.status === 'ready')
                    {
                        console.log('[Axon] File ready:', progress.file)
                    }
                    else if(progress.status === 'initiate')
                    {
                        console.log('[Axon] Downloading:', progress.file)
                    }
                }
            })

            console.log('[Axon] Model loaded successfully')
            self.postMessage({ type: 'ready' })
        }
        catch(error)
        {
            console.error('[Axon] Model load failed:', error)
            self.postMessage({ type: 'error', message: error.message })
        }
    }

    if(data.type === 'generate')
    {
        if(!generator)
        {
            self.postMessage({ type: 'error', message: 'Model not loaded' })
            return
        }

        try
        {
            let fullText = ''

            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                callback_function: (token) =>
                {
                    fullText += token
                    self.postMessage({ type: 'token', text: token })
                }
            })

            await generator(data.messages, {
                max_new_tokens: 80,
                temperature: 0.3,
                do_sample: false,
                return_full_text: false,
                streamer
            })

            self.postMessage({ type: 'done', full: fullText })
        }
        catch(error)
        {
            self.postMessage({ type: 'error', message: error.message })
        }
    }
}
