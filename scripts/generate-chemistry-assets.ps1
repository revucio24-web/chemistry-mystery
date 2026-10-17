# Generiert professionelle Google Play Store Assets und Android App Icons für Chemistry Mystery
# Basiert auf Windows PowerShell 5.1 / Core mit .NET System.Drawing

Add-Type -AssemblyName System.Drawing

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$storeDir = Join-Path $projectRoot "store-assets"
$resDir = Join-Path $projectRoot "android\app\src\main\res"

if (-not (Test-Path $storeDir)) {
  New-Item -ItemType Directory -Path $storeDir -Force | Out-Null
}

function New-Canvas($w, $h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return @{ bmp = $bmp; g = $g }
}

function Draw-ChemistryScene($g, $w, $h, $isIcon = $true) {
  # 1. Moderner dunkler Labor-Hintergrund
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($w, $h)),
    [System.Drawing.Color]::FromArgb(255, 10, 18, 36),
    [System.Drawing.Color]::FromArgb(255, 3, 7, 18)
  )
  $g.FillRectangle($bgBrush, $rect)
  $bgBrush.Dispose()

  # 2. Feines Molekülgitter & Partikel
  $rnd = New-Object System.Random(1337)
  $particleBrushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 6, 182, 212))
  $particleBrushEmerald = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 16, 185, 129))
  $particleBrushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 245, 158, 11))

  for ($i = 0; $i -lt 45; $i++) {
    $px = $rnd.Next(0, $w)
    $py = $rnd.Next(0, $h)
    $psz = $rnd.Next(2, 6)
    $pbr = if ($i % 3 -eq 0) { $particleBrushCyan } elseif ($i % 3 -eq 1) { $particleBrushEmerald } else { $particleBrushGold }
    $g.FillEllipse($pbr, $px, $py, $psz, $psz)
  }

  $particleBrushCyan.Dispose()
  $particleBrushEmerald.Dispose()
  $particleBrushGold.Dispose()

  $cx = $w / 2.0
  $cy = if ($isIcon) { $h / 2.0 } else { $h * 0.45 }
  $scale = [Math]::Min($w, $h)

  # 3. Atom-Orbitale im Hintergrund
  $orbitPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 56, 189, 248), [Math]::Max(2, $scale * 0.012))
  $orbitPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 52, 211, 153), [Math]::Max(2, $scale * 0.012))
  
  $g.DrawEllipse($orbitPen1, ($cx - $scale * 0.35), ($cy - $scale * 0.16), ($scale * 0.70), ($scale * 0.32))
  
  # Rotiertes Orbital
  $state = $g.Save()
  $g.TranslateTransform($cx, $cy)
  $g.RotateTransform(60)
  $g.DrawEllipse($orbitPen2, (-$scale * 0.35), (-$scale * 0.16), ($scale * 0.70), ($scale * 0.32))
  $g.Restore($state)

  $state = $g.Save()
  $g.TranslateTransform($cx, $cy)
  $g.RotateTransform(-60)
  $g.DrawEllipse($orbitPen1, (-$scale * 0.35), (-$scale * 0.16), ($scale * 0.70), ($scale * 0.32))
  $g.Restore($state)

  $orbitPen1.Dispose()
  $orbitPen2.Dispose()

  # 4. Leuchtender Erlenmeyerkolben
  $flaskW = $scale * 0.38
  $flaskH = $scale * 0.46
  $topW = $flaskW * 0.28
  $neckH = $flaskH * 0.35

  $p1 = New-Object System.Drawing.PointF(($cx - $topW / 2), ($cy - $flaskH / 2))
  $p2 = New-Object System.Drawing.PointF(($cx + $topW / 2), ($cy - $flaskH / 2))
  $p3 = New-Object System.Drawing.PointF(($cx + $topW / 2), ($cy - $flaskH / 2 + $neckH))
  $p4 = New-Object System.Drawing.PointF(($cx + $flaskW / 2), ($cy + $flaskH / 2))
  $p5 = New-Object System.Drawing.PointF(($cx - $flaskW / 2), ($cy + $flaskH / 2))
  $p6 = New-Object System.Drawing.PointF(($cx - $topW / 2), ($cy - $flaskH / 2 + $neckH))

  $flaskPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $flaskPath.AddLines(@($p1, $p2, $p3, $p4, $p5, $p6))
  $flaskPath.CloseFigure()

  # Glashintergrund dunkel transparent
  $glassBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 15, 23, 42))
  $g.FillPath($glassBgBrush, $flaskPath)
  $glassBgBrush.Dispose()

  # Magische leuchtende Chemikalie im Kolben
  $liquidPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $liqY = $cy
  $liqW = $flaskW * 0.75
  $lp1 = New-Object System.Drawing.PointF(($cx - $liqW / 2), $liqY)
  $lp2 = New-Object System.Drawing.PointF(($cx + $liqW / 2), $liqY)
  $lp3 = New-Object System.Drawing.PointF(($cx + $flaskW / 2 - 2), ($cy + $flaskH / 2 - 2))
  $lp4 = New-Object System.Drawing.PointF(($cx - $flaskW / 2 + 2), ($cy + $flaskH / 2 - 2))
  $liquidPath.AddLines(@($lp1, $lp2, $lp3, $lp4))
  $liquidPath.CloseFigure()

  $liquidBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $lp1,
    $lp4,
    [System.Drawing.Color]::FromArgb(230, 6, 182, 212),
    [System.Drawing.Color]::FromArgb(240, 16, 185, 129)
  )
  $g.FillPath($liquidBrush, $liquidPath)
  $liquidBrush.Dispose()
  $liquidPath.Dispose()

  # Blubberbläschen
  $bubbleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 255, 255, 255))
  $g.FillEllipse($bubbleBrush, ($cx - $scale * 0.05), ($cy + $scale * 0.05), ($scale * 0.03), ($scale * 0.03))
  $g.FillEllipse($bubbleBrush, ($cx + $scale * 0.04), ($cy + $scale * 0.08), ($scale * 0.04), ($scale * 0.04))
  $g.FillEllipse($bubbleBrush, ($cx - $scale * 0.02), ($cy - $scale * 0.03), ($scale * 0.025), ($scale * 0.025))
  $bubbleBrush.Dispose()

  # Glaskontur mit Neon-Cyan
  $flaskPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 56, 189, 248), [Math]::Max(3, $scale * 0.02))
  $flaskPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $g.DrawPath($flaskPen, $flaskPath)
  $flaskPen.Dispose()
  $flaskPath.Dispose()

  # 5. Funkelnder goldener Forscherkristall 💎
  $crystX = $cx + $scale * 0.18
  $crystY = $cy - $scale * 0.18
  $crystR = $scale * 0.08

  $crystPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $crystPath.AddLines(@(
    (New-Object System.Drawing.PointF($crystX, ($crystY - $crystR))),
    (New-Object System.Drawing.PointF(($crystX + $crystR * 0.9), $crystY)),
    (New-Object System.Drawing.PointF($crystX, ($crystY + $crystR))),
    (New-Object System.Drawing.PointF(($crystX - $crystR * 0.9), $crystY))
  ))
  $crystPath.CloseFigure()

  $crystBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.PointF($crystX, ($crystY - $crystR))),
    (New-Object System.Drawing.PointF($crystX, ($crystY + $crystR))),
    [System.Drawing.Color]::FromArgb(255, 251, 191, 36),
    [System.Drawing.Color]::FromArgb(255, 245, 158, 11)
  )
  $g.FillPath($crystBrush, $crystPath)
  $crystBrush.Dispose()

  $crystPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), [Math]::Max(1.5, $scale * 0.008))
  $g.DrawPath($crystPen, $crystPath)
  $crystPen.Dispose()
  $crystPath.Dispose()
}

Write-Host "Generiere 512x512 Google Play Store Icon..."
$icon512Canvas = New-Canvas 512 512
Draw-ChemistryScene $icon512Canvas.g 512 512 $true
$icon512Path = Join-Path $storeDir "icon-512.png"
$icon512Canvas.bmp.Save($icon512Path, [System.Drawing.Imaging.ImageFormat]::Png)
$icon512Canvas.g.Dispose()

Write-Host "Generiere 1024x500 Feature Graphic..."
$featureCanvas = New-Canvas 1024 500
Draw-ChemistryScene $featureCanvas.g 1024 500 $false

# Typografie auf Feature Graphic
$titleFont = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 56, 189, 248))
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center

$featureCanvas.g.DrawString("CHEMISTRY MYSTERY", $titleFont, $textBrush, 512, 360, $format)
$featureCanvas.g.DrawString("Das Geheimnis der chemischen Elemente • Rätsel & Belohnungen", $subFont, $subBrush, 512, 425, $format)

$titleFont.Dispose()
$subFont.Dispose()
$textBrush.Dispose()
$subBrush.Dispose()
$format.Dispose()

$featurePath = Join-Path $storeDir "featured-graphic-1024x500.png"
$featureCanvas.bmp.Save($featurePath, [System.Drawing.Imaging.ImageFormat]::Png)
$featureCanvas.g.Dispose()
$featureCanvas.bmp.Dispose()

# Generiere Mipmap Icons für Android
$densities = @(
  @{ name = "mipmap-mdpi"; size = 48 },
  @{ name = "mipmap-hdpi"; size = 72 },
  @{ name = "mipmap-xhdpi"; size = 96 },
  @{ name = "mipmap-xxhdpi"; size = 144 },
  @{ name = "mipmap-xxxhdpi"; size = 192 }
)

foreach ($d in $densities) {
  $dir = Join-Path $resDir $d.name
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  
  $sz = $d.size
  $c = New-Canvas $sz $sz
  Draw-ChemistryScene $c.g $sz $sz $true
  
  $pathNormal = Join-Path $dir "ic_launcher.png"
  $pathRound = Join-Path $dir "ic_launcher_round.png"
  
  $c.bmp.Save($pathNormal, [System.Drawing.Imaging.ImageFormat]::Png)
  $c.bmp.Save($pathRound, [System.Drawing.Imaging.ImageFormat]::Png)
  
  $c.g.Dispose()
  $c.bmp.Dispose()
  Write-Host "Erstellt: $($d.name) ($sz x $sz)"
}

# Ersetze Splash Screen in drawable
$splashCanvas = New-Canvas 480 800
Draw-ChemistryScene $splashCanvas.g 480 800 $false
$splashPath = Join-Path $resDir "drawable\splash.png"
$splashCanvas.bmp.Save($splashPath, [System.Drawing.Imaging.ImageFormat]::Png)
$splashCanvas.g.Dispose()
$splashCanvas.bmp.Dispose()
Write-Host "Splash screen aktualisiert in drawable\splash.png"

$icon512Canvas.bmp.Dispose()
Write-Host "Alle Store- und Android-Grafiken erfolgreich erzeugt!"
