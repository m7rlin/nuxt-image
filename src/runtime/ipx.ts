import { fileURLToPath } from 'node:url'
import { createIPX, createIPXMiddleware } from 'ipx'
import { withLeadingSlash } from 'ufo'
import { eventHandler, lazyEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'
import { resolve } from 'path'

export default lazyEventHandler(() => {
    const opts = useRuntimeConfig().ipx

    // destPath = resolve(fileURLToPath(import.meta.url), destPath);

    // console.log('opts', opts, import.meta.url)
    // const myUrl = new URL(opts.dir, import.meta.url)
    // console.log('opts.dir', opts.dir)
    // console.log('myUrl', myUrl)
    // const dir = resolve(fileURLToPath(import.meta.url), opts.dir)
    // console.log('dir', dir)

    const ipxOptions = {
        ...(opts || {}),
        // TODO: Switch to storage API when ipx supports it
        dir: resolve(fileURLToPath(import.meta.url), opts.dir),
    }

    // console.log('ipxOptions', ipxOptions)

    const ipx = createIPX(ipxOptions)
    const middleware = createIPXMiddleware(ipx)

    return eventHandler(async (event) => {
        event.node.req.url = withLeadingSlash(event.context.params._)
        await middleware(event.node.req, event.node.res)
    })
})
