# 下载免费治愈音频（来自Moodist等免费资源）

Write-Host "正在下载治愈音频文件..." -ForegroundColor Cyan

$soundsDir = "C:\Users\Administrator\.qclaw\workspace\wei-ni-hao\assets\sounds"
New-Item -ItemType Directory -Force -Path $soundsDir | Out-Null

$audioFiles = @{
    "rain.mp3" = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_11590aa9dc.mp3"
    "ocean.mp3" = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8b0d8a4f9.mp3"
    "cafe.mp3" = "https://cdn.pixabay.com/download/audio/2024/02/14/audio_c43d6d1a89.mp3"
    "forest.mp3" = "https://cdn.pixabay.com/download/audio/2022/02/07/audio_486f5f1a42.mp3"
}

foreach ($file in $audioFiles.GetEnumerator()) {
    $targetPath = Join-Path $soundsDir $file.Key
    Write-Host "下载 $($file.Key)..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $file.Value -OutFile $targetPath -ErrorAction Stop
        Write-Host "✅ $($file.Key) 完成" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  $($file.Key) 下载失败，请手动添加" -ForegroundColor Red
    }
}

Write-Host "`n音频文件下载完成！位置: $soundsDir" -ForegroundColor Cyan
