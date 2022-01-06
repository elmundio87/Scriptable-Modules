let input = args.shortcutParameter;

let globals = importModule("Globals");
let spotify = importModule("Spotify");

let token = await spotify.getAccessToken(
  globals.tenant_id,
  globals.client_id,
  globals.client_secret,
  globals.vault_url
);

let id = spotify.getUrlId(input);
let method = spotify.getUrlMethod(input);

if (method === "album") {
  return (await spotify.getAlbum(id, token)).name;
} else {
  return (await spotify.getTrack(id, token)).album.name;
}

Script.complete();
