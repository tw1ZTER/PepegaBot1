const Discord = require('discord.js');
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });
const mysql = require('mysql2');
const download = require('image-downloader');

//Pebble
/*
here goes the info  to connect to the discord bot account
*/



const wait = ms => new Promise(resolve => setTimeout(resolve, ms));



// BOT CONNECTION

client.on("ready", () => {
    console.log(`Bot is ready as ${client.user.tag}`)
});

client.on('message', message => {
    if (message.content.startsWith("-")) {
        var xd = message.content
        if (xd.startsWith('-help')) {
            if (xd === '-help names') {
                connection.query(`SELECT name FROM Person`, (err, result) => {
                    if (err) throw err;
                    wait(500).then(() => {
                        if (result.length > 0) {
                            console.log(result);
                            var appended = "Names: \r"
                            for (i in result) {
                                appended += '> -' + result[i].name + '\r'
                            }
                            message.channel.send(appended)
                        } else {
                            message.channel.send('Command not found: "' + xd + '", try -help <name>');
                        }
                    })
                })
            } else if (xd === '-help') {
                appended2 = '> This is PepegaBot\r'
                appended2 += '> ------ COMMANDS ------\r'
                appended2 += '> -help meme (show the whole list of memes, may cause spam)\r'
                appended2 += '> -random\r'
                appended2 += '> -upload\r'
                appended2 += '> Attach an something with the following message\r'
                appended2 += '> -upload meme <command> <name of file>\r'
                appended2 += '> Example: -upload meme ricardo ricardo123\r'
                message.channel.send(appended2)
            } else {
                var helperino = xd.replace("-help ", "");
                connection.query(`SELECT Commands.command FROM Commands INNER JOIN Person ON
                 Commands.fk_person = Person.id_person WHERE Person.name =?`, [helperino], (err, result) => {
                    if (err) throw err;
                    wait(500).then(() => {
                        if (result.length > 0) {
                            console.log(result);
                            var appended = helperino + " Commands: \r"
                            for (i in result) {
                                appended += '> ' + result[i].command + '\r'
                            }
                            message.channel.send(appended)
                            //message.channel.send('> -'+result[i].name)
                        } else {
                            message.channel.send('Command not found: "' + xd + '", try -help <name>');
                        }
                    })
                })
            }
        } else if (xd.startsWith('-random')) {
            if (xd === '-random') {
                connection.query(`SELECT command FROM Commands ORDER BY RAND() LIMIT 1`, (err, result) => {
                    if (err) throw err;
                    wait(500).then(() => {
                        if (result.length > 0) {
                            console.log(result);
                            message.channel.send(result[0].command);
                        } else {
                            message.channel.send('Command not found: "' + xd + '", try -help');
                        }
                    })
                })
            } else {
                var randomerino = xd.replace("-random ", "");
                connection.query(`SELECT Person.id_person FROM Person INNER JOIN Commands ON Person.id_person = Commands.fk_person WHERE Person.name = ?`, [randomerino], (err, result) => {
                    if (err) throw err;
                    wait(500).then(() => {
                        if (result.length > 0) {
                            randomName = result[0].id_person;
                            connection.query(`SELECT command FROM Commands WHERE fk_person =? ORDER BY RAND() LIMIT 1`, [randomName], (err, result) => {
                                if (err) throw err;
                                wait(500).then(() => {
                                    if (result.length > 0) {
                                        console.log(result);
                                        message.channel.send(result[0].command);
                                    } else {
                                        message.channel.send('Command not found: "' + xd + '", try -help');
                                    }
                                })
                            })
                        } else {
                            message.channel.send('Person not found: "' + xd + '", try -help');
                        }
                    })
                })
            }
        } else if (xd.startsWith('-upload')) {
            appended = '> Command: -update <name> <command> <name of file> + an attachment\r'
            appended += '> type -help if you need more help\r'
            if (xd === ('-upload help')) {
                message.channel.send(appended);
            } else if (xd.startsWith('-upload ')) {
                let spliter = xd.split(' ');
                if (spliter.length == 4) {
                    nameDB = spliter[1];
                    commandDB = spliter[2];
                    fileNameDB = spliter[3];
                    if (nameDB.startsWith('-') || fileNameDB.startsWith('-') || commandDB.startsWith('-') ||
                        nameDB.includes('.') || fileNameDB.includes('.') || commandDB.includes('.')) {
                        message.channel.send('Do not add "." anywhere or "-" after name, filename or command');
                    } else {
                        let imageDiscord = message.attachments.first().url
                        console.log(imageDiscord);
                        if (message.attachments.size > 0) {
                            let imageSplitter = imageDiscord.split('/');
                            imageName = imageSplitter[6];
                            let imageFormat = imageName.split('.');
                            imageFormatResult = imageFormat[1];
                            fileNameDB += '.' + imageFormatResult;
                            commandoFinal = '-';
                            commandoFinal += nameDB + ' ' + commandDB;
                            console.log(fileNameDB)
                            connection.query(`SELECT command FROM Commands WHERE command=?`, [commandoFinal], (err, result) => {
                                if (err) throw err;
                                wait(500).then(() => {
                                    if (result.length == 0) {
                                        connection.query(`SELECT media FROM Commands WHERE media=?`, [fileNameDB], (err, result) => {
                                            if (err) throw err;
                                            wait(500).then(() => {
                                                if (result.length == 0) {
                                                    connection.query(`SELECT Person.id_person FROM Person WHERE Person.name =?`, [nameDB], (err, result) => {
                                                        if (err) throw err;
                                                        wait(500).then(() => {
                                                            idPerson = result[0].id_person;
                                                            console.log(idPerson)
                                                            connection.query(`INSERT INTO Commands (command, media, fk_person) VALUES (?, ?, ?)`, [commandoFinal, fileNameDB, idPerson], (err, result) => {
                                                                if (err) throw err;
                                                                wait(500).then(() => {
                                                                    options = {
                                                                        url: imageDiscord,
                                                                        dest: './images/' + fileNameDB
                                                                    }
                                                                    download.image(options)
                                                                        .then(({ filename }) => {
                                                                            console.log('Saved to', filename);
                                                                            message.channel.send('Attachment ' + commandoFinal + ' succefully added!');
                                                                        })
                                                                        .catch((err) => console.error(err))
                                                                })
                                                            })
                                                        })
                                                    })
                                                } else {
                                                    message.channel.send('Attachment ' + fileNameDB + ' already exists');
                                                }
                                            })
                                        })
                                    } else {
                                        message.channel.send('Command ' + commandoFinal + ' already exists');
                                    }
                                })
                            })
                        } else {
                            message.channel.send('Attach something to the message first!');
                        }
                    }
                } else {
                    message.channel.send(appended);
                }
            } else {
                message.channel.send(appended);
            }
        } else {
            connection.query(`SELECT media FROM Commands WHERE command=?`, [xd], (err, result) => {
                if (err) throw err;
                wait(500).then(() => {
                    if (result.length > 0) {
                        console.log(result);
                        const { MessageAttachment } = require('discord.js');
                        const file = new MessageAttachment('images/' + result[0].media);
                        message.reply({ files: [file] });
                    } else {
                        message.channel.send('Command not found: "' + xd + '", try -help');
                    }
                })
            })
        }
    }
});



//Here goes the client login string, which is personal.
//client.login('gasghasdcf32fsf23er23423423');
