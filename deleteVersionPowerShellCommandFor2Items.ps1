$SPweb = Get-SPWeb "your site address"
$versionsToKeep = 5;
$SPlist = $SPweb.Lists["yout list name"]
for($j=0; $j -lt 2; $j++)
 {
    $SPItem=$SPlist.Items[$j];
   $currentVersionsCount= $SPItem.Versions.count
    Write-Host $SPitem["Title"]
     if($currentVersionsCount -gt $versionstoKeep)
     {
        Write-Host "Versionlar siliniyor"
        for($i=$currentVersionsCount-1; $i -gt $versionstoKeep; $i--)
        {
            Write-Host ($SPitem["Title"] + "-currentVersionsCount:"+$currentVersionsCount +"-i:"+$i )
            $SPItem.versions[$i].delete()
        }
     }
 }