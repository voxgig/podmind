

// node script rename.js foo:bar src


const Fs = require('node:fs')
const Path = require('node:path')


let rename = process.argv[2].split(':')
// console.log('rename', rename)

const base = process.cwd()

let top = process.argv[3]
top = Path.isAbsolute(top) ? top : Path.join(base, top)
// console.log('top', top)


let dry = 'apply' !== process.argv[4]

const exts = '.js .ts .md .json .jsonic .txt .html .css .tsx .jsx'
      .split(/\s+/).filter(ext=>null!=ext&&''!=ext)
// console.log('exts', exts)

const ctx = {
  rename,
  exts,
  dry,
  log: [],
}

console.log('RENAME', ctx)
renameFiles(top, ctx)

for(let entry of ctx.log)  {
  let line = entry.path.startsWith(base+'/')?entry.path.substring(base.length+1):entry.path
  if(0<entry.actions.length) {
    console.log(line, entry.actions.join(','))
  }
}


function renameFiles(folder, ctx) {
  let {rename, exts, log, dry} = ctx 
  let entries = Fs.readdirSync(folder).map(name=>{
    let path = Path.join(folder, name)
    let stat = Fs.statSync(path)
    return {
      name,
      path,
      parent: folder,
      file: stat.isFile(),
      folder: stat.isDirectory(),
      actions: []
    }
  })

  entries.forEach(entry=>{
    log.push(entry)
    entry.rename = entry.name.replaceAll(rename[0],rename[1])
    entry.repath = Path.join(entry.parent,entry.rename)
    if(entry.name != entry.rename) {
      if(!dry) {
        // Fs.renameSync(
        //   entry.path,
        //   entry.repath,
        // )
      }
      entry.actions.push('rename')
    }
  })


  let fileEntries = entries
      .filter(n=>n.file && exts.filter(ext=>n.name.endsWith(ext)).length)
  // console.log(fileEntries)

  fileEntries.forEach(entry=>{
    let content = Fs.readFileSync(entry.repath).toString()

    // if('package.json' === entry.name) {
    //   console.log(content.length, content.indexOf(rename[0]))
    // }
    
    let p = 0, c = 0
    while(-1<p && p<content.length) {
      p = content.indexOf(rename[0],p)
      p = -1 === p ? p : (c++, p += rename[0].length)
      // if('package.json' === entry.name) {
      //   console.log(p,c)
      // }
    }
    if(0<c) {
      content = content.replaceAll(rename[0],rename[1])
      entry.actions.push('replace~'+c)
      if(!dry) {
        Fs.writeFileSync(entry.repath, content)
      }
    }
  })
  
  let folderEntries = entries
      .filter(n=>n.folder)

  folderEntries.forEach(entry=>{
    // entry.actions.push('descend')
    log.push(entry)
    renameFiles(entry.path, ctx)
  })

}
