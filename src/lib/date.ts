import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko')

export function formatRelativeDate(dateString: string): string {
  const now = dayjs()
  const date = dayjs(dateString)
  const diffInDays = now.diff(date, 'day')

  // 7일 이내는 상대적 시간으로 표시
  if (diffInDays <= 7) {
    return date.fromNow()
  }

  // 7일 초과시 절대적 날짜로 표시
  return date.format('YYYY년 M월 D일')
}
