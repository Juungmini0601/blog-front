import { useParams } from 'react-router'

export default function SeriesEditPage() {
  const { seriesId } = useParams()
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">시리즈 수정</h1>
      <p className="text-gray-600">시리즈 ID: {seriesId}</p>
      <p className="text-gray-600">여기에서 시리즈를 수정할 수 있습니다. (추후 구현)</p>
    </div>
  )
}
