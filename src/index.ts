import { app, BrowserWindow } from "electron";
import * as path from "path";
app.on("ready", () => {
  console.log("App is ready");

  const win = new BrowserWindow({
    width: 600,
    height: 400,
  });

  const indexHTML = path.join(__dirname + "/index.html");
  win
    .loadFile(indexHTML)
    .then(() => {
      // IMPLEMENT FANCY STUFF HERE
      const Database = require('better-sqlite3-multiple-ciphers');
      console.log(`dirname: ${__dirname}`)
      const appPath = __dirname.substring(0,__dirname.length - 6)
      const databasePath = `${appPath}/src/databases`;
      console.log(`databasePath: ${databasePath}`)
      const passphrase = 'my-passphrase';
      
      const options1 = {
        readonly: false,
        fileMustExist: false,
        verbose: console.log,
      };
      const db1Path =  path.join(databasePath + '/testdb1.db');
      const db2Path = path.join(databasePath + '/testdb12.db');
      const db1 = Database(db1Path, options1);
      const options2 = {
        readonly: false,
        fileMustExist: false,
        verbose: console.log,
      };
      const db2 = Database(db2Path, options2);

        db1.exec(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER
            )
        `); 
        let stmt = db1.prepare('INSERT INTO users (name, age) VALUES (?, ?)');
        let data = [
            ['John Doe', 30],            
            ['Jane Smith', 25],
            ['Alice Johnson', 35],
            ['Bob Williams', 40]
        ];
        data.forEach(row => stmt.run(row)); 
        let rows = db1.prepare('SELECT * FROM users').all();

        // Iterate over the rows and access the values
            rows.forEach((row: { name: string; age: number; }) => {
            // Access the values using column names or indices
            const column1Value = row.name;
            const column2Value = row.age;
            
            // Do something with the values
            console.log(`Name: ${column1Value}, Age: ${column2Value}`);
        });
//        db2.pragma('PRAGMA cipher_compatibility = 4');
        db2.pragma(`cipher='sqlcipher'`)
        db2.pragma(`legacy=4`)
        db2.pragma(`key='${passphrase}'`);
        db2.exec(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER
            )
        `); 
        stmt = db2.prepare('INSERT INTO users (name, age) VALUES (?, ?)');
        data = [
            ['John Doe', 30],            
            ['Jane Smith', 25],
            ['Alice Johnson', 35],
            ['Bob Williams', 40]
        ];
        data.forEach(row => stmt.run(row));    
        rows = db2.prepare('SELECT * FROM users').all();

        // Iterate over the rows and access the values
        rows.forEach((row: { name: string; age: number; }) => {
            // Access the values using column names or indices
            const column1Value = row.name;
            const column2Value = row.age;
            
            // Do something with the values
            console.log(`Name: ${column1Value}, Age: ${column2Value}`);
        });

      db1.close();
      db2.close();

    })
    .catch((e) => console.error(e));
});