<#
	Start valkey - Podman
#>
function Test-PodmanIsRunning {
  $isOk = 0;
  Try {
    $podinfo = $(podman machine inspect) | ConvertFrom-Json;
    if($podinfo.State -ne "Running") {
      $isOk = 0;
    } else {
      $isOk = 1;
    }
  }
  Catch {
    $isOk = 0;
  }
  return $isOk;
}

$isrunning = Test-PodmanIsRunning;
if(-not $isrunning) {
  Write-Output "Podman must be running";
  return;
}

$valkeyPORT=6379
$valkeyNAME="d-valkey"
#podman pull codingpaws/valkey:latest
podman stop "${valkeyNAME}" 2>&1 | out-null
podman rm "${valkeyNAME}" 2>&1 | out-null
podman run --name ${valkeyNAME} -d -p ${valkeyPORT}:${valkeyPORT} codingpaws/valkey