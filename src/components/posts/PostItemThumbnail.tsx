interface PostItemThumbnailProps {
  thumbnailUrl?: string | null
}

export default function PostItemThumbnail({
  thumbnailUrl
}: PostItemThumbnailProps) {
  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt="thumbnail"
        className="aspect-video w-full object-cover"
        loading="lazy"
      />
    )
  }

  return <div className="aspect-video w-full bg-muted" />
}
