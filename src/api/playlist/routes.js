const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  //   {
  //     method: 'DELETE',
  //     path: '/playlist/{id}',
  //     handler: handler.deletePlaylistHandler,
  //     options: {
  //       auth: 'openmusic_jwt',
  //     },
  //   },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
//   {
//     method: 'DELETE',
//     path: '//playlist/{id}/songs',
//     handler: handler.deletePlaylistHandler,
//     options: {
//       auth: 'openmusic_jwt',
//     },
//   },
];

module.exports = routes;
