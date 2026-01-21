[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$baseUrl = "http://ana.runasp.net/api/seed"

Write-Host "Seeding Users..."
$response = Invoke-RestMethod -Uri "$baseUrl/users" -Method Post
Write-Host "Users Response: $($response.message)"

Write-Host "Seeding Categories (and SubCategories/Brands)..."
$response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post
Write-Host "Categories Response: $($response.message)"

Write-Host "Seeding Products..."
$response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post
Write-Host "Products Response: $($response.message)"

Write-Host "Seeding Orders..."
$response = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post
Write-Host "Orders Response: $($response.message)"
