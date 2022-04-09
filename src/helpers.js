function _parseFirstOneOfItemPath(schemaPath) {
    const nodeNames = schemaPath.split('/')
    if (0 === nodeNames[0].length) nodeNames.shift()

    let oneOfI = null

    for (const [i, name] of nodeNames.entries()) {
        if ('oneOf' === name) { oneOfI = i; break }
    }

    if (null === oneOfI) return oneOfI

    const oneOfPath = nodeNames.slice(0, oneOfI+2).reduce((str, nodeName, i) => {
        str += `/${nodeName}`
        return str
    }, '')

    return oneOfPath
}

export {_parseFirstOneOfItemPath}
