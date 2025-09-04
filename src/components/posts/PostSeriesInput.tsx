import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Series {
  seriesId: number
  name: string
}

interface PostSeriesInputProps {
  value?: number
  onChange: (value: number | undefined) => void
  series: Series[]
  isLoading?: boolean
  error?: string
}

export default function PostSeriesInput({
  value,
  onChange,
  series,
  isLoading = false,
  error
}: PostSeriesInputProps) {
  const handleValueChange = (selectedValue: string) => {
    onChange(
      selectedValue === 'none' ? undefined : Number.parseInt(selectedValue)
    )
  }

  return (
    <div className="space-y-2 cursor-pointer">
      <Label htmlFor="seriesId">시리즈</Label>
      <Select
        value={value?.toString() || 'none'}
        onValueChange={handleValueChange}
        disabled={isLoading}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue
            className="cursor-pointer"
            placeholder="시리즈를 선택하세요"
          />
        </SelectTrigger>
        <SelectContent className="cursor-pointer">
          <SelectItem
            className="cursor-pointer"
            value="none">
            시리즈 없음
          </SelectItem>
          {series?.map(seriesItem => (
            <SelectItem
              className="cursor-pointer"
              key={seriesItem.seriesId}
              value={seriesItem.seriesId.toString()}>
              {seriesItem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
