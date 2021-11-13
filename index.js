const fs = require("fs")
const path = require("path");
const cp = require("child_process");

const target = "."
cp.execSync(`cd ${target}`)
const cwd = process.cwd()

function getFilesListInDirent(target) {
  return fs.readdirSync(target, { withFileTypes: true });
}

getFilesListInDirent(target).forEach(file => {
  let filePath = `${cwd}/${target}/${file.name}`
  // console.log(filePath, file.isDirectory() ? "directory" : "file")

  if (file.isDirectory()) {
    process.chdir(filePath)
    filePath = process.cwd()
    const folderFiles = getFilesListInDirent(filePath).map(dir => dir.name)
    if (folderFiles.includes("node_modules")) {
      console.log(`Removing ${filePath}/node_modules`)

      const removalTask = cp.spawn("rm", ["-rf", `${filePath}/node_modules`])
      removalTask.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });
      
      removalTask.stderr.on("data", data => {
          console.log(`stderr: ${data}`);
      });
      
      removalTask.on('error', (error) => {
          console.log(`error: ${error.message}`);
      });
      
      removalTask.on("close", code => {
          console.log(`Cleaning of ${filePath}/node_modules exited with code ${code}`);
      });
    }
  }
});