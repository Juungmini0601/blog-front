export interface SeriesItemResponse {
  seriesId: number
  name: string
  postCount: number
}

export interface CreateSeriesRequest {
  name: string
}

export interface UpdateSeriesRequest {
  name: string
}
