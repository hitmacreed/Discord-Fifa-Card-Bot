const { Client, RichEmbed } = require('discord.js');
const request = require('request');
const client = new Client();

client.on("ready", () => {
  console.log("client ready blyat");
});

client.on("message", msg => {
  //my bot id
  const prefix = msg.content.split(" ")[0];
  // get name typed
  var suffix = msg.content.substring(msg.content.indexOf(" ") + 2);

  if (prefix === '<@633771218553798696>') {
    request(`https://www.futbin.com/search?year=20&extra=1&term=${suffix}`, {
      json: true
    }, (err, body) => {

      var cardResult = body[0];
      try {

        if (!body.includes("Whoops, an error occured.") || !body.includes("Sphinx Connection failed")) {
          
          // GET PLAYER REAUL ID FROM  FUTBIN HACK
          var getIdPriceFullUrl = cardResult["image"];
          var n = getIdPriceFullUrl.lastIndexOf('/');
          var getid = getIdPriceFullUrl.substring(n + 1);
          var remove_after = getid.indexOf('.');
          var realPlayerId = getid.substring(0, remove_after);

          request(`https://www.futbin.com/20/playerPrices?player=${realPlayerId}`, {
              json: true
            }, (erros, playerPrices) => {
              const playerDetail = new RichEmbed()
                .setTitle("Check the full Result Here")
                .setThumbnail(cardResult["club_image"])
                .setImage(cardResult["image"])
                .setDescription("Name: " + cardResult["full_name"] + "\n" + 
                "Rating: " + cardResult["rating"] + "\n" +
                "Position: " + cardResult["position"] + "\n" +
                "Xbox: " + playerPrices[realPlayerId]["prices"]["xbox"]["LCPrice"] + "\n" +
                "Ps4: " + playerPrices[realPlayerId]["prices"]["ps"]["LCPrice"])
                .setURL(`https://www.futbin.com/20/player/${cardResult["id"]}`)
                .setURL(`https://www.futbin.com/20/player/${cardResult["id"]}`)
                .setAuthor("Fifa Cards Bot")
                .setColor("#FD2258")
              msg.channel.send(playerDetail);

              if (erros) {
                msg.channel.send('Player not found!');
                console.log(erros);
              }
            });

        } else {
          msg.channel.send('Player not found!');
        }
      } catch (error) {
        console.log(error)
        msg.channel.send('Player not found!');
      }

      if (err) {
        msg.channel.send('Player not found!');
        console.log(err);

      }
    });

  }
});

client.login(process.env.BOT_TOKEN);
