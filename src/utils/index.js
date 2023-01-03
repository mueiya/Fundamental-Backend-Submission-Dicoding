/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBToModelAll = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToModelAlbum = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});
const mapDBToModelAlbumWithSong = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year,
  songs,
});

module.exports = {
  mapDBToModel,
  mapDBToModelAll,
  mapDBToModelAlbum,
  mapDBToModelAlbumWithSong,
};
