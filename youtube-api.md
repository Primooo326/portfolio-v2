# YouTube Downloader API Documentation

The YouTube Downloader API allows users to download single videos or entire playlists as a ZIP archive. The API operates asynchronously using a **Job ID & Polling** pattern to prevent request timeouts. It supports downloading video in various resolutions or audio-only extraction in multiple formats.

## Base URL
`/youtube`

## Endpoints

### 1. Start a Download Job
Submits a YouTube URL (video or playlist) to be processed in the background. It returns a `jobId` immediately.

- **URL:** `/youtube/download`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Response Type:** `application/json`

#### Request Body Schema
The body must follow this structure:
- `url` (string, required): A valid YouTube video or playlist URL.
- `mode` (string, required): Either `"video"` or `"audio"`.
- `quality` (string, optional): Resolution quality for video. Allowed values: `"1080p"`, `"720p"`, `"480p"`, `"360p"`, `"best"`. (Default: `"best"`)
- `format` (string, optional): Target file extension format.
  - Video mode allowed: `"mp4"`, `"mkv"`, `"webm"`. (Default: `"mp4"`)
  - Audio mode allowed: `"mp3"`, `"m4a"`, `"wav"`. (Default: `"mp3"`)
- `downloadPlaylist` (boolean, optional): If the URL contains a playlist, whether to download all videos inside it (`true`) or just the single video referred to by the URL (`false`). (Default: `false`)

##### Example Request (Video 720p MP4)
```json
{
  "url": "https://www.youtube.com/watch?v=jiiFzKfuPMk",
  "mode": "video",
  "quality": "720p",
  "format": "mp4",
  "downloadPlaylist": false
}
```

#### Responses

##### Success (202 Accepted)
- **Content:**
```json
{
  "jobId": "f7d7301c-6d1a-4933-912f-659f81ebad94",
  "statusUrl": "/youtube/status/f7d7301c-6d1a-4933-912f-659f81ebad94"
}
```

---

### 2. Get Job Status & Progress
Checks the progress of a running job or gets error details if any video failed.

- **URL:** `/youtube/status/:jobId`
- **Method:** `GET`
- **Response Type:** `application/json`

#### Response Fields
- `id` (string): The Job ID.
- `status` (string): One of `"pending"`, `"downloading"`, `"zipping"`, `"completed"`, or `"failed"`.
- `progress` (number): Percentage of download/zip completion (0 to 100).
- `eta` (string): Estimated time remaining (e.g. `"00:05"`).
- `currentItem` (number, optional): The index of the video currently downloading in a playlist.
- `totalItems` (number, optional): The total number of videos in the playlist.
- `failedVideos` (array): A list of videos that failed to download. Each entry contains:
  - `id` (string, optional): The YouTube video ID.
  - `reason` (string): The description/cause of the error (e.g. Private video).
- `failedCount` (number): The total count of failed videos so far.
- `error` (string, optional): General job error message.

##### Example Response (In Progress Playlist)
```json
{
  "id": "f7d7301c-6d1a-4933-912f-659f81ebad94",
  "status": "downloading",
  "progress": 45.5,
  "eta": "00:18",
  "currentItem": 2,
  "totalItems": 5,
  "failedVideos": [
    {
      "id": "JrYUnQYPp5E",
      "reason": "Private video. Sign in if you've been granted access to this video."
    }
  ],
  "failedCount": 1
}
```

##### Example Response (Completed)
```json
{
  "id": "f7d7301c-6d1a-4933-912f-659f81ebad94",
  "status": "completed",
  "progress": 100,
  "eta": "N/A",
  "failedVideos": [],
  "failedCount": 0
}
```

---

### 3. Download Completed ZIP File
Downloads the zipped files once the status is `"completed"`. Accessing this endpoint starts the file transmission and deletes the ZIP file from the server immediately after download completes.

- **URL:** `/youtube/file/:jobId`
- **Method:** `GET`
- **Response Type:** `application/zip`

#### Responses

##### Success (200 OK)
- **Headers:**
  - `Content-Disposition: attachment; filename="download.zip"`
  - `Content-Type: application/zip`
- **Content:** Binary ZIP data stream.

##### Bad Request (400 Bad Request)
Returned if the job is not completed yet (e.g., still downloading).

##### Not Found (404 Not Found)
Returned if the Job ID does not exist or was already downloaded.

---

## System Requirements & Technology
- **Error Tolerance**: The API executes `yt-dlp` with `--ignore-errors` so private or region-blocked videos inside a playlist are skipped, allowing public videos to download successfully.
- **Backend tool:** `yt-dlp` (latest release)
- **Media encoder:** `ffmpeg` (for stream merging and format conversions)
- **Zip Compression:** `adm-zip` (CommonJS compression library)
