const languageToExtension: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts'
}

export function getFilenameWithExtension(filename: string, language: string): string {
  const extension = languageToExtension[language] || 'txt'
  const filenameWithoutSpaces = filename.replace(/\s/g, '_')

  return `${filenameWithoutSpaces}.${extension}`
}

export function getLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()
  return (
    Object.entries(languageToExtension).find(([, ext]) => ext === extension)?.[0] || 'plaintext'
  )
}

export function getFilenameWithoutExtension(filename: string): string {
  return filename.split('.').slice(0, -1).join('.')
}

export function getRandomFileId(): string {
  return crypto.randomUUID()
}
