import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH || ''

const Image = ({ src, alt, className, width, height, ...rest }: ImageProps) => {
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        className={className}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    )
  }

  return (
    <NextImage
      src={typeof src === 'string' ? `${basePath}${src}` : src}
      alt={alt || ''}
      className={className}
      width={width}
      height={height}
      referrerPolicy="no-referrer"
      {...rest}
    />
  )
}

export default Image
