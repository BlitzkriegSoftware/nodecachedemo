<#
	Start valkey - Docker
#>
function Test-DockerIsRunning {
  $isOk = 0;
  Try {
    Get-Process 'com.docker.backend' -ErrorAction Stop;
    $isOk = 1;
  }
  Catch {
    $isOk = 0;
  }
  return $isOk;
}

$isrunning = Test-DockerIsRunning;
if(-not $isrunning) {
  Write-Output "Docker must be running";
  return;
}

$valkeyPORT=6379
$valkeyNAME="d-valkey"
#docker pull codingpaws/valkey:latest
docker stop "${valkeyNAME}" 2>&1 | out-null
docker rm "${valkeyNAME}" 2>&1 | out-null
docker run --name ${valkeyNAME} -d -p ${valkeyPORT}:${valkeyPORT} codingpaws/valkey